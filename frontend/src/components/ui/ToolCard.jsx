import { Link } from 'react-router-dom'
import GlassCard from './GlassCard'
import ToolIcon from '../icons/ToolIcons'

export default function ToolCard({
  icon,
  title,
  description,
  to,
  color = 'from-violet-500 to-purple-600',
  onClick,
  className = '',
  as: Component,
}) {
  const isRouterLink = Boolean(to) && !onClick
  const Wrapper =
    Component ?? (isRouterLink ? Link : onClick ? 'button' : 'div')

  const wrapperProps = isRouterLink
    ? { to }
    : onClick
      ? { type: 'button', onClick }
      : {}

  return (
    <GlassCard
      as={Wrapper}
      className={[
        'group relative flex h-full flex-col p-6 text-left overflow-hidden',
        'transition-all duration-500 ease-out',
        'hover:-translate-y-2 hover:scale-105',
        isRouterLink || onClick ? 'cursor-pointer' : '',
        className,
      ].join(' ')}
      {...wrapperProps}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Icon container with enhanced animation */}
      <div
        className={[
          'mb-6 flex h-14 w-14 items-center justify-center rounded-2xl',
          'bg-linear-to-br text-white shadow-xl',
          'transition-all duration-500 ease-out',
          'group-hover:scale-125 group-hover:shadow-2xl group-hover:-rotate-6',
          color,
        ].join(' ')}
      >
        <ToolIcon name={icon} className="h-7 w-7 transition-transform duration-500" />
      </div>

      {/* Title with enhanced styling */}
      <h3 className="text-xl font-bold text-zinc-50 transition-colors duration-300 group-hover:text-white">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400 transition-colors duration-300 group-hover:text-zinc-300">
        {description}
      </p>

      {/* CTA with smooth animation */}
      <div className="mt-6 flex items-center gap-2">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-violet-400 transition-colors duration-300 group-hover:text-violet-300">
          Explore
          <svg
            className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-2 group-hover:scale-110"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </span>
      </div>

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 -top-full h-full w-full bg-linear-to-b from-white/20 to-transparent opacity-0 transition-all duration-500 group-hover:top-0 group-hover:opacity-100" />
    </GlassCard>
  )
}
