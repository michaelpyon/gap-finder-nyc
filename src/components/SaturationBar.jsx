import { motion } from 'motion/react'
import { getSaturationTier } from '../data/demandModel'

export default function SaturationBar({ saturationPct, small = false }) {
  const tier = getSaturationTier(saturationPct)
  const fillWidth = Math.min(saturationPct * 100, 100)
  const overflowWidth = saturationPct > 1 ? Math.min((saturationPct - 1) * 100, 50) : 0

  return (
    <div className="relative">
      <div className={`w-full bg-border/50 rounded-full overflow-hidden ${small ? 'h-1.5' : 'h-2.5'}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${fillWidth}%` }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="h-full rounded-full"
          style={{ backgroundColor: tier.color }}
        />
      </div>
      {!small && (
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] font-medium" style={{ color: tier.color }}>
            {tier.label}
          </span>
          <span className="text-[10px] font-mono text-muted">
            {Math.round(saturationPct * 100)}%
          </span>
        </div>
      )}
    </div>
  )
}
