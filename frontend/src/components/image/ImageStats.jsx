export default function ImageStats({ file }) {
  if (!file) return null

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs text-zinc-500">Name</p>
        <p className="truncate text-sm text-zinc-100">
          {file.name}
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs text-zinc-500">Type</p>
        <p className="text-sm text-zinc-100">
          {file.type}
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs text-zinc-500">Size</p>
        <p className="text-sm text-zinc-100">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>
    </div>
  )
}
