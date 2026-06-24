export default function GlassCard({
  children,
  className = '',
  hover = true,
  as: Component = 'div',
  ...props
}) {
  return (
    <Component
      className={[
        'rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl',
        'shadow-[0_8px_32px_rgba(0,0,0,0.35)]',
        hover &&
          'transition-all duration-300 ease-out hover:border-white/20 hover:bg-white/[0.07] hover:shadow-[0_12px_40px_rgba(124,58,237,0.15)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </Component>
  )
}
