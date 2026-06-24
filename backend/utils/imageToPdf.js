const path = require('path')
const fs = require('fs').promises
const { jsPDF } = require('jspdf')

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads')

async function imagesToPdf(imagePaths) {
  let pdf = null
  let firstPage = true

  for (const imagePath of imagePaths) {
    const buffer = await fs.readFile(imagePath)
    const extension = path.extname(imagePath).toLowerCase().slice(1)

    const supported = extension === 'png' || extension === 'jpg' || extension === 'jpeg'
    if (!supported) {
      throw new Error(`Unsupported image format: ${extension}`)
    }

    const imageBase64 = buffer.toString('base64')
    const imageType = extension === 'png' ? 'PNG' : 'JPEG'
    const dataUrl = `data:image/${extension};base64,${imageBase64}`

    const img = new jsPDF({ unit: 'px', format: 'a4' })
    const imageProps = img.getImageProperties(dataUrl)
    const width = imageProps.width
    const height = imageProps.height

    if (firstPage) {
      pdf = new jsPDF({ unit: 'px', format: [width, height] })
      pdf.addImage(dataUrl, imageType, 0, 0, width, height)
      firstPage = false
    } else {
      pdf.addPage([width, height])
      pdf.addImage(dataUrl, imageType, 0, 0, width, height)
    }
  }

  if (!pdf) {
    throw new Error('No images provided')
  }

  return Buffer.from(pdf.output('arraybuffer'))
}

async function savePdf(pdfBytes, filename) {
  const filePath = path.join(UPLOADS_DIR, filename)
  await fs.writeFile(filePath, pdfBytes)
  return filePath
}

async function generateImagePdfFileName() {
  return `image-to-pdf-${Date.now()}-${Math.round(Math.random() * 1e9)}.pdf`
}

async function deleteTempFile(filePath) {
  if (!filePath) return
  try {
    await fs.unlink(filePath)
  } catch {
    /* file may already be removed */
  }
}

module.exports = {
  imagesToPdf,
  savePdf,
  generateImagePdfFileName,
  deleteTempFile,
  UPLOADS_DIR,
}
