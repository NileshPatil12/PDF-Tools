const path = require('path')
const fs = require('fs').promises
const { PDFDocument } = require('pdf-lib')

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads')

async function splitPdfPages(filePath) {
  try {
    const buffer = await fs.readFile(filePath)
    const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true })
    
    const pageCount = pdf.getPageCount()
    
    if (pageCount === 0) {
      throw new Error('PDF contains no pages')
    }

    console.log(`Splitting PDF with ${pageCount} pages from ${filePath}`)
    
    const splitFiles = []
    const pageIndices = pdf.getPageIndices()

    for (const pageIndex of pageIndices) {
      const singlePagePdf = await PDFDocument.create()
      const [copiedPage] = await singlePagePdf.copyPages(pdf, [pageIndex])
      singlePagePdf.addPage(copiedPage)
      
      const pdfBytes = await singlePagePdf.save()
      const filename = `split-${Date.now()}-page-${pageIndex + 1}-${Math.round(Math.random() * 1e9)}.pdf`
      const outputPath = path.join(UPLOADS_DIR, filename)
      
      await fs.writeFile(outputPath, pdfBytes)
      
      console.log(`Created split file: ${filename} (${pdfBytes.length} bytes)`)
      
      splitFiles.push({
        filename,
        filePath: outputPath,
        pageNumber: pageIndex + 1,
        size: pdfBytes.length,
      })
    }

    console.log(`Successfully split PDF into ${splitFiles.length} files`)
    return splitFiles
  } catch (error) {
    console.error('Error splitting PDF:', error.message, error.stack)
    throw error
  }
}

async function deleteTempFile(filePath) {
  if (!filePath) return
  try {
    await fs.unlink(filePath)
    console.log(`Deleted temp file: ${filePath}`)
  } catch (err) {
    console.warn(`Failed to delete temp file ${filePath}:`, err.message)
  }
}

async function deleteTempFiles(filePaths) {
  await Promise.all(filePaths.map((filePath) => deleteTempFile(filePath)))
}

module.exports = {
  splitPdfPages,
  deleteTempFile,
  deleteTempFiles,
  UPLOADS_DIR,
}
