import { useState } from 'react'
import ToolLayout from '../layouts/ToolLayout'
import ImageDropzone from '../components/image/ImageDropzone'
import ImagePreviewCard from '../components/image/ImagePreviewCard'
import Button from '../components/ui/Button'

export default function JpgToPng() {
  const [file, setFile] = useState(null)

  const convert = () => {
    const img = new Image()

    img.src = URL.createObjectURL(file)

    img.onload = () => {
      const canvas = document.createElement('canvas')

      canvas.width = img.width
      canvas.height = img.height

      const ctx = canvas.getContext('2d')

      ctx.drawImage(img, 0, 0)

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = url
        a.download = file.name.replace(/\.[^/.]+$/, '.png')
        a.click()
      }, 'image/png')
    }
  }

  return (
    <ToolLayout toolId="jpg-to-png">
      <ImageDropzone
        accept=".jpg,.jpeg"
        onFileSelect={setFile}
      />

      {file && (
        <>
          <ImagePreviewCard file={file} />

          <Button
            size="lg"
            onClick={convert}
          >
            Convert To PNG
          </Button>
        </>
      )}
    </ToolLayout>
  )
}