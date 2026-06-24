import { useRef, useState } from 'react'
import { wordToPdf, getPdfErrorMessage, downloadBlob } from '../api/pdf'
import { getToolById } from '../data/tools'
import ToolLayout from '../layouts/ToolLayout'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import ToolIcon from '../components/icons/ToolIcons'

export default function WordToPdfPage() {
  const tool = getToolById('word-to-pdf')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pdfBlob, setPdfBlob] = useState(null)
  const inputRef = useRef(null)

  const handleSelect = (files) => {
    setError('')
    setPdfBlob(null)
    const f = files?.[0]
    if (!f) return
    // basic validation
    const allowed = /\.docx?$|application\/msword|wordprocessingml/i
    if (!f.name.match(/\.docx?$/i) && !f.type.includes('word')) {
      setError('Only DOC or DOCX files are allowed')
      return
    }
    setFile(f)
  }

  const handleConvert = async () => {
    if (!file) {
      setError('Please upload a DOCX file to convert')
      return
    }

    setLoading(true)
    setError('')
    setPdfBlob(null)

    try {
      const blob = await wordToPdf([file])
      setPdfBlob(blob)
    } catch (err) {
      setError(await getPdfErrorMessage(err, 'Failed to convert Word to PDF'))
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (pdfBlob) downloadBlob(pdfBlob, 'document.pdf')
  }

  const clearFile = () => {
    setFile(null)
    setPdfBlob(null)
    setError('')
  }

  return (
    <>
      <ToolLayout toolId="word-to-pdf">
        <GlassCard hover={false} className="overflow-hidden p-1">
            <div className="relative rounded-xl border border-white/10 bg-zinc-950/80 px-5 py-8 sm:px-6">
              <input
                ref={inputRef}
                type="file"
                accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="sr-only"
                onChange={(e) => handleSelect(e.target.files)}
              />

              <div className="flex min-h-[160px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-700 bg-white/5 px-6 py-8 text-center transition hover:border-amber-400/60 hover:bg-amber-400/5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-300">
                  <ToolIcon name="upload" className="h-6 w-6" />
                </div>
                <p className="text-lg font-semibold text-zinc-100">Upload a Word document</p>
                <p className="mt-2 text-sm text-zinc-500">DOC or DOCX · Max 50 MB</p>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-zinc-200 hover:bg-white/10"
                    onClick={() => inputRef.current?.click()}
                  >
                    Choose file
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>

          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300" role="alert">
              {error}
            </div>
          )}

          {file && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-200 truncate">{file.name}</p>
                  <p className="text-xs text-zinc-500">{Math.round(file.size / 1024)} KB</p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={clearFile} className="text-sm text-zinc-500 hover:text-zinc-300">Remove</button>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button size="lg" className="w-full sm:w-auto" onClick={handleConvert} disabled={loading || !file}>
              {loading ? (
                <>
                  <Spinner />
                  Converting…
                </>
              ) : (
                'Convert to PDF'
              )}
            </Button>

            {pdfBlob && (
              <Button variant="secondary" size="lg" className="w-full sm:w-auto" onClick={handleDownload}>
                <ToolIcon name="document" className="h-5 w-5" />
                Download PDF
              </Button>
            )}
          </div>

          {pdfBlob && (
            <GlassCard hover={false} className="overflow-hidden p-1">
              <p className="border-b border-white/10 px-4 py-3 text-sm font-medium text-emerald-400">Generated PDF preview</p>
              <iframe src={URL.createObjectURL(pdfBlob)} title="Word to PDF preview" className="aspect-video w-full min-h-[260px] border-0" />
            </GlassCard>
          )}
        </ToolLayout>
    </>
  )
}
