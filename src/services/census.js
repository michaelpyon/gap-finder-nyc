// Census Bureau ACS 5-Year API + FCC Area API for tract lookup
// No API key required for basic ACS queries

const CENSUS_BASE = 'https://api.census.gov/data/2022/acs/acs5'
const FCC_BASE = 'https://geo.fcc.gov/api/census/block/find'

// ACS variable codes
const VARIABLES = [
  'B01003_001E', // Total population
  'B19013_001E', // Median household income
  'B01002_001E', // Median age
  'B25003_001E', // Total housing tenure
  'B25003_002E', // Owner occupied
  'B25003_003E', // Renter occupied
  'B15003_001E', // Total education (25+)
  'B15003_022E', // Bachelor's
  'B15003_023E', // Master's
  'B15003_024E', // Professional
  'B15003_025E', // Doctorate
  'B01001_007E', // Male 18-19
  'B01001_008E', // Male 20
  'B01001_009E', // Male 21
  'B01001_010E', // Male 22-24
  'B01001_011E', // Male 25-29
  'B01001_012E', // Male 30-34
  'B01001_013E', // Male 35-39
  'B01001_014E', // Male 40-44
  'B01001_031E', // Female 18-19
  'B01001_032E', // Female 20
  'B01001_033E', // Female 21
  'B01001_034E', // Female 22-24
  'B01001_035E', // Female 25-29
  'B01001_036E', // Female 30-34
  'B01001_037E', // Female 35-39
  'B01001_038E', // Female 40-44
  'B01001_003E', // Male under 5
  'B01001_004E', // Male 5-9
  'B01001_027E', // Female under 5
  'B01001_028E', // Female 5-9
  'B02001_001E', // Total race
  'B02001_002E', // White alone
  'B02001_003E', // Black alone
  'B02001_005E', // Asian alone
  'B03001_003E', // Hispanic/Latino
].join(',')

// Get FIPS codes (state, county, tract) from lat/lng via FCC API
export async function getFIPS(lat, lng) {
  const url = `${FCC_BASE}?latitude=${lat}&longitude=${lng}&format=json&showall=false`
  const res = await fetch(url)
  if (!res.ok) throw new Error('FCC geocoder failed')
  const data = await res.json()
  const block = data.Block?.FIPS
  if (!block) throw new Error('No census block found for this location')
  return {
    state: block.substring(0, 2),
    county: block.substring(2, 5),
    tract: block.substring(5, 11),
    blockGroup: block.substring(11, 12),
  }
}

// Sample points within radius to find all census tracts
function samplePoints(lat, lng, radiusMiles) {
  const points = [{ lat, lng }]
  const radiusDeg = radiusMiles * 0.0145 // rough miles to degrees
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4
    points.push({
      lat: lat + radiusDeg * Math.cos(angle),
      lng: lng + radiusDeg * Math.sin(angle) / Math.cos(lat * Math.PI / 180),
    })
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

// Parse ACS response into usable object
function parseACSRow(header, row) {
  const obj = {}
  header.forEach((key, i) => {
    obj[key] = row[i]
  })
  return obj
}

// Query ACS data for a specific tract
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
  let totalTenure = 0
  let ownerOcc = 0
  let renterOcc = 0
  let totalEdu = 0
  let collegePlus = 0
  let age25to34 = 0
  let age35to44 = 0
  let age18to44 = 0
  let under10 = 0
  let totalRace = 0
  let white = 0
  let black = 0
  let asian = 0
  let hispanic = 0

  for (const row of rows) {
    const pop = safeNum(row.B01003_001E)
    totalPop += pop
    weightedIncome += safeNum(row.B19013_001E) * pop
    weightedAge += safeNum(row.B01002_001E) * pop
    totalTenure += safeNum(row.B25003_001E)
    ownerOcc += safeNum(row.B25003_002E)
    renterOcc += safeNum(row.B25003_003E)
    totalEdu += safeNum(row.B15003_001E)
    collegePlus += safeNum(row.B15003_022E) + safeNum(row.B15003_023E) +
      safeNum(row.B15003_024E) + safeNum(row.B15003_025E)

    // Age 25-34 (male + female)
    age25to34 += safeNum(row.B01001_011E) + safeNum(row.B01001_012E) +
      safeNum(row.B01001_035E) + safeNum(row.B01001_036E)
    // Age 35-44
    age35to44 += safeNum(row.B01001_013E) + safeNum(row.B01001_014E) +
      safeNum(row.B01001_037E) + safeNum(row.B01001_038E)
    // Age 18-44 (all young adult brackets)
    age18to44 += safeNum(row.B01001_007E) + safeNum(row.B01001_008E) +
      safeNum(row.B01001_009E) + safeNum(row.B01001_010E) +
      safeNum(row.B01001_011E) + safeNum(row.B01001_012E) +
      safeNum(row.B01001_013E) + safeNum(row.B01001_014E) +
      safeNum(row.B01001_031E) + safeNum(row.B01001_032E) +
      safeNum(row.B01001_033E) + safeNum(row.B01001_034E) +
      safeNum(row.B01001_035E) + safeNum(row.B01001_036E) +
      safeNum(row.B01001_037E) + safeNum(row.B01001_038E)
    // Under 10
    under10 += safeNum(row.B01001_003E) + safeNum(row.B01001_004E) +
      safeNum(row.B01001_027E) + safeNum(row.B01001_028E)

    totalRace += safeNum(row.B02001_001E)
    white += safeNum(row.B02001_002E)
    black += safeNum(row.B02001_003E)
    asian += safeNum(row.B02001_005E)
    hispanic += safeNum(row.B03001_003E)
  }

  const medianIncome = totalPop > 0 ? Math.round(weightedIncome / totalPop) : 0
  const medianAge = totalPop > 0 ? Math.round(weightedAge / totalPop) : 0

  // Estimate pop density (NYC avg tract ~ 0.04 sq mi)
  const estAreaSqMi = rows.length * 0.04
  const popDensity = estAreaSqMi > 0 ? Math.round(totalPop / estAreaSqMi) : 0

  return {
    totalPopulation: totalPop,
    medianIncome,
    medianAge,
    popDensity,
    renterPct: totalTenure > 0 ? renterOcc / totalTenure : 0,
    ownerPct: totalTenure > 0 ? ownerOcc / totalTenure : 0,
    collegePct: totalEdu > 0 ? collegePlus / totalEdu : 0,
    youngProfPct: totalPop > 0 ? (age25to34 + age35to44) / totalPop : 0,
    pct25to34: totalPop > 0 ? age25to34 / totalPop : 0,
    pct35to44: totalPop > 0 ? age35to44 / totalPop : 0,
    pct18to44: totalPop > 0 ? age18to44 / totalPop : 0,
    under10Pct: totalPop > 0 ? under10 / totalPop : 0,
    whitePct: totalRace > 0 ? white / totalRace : 0,
    blackPct: totalRace > 0 ? black / totalRace : 0,
    asianPct: totalRace > 0 ? asian / totalRace : 0,
    hispanicPct: totalRace > 0 ? hispanic / totalRace : 0,
    tractCount: rows.length,
    dominantAge: age25to34 > age35to44 ? '25-34' : '35-44',
  }
}
