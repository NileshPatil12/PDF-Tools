const path = require('path')
const fs = require('fs').promises
const { PDFDocument } = require('pdf-lib')

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads')

async function mergeAllPages(buffers) {
  const mergedPdf = await PDFDocument.create()

  for (const buffer of buffers) {
    const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true })
    const pageIndices = pdf.getPageIndices()
    const copiedPages = await mergedPdf.copyPages(pdf, pageIndices)
    copiedPages.forEach((page) => mergedPdf.addPage(page))
  }

  return mergedPdf.save()
}

async function mergePdfFiles(filePaths) {
  const buffers = await Promise.all(
    filePaths.map((filePath) => fs.readFile(filePath)),
  )
  return mergeAllPages(buffers)
}

async function saveMergedPdfTemp(mergedBytes) {
  const filename = `merged-${Date.now()}-${Math.round(Math.random() * 1e9)}.pdf`
  const filePath = path.join(UPLOADS_DIR, filename)
  await fs.writeFile(filePath, mergedBytes)
  return filePath
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
  mergePdfFiles,
  mergeAllPages,
  saveMergedPdfTemp,
  deleteTempFile,
  UPLOADS_DIR,
}
