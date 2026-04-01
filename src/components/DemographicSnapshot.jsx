import { motion } from 'motion/react'

export default function DemographicSnapshot({ demographics }) {
  if (!demographics) return null

  const {
    totalPopulation, medianIncome, medianAge, avgHouseholdSize,
    renterPct, ownerPct, ageDistribution,
  } = demographics

  const maxAgeCount = Math.max(...ageDistribution.map(a => a.count), 1)

  return (
    <section>
      <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
        Demographic Snapshot
      </h2>

      {/* Key metrics row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <MetricCard label="Population" value={totalPopulation.toLocaleString()} />
        <MetricCard label="Median Income" value={`$${Math.round(medianIncome / 1000)}K`} />
        <MetricCard label="Median Age" value={medianAge.toString()} />
        <MetricCard label="Household Size" value={avgHouseholdSize.toFixed(1)} />
      </div>

      {/* Age distribution bar chart */}
      <div className="bg-surface border border-border rounded-xl p-4">
        <p className="text-[10px] text-muted uppercase tracking-wider mb-3">Age Distribution</p>
        <div className="flex items-end gap-2 h-24">
          {ageDistribution.map((bracket, i) => {
            const heightPct = (bracket.count / maxAgeCount) * 100
            const pct = totalPopulation > 0 ? Math.round((bracket.count / totalPopulation) * 100) : 0
            return (
              <div key={bracket.label} className="flex-1 flex flex-col items-center">
                <span className="text-[10px] font-mono text-muted mb-1">{pct}%</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(heightPct, 2)}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: [0.4, 0, 0.2, 1] }}
                  className="w-full bg-accent/30 rounded-t"
                  style={{ minHeight: '2px' }}
                />
                <span className="text-[10px] text-muted mt-1">{bracket.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Renter vs Owner */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="bg-surface border border-border rounded-xl p-3">
          <p className="text-[10px] text-muted uppercase tracking-wider">Renters</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-mono font-bold text-text">{Math.round(renterPct * 100)}%</span>
          </div>
          <div className="w-full bg-border/50 rounded-full h-1.5 mt-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${renterPct * 100}%` }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="h-full bg-accent/60 rounded-full"
            />
          </div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-3">
          <p className="text-[10px] text-muted uppercase tracking-wider">Homeowners</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-mono font-bold text-text">{Math.round(ownerPct * 100)}%</span>
          </div>
          <div className="w-full bg-border/50 rounded-full h-1.5 mt-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${ownerPct * 100}%` }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="h-full bg-blue-400/60 rounded-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function MetricCard({ label, value }) {
  return (
    <div className="bg-surface border border-border rounded-xl px-4 py-3">
      <p className="text-[10px] text-muted uppercase tracking-wider">{label}</p>
      <p className="text-xl font-mono font-bold text-text leading-tight mt-0.5">{value}</p>
    </div>
  )
}
