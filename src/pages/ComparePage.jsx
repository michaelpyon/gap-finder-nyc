import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { getDemographics } from '../services/dataService'
import { getBusinesses } from '../services/dataService'
import { analyzeGaps } from '../services/gapAnalysis'
import { findNeighborhood } from '../data/neighborhoods'
import { getSaturationTier } from '../data/demandModel'
import SaturationBar from '../components/SaturationBar'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'

function parseLocation(str) {
  if (!str) return null
  const parts = str.split(',')
  if (parts.length < 3) return null
  const lat = parseFloat(parts[0])
  const lng = parseFloat(parts[1])
  const r = parseFloat(parts[2])
  if (isNaN(lat) || isNaN(lng) || isNaN(r)) return null
  return { lat, lng, r }
}

export default function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [locations, setLocations] = useState([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState(0) // For mobile tab view

  // Parse locations from URL
  useEffect(() => {
    const locs = []
    for (let i = 1; i <= 3; i++) {
      const loc = parseLocation(searchParams.get(`loc${i}`))
      if (loc) locs.push({ ...loc, index: i })
    }
    setLocations(locs)
  }, [searchParams])

  // Fetch data for all locations
  const fetchAll = useCallback(async () => {
    if (locations.length === 0) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const promises = locations.map(async (loc) => {
        const [demo, biz] = await Promise.allSettled([
          getDemographics(loc.lat, loc.lng, loc.r),
          getBusinesses(loc.lat, loc.lng, loc.r),
        ])

        const demographics = demo.status === 'fulfilled' ? demo.value : null
        const businessData = biz.status === 'fulfilled' ? biz.value : { businesses: [], counts: {}, total: 0 }
        const gaps = demographics ? analyzeGaps(demographics, businessData.counts) : []
        const neighborhood = findNeighborhood(loc.lat, loc.lng)

        return {
          ...loc,
          neighborhood,
          demographics,
          businesses: businessData.businesses,
          totalBusinesses: businessData.total,
          gaps,
        }
      })

      const res = await Promise.all(promises)
      setResults(res)
    } catch (err) {
      setError(err.message || 'Failed to load comparison data')
    } finally {
      setLoading(false)
    }
  }, [locations])

  useEffect(() => {
    if (locations.length > 0) fetchAll()
  }, [fetchAll, locations.length])

  const handleAddLocation = useCallback(() => {
    // Navigate to home page with a return-to-compare intent
    // The user will drop a pin and come back
    const nextIndex = locations.length + 1
    if (nextIndex > 3) return
    navigate('/?addTo=compare&existingParams=' + encodeURIComponent(searchParams.toString()))
  }, [locations.length, navigate, searchParams])

  const handleRemoveLocation = useCallback((index) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.delete(`loc${index}`)
    // Reindex remaining
    const remaining = []
    for (let i = 1; i <= 3; i++) {
      const val = newParams.get(`loc${i}`)
      if (val) remaining.push(val)
    }
    const reindexed = new URLSearchParams()
    remaining.forEach((val, i) => reindexed.set(`loc${i + 1}`, val))
    setSearchParams(reindexed)
  }, [searchParams, setSearchParams])

  const shareUrl = `${window.location.origin}/compare?${searchParams.toString()}`

  // Build a merged category list for side-by-side
  const allCategoryIds = [...new Set(results.flatMap(r => r.gaps.map(g => g.id)))]

  if (loading) {
    return (
      <div className="min-h-screen bg-bg">
        <LoadingState />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg">
        <ErrorState message={error} onRetry={fetchAll} />
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center px-8">
          <p className="text-muted text-sm mb-3">No locations to compare yet.</p>
          <Link
            to="/"
            className="px-4 py-2 text-sm font-medium bg-accent text-bg rounded-lg hover:bg-accent/90 transition-colors"
          >
            Drop a pin to start
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Top nav */}
      <nav className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="text-sm text-muted hover:text-text transition-colors flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            New Search
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                if (navigator.share) {
                  try { await navigator.share({ title: 'Gap Finder: Compare', url: shareUrl }) } catch {}
                } else {
                  await navigator.clipboard.writeText(shareUrl)
                }
              }}
              className="px-3 py-1.5 text-xs font-medium text-muted border border-border rounded-lg
                hover:text-text hover:bg-surface transition-colors"
            >
              Share
            </button>
            {locations.length < 3 && (
              <Link
                to="/"
                className="px-3 py-1.5 text-xs font-medium text-bg bg-accent rounded-lg
                  hover:bg-accent/90 transition-colors"
              >
                + Add Location
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile tab selector */}
      <div className="sm:hidden sticky top-[52px] z-40 bg-bg border-b border-border">
        <div className="flex">
          {results.map((r, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`flex-1 py-3 text-xs font-medium text-center transition-colors
                ${activeTab === i ? 'text-accent border-b-2 border-accent' : 'text-muted'}`}
            >
              {r.neighborhood}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Desktop: side-by-side columns */}
        <div className="hidden sm:grid gap-6" style={{ gridTemplateColumns: `repeat(${results.length}, 1fr)` }}>
          {results.map((r, i) => (
            <CompareColumn key={i} result={r} allResults={results} index={i} onRemove={() => handleRemoveLocation(r.index)} />
          ))}
        </div>

        {/* Mobile: tabbed view */}
        <div className="sm:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.15 }}
            >
              {results[activeTab] && (
                <CompareColumn
                  result={results[activeTab]}
                  allResults={results}
                  index={activeTab}
                  onRemove={() => handleRemoveLocation(results[activeTab].index)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Category comparison table */}
        {results.length > 1 && results.every(r => r.demographics) && (
          <div className="mt-10">
            <h2 className="text-sm font-semibold text-text mb-4">Category-by-Category Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 text-muted font-medium">Category</th>
                    {results.map((r, i) => (
                      <th key={i} className="text-center py-2 px-2 text-muted font-medium">{r.neighborhood}</th>
                    ))}
                    <th className="text-center py-2 pl-4 text-muted font-medium">Better Opportunity</th>
                  </tr>
                </thead>
                <tbody>
                  {allCategoryIds.map(catId => {
                    const rows = results.map(r => r.gaps.find(g => g.id === catId))
                    // Find the best opportunity (lowest saturation where expected > 0)
                    let bestIdx = -1
                    let lowestSat = Infinity
                    rows.forEach((row, i) => {
                      if (row && row.expected > 0 && row.saturationPct < lowestSat) {
                        lowestSat = row.saturationPct
                        bestIdx = i
                      }
                    })

                    const label = rows.find(r => r)?.label || catId.replace(/_/g, ' ')

                    return (
                      <tr key={catId} className="border-b border-border/50">
                        <td className="py-2.5 pr-4 text-text capitalize">{label}</td>
                        {rows.map((row, i) => {
                          if (!row || row.expected === 0) {
                            return <td key={i} className="text-center py-2.5 px-2 text-muted">N/A</td>
                          }
                          const tier = getSaturationTier(row.saturationPct)
                          return (
                            <td key={i} className="text-center py-2.5 px-2">
                              <span className="font-mono" style={{ color: tier.color }}>
                                {Math.round(row.saturationPct * 100)}%
                              </span>
                              <span className="text-muted ml-1">
                                ({row.existing}/{row.expected})
                              </span>
                            </td>
                          )
                        })}
                        <td className="text-center py-2.5 pl-4">
                          {bestIdx >= 0 && lowestSat < 1.0 ? (
                            <span className="text-accent font-medium">{results[bestIdx].neighborhood}</span>
                          ) : (
                            <span className="text-muted">Tied</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border pt-6 pb-8 mt-8">
          <Link to="/methodology" className="text-xs text-muted hover:text-accent transition-colors">
            How we calculate these scores
          </Link>
          <p className="text-[10px] text-muted/50">
            Data: Census Bureau ACS 2022, OpenStreetMap
          </p>
        </div>
      </div>
    </div>
  )
}

function CompareColumn({ result, allResults, index, onRemove }) {
  const { neighborhood, demographics, totalBusinesses, gaps } = result
  const topGaps = gaps.filter(g => g.expected > 0 && g.saturationPct < 1.0).slice(0, 5)

  return (
    <div className="space-y-4">
      {/* Location header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-text">{neighborhood}</h2>
          <p className="text-[10px] text-muted font-mono mt-0.5">
            {result.lat.toFixed(4)}, {result.lng.toFixed(4)} / {result.r} mi
          </p>
        </div>
        {allResults.length > 1 && (
          <button onClick={onRemove} className="text-muted hover:text-red-400 transition-colors p-1">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Quick stats */}
      {demographics && (
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-surface border border-border rounded-lg px-3 py-2">
            <p className="text-[10px] text-muted uppercase tracking-wider">Population</p>
            <p className="font-mono text-base font-bold text-text">{demographics.totalPopulation.toLocaleString()}</p>
          </div>
          <div className="bg-surface border border-border rounded-lg px-3 py-2">
            <p className="text-[10px] text-muted uppercase tracking-wider">Median Income</p>
            <p className="font-mono text-base font-bold text-text">${Math.round(demographics.medianIncome / 1000)}K</p>
          </div>
          <div className="bg-surface border border-border rounded-lg px-3 py-2">
            <p className="text-[10px] text-muted uppercase tracking-wider">Median Age</p>
            <p className="font-mono text-base font-bold text-text">{demographics.medianAge}</p>
          </div>
          <div className="bg-surface border border-border rounded-lg px-3 py-2">
            <p className="text-[10px] text-muted uppercase tracking-wider">Businesses</p>
            <p className="font-mono text-base font-bold text-text">{totalBusinesses}</p>
          </div>
        </div>
      )}

      {/* Top gaps */}
      <div>
        <p className="text-[10px] text-muted uppercase tracking-wider mb-2">Top Gaps</p>
        {topGaps.length > 0 ? (
          <div className="space-y-1.5">
            {topGaps.map(gap => (
              <div key={gap.id} className="bg-surface border border-border rounded-lg px-3 py-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-text font-medium">{gap.label}</span>
                  <span className="text-[10px] font-mono" style={{ color: gap.tier.color }}>
                    {Math.round(gap.saturationPct * 100)}%
                  </span>
                </div>
                <SaturationBar saturationPct={gap.saturationPct} small />
                <p className="text-[10px] text-muted mt-1">
                  {gap.existing} of {gap.expected} expected
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted">No underserved categories detected.</p>
        )}
      </div>

      {/* View full report link */}
      <Link
        to={`/report?lat=${result.lat}&lng=${result.lng}&r=${result.r}`}
        className="block text-center py-2 text-xs text-accent hover:text-accent/80 transition-colors"
      >
        View full report
      </Link>
    </div>
  )
}
