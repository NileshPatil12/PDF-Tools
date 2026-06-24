import { useRef } from 'react'
import GlassCard from '../ui/GlassCard'
import ToolIcon from '../icons/ToolIcons'

export default function ImageDropzone({
  onFileSelect,
  accept = 'image/*',
  disabled = false,
}) {
  const inputRef = useRef(null)

  const handleFiles = (files) => {
    if (!files?.length) return
    onFileSelect(files[0])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (disabled) return
    handleFiles(e.dataTransfer.files)
  }

  return (
    <GlassCard className="p-8">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="flex min-h-[250px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 px-6 py-10 text-center transition-all hover:border-violet-500/50 hover:bg-white/[0.03]"
        onClick={() => inputRef.current?.click()}
      >
        <ToolIcon
          name="image"
          className="mb-4 h-16 w-16 text-violet-400"
        />

        <h3 className="text-lg font-semibold text-zinc-100">
          Upload Image
        </h3>

        <p className="mt-2 text-sm text-zinc-400">
          Drag & Drop image here or click to browse
        </p>

        <p className="mt-1 text-xs text-zinc-500">
          JPG, PNG, WEBP supported
        </p>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    </GlassCard>
  )
}