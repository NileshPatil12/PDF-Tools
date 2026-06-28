import { useEffect, useState } from 'react'
import ToolLayout from '../layouts/ToolLayout'
import ImageDropzone from '../components/image/ImageDropzone'
import ImagePreviewCard from '../components/image/ImagePreviewCard'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'

export default function ResizeImage() {
  const [file, setFile] = useState(null)

  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')

  const [originalWidth, setOriginalWidth] = useState(0)
  const [originalHeight, setOriginalHeight] = useState(0)

  const [keepAspectRatio, setKeepAspectRatio] = useState(true)

  const [loading, setLoading] = useState(false)

  const [resizedBlob, setResizedBlob] = useState(null)

  useEffect(() => {
    if (!file) return

    const img = new Image()

    img.src = URL.createObjectURL(file)

    img.onload = () => {
      setOriginalWidth(img.width)
      setOriginalHeight(img.height)

      setWidth(img.width)
      setHeight(img.height)
    }
  }, [file])

  const handleWidthChange = (value) => {
    setWidth(value)

    if (keepAspectRatio && originalWidth) {
      const ratio = originalHeight / originalWidth

      setHeight(Math.round(value * ratio))
    }
  }

  const handleHeightChange = (value) => {
    setHeight(value)

    if (keepAspectRatio && originalHeight) {
      const ratio = originalWidth / originalHeight

      setWidth(Math.round(value * ratio))
    }
  }

  const resizeImage = () => {
    if (!file || !width || !height) return

    setLoading(true)

    const img = new Image()

    img.src = URL.createObjectURL(file)

    img.onload = () => {
      const canvas = document.createElement('canvas')

      canvas.width = Number(width)
      canvas.height = Number(height)

      const ctx = canvas.getContext('2d')

      ctx.drawImage(
        img,
        0,
        0,
        Number(width),
        Number(height)
      )

      canvas.toBlob((blob) => {
        setResizedBlob(blob)
        setLoading(false)
      })
    }
  }

  const downloadImage = () => {
    if (!resizedBlob) return

    const url = URL.createObjectURL(resizedBlob)

    const a = document.createElement('a')

    a.href = url

    a.download = `resized-${file.name}`

    a.click()

    URL.revokeObjectURL(url)
  }

  return (
    <ToolLayout toolId="resize-image">
      <ImageDropzone
        onFileSelect={setFile}
        accept="image/*"
      />

      {file && (
        <>
          <ImagePreviewCard file={file} />

          <GlassCard className="p-6">
            <h3 className="mb-5 text-lg font-semibold text-zinc-100">
              Image Dimensions
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-zinc-500">
                  Current Size
                </p>

                <p className="mt-1 text-lg font-semibold text-emerald-400">
                  {originalWidth} × {originalHeight} px
                </p>
              </div>

              <div>
                <p className="text-xs text-zinc-500">
                  New Size
                </p>

                <p className="mt-1 text-lg font-semibold text-violet-400">
                  {width || 0} × {height || 0} px
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="mb-5 text-lg font-semibold text-zinc-100">
              Resize Settings
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Width (px)
                </label>

                <input
                  type="number"
                  value={width}
                  onChange={(e) =>
                    handleWidthChange(
                      Number(e.target.value)
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-zinc-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Height (px)
                </label>

                <input
                  type="number"
                  value={height}
                  onChange={(e) =>
                    handleHeightChange(
                      Number(e.target.value)
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-zinc-100"
                />
              </div>
            </div>

            <label className="mt-4 flex items-center gap-2 text-zinc-300">
              <input
                type="checkbox"
                checked={keepAspectRatio}
                onChange={() =>
                  setKeepAspectRatio(!keepAspectRatio)
                }
              />

              Maintain Aspect Ratio
            </label>

            <div className="mt-6">
              <p className="mb-3 text-sm text-zinc-400">
                Quick Presets
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setWidth(1920)
                    setHeight(1080)
                  }}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300"
                >
                  Full HD
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setWidth(1280)
                    setHeight(720)
                  }}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300"
                >
                  HD
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setWidth(1280)
                    setHeight(720)
                  }}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300"
                >
                  YouTube Thumbnail
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setWidth(1080)
                    setHeight(1080)
                  }}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300"
                >
                  Instagram Post
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setWidth(300)
                    setHeight(300)
                  }}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300"
                >
                  Passport Photo
                </button>
              </div>
            </div>
          </GlassCard>

          <div className="flex gap-3">
            <Button
              size="lg"
              onClick={resizeImage}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner />
                  Resizing...
                </>
              ) : (
                'Resize Image'
              )}
            </Button>

            {resizedBlob && (
              <Button
                variant="secondary"
                size="lg"
                onClick={downloadImage}
              >
                Download Image
              </Button>
            )}
          </div>

          {resizedBlob && (
            <GlassCard className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-zinc-100">
                Resize Result
              </h3>

              <p className="text-zinc-300">
                Image resized from{' '}
                <span className="font-semibold text-emerald-400">
                  {originalWidth} × {originalHeight}
                </span>{' '}
                to{' '}
                <span className="font-semibold text-violet-400">
                  {width} × {height}
                </span>{' '}
                pixels.
              </p>
            </GlassCard>
          )}
        </>
      )}
    </ToolLayout>
  )
}