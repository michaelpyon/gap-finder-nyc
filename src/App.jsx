import { useState, useCallback, useEffect } from 'react'
import { AnimatePresence } from 'motion/react'
import MapView from './components/MapView'
import SearchBar from './components/SearchBar'
import RadiusSelector from './components/RadiusSelector'
import ResultsPanel from './components/ResultsPanel'
import LoadingState from './components/LoadingState'
import { getDemographics } from './services/census'
import { getBusinesses } from './services/overpass'
import { analyzeGaps } from './services/gapAnalysis'
import { findNeighborhood } from './data/neighborhoods'

function App() {
  const [pin, setPin] = useState(null)
  const [radius, setRadius] = useState(0.5)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState(null)
  const [results, setResults] = useState(null)
  const [businesses, setBusinesses] = useState([])
  const [expandedGap, setExpandedGap] = useState(null)

  // Read URL params on mount for shareable links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const lat = parseFloat(params.get('lat'))
    const lng = parseFloat(params.get('lng'))
    const r = parseFloat(params.get('r'))
    if (!isNaN(lat) && !isNaN(lng)) {
      setPin({ lat, lng })
      if (!isNaN(r) && [0.25, 0.5, 1].includes(r)) setRadius(r)
    }
  }, [])

  // Auto-analyze when pin is set or radius changes (if pin exists)
  useEffect(() => {
    if (pin) runAnalysis(pin, radius)
  }, [pin, radius]) // eslint-disable-line react-hooks/exhaustive-deps

  const runAnalysis = useCallback(async (location, rad) => {
    setAnalyzing(true)
    setError(null)
    setResults(null)
    setBusinesses([])
    setExpandedGap(null)

    // Update URL for sharing
    const url = new URL(window.location)
    url.searchParams.set('lat', location.lat.toFixed(6))
    url.searchParams.set('lng', location.lng.toFixed(6))
    url.searchParams.set('r', rad)
    window.history.replaceState({}, '', url)

    try {
      // Run Census + Overpass in parallel
      const [demographics, businessData] = await Promise.all([
        getDemographics(location.lat, location.lng, rad),
        getBusinesses(location.lat, location.lng, rad),
      ])

      setBusinesses(businessData.businesses)

      // Run gap analysis
      const gaps = analyzeGaps(demographics, businessData.counts)
      const neighborhood = findNeighborhood(location.lat, location.lng)

      setResults({
        neighborhood,
        demographics,
        gaps,
        totalBusinesses: businessData.total,
      })
    } catch (err) {
      console.error('Analysis failed:', err)
      setError(err.message || 'Analysis failed. Try a different location.')
    } finally {
      setAnalyzing(false)
    }
  }, [])

  const handlePinDrop = useCallback((location) => {
    setPin(location)
  }, [])

  const handleRadiusChange = useCallback((r) => {
    setRadius(r)
  }, [])

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      {/* Left panel: Map */}
      <div className="w-[60%] relative no-print">
        <MapView
          pin={pin}
          onPinDrop={handlePinDrop}
          radius={radius}
          businesses={businesses}
          analyzing={analyzing}
        />
        <SearchBar onSelect={handlePinDrop} disabled={analyzing} />
        <RadiusSelector
          radius={radius}
          onChange={handleRadiusChange}
          disabled={analyzing}
        />
      </div>

      {/* Right panel: Results */}
      <div className="w-[40%] border-l border-border bg-bg flex flex-col">
        <AnimatePresence mode="wait">
          {/* Empty state */}
          {!pin && !analyzing && !results && (
            <div key="empty" className="flex-1 flex flex-col items-center justify-center px-8">
              <div className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2C6.69 2 4 4.69 4 8c0 4.5 6 10 6 10s6-5.5 6-10c0-3.31-2.69-6-6-6z" fill="#4ade80" fillOpacity="0.3"/>
                  <circle cx="10" cy="8" r="2.5" fill="#4ade80"/>
                </svg>
              </div>
              <h2 className="text-base font-semibold text-text text-center mb-2">
                Drop a pin to start
              </h2>
              <p className="text-sm text-muted text-center leading-relaxed max-w-xs">
                Click anywhere on the map or search for an address. We'll tell you what businesses are missing.
              </p>
            </div>
          )}

          {/* Loading state */}
          {analyzing && (
            <div key="loading" className="flex-1">
              <LoadingState />
            </div>
          )}

          {/* Error state */}
          {error && !analyzing && (
            <div key="error" className="flex-1 flex flex-col items-center justify-center px-8">
              <div className="w-12 h-12 rounded-full border-2 border-red-500/30 flex items-center justify-center mb-4">
                <span className="text-red-400 text-lg">!</span>
              </div>
              <p className="text-sm text-red-400 text-center mb-3">{error}</p>
              <button
                onClick={() => pin && runAnalysis(pin, radius)}
                className="px-4 py-2 text-xs font-medium bg-surface border border-border rounded-lg text-text hover:bg-border/50 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Results */}
          {results && !analyzing && !error && (
            <div key="results" className="flex-1 overflow-hidden">
              <ResultsPanel
                neighborhood={results.neighborhood}
                demographics={results.demographics}
                gaps={results.gaps}
                totalBusinesses={results.totalBusinesses}
                expandedGap={expandedGap}
                onExpandGap={setExpandedGap}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
