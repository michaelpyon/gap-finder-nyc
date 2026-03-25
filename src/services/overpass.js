// Overpass/OSM API: fetch businesses within a radius
// Free, no key required, CORS-enabled

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter'

// Miles to meters conversion
const milesToMeters = (miles) => Math.round(miles * 1609.34)

// Build Overpass QL query for businesses in radius
function buildQuery(lat, lng, radiusMiles) {
  const r = milesToMeters(radiusMiles)
  return `
[out:json][timeout:30];
(
  node["shop"](around:${r},${lat},${lng});
  node["amenity"~"restaurant|cafe|bar|pub|fast_food|pharmacy|dentist|doctors|veterinary|childcare|bank|nightclub|ice_cream"](around:${r},${lat},${lng});
  node["office"~"coworking"](around:${r},${lat},${lng});
  node["healthcare"](around:${r},${lat},${lng});
  node["leisure"~"fitness_centre|dance|swimming_pool"](around:${r},${lat},${lng});
  node["sport"~"yoga|pilates"](around:${r},${lat},${lng});
  node["craft"~"brewery"](around:${r},${lat},${lng});
  node["tourism"~"gallery"](around:${r},${lat},${lng});
  way["shop"](around:${r},${lat},${lng});
  way["amenity"~"restaurant|cafe|bar|pub|fast_food|pharmacy|dentist|doctors|veterinary|childcare|bank|nightclub|ice_cream"](around:${r},${lat},${lng});
  way["office"~"coworking"](around:${r},${lat},${lng});
  way["healthcare"](around:${r},${lat},${lng});
  way["leisure"~"fitness_centre|dance|swimming_pool"](around:${r},${lat},${lng});
  way["sport"~"yoga|pilates"](around:${r},${lat},${lng});
  way["craft"~"brewery"](around:${r},${lat},${lng});
  way["tourism"~"gallery"](around:${r},${lat},${lng});
);
out center;`.trim()
}

// Map OSM tags to internal category IDs
const TAG_MAP = {
  // Shop tags
  'shop=dry_cleaning': 'dry_cleaner',
  'shop=tailor': 'tailor',
  'shop=laundry': 'laundromat',
  'shop=hardware': 'hardware_store',
  'shop=doityourself': 'hardware_store',
  'shop=books': 'bookstore',
  'shop=bicycle': 'bike_shop',
  'shop=pet': 'pet_store',
  'shop=organic': 'organic_grocery',
  'shop=health_food': 'organic_grocery',
  'shop=greengrocer': 'organic_grocery',
  'shop=second_hand': 'vintage_clothing',
  'shop=charity': 'vintage_clothing',
  'shop=florist': 'florist',
  'shop=bakery': 'bakery',
  'shop=supermarket': 'grocery',
  'shop=convenience': 'convenience',
  'shop=beauty': 'spa_wellness',
  'shop=massage': 'spa_wellness',
  'shop=art': 'art_gallery',
  'shop=optician': 'optometrist',
  'shop=clothes': 'clothing',
  'shop=shoes': 'shoes',
  'shop=electronics': 'electronics',
  'shop=wine': 'wine_shop',

  // Amenity tags
  'amenity=restaurant': 'restaurant',
  'amenity=cafe': 'cafe',
  'amenity=bar': 'bar',
  'amenity=pub': 'bar',
  'amenity=fast_food': 'fast_food',
  'amenity=pharmacy': 'pharmacy',
  'amenity=dentist': 'dentist',
  'amenity=doctors': 'doctor',
  'amenity=veterinary': 'veterinary',
  'amenity=childcare': 'daycare',
  'amenity=kindergarten': 'daycare',
  'amenity=bank': 'bank',
  'amenity=nightclub': 'music_venue',
  'amenity=ice_cream': 'ice_cream',
  'amenity=clinic': 'clinic',
  'amenity=coworking_space': 'coworking',

  // Office
  'office=coworking': 'coworking',

  // Healthcare
  'healthcare=physiotherapist': 'physical_therapy',
  'healthcare=dentist': 'dentist',
  'healthcare=pharmacy': 'pharmacy',
  'healthcare=optometrist': 'optometrist',
  'healthcare=doctor': 'doctor',

  // Leisure/sport
  'leisure=fitness_centre': 'gym',
  'leisure=dance': 'dance_studio',
  'leisure=swimming_pool': 'pool',
  'leisure=spa': 'spa_wellness',
  'sport=yoga': 'yoga_studio',
  'sport=pilates': 'pilates_studio',

  // Other
  'craft=brewery': 'craft_brewery',
  'tourism=gallery': 'art_gallery',
}

// Higher-level category grouping for map display
const DISPLAY_CATEGORIES = {
  restaurant: 'food',
  cafe: 'food',
  bar: 'food',
  fast_food: 'food',
  ice_cream: 'food',
  bakery: 'food',
  wine_shop: 'food',
  craft_brewery: 'food',
  grocery: 'retail',
  convenience: 'retail',
  clothing: 'retail',
  shoes: 'retail',
  electronics: 'retail',
  bookstore: 'retail',
  bike_shop: 'retail',
  pet_store: 'retail',
  organic_grocery: 'retail',
  vintage_clothing: 'retail',
  florist: 'retail',
  pharmacy: 'health',
  dentist: 'health',
  doctor: 'health',
  clinic: 'health',
  physical_therapy: 'health',
  optometrist: 'health',
  veterinary: 'health',
  spa_wellness: 'health',
  gym: 'fitness',
  yoga_studio: 'fitness',
  pilates_studio: 'fitness',
  dance_studio: 'fitness',
  pool: 'fitness',
  dry_cleaner: 'services',
  tailor: 'services',
  laundromat: 'services',
  hardware_store: 'services',
  bank: 'services',
  daycare: 'services',
  coworking: 'professional',
  art_gallery: 'entertainment',
  music_venue: 'entertainment',
}

function categorizeElement(element) {
  const tags = element.tags || {}
  let categoryId = 'other'

  // Try each tag combination
  for (const [tagKey, catId] of Object.entries(TAG_MAP)) {
    const [key, value] = tagKey.split('=')
    if (tags[key] === value) {
      categoryId = catId
      break
    }
  }

  // Fallback: use the first recognized tag
  if (categoryId === 'other') {
    if (tags.shop) categoryId = tags.shop
    else if (tags.amenity) categoryId = tags.amenity
    else if (tags.healthcare) categoryId = tags.healthcare
  }

  const name = tags.name || tags['name:en'] || categoryId.replace(/_/g, ' ')
  const displayCategory = DISPLAY_CATEGORIES[categoryId] || 'services'

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

// Fetch and categorize businesses
export async function getBusinesses(lat, lng, radiusMiles) {
  const query = buildQuery(lat, lng, radiusMiles)
  const res = await fetch(OVERPASS_URL, {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })

  if (!res.ok) throw new Error(`Overpass API error: ${res.status}`)
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
}
