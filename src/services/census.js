// Census Bureau ACS 5-Year API + FCC Area API for tract lookup
// No API key required for basic ACS queries

const CENSUS_BASE = 'https://api.census.gov/data/2022/acs/acs5'
const FCC_BASE = 'https://geo.fcc.gov/api/census/block/find'
const CENSUS_GEOCODER = 'https://geocoding.geo.census.gov/geocoder/geographies/coordinates'

// ACS variable codes
const VARIABLES = [
  'B01003_001E', // Total population
  'B19013_001E', // Median household income
  'B01002_001E', // Median age
  'B25003_001E', // Total housing tenure
  'B25003_002E', // Owner occupied
  'B25003_003E', // Renter occupied
  'B25010_001E', // Average household size
  // Age brackets: Under 25
  'B01001_003E', // Male under 5
  'B01001_004E', // Male 5-9
  'B01001_005E', // Male 10-14
  'B01001_006E', // Male 15-17
  'B01001_007E', // Male 18-19
  'B01001_008E', // Male 20
  'B01001_009E', // Male 21
  'B01001_010E', // Male 22-24
  'B01001_027E', // Female under 5
  'B01001_028E', // Female 5-9
  'B01001_029E', // Female 10-14
  'B01001_030E', // Female 15-17
  'B01001_031E', // Female 18-19
  'B01001_032E', // Female 20
  'B01001_033E', // Female 21
  'B01001_034E', // Female 22-24
  // Age brackets: 25-34
  'B01001_011E', // Male 25-29
  'B01001_012E', // Male 30-34
  'B01001_035E', // Female 25-29
  'B01001_036E', // Female 30-34
  // Age brackets: 35-44
  'B01001_013E', // Male 35-39
  'B01001_014E', // Male 40-44
  'B01001_037E', // Female 35-39
  'B01001_038E', // Female 40-44
  // Age brackets: 45-54
  'B01001_015E', // Male 45-49
  'B01001_016E', // Male 50-54
  'B01001_039E', // Female 45-49
  'B01001_040E', // Female 50-54
  // Age brackets: 55-64
  'B01001_017E', // Male 55-59
  'B01001_018E', // Male 60-61
  'B01001_019E', // Male 62-64
  'B01001_041E', // Female 55-59
  'B01001_042E', // Female 60-61
  'B01001_043E', // Female 62-64
  // Age brackets: 65+
  'B01001_020E', // Male 65-66
  'B01001_021E', // Male 67-69
  'B01001_022E', // Male 70-74
  'B01001_023E', // Male 75-79
  'B01001_024E', // Male 80-84
  'B01001_025E', // Male 85+
  'B01001_044E', // Female 65-66
  'B01001_045E', // Female 67-69
  'B01001_046E', // Female 70-74
  'B01001_047E', // Female 75-79
  'B01001_048E', // Female 80-84
  'B01001_049E', // Female 85+
].join(',')

// Get FIPS codes from lat/lng via FCC API, with Census Geocoder fallback
export async function getFIPS(lat, lng) {
  try {
    const url = `${FCC_BASE}?latitude=${lat}&longitude=${lng}&format=json&showall=false`
    const res = await fetch(url)
    if (!res.ok) throw new Error('FCC geocoder failed')
    const data = await res.json()
    const block = data.Block?.FIPS
    if (!block) throw new Error('No census block found')
    return {
      state: block.substring(0, 2),
      county: block.substring(2, 5),
      tract: block.substring(5, 11),
    }
  } catch {
    // Fallback: Census Geocoder API
    const url = `${CENSUS_GEOCODER}?x=${lng}&y=${lat}&benchmark=Public_AR_Current&vintage=Current_Current&format=json`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Both geocoders failed')
    const data = await res.json()
    const geo = data.result?.geographies?.['Census Tracts']?.[0]
    if (!geo) throw new Error('No census tract from Census Geocoder')
    return {
      state: geo.STATE,
      county: geo.COUNTY,
      tract: geo.TRACT,
    }
  }
}

// Sample points within radius to find all census tracts
function samplePoints(lat, lng, radiusMiles) {
  const points = [{ lat, lng }]
  const radiusDeg = radiusMiles * 0.0145
  // 8 points on the circle + 4 at half radius
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4
    const cosLat = Math.cos(lat * Math.PI / 180)
    points.push({
      lat: lat + radiusDeg * Math.cos(angle),
      lng: lng + radiusDeg * Math.sin(angle) / cosLat,
    })
    if (i < 4) {
      points.push({
        lat: lat + (radiusDeg * 0.5) * Math.cos(angle),
        lng: lng + (radiusDeg * 0.5) * Math.sin(angle) / cosLat,
      })
    }
  }
  return points
}

// Get all unique tracts within the radius
async function getTractsInRadius(lat, lng, radiusMiles) {
  const points = samplePoints(lat, lng, radiusMiles)
  const results = await Promise.allSettled(
    points.map(p => getFIPS(p.lat, p.lng))
  )
  const tracts = new Map()
  for (const r of results) {
    if (r.status === 'fulfilled') {
      const key = `${r.value.state}-${r.value.county}-${r.value.tract}`
      if (!tracts.has(key)) tracts.set(key, r.value)
    }
  }
  return Array.from(tracts.values())
}

function parseACSRow(header, row) {
  const obj = {}
  header.forEach((key, i) => { obj[key] = row[i] })
  return obj
}

async function queryACS(state, county, tract) {
  const url = `${CENSUS_BASE}?get=${VARIABLES}&for=tract:${tract}&in=state:${state}&in=county:${county}`
  const res = await fetch(url)
  if (!res.ok) return null
  const data = await res.json()
  if (data.length < 2) return null
  return parseACSRow(data[0], data[1])
}

// Main function: get demographics for a location + radius
export async function getDemographics(lat, lng, radiusMiles) {
  const tracts = await getTractsInRadius(lat, lng, radiusMiles)
  if (tracts.length === 0) throw new Error('No census tracts found')

  const tractData = await Promise.allSettled(
    tracts.map(t => queryACS(t.state, t.county, t.tract))
  )

  const validData = tractData
    .filter(r => r.status === 'fulfilled' && r.value)
    .map(r => r.value)

  if (validData.length === 0) throw new Error('No demographic data available')

  return aggregateDemographics(validData)
}

function safeNum(v) {
  const n = Number(v)
  return isNaN(n) || n < 0 ? 0 : n
}

function aggregateDemographics(rows) {
  let totalPop = 0
  let weightedIncome = 0
  let weightedAge = 0
  let weightedHouseholdSize = 0
  let totalTenure = 0
  let ownerOcc = 0
  let renterOcc = 0

  // Age buckets
  let under25 = 0
  let age25to34 = 0
  let age35to44 = 0
  let age45to54 = 0
  let age55to64 = 0
  let age65plus = 0
  let age18to44 = 0

  for (const row of rows) {
    const pop = safeNum(row.B01003_001E)
    totalPop += pop
    weightedIncome += safeNum(row.B19013_001E) * pop
    weightedAge += safeNum(row.B01002_001E) * pop
    weightedHouseholdSize += safeNum(row.B25010_001E) * pop
    totalTenure += safeNum(row.B25003_001E)
    ownerOcc += safeNum(row.B25003_002E)
    renterOcc += safeNum(row.B25003_003E)

    // Under 25 (all brackets under 25)
    under25 +=
      safeNum(row.B01001_003E) + safeNum(row.B01001_004E) + safeNum(row.B01001_005E) +
      safeNum(row.B01001_006E) + safeNum(row.B01001_007E) + safeNum(row.B01001_008E) +
      safeNum(row.B01001_009E) + safeNum(row.B01001_010E) +
      safeNum(row.B01001_027E) + safeNum(row.B01001_028E) + safeNum(row.B01001_029E) +
      safeNum(row.B01001_030E) + safeNum(row.B01001_031E) + safeNum(row.B01001_032E) +
      safeNum(row.B01001_033E) + safeNum(row.B01001_034E)

    // 25-34
    age25to34 +=
      safeNum(row.B01001_011E) + safeNum(row.B01001_012E) +
      safeNum(row.B01001_035E) + safeNum(row.B01001_036E)

    // 35-44
    age35to44 +=
      safeNum(row.B01001_013E) + safeNum(row.B01001_014E) +
      safeNum(row.B01001_037E) + safeNum(row.B01001_038E)

    // 45-54
    age45to54 +=
      safeNum(row.B01001_015E) + safeNum(row.B01001_016E) +
      safeNum(row.B01001_039E) + safeNum(row.B01001_040E)

    // 55-64
    age55to64 +=
      safeNum(row.B01001_017E) + safeNum(row.B01001_018E) + safeNum(row.B01001_019E) +
      safeNum(row.B01001_041E) + safeNum(row.B01001_042E) + safeNum(row.B01001_043E)

    // 65+
    age65plus +=
      safeNum(row.B01001_020E) + safeNum(row.B01001_021E) + safeNum(row.B01001_022E) +
      safeNum(row.B01001_023E) + safeNum(row.B01001_024E) + safeNum(row.B01001_025E) +
      safeNum(row.B01001_044E) + safeNum(row.B01001_045E) + safeNum(row.B01001_046E) +
      safeNum(row.B01001_047E) + safeNum(row.B01001_048E) + safeNum(row.B01001_049E)

    // 18-44 (for bar/nightlife demand)
    age18to44 +=
      safeNum(row.B01001_007E) + safeNum(row.B01001_008E) + safeNum(row.B01001_009E) +
      safeNum(row.B01001_010E) + safeNum(row.B01001_011E) + safeNum(row.B01001_012E) +
      safeNum(row.B01001_013E) + safeNum(row.B01001_014E) +
      safeNum(row.B01001_031E) + safeNum(row.B01001_032E) + safeNum(row.B01001_033E) +
      safeNum(row.B01001_034E) + safeNum(row.B01001_035E) + safeNum(row.B01001_036E) +
      safeNum(row.B01001_037E) + safeNum(row.B01001_038E)
  }

  const medianIncome = totalPop > 0 ? Math.round(weightedIncome / totalPop) : 0
  const medianAge = totalPop > 0 ? Math.round(weightedAge / totalPop * 10) / 10 : 0
  const avgHouseholdSize = totalPop > 0 ? Math.round(weightedHouseholdSize / totalPop * 10) / 10 : 0
  const renterPct = totalTenure > 0 ? renterOcc / totalTenure : 0
  const ownerPct = totalTenure > 0 ? ownerOcc / totalTenure : 0

  // Age distribution for chart
  const ageDistribution = [
    { label: '<25', count: under25 },
    { label: '25-34', count: age25to34 },
    { label: '35-44', count: age35to44 },
    { label: '45-54', count: age45to54 },
    { label: '55-64', count: age55to64 },
    { label: '65+', count: age65plus },
  ]

  return {
    totalPopulation: totalPop,
    medianIncome,
    medianAge,
    avgHouseholdSize,
    renterPct,
    ownerPct,
    pct18to44: totalPop > 0 ? age18to44 / totalPop : 0,
    ageDistribution,
    tractCount: rows.length,
  }
}
