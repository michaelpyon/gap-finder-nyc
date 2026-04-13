import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import MapView from '../components/MapView'
import SearchBar from '../components/SearchBar'
import RadiusSelector from '../components/RadiusSelector'

export default function HomePage() {
  const [pin, setPin] = useState(null)
  const [radius, setRadius] = useState(0.5)
  const navigate = useNavigate()

  const handlePinDrop = useCallback((location) => {
    setPin(location)
  }, [])

  const handleAnalyze = useCallback(() => {
    if (!pin) return
    navigate(`/report?lat=${pin.lat.toFixed(6)}&lng=${pin.lng.toFixed(6)}&r=${radius}`)
  }, [pin, radius, navigate])

  return (
    <div className="flex flex-col h-screen bg-bg overflow-hidden">
      {/* Full-screen map */}
      <div className="flex-1 relative">
        <MapView
          pin={pin}
          onPinDrop={handlePinDrop}
          radius={radius}
          businesses={[]}
          analyzing={false}
        />
        <SearchBar onSelect={handlePinDrop} disabled={false} />
        <RadiusSelector
          radius={radius}
          onChange={setRadius}
          disabled={false}
        />

        {/* Analyze button */}
        {pin && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
            <button
              onClick={handleAnalyze}
              className="px-6 py-3 bg-accent text-bg font-semibold text-sm rounded-xl
                shadow-lg shadow-accent/25 hover:shadow-accent/40
                hover:scale-[1.02] active:scale-[0.98]
                transition-all duration-150"
            >
              Analyze This Location
            </button>
          </div>
        )}

        {/* Empty state hint */}
        {!pin && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10
            bg-surface/90 backdrop-blur-sm border border-border rounded-xl px-6 py-4
            text-center max-w-xs">
            <p className="text-sm text-text font-medium mb-1">
              Drop a pin to start
            </p>
            <p className="text-xs text-muted leading-relaxed">
              Click anywhere on the map or search for an address.
              We'll show you what businesses are missing.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
