export default function DemographicChips({ demographics }) {
  if (!demographics) return null

  const chips = [
    {
      label: 'Pop Density',
      value: `${(demographics.popDensity / 1000).toFixed(1)}K`,
      sub: '/sq mi',
    },
    {
      label: 'Median Income',
      value: `$${Math.round(demographics.medianIncome / 1000)}K`,
      sub: '/year',
    },
    {
      label: 'Dominant Age',
      value: demographics.dominantAge,
      sub: `${(demographics.youngProfPct * 100).toFixed(0)}% of pop`,
    },
  ]

  return (
    <div className="flex gap-2">
      {chips.map((chip) => (
        <div
          key={chip.label}
          className="flex-1 bg-surface border border-border rounded-lg px-3 py-2"
        >
          <p className="text-muted text-[10px] uppercase tracking-wider">{chip.label}</p>
          <p className="text-text font-mono text-lg font-bold leading-tight">{chip.value}</p>
          <p className="text-muted text-[10px]">{chip.sub}</p>
        </div>
      ))}
    </div>
  )
}
