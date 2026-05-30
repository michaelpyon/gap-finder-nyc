// Hero opportunity card: the single biggest gap, made screenshot-worthy.
// Purely presentational. It reads the top-ranked gap that gapAnalysis
// already produced (most underserved first) and the demand-model display
// category for color. No new data, no new claims.

import { motion } from 'motion/react'
import { DISPLAY_CATEGORIES } from '../data/demandModel'

export default function HeroGap({ gap, neighborhood, onViewOnMap }) {
  if (!gap) return null

  const displayCat = DISPLAY_CATEGORIES[gap.displayCategory]
  const color = displayCat?.color || '#4ade80'
  // saturationPct is existing / expected. Lower means more underserved.
  const filledPct = Math.min(100, Math.round((gap.saturationPct || 0) * 100))

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      className="relative overflow-hidden rounded-2xl border border-border bg-surface p-5 sm:p-6"
    >
      {/* Soft category-tinted glow */}
      <div
        className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />

      <div className="relative">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
          Biggest opportunity{neighborhood ? ` in ${neighborhood}` : ''}
        </p>

        <div className="mt-2 flex items-start gap-3">
          <span className="text-3xl leading-none" aria-hidden="true">{gap.icon}</span>
          <div className="min-w-0">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text">
              {gap.label}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {gap.existing === 0
                ? 'No locations here today, '
                : `Only ${gap.existing} where the population supports about ${gap.expected}, `}
              a gap of <span className="font-semibold text-text">{gap.deficit}</span>.
            </p>
          </div>
        </div>

        {/* Saturation meter */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px] font-mono text-muted">
            <span>{filledPct}% of expected supply</span>
            <span style={{ color }}>{displayCat?.label || gap.displayCategory}</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-bg">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${filledPct}%` }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
              className="h-full rounded-full"
              style={{ backgroundColor: color }}
            />
          </div>
        </div>

        {onViewOnMap && (
          <button
            onClick={() => onViewOnMap(gap.id)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-accent/30 px-3 py-1.5
              text-xs font-medium text-accent transition-colors hover:bg-accent/10"
          >
            See it on the map
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
    </motion.section>
  )
}
