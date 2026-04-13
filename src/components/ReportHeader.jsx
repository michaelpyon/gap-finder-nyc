import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'

export default function ReportHeader({ neighborhood, lat, lng, radius, totalBusinesses, tractCount }) {
  const miniMapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    if (!miniMapRef.current || isNaN(lat) || isNaN(lng)) return
    const token = import.meta.env.VITE_MAPBOX_TOKEN
    if (!token) return

    mapboxgl.accessToken = token

    const map = new mapboxgl.Map({
      container: miniMapRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [lng, lat],
      zoom: 13.5,
      interactive: false,
      attributionControl: false,
    })

    map.on('load', () => {
      // Add radius circle
      const radiusKm = radius * 1.60934
      const coords = []
      for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * 2 * Math.PI
        const dx = radiusKm * Math.cos(angle) / (111.32 * Math.cos(lat * Math.PI / 180))
        const dy = radiusKm * Math.sin(angle) / 110.574
        coords.push([lng + dx, lat + dy])
      }

      map.addSource('radius', {
        type: 'geojson',
        data: { type: 'Feature', geometry: { type: 'Polygon', coordinates: [coords] } },
      })
      map.addLayer({
        id: 'radius-fill',
        type: 'fill',
        source: 'radius',
        paint: { 'fill-color': '#4ade80', 'fill-opacity': 0.08 },
      })
      map.addLayer({
        id: 'radius-line',
        type: 'line',
        source: 'radius',
        paint: { 'line-color': '#4ade80', 'line-width': 1.5, 'line-opacity': 0.4, 'line-dasharray': [3, 2] },
      })

      // Add pin
      const el = document.createElement('div')
      el.innerHTML = `<svg width="20" height="30" viewBox="0 0 24 36" fill="none">
        <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="#4ade80"/>
        <circle cx="12" cy="12" r="4" fill="#0a0a0f"/>
      </svg>`
      new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([lng, lat])
        .addTo(map)
    })

    mapInstanceRef.current = map
    return () => map.remove()
  }, [lat, lng, radius])

  const timestamp = new Date().toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Mini map */}
      <div className="w-full sm:w-48 h-36 sm:h-auto rounded-xl overflow-hidden border border-border shrink-0">
        <div ref={miniMapRef} className="w-full h-full" />
      </div>

      {/* Info */}
      <div className="flex-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-text tracking-tight">
          {neighborhood}
        </h1>
        <p className="text-xs text-muted font-mono mt-1">
          {lat?.toFixed(4)}, {lng?.toFixed(4)} / {radius} mi radius
        </p>
        <div className="flex items-center gap-4 mt-3">
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wider">Businesses</p>
            <p className="text-sm font-mono font-bold text-text">{totalBusinesses}</p>
          </div>
          <div className="w-px h-6 bg-border" />
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wider">Census Tracts</p>
            <p className="text-sm font-mono font-bold text-text">{tractCount}</p>
          </div>
          <div className="w-px h-6 bg-border" />
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wider">Generated</p>
            <p className="text-sm font-mono font-bold text-text">{timestamp}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
