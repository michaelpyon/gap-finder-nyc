// Comparable neighborhoods lookup: where each business type thrives in NYC
// Used to show "this works well in X, Y, Z" as evidence

export const COMPARABLE_NEIGHBORHOODS = {
  dry_cleaner: ['Upper East Side', 'Park Slope', 'Tribeca'],
  tailor: ['Midtown East', 'Upper East Side', 'Williamsburg'],
  coworking: ['Williamsburg', 'DUMBO', 'Flatiron'],
  laundromat: ['Bushwick', 'Washington Heights', 'Bed-Stuy'],
  hardware_store: ['Park Slope', 'Bay Ridge', 'Jackson Heights'],
  physical_therapy: ['Upper West Side', 'Park Slope', 'Astoria'],
  yoga_studio: ['Williamsburg', 'Park Slope', 'West Village'],
  pilates_studio: ['Tribeca', 'Upper East Side', 'Cobble Hill'],
  dentist: ['Astoria', 'Park Slope', 'Forest Hills'],
  pediatrician: ['Park Slope', 'Carroll Gardens', 'Riverdale'],
  spa_wellness: ['SoHo', 'Tribeca', 'Upper East Side'],
  optometrist: ['Jackson Heights', 'Astoria', 'Flushing'],
  wine_bar: ['West Village', 'Cobble Hill', 'Carroll Gardens'],
  specialty_coffee: ['Williamsburg', 'Greenpoint', 'Bushwick'],
  juice_bar: ['West Village', 'Williamsburg', 'Park Slope'],
  bakery: ['Park Slope', 'Greenpoint', 'Astoria'],
  craft_brewery: ['Williamsburg', 'Gowanus', 'Long Island City'],
  bookstore: ['Park Slope', 'West Village', 'Cobble Hill'],
  bike_shop: ['Williamsburg', 'Park Slope', 'Greenpoint'],
  pet_store: ['Upper West Side', 'Park Slope', 'Williamsburg'],
  organic_grocery: ['Park Slope', 'Cobble Hill', 'West Village'],
  vintage_clothing: ['Williamsburg', 'Bushwick', 'East Village'],
  florist: ['Upper East Side', 'Park Slope', 'West Village'],
  pharmacy: ['Astoria', 'Jackson Heights', 'Fordham'],
  daycare: ['Park Slope', 'Carroll Gardens', 'Prospect Heights'],
  tutoring_center: ['Park Slope', 'Flushing', 'Forest Hills'],
  art_gallery: ['Chelsea', 'Bushwick', 'Lower East Side'],
  dance_studio: ['Williamsburg', 'Bushwick', 'East Village'],
  music_venue: ['Williamsburg', 'Bushwick', 'Lower East Side'],
  korean_grocery: ['Flushing', 'Murray Hill', 'Fort Lee'],
  latin_grocery: ['Jackson Heights', 'Sunset Park', 'Washington Heights'],
}

// Reverse geocode neighborhood name from coordinates (NYC neighborhoods)
export const NYC_NEIGHBORHOODS = [
  { name: 'Williamsburg', lat: 40.7081, lng: -73.9571, radius: 0.8 },
  { name: 'Greenpoint', lat: 40.7274, lng: -73.9514, radius: 0.6 },
  { name: 'Bushwick', lat: 40.6942, lng: -73.9216, radius: 0.8 },
  { name: 'Park Slope', lat: 40.6710, lng: -73.9812, radius: 0.7 },
  { name: 'Cobble Hill', lat: 40.6860, lng: -73.9960, radius: 0.4 },
  { name: 'Carroll Gardens', lat: 40.6795, lng: -73.9991, radius: 0.4 },
  { name: 'DUMBO', lat: 40.7033, lng: -73.9891, radius: 0.3 },
  { name: 'Prospect Heights', lat: 40.6775, lng: -73.9692, radius: 0.5 },
  { name: 'Crown Heights', lat: 40.6694, lng: -73.9422, radius: 0.8 },
  { name: 'Bed-Stuy', lat: 40.6872, lng: -73.9418, radius: 0.9 },
  { name: 'Gowanus', lat: 40.6733, lng: -73.9901, radius: 0.4 },
  { name: 'Red Hook', lat: 40.6734, lng: -74.0083, radius: 0.5 },
  { name: 'Bay Ridge', lat: 40.6346, lng: -74.0287, radius: 0.8 },
  { name: 'Sunset Park', lat: 40.6466, lng: -74.0087, radius: 0.7 },
  { name: 'Upper East Side', lat: 40.7736, lng: -73.9566, radius: 0.8 },
  { name: 'Upper West Side', lat: 40.7870, lng: -73.9754, radius: 0.8 },
  { name: 'Midtown East', lat: 40.7549, lng: -73.9724, radius: 0.6 },
  { name: 'West Village', lat: 40.7336, lng: -74.0027, radius: 0.5 },
  { name: 'East Village', lat: 40.7265, lng: -73.9815, radius: 0.5 },
  { name: 'SoHo', lat: 40.7233, lng: -73.9985, radius: 0.4 },
  { name: 'Tribeca', lat: 40.7163, lng: -74.0086, radius: 0.4 },
  { name: 'Lower East Side', lat: 40.7168, lng: -73.9861, radius: 0.5 },
  { name: 'Chelsea', lat: 40.7465, lng: -73.9979, radius: 0.5 },
  { name: 'Flatiron', lat: 40.7395, lng: -73.9903, radius: 0.4 },
  { name: 'Harlem', lat: 40.8116, lng: -73.9465, radius: 0.9 },
  { name: 'Washington Heights', lat: 40.8417, lng: -73.9393, radius: 0.8 },
  { name: 'Astoria', lat: 40.7723, lng: -73.9303, radius: 0.8 },
  { name: 'Long Island City', lat: 40.7425, lng: -73.9535, radius: 0.6 },
  { name: 'Jackson Heights', lat: 40.7478, lng: -73.8832, radius: 0.7 },
  { name: 'Flushing', lat: 40.7580, lng: -73.8306, radius: 0.8 },
  { name: 'Forest Hills', lat: 40.7185, lng: -73.8442, radius: 0.7 },
  { name: 'Fordham', lat: 40.8614, lng: -73.8974, radius: 0.6 },
  { name: 'Riverdale', lat: 40.8955, lng: -73.9125, radius: 0.7 },
  { name: 'East Williamsburg', lat: 40.7119, lng: -73.9372, radius: 0.5 },
  { name: 'Clinton Hill', lat: 40.6897, lng: -73.9663, radius: 0.5 },
  { name: 'Fort Greene', lat: 40.6892, lng: -73.9762, radius: 0.4 },
  { name: 'Kensington', lat: 40.6390, lng: -73.9724, radius: 0.5 },
  { name: 'Ditmas Park', lat: 40.6360, lng: -73.9600, radius: 0.5 },
  { name: 'Murray Hill', lat: 40.7488, lng: -73.9783, radius: 0.4 },
  { name: 'Gramercy', lat: 40.7375, lng: -73.9835, radius: 0.4 },
]

export function findNeighborhood(lat, lng) {
  let closest = null
  let minDist = Infinity
  for (const n of NYC_NEIGHBORHOODS) {
    const d = Math.sqrt((lat - n.lat) ** 2 + (lng - n.lng) ** 2)
    if (d < minDist && d < n.radius * 0.015) {
      minDist = d
      closest = n.name
    }
  }
  return closest || 'NYC Neighborhood'
}
