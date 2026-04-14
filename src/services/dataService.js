// Data Service: switchable layer between mock data and real APIs
// Set USE_MOCK_DATA to false when Census/Overpass API keys are configured
//
// The gap analysis engine (gapAnalysis.js) doesn't change.
// It always receives demographics + business counts and produces gap scores.
// This layer controls WHERE that data comes from.

import { getMockDemographics, getMockBusinesses } from './mockData'

// Toggle this to switch between mock and real API data
// Real APIs: Census Bureau ACS (free, no key) + Overpass/OSM (free, no key)
// Mock mode uses realistic NYC data generated from Census patterns
const USE_MOCK_DATA = true

let realCensus = null
let realOverpass = null

async function loadRealAPIs() {
  if (!realCensus) {
    realCensus = await import('./census.js')
  }
  if (!realOverpass) {
    realOverpass = await import('./overpass.js')
  }
}

/**
 * Get demographics for a location + radius
 * Returns: { totalPopulation, medianIncome, medianAge, avgHouseholdSize,
 *            renterPct, ownerPct, pct18to44, ageDistribution, tractCount }
 */
export async function getDemographics(lat, lng, radiusMiles) {
  if (USE_MOCK_DATA) {
    return getMockDemographics(lat, lng, radiusMiles)
  }
  await loadRealAPIs()
  return realCensus.getDemographics(lat, lng, radiusMiles)
}

/**
 * Get businesses for a location + radius
 * Returns: { businesses: [...], counts: { categoryId: count }, total: number }
 */
export async function getBusinesses(lat, lng, radiusMiles) {
  if (USE_MOCK_DATA) {
    return getMockBusinesses(lat, lng, radiusMiles)
  }
  await loadRealAPIs()
  return realOverpass.getBusinesses(lat, lng, radiusMiles)
}
