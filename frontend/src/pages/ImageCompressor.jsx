import { useEffect, useState } from 'react'
import ToolLayout from '../layouts/ToolLayout'
import ImageDropzone from '../components/image/ImageDropzone'
import ImagePreviewCard from '../components/image/ImagePreviewCard'
import ImageStats from '../components/image/ImageStats'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'

export default function ImageCompressor() {
  const [file, setFile] = useState(null)

  const [targetSize, setTargetSize] = useState(500)
  const [unit, setUnit] = useState('KB')

  const [loading, setLoading] = useState(false)

  const [compressedBlob, setCompressedBlob] = useState(null)

  const [originalSize, setOriginalSize] = useState(0)
  const [compressedSize, setCompressedSize] = useState(0)

  const [actualQuality, setActualQuality] = useState(null)
  const [targetBytesReached, setTargetBytesReached] = useState(false)

  useEffect(() => {
    if (!file) return

    setOriginalSize(file.size / 1024)
    setCompressedBlob(null)
    setCompressedSize(0)
    setActualQuality(null)
  }, [file])

  const compressImage = async () => {
    if (!file) return

    setLoading(true)

    const targetBytes =
      unit === 'MB'
        ? targetSize * 1024 * 1024
        : targetSize * 1024

    const img = new Image()

    img.src = URL.createObjectURL(file)

    img.onload = async () => {
      const canvas = document.createElement('canvas')

      canvas.width = img.width
      canvas.height = img.height

      const ctx = canvas.getContext('2d')

      ctx.drawImage(img, 0, 0)

      let low = 0.01
      let high = 1

      let bestBlob = null
      let bestQuality = 1

      for (let i = 0; i < 20; i++) {
        const quality = (low + high) / 2

        const blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, 'image/jpeg', quality)
        )

        if (!blob) continue

        if (blob.size > targetBytes) {
          high = quality
        } else {
          bestBlob = blob
          bestQuality = quality
          low = quality
        }
      }

      if (!bestBlob) {
        bestBlob = await new Promise((resolve) =>
          canvas.toBlob(resolve, 'image/jpeg', 0.05)
        )
      }

      setCompressedBlob(bestBlob)
      setCompressedSize(bestBlob.size / 1024)

      setActualQuality(Math.round(bestQuality * 100))

      setTargetBytesReached(
        Math.abs(bestBlob.size - targetBytes) <=
          targetBytes * 0.1
      )

      setLoading(false)
    }
  }

  const downloadImage = () => {
    if (!compressedBlob) return

    const url = URL.createObjectURL(compressedBlob)

    const a = document.createElement('a')

    a.href = url

    a.download = `compressed-${file.name.replace(
      /\.[^/.]+$/,
      ''
    )}.jpg`

    document.body.appendChild(a)

    a.click()

    document.body.removeChild(a)

    URL.revokeObjectURL(url)
  }

  const reduction =
    originalSize > 0
      ? (
          ((originalSize - compressedSize) /
            originalSize) *
          100
        ).toFixed(1)
      : 0

  return (
    <ToolLayout toolId="compress-image">
      <ImageDropzone
        onFileSelect={setFile}
        accept="image/*"
      />

      {file && (
        <>
          <ImagePreviewCard file={file} />

          <ImageStats file={file} />

          <GlassCard className="p-6">
            <h3 className="mb-5 text-lg font-semibold text-zinc-100">
              Compression Settings
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Target Size
                </label>

                <input
                  type="number"
                  min="10"
                  value={targetSize}
                  onChange={(e) =>
                    setTargetSize(Number(e.target.value))
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Unit
                </label>

                <select
                  value={unit}
                  onChange={(e) =>
                    setUnit(e.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-100 outline-none focus:border-violet-500"
                >
                  <option value="KB">KB</option>
                  <option value="MB">MB</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {[100, 200, 500, 1024].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    setTargetSize(size)
                    setUnit('KB')
                  }}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/10"
                >
                  {size >= 1024
                    ? `${size / 1024} MB`
                    : `${size} KB`}
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-violet-500/20 bg-violet-500/10 p-4">
              <p className="text-sm text-violet-300">
                Compress image below{' '}
                <span className="font-semibold">
                  {targetSize} {unit}
                </span>
              </p>
            </div>
          </GlassCard>

          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={compressImage}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner />
                  Compressing...
                </>
              ) : (
                'Compress Image'
              )}
            </Button>

            {compressedBlob && (
              <Button
                variant="secondary"
                size="lg"
                onClick={downloadImage}
              >
                Download Image
              </Button>
            )}
          </div>

          {compressedBlob && (
            <GlassCard className="p-6">
              <h3 className="mb-5 text-lg font-semibold text-zinc-100">
                Compression Results
              </h3>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-zinc-500">
                    Original Size
                  </p>

                  <p className="mt-1 text-lg font-semibold text-zinc-100">
                    {originalSize.toFixed(2)} KB
                  </p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500">
                    Compressed Size
                  </p>

                  <p className="mt-1 text-lg font-semibold text-emerald-400">
                    {compressedSize.toFixed(2)} KB
                  </p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500">
                    Reduction
                  </p>

                  <p className="mt-1 text-lg font-semibold text-violet-400">
                    {reduction}%
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-zinc-500">
                    Target Size
                  </p>

                  <p className="mt-1 text-lg font-semibold text-cyan-400">
                    {targetSize} {unit}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500">
                    Quality Used
                  </p>

                  <p className="mt-1 text-lg font-semibold text-amber-400">
                    {actualQuality}%
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <p className="text-sm text-emerald-300">
                  {targetBytesReached
                    ? '✓ Successfully compressed near target size'
                    : '⚠ Closest possible size generated'}
                </p>
              </div>
            </GlassCard>
          )}
        </>
      )}
    </ToolLayout>
  )
}