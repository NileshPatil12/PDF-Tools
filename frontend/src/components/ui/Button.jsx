const variants = {
  primary:
    'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-900/40 hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-700/50',
  secondary:
    'border border-white/15 bg-white/5 text-zinc-200 hover:border-white/25 hover:bg-white/10',
  ghost: 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2.5 text-sm font-medium',
  lg: 'px-8 py-3 text-base font-medium',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  as: Component = 'button',
  type = 'button',
  ...props
}) {
  return (
    <Component
      type={Component === 'button' ? type : undefined}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-xl transform-gpu will-change-transform motion-safe:transition-all duration-300 ease-out',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400',
        'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </Component>
  )
}
