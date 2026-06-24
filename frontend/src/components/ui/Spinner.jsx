export default function Spinner({ className = 'h-5 w-5', srLabel = 'Loading' }) {
  return (
    <span role="status" aria-live="polite" className="inline-flex items-center">
      <svg
        className={`animate-spin ${className}`}
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      {srLabel ? <span className="sr-only">{srLabel}</span> : null}
    </span>
  )
}
