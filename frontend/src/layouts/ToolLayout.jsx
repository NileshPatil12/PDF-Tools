import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { getToolById } from '../data/tools'
import ToolIcon from '../components/icons/ToolIcons'

export default function ToolLayout({ toolId, children }) {
  const tool = getToolById(toolId)

  return (
    <div className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          to={ROUTES.HOME}
          className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to home
        </Link>

        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:gap-6 sm:text-left">
          <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br ${tool?.color ?? 'from-violet-500 to-purple-600'} text-white shadow-lg shadow-violet-900/30`}>
            <ToolIcon name={tool?.icon} className="h-8 w-8" />
          </div>
          <div className="w-full">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
              {tool?.title}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-zinc-400">
              {tool?.description}
            </p>
          </div>
        </div>

        <div className="mt-10 space-y-6">{children}</div>
      </div>
    </div>
  )
}
