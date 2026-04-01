import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import SaturationBar from './SaturationBar'
import { DISPLAY_CATEGORIES } from '../data/demandModel'

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 25 },
  },
}

export default function GapRanking({ gaps, onViewOnMap }) {
  const [expandedId, setExpandedId] = useState(null)

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wider">
          Top Gaps (Ranked by Opportunity)
        </h2>
        <span className="text-xs text-muted font-mono">{gaps.length} underserved</span>
      </div>

      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="visible"
        className="space-y-2"
      >
        {gaps.map((gap, index) => {
          const isExpanded = expandedId === gap.id
          const displayCat = DISPLAY_CATEGORIES[gap.displayCategory]

          return (
            <motion.div
              key={gap.id}
              variants={itemVariants}
              className="border border-border rounded-xl overflow-hidden bg-surface hover:border-border/80 transition-colors"
            >
              {/* Row header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : gap.id)}
                className="w-full text-left px-4 py-3 flex items-center gap-3"
              >
                {/* Rank */}
                <span className="text-xs font-mono text-muted/50 w-5 shrink-0">
                  {index + 1}
                </span>

                {/* Icon + Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{gap.icon}</span>
                    <h3 className="text-sm font-semibold text-text truncate">{gap.label}</h3>
                    <span
                      className="inline-block px-1.5 py-0.5 rounded text-[9px] font-medium shrink-0"
                      style={{
                        backgroundColor: (displayCat?.color || '#6b7280') + '20',
                        color: displayCat?.color || '#6b7280',
                      }}
                    >
                      {displayCat?.label || gap.displayCategory}
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <SaturationBar saturationPct={gap.saturationPct} small />
                  </div>
                </div>

                {/* Score */}
                <div className="text-right shrink-0 ml-2">
                  <p className="text-xs text-muted">
                    <span className="font-mono font-bold text-text text-base">{gap.existing}</span>
                    <span className="mx-0.5">/</span>
                    <span className="font-mono text-accent">{gap.expected}</span>
                  </p>
                  <p className="text-[9px] text-muted">existing / expected</p>
                </div>

                {/* Chevron */}
                <motion.svg
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="shrink-0 text-muted"
                  width="12" height="12" viewBox="0 0 12 12" fill="none"
                >
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </motion.svg>
              </button>

              {/* Expanded detail */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 35, mass: 0.7 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-1 border-t border-border space-y-3">
                      {/* Stat boxes */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-bg rounded-lg p-3">
                          <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Existing</p>
                          <p className="font-mono text-xl font-bold text-text">{gap.existing}</p>
                        </div>
                        <div className="bg-bg rounded-lg p-3">
                          <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Expected</p>
                          <p className="font-mono text-xl font-bold text-accent">{gap.expected}</p>
                        </div>
                        <div className="bg-bg rounded-lg p-3">
                          <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Deficit</p>
                          <p className="font-mono text-xl font-bold text-warning">{gap.deficit}</p>
                        </div>
                      </div>

                      {/* How we calculated */}
                      <div className="text-xs text-muted leading-relaxed">
                        <p className="text-[10px] text-muted uppercase tracking-wider mb-1">How this is calculated</p>
                        <p>
                          Demand ratio: 1 per {gap.ratio.toLocaleString()} residents.
                          {gap.filterLabel !== 'No filter (universal demand)' && ` Filter: ${gap.filterLabel}.`}
                        </p>
                      </div>

                      {/* View on map */}
                      <button
                        onClick={() => onViewOnMap(gap.id)}
                        className="w-full py-2 text-xs font-medium text-accent border border-accent/30 rounded-lg
                          hover:bg-accent/10 transition-colors"
                      >
                        View competitors on map
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
