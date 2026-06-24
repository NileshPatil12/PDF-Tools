import { useEffect, useState } from 'react'
import ToolLayout from '../layouts/ToolLayout'
import { mergePdfs, getPdfErrorMessage, downloadBlob } from '../api/pdf'
import { getToolById } from '../data/tools'
// header and route handled by ToolLayout
import PdfDropzone from '../components/merge/PdfDropzone'
import FilePreviewCard from '../components/merge/FilePreviewCard'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import ToolIcon from '../components/icons/ToolIcons'

const MAX_FILES = 10
const MAX_FILE_SIZE = 20 * 1024 * 1024

function createFileId(file) {
  return `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`
}

export default function MergePdfPage() {
  const tool = getToolById('merge')
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mergedBlob, setMergedBlob] = useState(null)
  const [mergedPreviewUrl, setMergedPreviewUrl] = useState(null)

  useEffect(() => {
    if (!mergedBlob) {
      setMergedPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(mergedBlob)
    setMergedPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [mergedBlob])

  const addFiles = (incoming) => {
    setError('')
    setMergedBlob(null)

    const valid = []
    for (const file of incoming) {
      const isPdf =
        file.type === 'application/pdf' ||
        file.name.toLowerCase().endsWith('.pdf')
      if (!isPdf) continue
      if (file.size > MAX_FILE_SIZE) {
        setError(`${file.name} exceeds 20 MB limit`)
        continue
      }
      valid.push({ id: createFileId(file), file })
    }

    setFiles((prev) => [...prev, ...valid].slice(0, MAX_FILES))
  }

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
    setMergedBlob(null)
  }

  const clearAll = () => {
    setFiles([])
    setMergedBlob(null)
    setError('')
  }

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Add at least 2 PDF files to merge')
      return
    }

    setLoading(true)
    setError('')
    setMergedBlob(null)

    try {
      const blob = await mergePdfs(files.map((f) => f.file))
      setMergedBlob(blob)
    } catch (err) {
      setError(await getPdfErrorMessage(err, 'Failed to merge PDFs'))
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (mergedBlob) {
      downloadBlob(mergedBlob, 'merged.pdf')
    }
  }

  return (
    <>
      <ToolLayout toolId="merge">
        <PdfDropzone
          onFilesAdded={addFiles}
          disabled={loading}
          maxFiles={MAX_FILES}
          currentCount={files.length}
        />

          {error && (
            <div
              className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
              role="alert"
            >
              {error}
            </div>
          )}

          {files.length > 0 && (
            <div>
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-zinc-400">
                  {files.length} file{files.length !== 1 ? 's' : ''} · merged in this order
                </p>
                <button
                  type="button"
                  onClick={clearAll}
                  disabled={loading}
                  className="self-start text-sm text-zinc-500 transition-colors hover:text-zinc-300 disabled:opacity-50"
                >
                  Clear all
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {files.map((entry, index) => (
                  <FilePreviewCard
                    key={entry.id}
                    file={entry.file}
                    index={index}
                    onRemove={() => removeFile(entry.id)}
                    disabled={loading}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              size="lg"
              className="w-full sm:w-auto"
              onClick={handleMerge}
              disabled={loading || files.length < 2}
            >
              {loading ? (
                <>
                  <Spinner />
                  Merging PDFs…
                </>
              ) : (
                'Merge PDFs'
              )}
            </Button>

            {mergedBlob && (
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
                onClick={handleDownload}
                disabled={loading}
              >
                <ToolIcon name="document" className="h-5 w-5" />
                Download merged PDF
              </Button>
            )}
          </div>

          {mergedBlob && (
            <GlassCard hover={false} className="overflow-hidden p-1">
              <p className="border-b border-white/10 px-4 py-3 text-sm font-medium text-emerald-400">
                Merge complete — preview
              </p>
              {mergedPreviewUrl && (
                <iframe
                  src={mergedPreviewUrl}
                  title="Merged PDF preview"
                  className="aspect-4/3 w-full min-h-80 border-0 sm:aspect-video"
                />
              )}
            </GlassCard>
          )}
      </ToolLayout>
    </>
  )
}
