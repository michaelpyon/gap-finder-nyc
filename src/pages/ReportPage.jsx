import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { getDemographics } from '../services/dataService'
import { getBusinesses } from '../services/dataService'
import { analyzeGaps, getTopGaps } from '../services/gapAnalysis'
import { findNeighborhood } from '../data/neighborhoods'
import ReportHeader from '../components/ReportHeader'
import DemographicSnapshot from '../components/DemographicSnapshot'
import GapRanking from '../components/GapRanking'
import CompetitiveMap from '../components/CompetitiveMap'
import CategoryBreakdown from '../components/CategoryBreakdown'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'

export default function ReportPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const lat = parseFloat(searchParams.get('lat'))
  const lng = parseFloat(searchParams.get('lng'))
  const radius = parseFloat(searchParams.get('r')) || 0.5

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [demographics, setDemographics] = useState(null)
  const [businesses, setBusinesses] = useState([])
  const [allGaps, setAllGaps] = useState([])
  const [topGaps, setTopGaps] = useState([])
  const [neighborhood, setNeighborhood] = useState('')
  const [totalBusinesses, setTotalBusinesses] = useState(0)
  const [filterCategory, setFilterCategory] = useState(null)
  const [censusError, setCensusError] = useState(false)
  const [osmError, setOsmError] = useState(false)

  const competitiveMapRef = useRef(null)

  const runAnalysis = useCallback(async () => {
    if (isNaN(lat) || isNaN(lng)) {
      setError('Invalid coordinates. Go back and drop a pin.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    setCensusError(false)
    setOsmError(false)

    const hood = findNeighborhood(lat, lng)
    setNeighborhood(hood)

    // Run Census + Overpass in parallel, handle partial failures
    const [censusResult, osmResult] = await Promise.allSettled([
      getDemographics(lat, lng, radius),
      getBusinesses(lat, lng, radius),
    ])

    let demo = null
    let biz = { businesses: [], counts: {}, total: 0 }

    if (censusResult.status === 'fulfilled') {
      demo = censusResult.value
      setDemographics(demo)
    } else {
      setCensusError(true)
    }

    if (osmResult.status === 'fulfilled') {
      biz = osmResult.value
      setBusinesses(biz.businesses)
      setTotalBusinesses(biz.total)
    } else {
      setOsmError(true)
    }

    // Both failed: show error
    if (!demo && biz.total === 0) {
      setError('Both Census and business data failed to load. Please try again.')
      setLoading(false)
      return
    }

    // Run gap analysis if we have demographics
    if (demo) {
      const all = analyzeGaps(demo, biz.counts)
      const top = getTopGaps(demo, biz.counts, 10)
      setAllGaps(all)
      setTopGaps(top)
    }

    setLoading(false)
  }, [lat, lng, radius])

  useEffect(() => {
    runAnalysis()
  }, [runAnalysis])

  const handleViewOnMap = useCallback((categoryId) => {
    setFilterCategory(categoryId)
    competitiveMapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const handleCompare = useCallback(() => {
    navigate(`/compare?loc1=${lat},${lng},${radius}`)
  }, [lat, lng, radius, navigate])

  const shareUrl = `${window.location.origin}/report?lat=${lat?.toFixed(6)}&lng=${lng?.toFixed(6)}&r=${radius}`

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `Gap Finder: ${neighborhood}`, url: shareUrl })
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(shareUrl)
      // Could add a toast here
    }
  }, [shareUrl, neighborhood])

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
        <ErrorState message={error} onRetry={runAnalysis} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Top nav */}
      <nav className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="text-sm text-muted hover:text-text transition-colors flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            New Search
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 text-xs font-medium text-muted border border-border rounded-lg
                hover:text-text hover:bg-surface transition-colors"
            >
              Share
            </button>
            <button
              onClick={handleCompare}
              className="px-3 py-1.5 text-xs font-medium text-bg bg-accent rounded-lg
                hover:bg-accent/90 transition-colors"
            >
              Compare Locations
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Partial failure banners */}
        {censusError && (
          <div className="bg-warning/10 border border-warning/30 rounded-lg px-4 py-3">
            <p className="text-sm text-warning">Demographics unavailable. Business data is still shown below.</p>
          </div>
        )}
        {osmError && (
          <div className="bg-warning/10 border border-warning/30 rounded-lg px-4 py-3">
            <p className="text-sm text-warning">Business data unavailable. Demographics are still shown below.</p>
          </div>
        )}

        {/* Report Header */}
        <ReportHeader
          neighborhood={neighborhood}
          lat={lat}
          lng={lng}
          radius={radius}
          totalBusinesses={totalBusinesses}
          tractCount={demographics?.tractCount || 0}
        />

        {/* Demographic Snapshot */}
        {demographics && (
          <DemographicSnapshot demographics={demographics} />
        )}

        {/* Zero population warning */}
        {demographics && demographics.totalPopulation === 0 && (
          <div className="bg-surface border border-border rounded-xl p-6 text-center">
            <p className="text-sm text-muted">No residential population in this tract. This area may be commercial or industrial.</p>
          </div>
        )}

        {/* Top Gaps */}
        {topGaps.length > 0 && (
          <GapRanking
            gaps={topGaps}
            onViewOnMap={handleViewOnMap}
          />
        )}

        {/* No gaps found */}
        {demographics && topGaps.length === 0 && demographics.totalPopulation > 0 && (
          <div className="bg-surface border border-border rounded-xl p-6 text-center">
            <p className="text-sm text-text mb-1">No significant gaps detected.</p>
            <p className="text-xs text-muted">This area appears well-served across all categories. Try a different location or expand the radius.</p>
          </div>
        )}

        {/* Competitive Map */}
        {businesses.length > 0 && (
          <div ref={competitiveMapRef}>
            <CompetitiveMap
              lat={lat}
              lng={lng}
              radius={radius}
              businesses={businesses}
              filterCategory={filterCategory}
              onClearFilter={() => setFilterCategory(null)}
            />
          </div>
        )}

        {/* Sparse OSM data warning */}
        {!osmError && businesses.length < 5 && businesses.length > 0 && (
          <div className="bg-surface border border-border rounded-xl px-4 py-3">
            <p className="text-xs text-muted">Limited business data available for this area. OpenStreetMap coverage varies by neighborhood.</p>
          </div>
        )}

        {/* Full Category Breakdown */}
        {allGaps.length > 0 && (
          <CategoryBreakdown gaps={allGaps} />
        )}

        {/* Footer links */}
        <div className="flex items-center justify-between border-t border-border pt-6 pb-8">
          <Link
            to="/methodology"
            className="text-xs text-muted hover:text-accent transition-colors"
          >
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
