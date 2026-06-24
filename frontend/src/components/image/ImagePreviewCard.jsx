import GlassCard from '../ui/GlassCard'

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export default function ImagePreviewCard({ file }) {
  if (!file) return null

  return (
    <GlassCard className="overflow-hidden p-4">
      <img
        src={URL.createObjectURL(file)}
        alt={file.name}
        className="h-64 w-full rounded-xl object-contain bg-black/20"
      />

      <div className="mt-4">
        <h3 className="truncate text-sm font-medium text-zinc-100">
          {file.name}
        </h3>

        <p className="mt-1 text-xs text-zinc-400">
          {formatSize(file.size)}
        </p>
      </div>
    </GlassCard>
  )
}