import { Link, Navigate } from 'react-router-dom'
import { getToolById } from '../data/tools'
import { ROUTES } from '../constants/routes'
import ToolIcon from '../components/icons/ToolIcons'
import FileUpload from '../components/ui/FileUpload'

const acceptByTool = {
  merge: '.pdf,application/pdf',
  split: '.pdf,application/pdf',
  'image-to-pdf': 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp',
  'word-to-pdf':
    '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

const helperByTool = {
  merge: 'Select multiple PDFs to combine · Max 10 files · 50 MB each',
  split: 'Select a PDF to split · Max 50 MB',
  'image-to-pdf': 'JPG, PNG, or WebP · Max 10 images · 20 MB each',
  'word-to-pdf': 'DOC or DOCX · Max 50 MB',
}

function validateToolFile(toolId, file, maxFileSize) {
  if (file.size > maxFileSize) {
    return `File exceeds ${maxFileSize / (1024 * 1024)} MB limit`
  }

  if (toolId === 'merge' || toolId === 'split') {
    const isPdf =
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    if (!isPdf) return 'Only PDF files are allowed'
  }

  if (toolId === 'image-to-pdf') {
    const isImage =
      file.type.startsWith('image/') ||
      /\.(jpe?g|png|webp)$/i.test(file.name)
    if (!isImage) return 'Only JPG, PNG, or WebP images are allowed'
  }

  if (toolId === 'word-to-pdf') {
    const isWord = /\.(docx?|DOCX?)$/.test(file.name) ||
      file.type.includes('word') ||
      file.type === 'application/msword'
    if (!isWord) return 'Only DOC or DOCX files are allowed'
  }

  return null
}

export default function ToolPage({ toolId }) {
  const tool = getToolById(toolId)

  if (!tool) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  const accept = acceptByTool[toolId] ?? '.pdf,application/pdf'
  const isMulti = toolId === 'merge' || toolId === 'image-to-pdf'
  const maxFileSize = toolId === 'image-to-pdf' ? 20 * 1024 * 1024 : 50 * 1024 * 1024

  return (
    <div className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          to={ROUTES.HOME}
          className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to home
        </Link>

        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:gap-6 sm:text-left">
          <div
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.color} text-white shadow-lg shadow-violet-900/30`}
          >
            <ToolIcon name={tool.icon} className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
              {tool.title}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-zinc-400">
              {tool.description}
            </p>
          </div>
        </div>

        <div className="mt-10">
          <FileUpload
            accept={accept}
            multiple={isMulti}
            maxFiles={isMulti ? 10 : 1}
            maxFileSize={maxFileSize}
            dropzoneTitle={`Upload files for ${tool.title}`}
            helperText={helperByTool[toolId]}
            validateFile={(file) => validateToolFile(toolId, file, maxFileSize)}
          />
        </div>
      </div>
    </div>
  )
}
