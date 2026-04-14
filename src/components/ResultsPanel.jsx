import { motion } from 'motion/react'
import GapCard from './GapCard'
import DemographicChips from './DemographicChips'

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.15,
    },
  },
}

export default function ResultsPanel({
  neighborhood,
  demographics,
  gaps,
  totalBusinesses,
  expandedGap,
  onExpandGap,
}) {
  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
      className="h-full overflow-y-auto"
    >
      <div className="p-5 space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text">
            {neighborhood}
          </h1>
          <p className="text-xs text-muted mt-1 font-mono">
            {totalBusinesses} businesses scanned
            {demographics && ` across ${demographics.tractCount} census tract${demographics.tractCount > 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Demographic chips */}
        <DemographicChips demographics={demographics} />

        {/* Gap list header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
            Top Gaps
          </h2>
          <span className="text-xs text-muted font-mono">
            {gaps.length} found
          </span>
        </div>

        {/* Gap cards, staggered */}
        {gaps.length > 0 ? (
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="space-y-2"
          >
            {gaps.map((gap, i) => (
              <GapCard
                key={gap.id}
                gap={gap}
                index={i}
                expanded={expandedGap === gap.id}
                onToggle={() => onExpandGap(expandedGap === gap.id ? null : gap.id)}
              />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted text-sm">
              No significant gaps detected in this area.
            </p>
            <p className="text-muted/60 text-xs mt-1">
              Try a different location or expand the radius.
            </p>
          </div>
        )}

        {/* Export button */}
        {gaps.length > 0 && (
          <button
            onClick={() => window.print()}
            className="w-full py-2.5 text-xs font-medium text-muted border border-border rounded-lg hover:bg-surface hover:text-text transition-colors"
          >
            Export to PDF
          </button>
        )}

        {/* Footer */}
        <p className="text-[10px] text-muted/50 text-center pb-4">
          Data: Census Bureau ACS 2022, OpenStreetMap.
          Gap scores are estimates based on demographic benchmarks.
        </p>
      </div>
    </motion.div>
  )
}
