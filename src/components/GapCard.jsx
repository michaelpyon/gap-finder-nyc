import { motion, AnimatePresence } from 'motion/react'
import { CATEGORIES } from '../data/benchmarks'

export default function GapCard({ gap, expanded, onToggle, index }) {
  const catMeta = CATEGORIES[gap.category] || { label: gap.category, color: '#6b7280' }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: index * 0.05,
        type: 'spring',
        duration: 0.3,
        bounce: 0,
      }}
      className="border border-border rounded-lg overflow-hidden bg-surface hover:border-border transition-colors"
    >
      {/* Collapsed header */}
      <button
        onClick={onToggle}
        className="w-full text-left px-4 py-3 flex items-center gap-3 group"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="inline-block w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: catMeta.color }}
            />
            <h3 className="text-sm font-semibold text-text truncate">
              {gap.label}
            </h3>
          </div>
          <p className="text-xs text-muted leading-snug">
            {gap.justificationText}
          </p>
        </div>

        {/* Gap score */}
        <div className="text-right shrink-0">
          <p className="font-mono text-2xl font-bold text-accent leading-none">
            {gap.gapScore.toFixed(1)}
          </p>
          <p className="text-[10px] text-muted uppercase tracking-wider mt-0.5">
            gap score
          </p>
        </div>

        {/* Expand indicator */}
        <svg
          className={`shrink-0 text-muted transition-transform duration-150 ${expanded ? 'rotate-180' : ''}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-border space-y-4">
              {/* Score breakdown */}
              <div className="flex gap-4">
                <div className="flex-1 bg-bg rounded-lg p-3">
                  <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Existing</p>
                  <p className="font-mono text-xl font-bold text-text">{gap.existing}</p>
                </div>
                <div className="flex-1 bg-bg rounded-lg p-3">
                  <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Expected</p>
                  <p className="font-mono text-xl font-bold text-accent">{gap.expected}</p>
                </div>
                <div className="flex-1 bg-bg rounded-lg p-3">
                  <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Deficit</p>
                  <p className="font-mono text-xl font-bold text-warning">
                    {gap.deficit > 0 ? '+' : ''}{gap.deficit}
                  </p>
                </div>
              </div>

              {/* Demographic signals */}
              {gap.justificationPoints.length > 0 && (
                <div>
                  <p className="text-[10px] text-muted uppercase tracking-wider mb-2">
                    Demographic Signals
                  </p>
                  <ul className="space-y-1">
                    {gap.justificationPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-text/80">
                        <span className="text-accent mt-0.5 shrink-0">+</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Comparable neighborhoods */}
              {gap.comparableNeighborhoods.length > 0 && (
                <div>
                  <p className="text-[10px] text-muted uppercase tracking-wider mb-2">
                    Thrives In
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {gap.comparableNeighborhoods.map((n) => (
                      <span
                        key={n}
                        className="px-2 py-0.5 bg-bg border border-border rounded text-xs text-text/70"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Estimated demand */}
              {gap.estimatedDemand > 0 && (
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-3">
                  <p className="text-[10px] text-accent uppercase tracking-wider mb-0.5">
                    Estimated Annual Demand
                  </p>
                  <p className="font-mono text-lg font-bold text-accent">
                    ${gap.estimatedDemand.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-muted mt-0.5">
                    Based on local households and BLS spending data
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
