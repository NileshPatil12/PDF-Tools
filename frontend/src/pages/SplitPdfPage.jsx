import { useEffect, useState } from 'react'
import ToolLayout from '../layouts/ToolLayout'
import { splitPdf, getPdfErrorMessage } from '../api/pdf'
import { getToolById } from '../data/tools'
// header and route handled by ToolLayout
import PdfDropzone from '../components/merge/PdfDropzone'
import FilePreviewCard from '../components/merge/FilePreviewCard'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
// header icon rendered by ToolLayout

function createFileId(file) {
  return `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`
}

function getDownloadUrl(path) {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  return `${baseUrl}${path}`
}

export default function SplitPdfPage() {
  const tool = getToolById('split')
  const [fileEntry, setFileEntry] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [splitFiles, setSplitFiles] = useState([])

  useEffect(() => {
    if (!fileEntry) {
      setSplitFiles([])
      setError('')
    }
  }, [fileEntry])

  const addFiles = (incoming) => {
    setError('')
    setSplitFiles([])

    const pdf = Array.from(incoming).find(
      (file) =>
        file.type === 'application/pdf' ||
        file.name.toLowerCase().endsWith('.pdf'),
    )

    if (!pdf) {
      setError('Please upload a valid PDF file.')
      return
    }

    if (pdf.size > 50 * 1024 * 1024) {
      setError('PDF must be smaller than 50 MB.')
      return
    }

    setFileEntry({ id: createFileId(pdf), file: pdf })
  }

  const removeFile = () => {
    setFileEntry(null)
    setSplitFiles([])
    setError('')
  }

  const clearAll = () => removeFile()

  const handleSplit = async () => {
    if (!fileEntry) {
      setError('Upload a PDF file before splitting.')
      return
    }

    setLoading(true)
    setError('')
    setSplitFiles([])

    try {
      const data = await splitPdf(fileEntry.file)
      setSplitFiles(data.files || [])
    } catch (err) {
      setError(await getPdfErrorMessage(err, 'Unable to split PDF.'))
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadAll = () => {
    splitFiles.forEach((file) => {
      const link = document.createElement('a')
      link.href = getDownloadUrl(file.url)
      link.download = file.filename
      link.target = '_blank'
      link.rel = 'noreferrer'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }

  return (
    <>
      <ToolLayout toolId="split">
        <PdfDropzone
          onFilesAdded={addFiles}
          disabled={loading}
          maxFiles={1}
          currentCount={fileEntry ? 1 : 0}
        />

          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300" role="alert">
              {error}
            </div>
          )}

          {fileEntry && (
            <div>
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-zinc-400">
                  1 PDF selected · ready to split
                </p>
                <button
                  type="button"
                  onClick={clearAll}
                  disabled={loading}
                  className="self-start text-sm text-zinc-500 transition-colors hover:text-zinc-300 disabled:opacity-50"
                >
                  Remove file
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-1">
                <FilePreviewCard
                  key={fileEntry.id}
                  file={fileEntry.file}
                  index={0}
                  onRemove={removeFile}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              size="lg"
              className="w-full sm:w-auto"
              onClick={handleSplit}
              disabled={loading || !fileEntry}
            >
              {loading ? (
                <>
                  <Spinner />
                  Splitting PDF…
                </>
              ) : (
                'Split PDF'
              )}
            </Button>
            {splitFiles.length > 0 && (
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
                onClick={handleDownloadAll}
              >
                Download all
              </Button>
            )}
          </div>

          {splitFiles.length > 0 && (
            <GlassCard hover={false} className="overflow-hidden p-1">
              <div className="border-b border-white/10 px-4 py-3">
                <p className="text-sm font-medium text-emerald-400">Split complete — download individual pages</p>
              </div>
              <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
                {splitFiles.map((file) => (
                  <div key={file.filename} className="rounded-3xl border border-white/10 bg-zinc-950/70 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-zinc-100">Page {file.pageNumber}</p>
                        <p className="mt-1 text-xs text-zinc-500">{file.filename}</p>
                      </div>
                      <span className="rounded-full bg-zinc-900/80 px-2 py-1 text-xs uppercase tracking-[0.18em] text-zinc-400">
                        {Math.round(file.size / 1024)} KB
                      </span>
                    </div>
                    <a
                      href={getDownloadUrl(file.url)}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-400"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
      </ToolLayout>
    </>
  )
}
