// Overpass/OSM API: fetch businesses within a radius
// Free, no key required, CORS-enabled

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter'
const OVERPASS_MIRROR = 'https://overpass.kumi.systems/api/interpreter'
const MAX_RETRIES = 3
const RETRY_DELAYS = [2000, 4000, 8000]

const milesToMeters = (miles) => Math.round(miles * 1609.34)

// Build Overpass QL query for all commercial POIs in radius
function buildQuery(lat, lng, radiusMiles) {
  const r = milesToMeters(radiusMiles)
  return `
[out:json][timeout:25];
(
  node["amenity"~"restaurant|cafe|bar|pub|fast_food|pharmacy|dentist|bank|childcare|kindergarten"](around:${r},${lat},${lng});
  node["shop"~"supermarket|convenience|bakery|hairdresser|beauty|dry_cleaning|laundry|pet|car_repair"](around:${r},${lat},${lng});
  node["leisure"~"fitness_centre"](around:${r},${lat},${lng});
  node["sport"~"yoga"](around:${r},${lat},${lng});
  node["healthcare"~"dentist|pharmacy"](around:${r},${lat},${lng});
  way["amenity"~"restaurant|cafe|bar|pub|fast_food|pharmacy|dentist|bank|childcare|kindergarten"](around:${r},${lat},${lng});
  way["shop"~"supermarket|convenience|bakery|hairdresser|beauty|dry_cleaning|laundry|pet|car_repair"](around:${r},${lat},${lng});
  way["leisure"~"fitness_centre"](around:${r},${lat},${lng});
  way["sport"~"yoga"](around:${r},${lat},${lng});
  way["healthcare"~"dentist|pharmacy"](around:${r},${lat},${lng});
);
out center;`.trim()
}

// Map OSM tags to our 20 demand category IDs
const TAG_TO_CATEGORY = {
  'amenity=restaurant': 'restaurant',
  'amenity=cafe': 'coffee_shop',
  'amenity=bar': 'bar',
  'amenity=pub': 'bar',
  'amenity=fast_food': 'fast_food',
  'amenity=pharmacy': 'pharmacy',
  'amenity=dentist': 'dentist',
  'amenity=bank': 'bank',
  'amenity=childcare': 'daycare',
  'amenity=kindergarten': 'daycare',
  'shop=supermarket': 'grocery',
  'shop=greengrocer': 'grocery',
  'shop=convenience': 'convenience_store',
  'shop=bakery': 'bakery',
  'shop=hairdresser': 'hair_salon',
  'shop=beauty': 'nail_salon',
  'shop=dry_cleaning': 'dry_cleaner',
  'shop=laundry': 'laundromat',
  'shop=pet': 'pet_store',
  'shop=car_repair': 'auto_repair',
  'leisure=fitness_centre': 'gym',
  'sport=yoga': 'yoga_studio',
  'healthcare=dentist': 'dentist',
  'healthcare=pharmacy': 'pharmacy',
}

// Higher-level grouping for map pins
const CATEGORY_TO_DISPLAY = {
  restaurant: 'food',
  coffee_shop: 'food',
  bar: 'food',
  fast_food: 'food',
  bakery: 'food',
  pizza_restaurant: 'food',
  convenience_store: 'retail',
  grocery: 'retail',
  pet_store: 'retail',
  pharmacy: 'health',
  dentist: 'health',
  gym: 'fitness',
  yoga_studio: 'fitness',
  hair_salon: 'services',
  laundromat: 'services',
  nail_salon: 'services',
  daycare: 'services',
  dry_cleaner: 'services',
  auto_repair: 'services',
  bank: 'services',
}

function categorizeElement(element) {
  const tags = element.tags || {}
  let categoryId = 'other'

  // Check cuisine tag for pizza specifically
  if ((tags.amenity === 'restaurant' || tags.amenity === 'fast_food') &&
      tags.cuisine && tags.cuisine.toLowerCase().includes('pizza')) {
    categoryId = 'pizza_restaurant'
  } else {
    for (const [tagKey, catId] of Object.entries(TAG_TO_CATEGORY)) {
      const [key, value] = tagKey.split('=')
      if (tags[key] === value) {
        categoryId = catId
        break
      }
    }
  }

  if (categoryId === 'other') {
    if (tags.shop) categoryId = tags.shop
    else if (tags.amenity) categoryId = tags.amenity
    else if (tags.healthcare) categoryId = tags.healthcare
  }

  const name = tags.name || tags['name:en'] || categoryId.replace(/_/g, ' ')
  const displayCategory = CATEGORY_TO_DISPLAY[categoryId] || 'services'

  return {
    id: element.id,
    name,
    categoryId,
    displayCategory,
    lat: element.lat || element.center?.lat,
    lng: element.lon || element.center?.lon,
    tags,
  }
}

async function fetchWithRetry(url, options) {
  let lastError = null
  const urls = [
    { base: OVERPASS_URL, label: 'primary' },
    { base: OVERPASS_MIRROR, label: 'mirror' },
  ]

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const endpoint = attempt < 2 ? urls[0].base : urls[1].base
    try {
      const res = await fetch(endpoint, options)
      if (res.status === 429) {
        // Rate limited: wait and retry
        if (attempt < MAX_RETRIES - 1) {
          await new Promise(r => setTimeout(r, RETRY_DELAYS[attempt]))
          continue
        }
      }
      if (!res.ok) throw new Error(`Overpass API error: ${res.status}`)
      return res
    } catch (err) {
      lastError = err
      if (attempt < MAX_RETRIES - 1) {
        await new Promise(r => setTimeout(r, RETRY_DELAYS[attempt]))
      }
    }
  }
  throw lastError || new Error('Overpass API request failed after retries')
}

// Fetch and categorize businesses
export async function getBusinesses(lat, lng, radiusMiles) {
  const query = buildQuery(lat, lng, radiusMiles)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000) // 10s timeout

  try {
    const res = await fetchWithRetry(OVERPASS_URL, {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      signal: controller.signal,
    })

    const data = await res.json()

    const businesses = data.elements
      .filter(el => el.tags && (el.lat || el.center))
      .map(categorizeElement)
      .filter(b => b.lat && b.lng)

    // Count by category
    const counts = {}
    for (const b of businesses) {
      counts[b.categoryId] = (counts[b.categoryId] || 0) + 1
    }

    return { businesses, counts, total: businesses.length }
  } finally {
    clearTimeout(timeout)
  }
}
