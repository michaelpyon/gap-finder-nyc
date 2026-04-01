import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import SaturationBar from './SaturationBar'
import { DISPLAY_CATEGORIES } from '../data/demandModel'

export default function CategoryBreakdown({ gaps }) {
  const [isOpen, setIsOpen] = useState(false)

  // Group by display category
  const grouped = {}
  for (const gap of gaps) {
    const key = gap.displayCategory
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(gap)
  }

  return (
    <section>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left mb-3"
      >
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wider">
          Full Category Breakdown
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted font-mono">{gaps.length} categories</span>
          <motion.svg
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="text-muted"
            width="12" height="12" viewBox="0 0 12 12" fill="none"
          >
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </motion.svg>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="space-y-6">
              {Object.entries(grouped).map(([catKey, catGaps]) => {
                const displayCat = DISPLAY_CATEGORIES[catKey]
                return (
                  <div key={catKey}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: displayCat?.color || '#6b7280' }} />
                      <h3 className="text-xs font-medium text-text">{displayCat?.label || catKey}</h3>
                    </div>
                    <div className="space-y-1">
                      {catGaps.map(gap => (
                        <div
                          key={gap.id}
                          className="flex items-center gap-3 bg-surface border border-border rounded-lg px-3 py-2"
                        >
                          <span className="text-sm shrink-0">{gap.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-text truncate">{gap.label}</p>
                            <div className="mt-1">
                              <SaturationBar saturationPct={gap.saturationPct} small />
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-mono text-muted">
                              {gap.existing}/{gap.expected}
                            </span>
                          </div>
                          <span
                            className="text-[10px] font-mono font-medium shrink-0"
                            style={{ color: gap.tier.color }}
                          >
                            {Math.round(gap.saturationPct * 100)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
