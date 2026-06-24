import Button from '../ui/Button'
import ToolIcon from '../icons/ToolIcons'

const stats = [
  { value: '4', label: 'PDF tools' },
  { value: '100%', label: 'Browser-based' },
  { value: '0', label: 'Account required' },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-0 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-64 w-64 rounded-full bg-indigo-600/15 blur-[80px]" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-fuchsia-600/10 blur-[60px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:gap-16 lg:text-left">
          <div className="flex-1">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-400" />
              </span>
              Free PDF utilities — no signup
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
              Every PDF tool you need,{' '}
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                in one place
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-400 lg:mx-0">
              Merge, split, compress, and transform PDFs in seconds. Drag files
              in, pick a tool, and download — fast, private, and built for the
              web.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Browse tools
              </Button>
            </div>

            <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-white/10 pt-10 sm:max-w-md lg:max-w-none">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-2xl font-semibold text-zinc-50 sm:text-3xl">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-500">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mt-16 flex flex-1 justify-center lg:mt-0">
            <div className="relative h-64 w-64 sm:h-72 sm:w-72">
              <div className="absolute inset-0 animate-[float_6s_ease-in-out_infinite] rounded-3xl border border-white/10 bg-gradient-to-br from-violet-600/30 to-indigo-900/40 p-6 shadow-2xl shadow-violet-950/50 backdrop-blur-xl">
                <div className="flex h-full flex-col justify-between">
                  <ToolIcon name="document" className="h-12 w-12 text-violet-300" />
                  <div>
                    <p className="text-left text-sm font-medium text-zinc-200">
                      report-final.pdf
                    </p>
                    <p className="text-left text-xs text-zinc-500">2.4 MB · 12 pages</p>
                  </div>
                </div>
              </div>
              <div className="absolute -right-4 top-8 animate-[float_6s_ease-in-out_infinite_1s] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
                <p className="text-xs font-medium text-emerald-400">Ready to merge</p>
              </div>
              <div className="absolute -left-6 bottom-12 animate-[float_6s_ease-in-out_infinite_2s] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
                <p className="text-xs font-medium text-violet-300">Drag & drop</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
