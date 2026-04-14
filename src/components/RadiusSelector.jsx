const RADII = [0.25, 0.5, 1]

export default function RadiusSelector({ radius, onChange, disabled }) {
  return (
    <div className="absolute bottom-6 left-4 z-10 flex gap-2">
      {RADII.map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          disabled={disabled}
          className={`px-3 py-1.5 min-h-[44px] text-xs font-medium rounded-full border transition-colors duration-150
            ${radius === r
              ? 'bg-accent/15 border-accent/40 text-accent'
              : 'bg-surface/90 border-border text-muted hover:text-text hover:border-border'
            }
            disabled:opacity-40 disabled:cursor-not-allowed
            backdrop-blur-sm`}
        >
          {r} mi
        </button>
      ))}
    </div>
  )
}
