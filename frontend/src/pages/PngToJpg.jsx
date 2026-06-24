import { useState } from 'react'
import ToolLayout from '../layouts/ToolLayout'
import ImageDropzone from '../components/image/ImageDropzone'
import ImagePreviewCard from '../components/image/ImagePreviewCard'
import Button from '../components/ui/Button'

export default function PngToJpg() {
  const [file, setFile] = useState(null)

  const convert = () => {
    const img = new Image()

    img.src = URL.createObjectURL(file)

    img.onload = () => {
      const canvas = document.createElement('canvas')

      canvas.width = img.width
      canvas.height = img.height

      const ctx = canvas.getContext('2d')

      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.drawImage(img, 0, 0)

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = url
        a.download = file.name.replace('.png', '.jpg')
        a.click()
      }, 'image/jpeg')
    }
  }

  return (
    <ToolLayout toolId="png-to-jpg">
      <ImageDropzone
        accept=".png"
        onFileSelect={setFile}
      />

      {file && (
        <>
          <ImagePreviewCard file={file} />

          <Button
            size="lg"
            onClick={convert}
          >
            Convert To JPG
          </Button>
        </>
      )}
    </ToolLayout>
  )
}