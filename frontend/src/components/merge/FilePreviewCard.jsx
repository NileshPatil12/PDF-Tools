import { useEffect, useMemo } from 'react'
import GlassCard from '../ui/GlassCard'
import { formatSize } from '../../utils/formatSize'

export default function FilePreviewCard({
  file,
  index,
  onRemove,
  disabled = false,
}) {
  const previewUrl = useMemo(() => URL.createObjectURL(file), [file])

  useEffect(() => {
    return () => URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  return (
    <GlassCard hover={false} className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-violet-500/20 text-xs font-medium text-violet-300">
            {index + 1}
          </span>
          <p className="truncate text-sm font-medium text-zinc-200">{file.name}</p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className="shrink-0 rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-300 disabled:opacity-50"
          aria-label={`Remove ${file.name}`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="relative aspect-[4/3] bg-zinc-900/50">
        <iframe
          src={previewUrl}
          title={`Preview of ${file.name}`}
          className="h-full w-full border-0"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950/80 to-transparent px-3 py-2">
          <p className="text-xs text-zinc-500">{formatSize(file.size)}</p>
        </div>
      </div>
    </GlassCard>
  )
}
