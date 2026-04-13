import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { DISPLAY_CATEGORIES } from '../data/demandModel'

const CATEGORY_COLORS = {
  food: '#fbbf24',
  retail: '#34d399',
  health: '#f87171',
  fitness: '#a78bfa',
  services: '#60a5fa',
}

export default function CompetitiveMap({ lat, lng, radius, businesses, filterCategory, onClearFilter }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])
  const [legendOpen, setLegendOpen] = useState(false)

  const filteredBusinesses = filterCategory
    ? businesses.filter(b => b.categoryId === filterCategory)
    : businesses

  // Initialize map
  useEffect(() => {
    if (!containerRef.current) return
    const token = import.meta.env.VITE_MAPBOX_TOKEN
    if (!token) return

    mapboxgl.accessToken = token
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [lng, lat],
      zoom: 14,
      attributionControl: false,
    })

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right')

    // Add radius circle
    map.on('load', () => {
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
        paint: { 'fill-color': '#4ade80', 'fill-opacity': 0.05 },
      })
      map.addLayer({
        id: 'radius-line',
        type: 'line',
        source: 'radius',
        paint: { 'line-color': '#4ade80', 'line-width': 1.5, 'line-opacity': 0.3, 'line-dasharray': [3, 2] },
      })
    })

    // Add center pin
    const pinEl = document.createElement('div')
    pinEl.innerHTML = `<svg width="20" height="30" viewBox="0 0 24 36" fill="none">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="#4ade80"/>
      <circle cx="12" cy="12" r="4" fill="#0a0a0f"/>
    </svg>`
    new mapboxgl.Marker({ element: pinEl, anchor: 'bottom' })
      .setLngLat([lng, lat])
      .addTo(map)

    mapRef.current = map
    return () => map.remove()
  }, [lat, lng, radius])

  // Update business markers when filter changes
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Clear old markers
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    for (const biz of filteredBusinesses) {
      if (!biz.lat || !biz.lng) continue
      const color = CATEGORY_COLORS[biz.displayCategory] || '#6b7280'

      const el = document.createElement('div')
      el.style.width = '10px'
      el.style.height = '10px'
      el.style.borderRadius = '50%'
      el.style.backgroundColor = color
      el.style.border = '1.5px solid rgba(0,0,0,0.4)'
      el.style.cursor = 'pointer'
      el.style.transition = 'transform 0.15s ease'
      el.addEventListener('mouseenter', () => { el.style.transform = 'scale(2)' })
      el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)' })

      const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat([biz.lng, biz.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 8, closeButton: false })
            .setHTML(`
              <strong>${biz.name}</strong><br/>
              <span style="color:#6b7280;font-size:11px">${biz.categoryId.replace(/_/g, ' ')}</span>
            `)
        )
        .addTo(map)

      markersRef.current.push(marker)
    }
  }, [filteredBusinesses])

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wider">
          Competitive Map
        </h2>
        <div className="flex items-center gap-2">
          {filterCategory && (
            <button
              onClick={onClearFilter}
              className="px-2 py-1 text-[10px] font-medium text-accent border border-accent/30 rounded
                hover:bg-accent/10 transition-colors"
            >
              Clear filter: {filterCategory.replace(/_/g, ' ')}
            </button>
          )}
          <button
            onClick={() => setLegendOpen(!legendOpen)}
            className="text-xs text-muted hover:text-text transition-colors"
          >
            Legend
          </button>
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-border">
        <div ref={containerRef} className="w-full h-80 sm:h-96" />

        {/* Legend overlay */}
        {legendOpen && (
          <div className="absolute top-3 left-3 bg-bg/90 backdrop-blur-sm border border-border rounded-lg p-3 z-10">
            <p className="text-[10px] text-muted uppercase tracking-wider mb-2">Categories</p>
            <div className="space-y-1.5">
              {Object.entries(DISPLAY_CATEGORIES).map(([key, cat]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-[11px] text-text/80">{cat.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Count overlay */}
        <div className="absolute bottom-3 left-3 bg-bg/80 backdrop-blur-sm border border-border rounded-lg px-3 py-1.5">
          <span className="text-[11px] font-mono text-muted">
            {filteredBusinesses.length} business{filteredBusinesses.length !== 1 ? 'es' : ''}
            {filterCategory && ` (${filterCategory.replace(/_/g, ' ')})`}
          </span>
        </div>
      </div>
    </section>
  )
}
