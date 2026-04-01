// Gap Analysis Engine: density-relative saturation scoring
//
// Core insight: "2 yoga studios serving a population that supports 6" = underserved
// Not binary present/absent. HOW underserved matters.

import { DEMAND_CATEGORIES, getSaturationTier } from '../data/demandModel'

// Check if a demographic filter condition is met
function passesFilter(filter, demographics) {
  if (!filter) return true
  const actualValue = demographics[filter.field]
  if (actualValue === undefined || actualValue === null) return true // pass if data missing
  switch (filter.op) {
    case '>=': return actualValue >= filter.value
    case '>': return actualValue > filter.value
    case '<=': return actualValue <= filter.value
    case '<': return actualValue < filter.value
    case '==': return actualValue === filter.value
    default: return true
  }
}

// Calculate expected count for a category
function calculateExpected(category, population) {
  if (population <= 0) return 0
  return Math.floor(population / category.ratio)
}

// Map OSM counts to demand category counts
// Some demand categories don't map 1:1 to OSM tags
function getExistingCount(categoryId, businessCounts) {
  return businessCounts[categoryId] || 0
}

// Run the full gap analysis
export function analyzeGaps(demographics, businessCounts) {
  const population = demographics.totalPopulation
  const results = []

  for (const category of DEMAND_CATEGORIES) {
    // Check if demographic filter is met
    const filterPasses = passesFilter(category.filter, demographics)

    const existing = getExistingCount(category.id, businessCounts)
    const expected = filterPasses ? calculateExpected(category, population) : 0

    // Saturation percentage: existing / expected
    // Handle edge cases:
    //   - expected = 0 and existing = 0: N/A (filter not met or no population)
    //   - expected = 0 and existing > 0: oversupplied in low-demand area
    //   - expected > 0 and existing = 0: completely unserved
    let saturationPct = 0
    if (expected > 0) {
      saturationPct = existing / expected
    } else if (existing > 0) {
      saturationPct = 2.0 // mark as oversaturated
    } else {
      // Both 0: skip this category (demand model says it doesn't apply)
      if (!filterPasses) continue
      // Population too low for even 1 expected
      saturationPct = existing > 0 ? 2.0 : 0
    }

    const tier = getSaturationTier(saturationPct)
    const deficit = Math.max(0, expected - existing)

    results.push({
      id: category.id,
      label: category.label,
      icon: category.icon,
      displayCategory: category.displayCategory,
      existing,
      expected,
      deficit,
      saturationPct,
      tier,
      filterPasses,
      filterLabel: category.filterLabel,
      ratio: category.ratio,
    })
  }

  // Sort by saturation ascending (most underserved first)
  // Categories with 0 expected (filter not met) go to the bottom
  results.sort((a, b) => {
    // Both have expected > 0: sort by saturation
    if (a.expected > 0 && b.expected > 0) return a.saturationPct - b.saturationPct
    // One has expected = 0: it goes last
    if (a.expected === 0) return 1
    if (b.expected === 0) return -1
    return 0
  })

  return results
}

// Convenience: get only the top N underserved gaps
export function getTopGaps(demographics, businessCounts, n = 10) {
  const all = analyzeGaps(demographics, businessCounts)
  return all.filter(g => g.expected > 0 && g.saturationPct < 1.0).slice(0, n)
}
