import { useState, useRef, useEffect, useCallback } from 'react'

const MAPBOX_GEOCODE = 'https://api.mapbox.com/geocoding/v5/mapbox.places'
const NYC_BBOX = '-74.3,40.45,-73.7,40.95'

export default function SearchBar({ onSelect, disabled }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const debounceRef = useRef(null)

  const search = useCallback(async (q) => {
    const token = import.meta.env.VITE_MAPBOX_TOKEN
    if (!token || q.length < 3) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const url = `${MAPBOX_GEOCODE}/${encodeURIComponent(q)}.json?access_token=${token}&bbox=${NYC_BBOX}&types=address,poi&limit=5`
      const res = await fetch(url)
      const data = await res.json()
      setResults(data.features || [])
      setOpen(true)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleInput = (e) => {
    const v = e.target.value
    setQuery(v)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(v), 300)
  }

  const handleSelect = (feature) => {
    const [lng, lat] = feature.center
    setQuery(feature.place_name)
    setOpen(false)
    setResults([])
    onSelect({ lat, lng })
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!inputRef.current?.parentElement?.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="absolute top-4 left-4 right-4 z-10 max-w-md">
      <div className="relative">
        <div className="flex items-center bg-surface border border-border rounded-lg overflow-hidden focus-within:border-accent/50 transition-colors">
          <svg className="ml-3 shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5.5" stroke="#6b7280" strokeWidth="1.5"/>
            <line x1="11" y1="11" x2="14.5" y2="14.5" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInput}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder="Drop a pin or enter an address in NYC"
            disabled={disabled}
            className="w-full bg-transparent text-text text-sm px-3 py-3 outline-none placeholder:text-muted disabled:opacity-50"
          />
          {loading && (
            <div className="mr-3 w-4 h-4 border-2 border-muted border-t-accent rounded-full animate-spin" />
          )}
        </div>

        {open && results.length > 0 && (
          <div className="absolute top-full mt-1 w-full bg-surface border border-border rounded-lg overflow-hidden shadow-2xl">
            {results.map((feature) => (
              <button
                key={feature.id}
                onClick={() => handleSelect(feature)}
                className="w-full text-left px-4 py-2.5 text-sm text-text hover:bg-border/50 transition-colors flex items-start gap-2"
              >
                <svg className="mt-0.5 shrink-0" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 0C4.24 0 2 2.24 2 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5z" fill="#4ade80" fillOpacity="0.6"/>
                  <circle cx="7" cy="5" r="2" fill="#0a0a0f"/>
                </svg>
                <span className="leading-tight">{feature.place_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
