export default function Input({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  disabled = false,
  autoComplete,
  className = '',
}) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium text-zinc-300">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={[
          'w-full rounded-xl border bg-white/[0.04] px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 backdrop-blur-sm transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error
            ? 'border-rose-500/50 focus:ring-rose-500/40'
            : 'border-white/10 hover:border-white/20',
        ].join(' ')}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-rose-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
