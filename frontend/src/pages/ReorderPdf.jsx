import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'

import ToolLayout from '../layouts/ToolLayout'
import PdfDropzone from '../components/merge/PdfDropzone'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'

export default function ReorderPdf() {
  const [file, setFile] = useState(null)
  const [pages, setPages] = useState([])
  const [originalPages, setOriginalPages] = useState([])
  const [loading, setLoading] = useState(false)

  const handlePdfUpload = async (selectedFile) => {
    if (!selectedFile) return

    setFile(selectedFile)

    const bytes = await selectedFile.arrayBuffer()

    const pdfDoc = await PDFDocument.load(bytes)

    const count = pdfDoc.getPageCount()

    const pageList = Array.from(
      { length: count },
      (_, i) => i
    )

    setPages(pageList)
    setOriginalPages(pageList)
  }

  const moveUp = (index) => {
    if (index === 0) return

    const updated = [...pages]

    ;[updated[index - 1], updated[index]] = [
      updated[index],
      updated[index - 1],
    ]

    setPages(updated)
  }

  const moveDown = (index) => {
    if (index === pages.length - 1) return

    const updated = [...pages]

    ;[updated[index], updated[index + 1]] = [
      updated[index + 1],
      updated[index],
    ]

    setPages(updated)
  }

  const deletePage = (index) => {
    setPages((prev) =>
      prev.filter((_, i) => i !== index)
    )
  }

  const resetOrder = () => {
    setPages([...originalPages])
  }

  const downloadPdf = async () => {
    if (!file) return

    setLoading(true)

    try {
      const sourceBytes =
        await file.arrayBuffer()

      const sourcePdf =
        await PDFDocument.load(sourceBytes)

      const newPdf =
        await PDFDocument.create()

      for (const pageIndex of pages) {
        const [page] =
          await newPdf.copyPages(
            sourcePdf,
            [pageIndex]
          )

        newPdf.addPage(page)
      }

      const pdfBytes =
        await newPdf.save()

      const blob = new Blob(
        [pdfBytes],
        {
          type: 'application/pdf',
        }
      )

      const url =
        URL.createObjectURL(blob)

      const a =
        document.createElement('a')

      a.href = url
      a.download = 'reordered.pdf'

      a.click()

      URL.revokeObjectURL(url)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ToolLayout toolId="reorder-pdf">
      <PdfDropzone
        onFilesAdded={(files) =>
          handlePdfUpload(files[0])
        }
        maxFiles={1}
        currentCount={0}
      />
      

      {file && (
        <>
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-zinc-100">
                  {file.name}
                </h3>

                <p className="text-sm text-zinc-400">
                  {pages.length} Pages
                </p>
              </div>

              <Button
                variant="secondary"
                onClick={resetOrder}
              >
                Reset
              </Button>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-zinc-100">
              Reorder Pages
            </h3>

            <div className="space-y-3">
              {pages.map(
                (pageNumber, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <div>
                      <p className="font-medium text-zinc-100">
                        Page {pageNumber + 1}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          moveUp(index)
                        }
                      >
                        ↑
                      </Button>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          moveDown(index)
                        }
                      >
                        ↓
                      </Button>

                      <Button
                        size="sm"
                        onClick={() =>
                          deletePage(index)
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )
              )}
            </div>
          </GlassCard>

          <Button
            size="lg"
            onClick={downloadPdf}
            disabled={
              loading || pages.length === 0
            }
          >
            {loading ? (
              <>
                <Spinner />
                Processing...
              </>
            ) : (
              'Download Reordered PDF'
            )}
          </Button>
        </>
      )}
    </ToolLayout>
  )
}