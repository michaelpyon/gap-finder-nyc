import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'

const NYC_BOUNDS = [[-74.3, 40.45], [-73.7, 40.95]]
const NYC_CENTER = [-73.95, 40.73]

export default function MapView({ pin, onPinDrop, radius, businesses, analyzing }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
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

    map.on('click', (e) => {
      const { lng, lat } = e.lngLat
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
    el.style.animation = 'pin-bounce 0.4s ease-out'
    el.style.transformOrigin = 'bottom center'

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
          paint: { 'fill-color': '#4ade80', 'fill-opacity': 0.05 },
        })
        map.addLayer({
          id: 'radius-border',
          type: 'line',
          source: 'radius-circle',
          paint: {
            'line-color': '#4ade80', 'line-width': 1.5,
            'line-opacity': 0.4, 'line-dasharray': [3, 2],
          },
        })
      }
    }

    if (map.isStyleLoaded()) updateCircle()
    else map.once('style.load', updateCircle)
  }, [pin, radius])

  // Business markers (for home page, mostly empty)
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    businessMarkersRef.current.forEach(m => m.remove())
    businessMarkersRef.current = []
    if (!businesses?.length) return

    for (const biz of businesses) {
      if (!biz.lat || !biz.lng) continue
      const el = document.createElement('div')
      el.style.width = '6px'
      el.style.height = '6px'
      el.style.borderRadius = '50%'
      el.style.backgroundColor = '#4ade80'
      el.style.opacity = '0.5'

      const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat([biz.lng, biz.lat])
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
            width: '200px', height: '200px',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(74,222,128,0.1) 0%, transparent 70%)',
          }}
        />
      )}
    </div>
  )
}

function createCircleGeoJSON(lat, lng, radiusKm, steps = 64) {
  const coords = []
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * 2 * Math.PI
    const dx = radiusKm * Math.cos(angle) / (111.32 * Math.cos(lat * Math.PI / 180))
    const dy = radiusKm * Math.sin(angle) / 110.574
    coords.push([lng + dx, lat + dy])
  }
  return { type: 'Feature', geometry: { type: 'Polygon', coordinates: [coords] } }
}
