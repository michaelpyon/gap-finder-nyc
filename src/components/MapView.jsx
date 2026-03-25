import { useEffect, useRef, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import { CATEGORIES } from '../data/benchmarks'

const NYC_BOUNDS = [[-74.3, 40.45], [-73.7, 40.95]]
const NYC_CENTER = [-73.95, 40.73]

const CATEGORY_COLORS = {
  food: '#fbbf24',
  retail: '#34d399',
  health: '#f87171',
  fitness: '#a78bfa',
  services: '#60a5fa',
  professional: '#38bdf8',
  entertainment: '#fb923c',
}

export default function MapView({ pin, onPinDrop, radius, businesses, analyzing }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const circleLayerAdded = useRef(false)
  const businessMarkersRef = useRef([])

  // Initialize map
  useEffect(() => {
    if (!containerRef.current) return
    const token = import.meta.env.VITE_MAPBOX_TOKEN
    if (!token) return

    mapboxgl.accessToken = token
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: NYC_CENTER,
      zoom: 12,
      maxBounds: NYC_BOUNDS,
      attributionControl: false,
    })

    map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-left')
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right')

    mapRef.current = map

    // Click handler for pin drop
    map.on('click', (e) => {
      const { lng, lat } = e.lngLat
      // Only allow clicks within NYC
      if (lat < 40.45 || lat > 40.95 || lng < -74.3 || lng > -73.7) return
      onPinDrop({ lat, lng })
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Update pin marker
  useEffect(() => {
    const map = mapRef.current
    if (!map || !pin) return

    if (markerRef.current) markerRef.current.remove()

    const el = document.createElement('div')
    el.innerHTML = `<svg width="24" height="36" viewBox="0 0 24 36" fill="none">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="#4ade80"/>
      <circle cx="12" cy="12" r="5" fill="#0a0a0f"/>
    </svg>`
    el.style.cursor = 'pointer'

    // Bounce animation
    el.style.animation = 'none'
    el.offsetHeight // trigger reflow
    el.style.animation = 'pin-bounce 0.4s ease-out'
    el.style.transformOrigin = 'bottom center'

    const style = document.createElement('style')
    style.textContent = `@keyframes pin-bounce {
      0% { transform: translateY(-20px) scale(0.8); opacity: 0; }
      60% { transform: translateY(4px) scale(1.05); opacity: 1; }
      100% { transform: translateY(0) scale(1); opacity: 1; }
    }`
    document.head.appendChild(style)

    const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat([pin.lng, pin.lat])
      .addTo(map)

    markerRef.current = marker
    map.flyTo({ center: [pin.lng, pin.lat], zoom: 14.5, duration: 800 })
  }, [pin])

  // Update radius circle
  useEffect(() => {
    const map = mapRef.current
    if (!map || !pin) return

    const updateCircle = () => {
      const radiusKm = radius * 1.60934
      const source = map.getSource('radius-circle')

      const geojson = createCircleGeoJSON(pin.lat, pin.lng, radiusKm)

      if (source) {
        source.setData(geojson)
      } else {
        map.addSource('radius-circle', { type: 'geojson', data: geojson })
        map.addLayer({
          id: 'radius-fill',
          type: 'fill',
          source: 'radius-circle',
          paint: {
            'fill-color': '#4ade80',
            'fill-opacity': analyzing ? 0.08 : 0.05,
          },
        })
        map.addLayer({
          id: 'radius-border',
          type: 'line',
          source: 'radius-circle',
          paint: {
            'line-color': '#4ade80',
            'line-width': 1.5,
            'line-opacity': 0.4,
            'line-dasharray': [3, 2],
          },
        })
        circleLayerAdded.current = true
      }
    }

    if (map.isStyleLoaded()) {
      updateCircle()
    } else {
      map.once('style.load', updateCircle)
    }
  }, [pin, radius, analyzing])

  // Update business markers
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Clear old markers
    businessMarkersRef.current.forEach(m => m.remove())
    businessMarkersRef.current = []

    if (!businesses?.length) return

    for (const biz of businesses) {
      if (!biz.lat || !biz.lng) continue
      const color = CATEGORY_COLORS[biz.displayCategory] || '#6b7280'

      const el = document.createElement('div')
      el.style.width = '8px'
      el.style.height = '8px'
      el.style.borderRadius = '50%'
      el.style.backgroundColor = color
      el.style.border = '1px solid rgba(0,0,0,0.3)'
      el.style.cursor = 'pointer'
      el.style.transition = 'transform 0.15s'
      el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.8)' })
      el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)' })

      const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat([biz.lng, biz.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 10, closeButton: false })
            .setHTML(`<strong>${biz.name}</strong><br/><span style="color:#6b7280;font-size:11px">${biz.categoryId.replace(/_/g, ' ')}</span>`)
        )
        .addTo(map)

      businessMarkersRef.current.push(marker)
    }
  }, [businesses])

  const noToken = !import.meta.env.VITE_MAPBOX_TOKEN

  return (
    <div className="relative h-full w-full">
      {noToken && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-bg">
          <div className="text-center px-8">
            <p className="text-muted text-sm mb-2">Mapbox token required</p>
            <p className="text-muted text-xs">Add VITE_MAPBOX_TOKEN to your .env file</p>
          </div>
        </div>
      )}
      <div ref={containerRef} className="h-full w-full" />
      {analyzing && pin && (
        <div
          className="absolute pointer-events-none rounded-full border-2 border-accent"
          style={{
            animation: 'scan-pulse 2s ease-in-out infinite',
            width: '200px',
            height: '200px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(74,222,128,0.1) 0%, transparent 70%)',
          }}
        />
      )}
    </div>
  )
}

// Generate a GeoJSON circle polygon
function createCircleGeoJSON(lat, lng, radiusKm, steps = 64) {
  const coords = []
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * 2 * Math.PI
    const dx = radiusKm * Math.cos(angle) / (111.32 * Math.cos(lat * Math.PI / 180))
    const dy = radiusKm * Math.sin(angle) / 110.574
    coords.push([lng + dx, lat + dy])
  }
  return {
    type: 'Feature',
    geometry: { type: 'Polygon', coordinates: [coords] },
  }
}
