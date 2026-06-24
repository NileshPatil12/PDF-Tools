import { useState } from 'react'
import ToolLayout from '../layouts/ToolLayout'
import ImageDropzone from '../components/image/ImageDropzone'
import ImagePreviewCard from '../components/image/ImagePreviewCard'
import Button from '../components/ui/Button'

export default function ResizeImage() {
  const [file, setFile] = useState(null)
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')

  const resizeImage = () => {
    if (!file || !width || !height) return

    const img = new Image()
    img.src = URL.createObjectURL(file)

    img.onload = () => {
      const canvas = document.createElement('canvas')

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = url
        a.download = `resized-${file.name}`
        a.click()
      })
    }
  }

  return (
    <ToolLayout toolId="resize-image">
      <ImageDropzone onFileSelect={setFile} />

      {file && (
        <>
          <ImagePreviewCard file={file} />

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="number"
              placeholder="Width"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/5 p-3 text-zinc-100"
            />

            <input
              type="number"
              placeholder="Height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/5 p-3 text-zinc-100"
            />
          </div>

          <Button
            size="lg"
            onClick={resizeImage}
          >
            Resize Image
          </Button>
        </>
      )}
    </ToolLayout>
  )
}