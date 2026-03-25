// Gap Analysis Engine: compare business mix against demographic benchmarks

import { BENCHMARKS } from '../data/benchmarks'
import { COMPARABLE_NEIGHBORHOODS } from '../data/neighborhoods'

// BLS Consumer Expenditure Survey approximations (annual per-household)
const SPEND_BENCHMARKS = {
  dry_cleaner: 180,
  tailor: 120,
  coworking: 2400,
  laundromat: 240,
  hardware_store: 350,
  physical_therapy: 800,
  yoga_studio: 1200,
  pilates_studio: 1500,
  dentist: 400,
  pediatrician: 600,
  spa_wellness: 900,
  optometrist: 250,
  wine_bar: 600,
  specialty_coffee: 800,
  juice_bar: 400,
  bakery: 300,
  craft_brewery: 500,
  bookstore: 200,
  bike_shop: 250,
  pet_store: 500,
  organic_grocery: 1500,
  vintage_clothing: 300,
  florist: 150,
  pharmacy: 500,
  daycare: 12000,
  tutoring_center: 2000,
  art_gallery: 200,
  dance_studio: 600,
  music_venue: 400,
  korean_grocery: 800,
  latin_grocery: 600,
}

// Check if demographic conditions are met for a benchmark
function meetsConditions(benchmark, demographics) {
  const c = benchmark.conditions
  if (c.minIncome && demographics.medianIncome < c.minIncome) return false
  if (c.minCollegePct && demographics.collegePct < c.minCollegePct) return false
  if (c.minRenterPct && demographics.renterPct < c.minRenterPct) return false
  if (c.minOwnerPct && demographics.ownerPct < c.minOwnerPct) return false
  if (c.minYoungProfPct && demographics.youngProfPct < c.minYoungProfPct) return false
  if (c.minAge && demographics.medianAge < c.minAge) return false
  if (c.minUnder10Pct && demographics.under10Pct < c.minUnder10Pct) return false
  if (c.minPopDensity && demographics.popDensity < c.minPopDensity) return false
  if (c.minAsianPct && demographics.asianPct < c.minAsianPct) return false
  if (c.minHispanicPct && demographics.hispanicPct < c.minHispanicPct) return false
  return true
}

// Count existing businesses matching a benchmark's OSM tags
function countExisting(benchmark, businessCounts) {
  // Direct ID match
  let count = businessCounts[benchmark.id] || 0

  // Some benchmarks need fuzzy matching
  // e.g., specialty_coffee matches "cafe" tag
  if (benchmark.id === 'specialty_coffee') {
    count += businessCounts['cafe'] || 0
  }
  if (benchmark.id === 'wine_bar') {
    // Bars could be wine bars, count partial
    count += Math.floor((businessCounts['bar'] || 0) * 0.15)
  }
  if (benchmark.id === 'craft_brewery') {
    count += Math.floor((businessCounts['bar'] || 0) * 0.1)
  }
  if (benchmark.id === 'korean_grocery' || benchmark.id === 'latin_grocery') {
    // Hard to distinguish ethnic groceries from OSM data
    // Count a fraction of supermarkets/convenience as potential matches
    count += Math.floor((businessCounts['grocery'] || 0) * 0.05)
    count += Math.floor((businessCounts['convenience'] || 0) * 0.05)
  }
  if (benchmark.id === 'organic_grocery') {
    count += Math.floor((businessCounts['grocery'] || 0) * 0.1)
  }
  if (benchmark.id === 'juice_bar') {
    count += Math.floor((businessCounts['cafe'] || 0) * 0.05)
  }
  if (benchmark.id === 'music_venue') {
    count += businessCounts['music_venue'] || 0
  }
  if (benchmark.id === 'pediatrician') {
    count += Math.floor((businessCounts['doctor'] || 0) * 0.15)
  }
  if (benchmark.id === 'physical_therapy') {
    count += Math.floor((businessCounts['clinic'] || 0) * 0.1)
  }

  return count
}

// Build demographic justification bullet points
function buildJustification(benchmark, demographics) {
  const points = []
  const c = benchmark.conditions

  if (c.minIncome) {
    points.push(`Median income $${demographics.medianIncome.toLocaleString()} (threshold: $${c.minIncome.toLocaleString()})`)
  }
  if (c.minCollegePct) {
    points.push(`${(demographics.collegePct * 100).toFixed(0)}% college-educated (threshold: ${(c.minCollegePct * 100).toFixed(0)}%)`)
  }
  if (c.minRenterPct) {
    points.push(`${(demographics.renterPct * 100).toFixed(0)}% renters (threshold: ${(c.minRenterPct * 100).toFixed(0)}%)`)
  }
  if (c.minOwnerPct) {
    points.push(`${(demographics.ownerPct * 100).toFixed(0)}% homeowners (threshold: ${(c.minOwnerPct * 100).toFixed(0)}%)`)
  }
  if (c.minYoungProfPct) {
    points.push(`${(demographics.youngProfPct * 100).toFixed(0)}% aged 25-44 (threshold: ${(c.minYoungProfPct * 100).toFixed(0)}%)`)
  }
  if (c.minAge) {
    points.push(`Median age ${demographics.medianAge} (threshold: ${c.minAge})`)
  }
  if (c.minUnder10Pct) {
    points.push(`${(demographics.under10Pct * 100).toFixed(1)}% under 10 years old (threshold: ${(c.minUnder10Pct * 100).toFixed(0)}%)`)
  }
  if (c.minPopDensity) {
    points.push(`Pop density ~${demographics.popDensity.toLocaleString()}/sq mi (threshold: ${c.minPopDensity.toLocaleString()})`)
  }
  if (c.minAsianPct) {
    points.push(`${(demographics.asianPct * 100).toFixed(0)}% Asian population (threshold: ${(c.minAsianPct * 100).toFixed(0)}%)`)
  }
  if (c.minHispanicPct) {
    points.push(`${(demographics.hispanicPct * 100).toFixed(0)}% Hispanic population (threshold: ${(c.minHispanicPct * 100).toFixed(0)}%)`)
  }

  return points
}

// Run the full gap analysis
export function analyzeGaps(demographics, businessCounts) {
  const gaps = []
  const pop5k = demographics.totalPopulation / 5000

  for (const benchmark of BENCHMARKS) {
    if (!meetsConditions(benchmark, demographics)) continue

    const existing = countExisting(benchmark, businessCounts)
    const expected = Math.max(1, Math.round(benchmark.expectedPer5k * pop5k * 10) / 10)

    // Only flag if there's a meaningful gap
    const deficit = expected - existing
    if (deficit <= 0) continue

    // Gap score: 1-10 scale
    const rawScore = (deficit / Math.max(expected, 1)) * 10
    const gapScore = Math.min(10, Math.max(1, Math.round(rawScore * 10) / 10))

    // Estimated demand
    const annualSpend = SPEND_BENCHMARKS[benchmark.id] || 300
    const relevantHouseholds = Math.round(demographics.totalPopulation / 2.5) // avg household size
    const estimatedDemand = Math.round(relevantHouseholds * annualSpend * (deficit / expected))

    gaps.push({
      id: benchmark.id,
      label: benchmark.label,
      category: benchmark.category,
      gapScore,
      existing,
      expected: Math.round(expected * 10) / 10,
      deficit: Math.round(deficit * 10) / 10,
      justificationText: benchmark.justification,
      justificationPoints: buildJustification(benchmark, demographics),
      comparableNeighborhoods: COMPARABLE_NEIGHBORHOODS[benchmark.id] || [],
      estimatedDemand,
    })
  }

  // Sort by gap score descending
  gaps.sort((a, b) => b.gapScore - a.gapScore)

  return gaps.slice(0, 15) // Top 15 gaps
}
