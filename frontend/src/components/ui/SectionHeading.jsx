export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className = '',
}) {
  const alignClass =
    align === 'center' ? 'text-center mx-auto' : 'text-left max-w-2xl'

  return (
    <div className={`mb-12 max-w-2xl ${alignClass} ${className}`}>
      {eyebrow && (
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-violet-400">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-zinc-400">
          {description}
        </p>
      )}
    </div>
  )
}
