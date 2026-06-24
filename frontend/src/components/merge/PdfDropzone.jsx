import { useRef, useState } from 'react'
import GlassCard from '../ui/GlassCard'
import ToolIcon from '../icons/ToolIcons'

export default function PdfDropzone({
  onFilesAdded,
  disabled = false,
  maxFiles = 10,
  currentCount = 0,
}) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = (fileList) => {
    const pdfs = Array.from(fileList).filter(
      (f) =>
        f.type === 'application/pdf' ||
        f.name.toLowerCase().endsWith('.pdf'),
    )
    if (pdfs.length) onFilesAdded(pdfs)
  }

  const atLimit = currentCount >= maxFiles

  return (
    <GlassCard hover={false} className="overflow-hidden p-1">
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
        }}
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled && !atLimit) setIsDragging(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          if (e.currentTarget === e.target) setIsDragging(false)
        }}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          if (!disabled && !atLimit) handleFiles(e.dataTransfer.files)
        }}
        onClick={() => !disabled && !atLimit && inputRef.current?.click()}
        className={[
          'flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition-all duration-300 sm:min-h-[180px]',
          isDragging
            ? 'border-violet-400 bg-violet-500/10'
            : 'border-white/15 bg-white/[0.02] hover:border-violet-500/40 hover:bg-violet-500/5',
          disabled || atLimit ? 'pointer-events-none opacity-60' : '',
        ].join(' ')}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          disabled={disabled || atLimit}
          className="sr-only"
          onChange={(e) => {
            handleFiles(e.target.files)
            e.target.value = ''
          }}
        />

        <div
          className={[
            'mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/40 to-indigo-600/40 transition-transform',
            isDragging ? 'scale-110' : '',
          ].join(' ')}
        >
          <ToolIcon name="upload" className="h-6 w-6 text-violet-300" />
        </div>

        <p className="text-sm font-medium text-zinc-200 sm:text-base">
          {atLimit
            ? `Maximum ${maxFiles} files reached`
            : isDragging
              ? 'Release to add PDFs'
              : 'Drag & drop PDF files here'}
        </p>
        <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
          or <span className="text-violet-400">browse</span> · up to {maxFiles} files
        </p>
      </div>
    </GlassCard>
  )
}
