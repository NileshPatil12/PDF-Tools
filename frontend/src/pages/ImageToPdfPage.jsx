import { useEffect, useRef, useState } from 'react'
import { imageToPdf, getPdfErrorMessage, downloadBlob } from '../api/pdf'
import { getToolById } from '../data/tools'
import ToolLayout from '../layouts/ToolLayout'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import ToolIcon from '../components/icons/ToolIcons'

const MAX_IMAGES = 10
const MAX_FILE_SIZE = 20 * 1024 * 1024

function createFileId(file) {
  return `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`
}

function isImageFile(file) {
  return (
    file.type.startsWith('image/') ||
    /\.(jpe?g|png|webp)$/i.test(file.name)
  )
}

export default function ImageToPdfPage() {
  const tool = getToolById('image-to-pdf')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pdfBlob, setPdfBlob] = useState(null)
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!pdfBlob) {
      setPdfPreviewUrl(null)
      return
    }

    const url = URL.createObjectURL(pdfBlob)
    setPdfPreviewUrl(url)

    return () => URL.revokeObjectURL(url)
  }, [pdfBlob])

  useEffect(() => {
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.previewUrl))
    }
  }, [images])

  const addFiles = (fileList) => {
    setError('')
    setPdfBlob(null)

    const incoming = Array.from(fileList)
    if (!incoming.length) return

    const next = []
    let fileError = ''

    for (const file of incoming) {
      if (!isImageFile(file)) {
        fileError = 'Only JPG, PNG, or WebP files are allowed.'
        continue
      }
      if (file.size > MAX_FILE_SIZE) {
        fileError = `${file.name} exceeds the 20 MB limit.`
        continue
      }

      next.push({
        id: createFileId(file),
        file,
        previewUrl: URL.createObjectURL(file),
      })
    }

    setError(fileError)
    setImages((prev) => {
      const merged = [...prev, ...next].slice(0, MAX_IMAGES)
      return merged
    })
  }

  const removeImage = (id) => {
    setImages((prev) => {
      const removed = prev.find((image) => image.id === id)
      if (removed) URL.revokeObjectURL(removed.previewUrl)
      return prev.filter((image) => image.id !== id)
    })
    setPdfBlob(null)
  }

  const clearAll = () => {
    images.forEach((image) => URL.revokeObjectURL(image.previewUrl))
    setImages([])
    setPdfBlob(null)
    setError('')
  }

  const handleConvert = async () => {
    if (!images.length) {
      setError('Upload at least one image to convert.')
      return
    }

    setLoading(true)
    setError('')
    setPdfBlob(null)

    try {
      const blob = await imageToPdf(images.map((image) => image.file))
      setPdfBlob(blob)
    } catch (err) {
      setError(await getPdfErrorMessage(err, 'Failed to convert images to PDF'))
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (pdfBlob) {
      downloadBlob(pdfBlob, 'images-to-pdf.pdf')
    }
  }

  return (
    <>
      <ToolLayout toolId="image-to-pdf">
        <GlassCard hover={false} className="overflow-hidden p-1">
            <div className="relative rounded-xl border border-white/10 bg-zinc-950/80 px-5 py-8 sm:px-6">
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                multiple
                className="sr-only"
                onChange={(event) => {
                  addFiles(event.target.files)
                  event.target.value = ''
                }}
              />

              <div
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    inputRef.current?.click()
                  }
                }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault()
                  addFiles(event.dataTransfer.files)
                }}
                onClick={() => inputRef.current?.click()}
                className="flex min-h-[240px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-700 bg-white/5 px-6 py-10 text-center transition hover:border-emerald-400/60 hover:bg-emerald-400/5 focus:outline-none"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
                  <ToolIcon name="upload" className="h-7 w-7" />
                </div>
                <p className="text-lg font-semibold text-zinc-100">Upload images</p>
                <p className="mt-2 text-sm text-zinc-500">
                  Drag & drop JPG, PNG, or WebP files here, or browse from your device.
                </p>
                <p className="mt-3 text-xs text-zinc-500">Up to {MAX_IMAGES} images, 20 MB each.</p>
              </div>
            </div>
          </GlassCard>

          {error && (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200" role="alert">
              {error}
            </div>
          )}

          {images.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-zinc-400">
                  {images.length} image{images.length !== 1 ? 's' : ''} selected
                </p>
                <button
                  type="button"
                  onClick={clearAll}
                  className="self-start text-sm text-zinc-500 transition-colors hover:text-zinc-300"
                >
                  Clear all
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {images.map((image) => (
                  <GlassCard key={image.id} hover={false} className="overflow-hidden p-0">
                    <div className="relative overflow-hidden bg-zinc-950">
                      <img
                        src={image.previewUrl}
                        alt={image.file.name}
                        className="h-44 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-zinc-200 transition hover:bg-black/80"
                        aria-label={`Remove ${image.file.name}`}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="space-y-2 p-4">
                      <p className="truncate text-sm font-semibold text-zinc-100">{image.file.name}</p>
                      <p className="text-xs text-zinc-500">{Math.round(image.file.size / 1024)} KB</p>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              size="lg"
              className="w-full sm:w-auto"
              onClick={handleConvert}
              disabled={loading || images.length === 0}
            >
              {loading ? (
                <>
                  <Spinner />
                  Converting…
                </>
              ) : (
                'Convert to PDF'
              )}
            </Button>

            {pdfBlob && (
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
                onClick={handleDownload}
              >
                <ToolIcon name="document" className="h-5 w-5" />
                Download PDF
              </Button>
            )}
          </div>

          {pdfPreviewUrl && (
            <GlassCard hover={false} className="overflow-hidden p-1">
              <p className="border-b border-white/10 px-4 py-3 text-sm font-medium text-emerald-400">
                Generated PDF preview
              </p>
              <iframe
                src={pdfPreviewUrl}
                title="Converted PDF preview"
                className="aspect-[4/3] w-full min-h-[280px] border-0 sm:aspect-[16/9]"
              />
            </GlassCard>
          )}
        </ToolLayout>
    </>
  )
}
