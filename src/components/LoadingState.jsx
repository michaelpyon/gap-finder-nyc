import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const MESSAGES = [
  'Scanning nearby businesses...',
  'Pulling Census data...',
  'Categorizing business types...',
  'Running gap analysis...',
  'Scoring opportunities...',
]

export default function LoadingState() {
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-full flex flex-col items-center justify-center px-8">
      {/* Skeleton cards */}
      <div className="w-full max-w-sm space-y-3 mb-8">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, type: 'spring', duration: 0.3, bounce: 0 }}
            className="bg-surface border border-border rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div
                  className="h-3 bg-border rounded"
                  style={{
                    width: `${60 + Math.random() * 30}%`,
                    animation: 'scan-pulse 1.5s ease-in-out infinite',
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
                <div
                  className="h-2 bg-border/50 rounded"
                  style={{
                    width: `${40 + Math.random() * 20}%`,
                    animation: 'scan-pulse 1.5s ease-in-out infinite',
                    animationDelay: `${i * 0.2 + 0.1}s`,
                  }}
                />
              </div>
              <div
                className="w-10 h-10 bg-border rounded ml-4"
                style={{
                  animation: 'scan-pulse 1.5s ease-in-out infinite',
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Status message */}
      <AnimatePresence mode="wait">
        <motion.p
          key={msgIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="text-muted text-sm font-mono"
        >
          {MESSAGES[msgIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
