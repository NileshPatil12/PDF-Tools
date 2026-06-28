import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'

import ToolLayout from '../layouts/ToolLayout'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import PdfDropzone from '../components/merge/PdfDropzone'

export default function PdfMetadataViewer() {
  const [file, setFile] = useState(null)
  const [metadata, setMetadata] = useState(null)
  const [loading, setLoading] = useState(false)

  const clearFile = () => {
    setFile(null)
    setMetadata(null)
  }

  const handlePdfSelect = async (selectedFile) => {
    if (!selectedFile) return

    setFile(selectedFile)
    setMetadata(null)
    setLoading(true)

    try {
      const bytes = await selectedFile.arrayBuffer()

      const pdfDoc = await PDFDocument.load(bytes)

      setMetadata({
        fileName: selectedFile.name,
        fileSize: (
          selectedFile.size /
          1024 /
          1024
        ).toFixed(2),

        pages: pdfDoc.getPageCount(),

        title:
          pdfDoc.getTitle() ||
          'Not Available',

        author:
          pdfDoc.getAuthor() ||
          'Not Available',

        subject:
          pdfDoc.getSubject() ||
          'Not Available',

        keywords:
          pdfDoc.getKeywords() ||
          'Not Available',

        creationDate:
          pdfDoc
            .getCreationDate()
            ?.toLocaleString() ||
          'Not Available',

        modificationDate:
          pdfDoc
            .getModificationDate()
            ?.toLocaleString() ||
          'Not Available',
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const copyMetadata = () => {
    navigator.clipboard.writeText(
      JSON.stringify(metadata, null, 2)
    )
  }

  const downloadMetadata = () => {
    const blob = new Blob(
      [JSON.stringify(metadata, null, 2)],
      {
        type: 'application/json',
      }
    )

    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'pdf-metadata.json'
    a.click()

    URL.revokeObjectURL(url)
  }

  return (
    <ToolLayout toolId="pdf-metadata">
      <GlassCard className="p-8">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-zinc-100">
              PDF Metadata Viewer
            </h2>

            <p className="mt-2 text-zinc-400">
              Inspect PDF document
              properties instantly.
            </p>
          </div>

          <PdfDropzone
            onFilesAdded={(files) =>
              handlePdfSelect(files[0])
            }
            maxFiles={1}
            currentCount={file ? 1 : 0}
          />

          {file && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-zinc-100">
                    {file.name}
                  </p>

                  <p className="text-sm text-zinc-400">
                    {(
                      file.size /
                      1024 /
                      1024
                    ).toFixed(2)}{' '}
                    MB
                  </p>
                </div>

                <Button
                  variant="ghost"
                  onClick={clearFile}
                >
                  Clear File
                </Button>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex justify-center">
              <Button disabled>
                <Spinner />
                Reading PDF...
              </Button>
            </div>
          )}
        </div>
      </GlassCard>

      {metadata && (
        <GlassCard className="mt-6 p-8">
          <div className="mb-6 flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={copyMetadata}
            >
              Copy Metadata
            </Button>

            <Button
              variant="secondary"
              onClick={downloadMetadata}
            >
              Download JSON
            </Button>
          </div>

          <h3 className="mb-6 text-xl font-semibold text-zinc-100">
            Document Information
          </h3>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Info
              label="File Name"
              value={metadata.fileName}
            />

            <Info
              label="File Size"
              value={`${metadata.fileSize} MB`}
            />

            <Info
              label="Pages"
              value={metadata.pages}
            />

            <Info
              label="Title"
              value={metadata.title}
            />

            <Info
              label="Author"
              value={metadata.author}
            />

            <Info
              label="Subject"
              value={metadata.subject}
            />

            <Info
              label="Keywords"
              value={metadata.keywords}
            />

            <Info
              label="Created"
              value={metadata.creationDate}
            />

            <Info
              label="Modified"
              value={metadata.modificationDate}
            />
          </div>
        </GlassCard>
      )}
    </ToolLayout>
  )
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-violet-500/30">
      <p className="text-xs uppercase tracking-wide text-zinc-500">
        {label}
      </p>

      <p className="mt-2 break-words text-sm text-zinc-100">
        {value}
      </p>
    </div>
  )
}