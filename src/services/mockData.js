// Comprehensive NYC mock data layer
// Realistic demographics and business counts per neighborhood
// Source patterns: Census ACS 2022 estimates, NYC open data patterns
// Designed to be swapped for real Census + Overpass API calls later

import { NYC_NEIGHBORHOODS, findNeighborhood } from '../data/neighborhoods'
import { DEMAND_CATEGORIES } from '../data/demandModel'

// ============================================================
// NEIGHBORHOOD DEMOGRAPHICS
// Realistic NYC numbers based on Census ACS patterns
// ============================================================

const NEIGHBORHOOD_DEMOGRAPHICS = {
  'Williamsburg': {
    totalPopulation: 78200,
    medianIncome: 82000,
    medianAge: 31.4,
    avgHouseholdSize: 2.1,
    renterPct: 0.78,
    ownerPct: 0.22,
    pct18to44: 0.52,
    collegePct: 0.58,
    youngProfPct: 0.45,
    under10Pct: 0.08,
    asianPct: 0.07,
    hispanicPct: 0.18,
    popDensity: 42000,
  },
  'Greenpoint': {
    totalPopulation: 38400,
    medianIncome: 76000,
    medianAge: 32.8,
    avgHouseholdSize: 2.2,
    renterPct: 0.74,
    ownerPct: 0.26,
    pct18to44: 0.48,
    collegePct: 0.52,
    youngProfPct: 0.40,
    under10Pct: 0.07,
    asianPct: 0.05,
    hispanicPct: 0.14,
    popDensity: 38000,
  },
  'Bushwick': {
    totalPopulation: 52600,
    medianIncome: 48000,
    medianAge: 29.6,
    avgHouseholdSize: 2.8,
    renterPct: 0.82,
    ownerPct: 0.18,
    pct18to44: 0.46,
    collegePct: 0.32,
    youngProfPct: 0.38,
    under10Pct: 0.12,
    asianPct: 0.04,
    hispanicPct: 0.52,
    popDensity: 35000,
  },
  'Park Slope': {
    totalPopulation: 67800,
    medianIncome: 128000,
    medianAge: 36.2,
    avgHouseholdSize: 2.5,
    renterPct: 0.55,
    ownerPct: 0.45,
    pct18to44: 0.38,
    collegePct: 0.72,
    youngProfPct: 0.32,
    under10Pct: 0.14,
    asianPct: 0.08,
    hispanicPct: 0.12,
    popDensity: 38000,
  },
  'Cobble Hill': {
    totalPopulation: 12400,
    medianIncome: 145000,
    medianAge: 38.1,
    avgHouseholdSize: 2.3,
    renterPct: 0.52,
    ownerPct: 0.48,
    pct18to44: 0.36,
    collegePct: 0.74,
    youngProfPct: 0.30,
    under10Pct: 0.12,
    asianPct: 0.06,
    hispanicPct: 0.08,
    popDensity: 32000,
  },
  'Carroll Gardens': {
    totalPopulation: 14200,
    medianIncome: 135000,
    medianAge: 37.4,
    avgHouseholdSize: 2.4,
    renterPct: 0.50,
    ownerPct: 0.50,
    pct18to44: 0.35,
    collegePct: 0.68,
    youngProfPct: 0.28,
    under10Pct: 0.13,
    asianPct: 0.05,
    hispanicPct: 0.15,
    popDensity: 28000,
  },
  'DUMBO': {
    totalPopulation: 5800,
    medianIncome: 168000,
    medianAge: 34.5,
    avgHouseholdSize: 2.0,
    renterPct: 0.65,
    ownerPct: 0.35,
    pct18to44: 0.48,
    collegePct: 0.82,
    youngProfPct: 0.42,
    under10Pct: 0.09,
    asianPct: 0.12,
    hispanicPct: 0.06,
    popDensity: 18000,
  },
  'Prospect Heights': {
    totalPopulation: 24600,
    medianIncome: 92000,
    medianAge: 34.8,
    avgHouseholdSize: 2.2,
    renterPct: 0.68,
    ownerPct: 0.32,
    pct18to44: 0.42,
    collegePct: 0.60,
    youngProfPct: 0.36,
    under10Pct: 0.10,
    asianPct: 0.06,
    hispanicPct: 0.14,
    popDensity: 36000,
  },
  'Crown Heights': {
    totalPopulation: 96800,
    medianIncome: 52000,
    medianAge: 33.2,
    avgHouseholdSize: 2.7,
    renterPct: 0.75,
    ownerPct: 0.25,
    pct18to44: 0.40,
    collegePct: 0.35,
    youngProfPct: 0.28,
    under10Pct: 0.13,
    asianPct: 0.04,
    hispanicPct: 0.16,
    popDensity: 34000,
  },
  'Bed-Stuy': {
    totalPopulation: 82400,
    medianIncome: 46000,
    medianAge: 32.5,
    avgHouseholdSize: 2.6,
    renterPct: 0.72,
    ownerPct: 0.28,
    pct18to44: 0.42,
    collegePct: 0.30,
    youngProfPct: 0.26,
    under10Pct: 0.14,
    asianPct: 0.03,
    hispanicPct: 0.18,
    popDensity: 32000,
  },
  'Gowanus': {
    totalPopulation: 11200,
    medianIncome: 78000,
    medianAge: 33.6,
    avgHouseholdSize: 2.1,
    renterPct: 0.70,
    ownerPct: 0.30,
    pct18to44: 0.46,
    collegePct: 0.55,
    youngProfPct: 0.40,
    under10Pct: 0.08,
    asianPct: 0.05,
    hispanicPct: 0.16,
    popDensity: 22000,
  },
  'Red Hook': {
    totalPopulation: 11800,
    medianIncome: 32000,
    medianAge: 34.2,
    avgHouseholdSize: 2.8,
    renterPct: 0.85,
    ownerPct: 0.15,
    pct18to44: 0.38,
    collegePct: 0.22,
    youngProfPct: 0.18,
    under10Pct: 0.15,
    asianPct: 0.03,
    hispanicPct: 0.42,
    popDensity: 14000,
  },
  'Bay Ridge': {
    totalPopulation: 82600,
    medianIncome: 62000,
    medianAge: 40.5,
    avgHouseholdSize: 2.6,
    renterPct: 0.58,
    ownerPct: 0.42,
    pct18to44: 0.32,
    collegePct: 0.35,
    youngProfPct: 0.22,
    under10Pct: 0.10,
    asianPct: 0.14,
    hispanicPct: 0.18,
    popDensity: 28000,
  },
  'Sunset Park': {
    totalPopulation: 68400,
    medianIncome: 44000,
    medianAge: 34.8,
    avgHouseholdSize: 3.2,
    renterPct: 0.76,
    ownerPct: 0.24,
    pct18to44: 0.36,
    collegePct: 0.22,
    youngProfPct: 0.20,
    under10Pct: 0.14,
    asianPct: 0.28,
    hispanicPct: 0.38,
    popDensity: 32000,
  },
  'Upper East Side': {
    totalPopulation: 212000,
    medianIncome: 118000,
    medianAge: 42.8,
    avgHouseholdSize: 1.9,
    renterPct: 0.68,
    ownerPct: 0.32,
    pct18to44: 0.34,
    collegePct: 0.78,
    youngProfPct: 0.28,
    under10Pct: 0.08,
    asianPct: 0.10,
    hispanicPct: 0.12,
    popDensity: 52000,
  },
  'Upper West Side': {
    totalPopulation: 198000,
    medianIncome: 112000,
    medianAge: 41.2,
    avgHouseholdSize: 2.0,
    renterPct: 0.72,
    ownerPct: 0.28,
    pct18to44: 0.36,
    collegePct: 0.76,
    youngProfPct: 0.30,
    under10Pct: 0.09,
    asianPct: 0.08,
    hispanicPct: 0.15,
    popDensity: 48000,
  },
  'Midtown East': {
    totalPopulation: 52000,
    medianIncome: 105000,
    medianAge: 44.5,
    avgHouseholdSize: 1.7,
    renterPct: 0.75,
    ownerPct: 0.25,
    pct18to44: 0.38,
    collegePct: 0.72,
    youngProfPct: 0.32,
    under10Pct: 0.04,
    asianPct: 0.14,
    hispanicPct: 0.08,
    popDensity: 42000,
  },
  'West Village': {
    totalPopulation: 32800,
    medianIncome: 125000,
    medianAge: 39.2,
    avgHouseholdSize: 1.8,
    renterPct: 0.72,
    ownerPct: 0.28,
    pct18to44: 0.40,
    collegePct: 0.78,
    youngProfPct: 0.35,
    under10Pct: 0.05,
    asianPct: 0.06,
    hispanicPct: 0.08,
    popDensity: 46000,
  },
  'East Village': {
    totalPopulation: 44200,
    medianIncome: 72000,
    medianAge: 33.5,
    avgHouseholdSize: 1.9,
    renterPct: 0.80,
    ownerPct: 0.20,
    pct18to44: 0.48,
    collegePct: 0.58,
    youngProfPct: 0.42,
    under10Pct: 0.05,
    asianPct: 0.12,
    hispanicPct: 0.16,
    popDensity: 52000,
  },
  'SoHo': {
    totalPopulation: 12600,
    medianIncome: 142000,
    medianAge: 38.8,
    avgHouseholdSize: 1.8,
    renterPct: 0.62,
    ownerPct: 0.38,
    pct18to44: 0.42,
    collegePct: 0.80,
    youngProfPct: 0.36,
    under10Pct: 0.06,
    asianPct: 0.10,
    hispanicPct: 0.06,
    popDensity: 28000,
  },
  'Tribeca': {
    totalPopulation: 18400,
    medianIncome: 192000,
    medianAge: 40.2,
    avgHouseholdSize: 2.2,
    renterPct: 0.48,
    ownerPct: 0.52,
    pct18to44: 0.36,
    collegePct: 0.84,
    youngProfPct: 0.30,
    under10Pct: 0.12,
    asianPct: 0.08,
    hispanicPct: 0.05,
    popDensity: 22000,
  },
  'Lower East Side': {
    totalPopulation: 52400,
    medianIncome: 42000,
    medianAge: 36.8,
    avgHouseholdSize: 2.4,
    renterPct: 0.82,
    ownerPct: 0.18,
    pct18to44: 0.42,
    collegePct: 0.38,
    youngProfPct: 0.32,
    under10Pct: 0.10,
    asianPct: 0.22,
    hispanicPct: 0.28,
    popDensity: 48000,
  },
  'Chelsea': {
    totalPopulation: 48600,
    medianIncome: 108000,
    medianAge: 38.4,
    avgHouseholdSize: 1.7,
    renterPct: 0.74,
    ownerPct: 0.26,
    pct18to44: 0.44,
    collegePct: 0.72,
    youngProfPct: 0.38,
    under10Pct: 0.04,
    asianPct: 0.08,
    hispanicPct: 0.14,
    popDensity: 40000,
  },
  'Flatiron': {
    totalPopulation: 18200,
    medianIncome: 132000,
    medianAge: 36.5,
    avgHouseholdSize: 1.8,
    renterPct: 0.70,
    ownerPct: 0.30,
    pct18to44: 0.46,
    collegePct: 0.78,
    youngProfPct: 0.40,
    under10Pct: 0.05,
    asianPct: 0.12,
    hispanicPct: 0.08,
    popDensity: 34000,
  },
  'Harlem': {
    totalPopulation: 118000,
    medianIncome: 42000,
    medianAge: 35.5,
    avgHouseholdSize: 2.5,
    renterPct: 0.78,
    ownerPct: 0.22,
    pct18to44: 0.38,
    collegePct: 0.28,
    youngProfPct: 0.24,
    under10Pct: 0.13,
    asianPct: 0.04,
    hispanicPct: 0.32,
    popDensity: 36000,
  },
  'Washington Heights': {
    totalPopulation: 152000,
    medianIncome: 38000,
    medianAge: 33.8,
    avgHouseholdSize: 2.9,
    renterPct: 0.85,
    ownerPct: 0.15,
    pct18to44: 0.36,
    collegePct: 0.22,
    youngProfPct: 0.18,
    under10Pct: 0.14,
    asianPct: 0.03,
    hispanicPct: 0.68,
    popDensity: 42000,
  },
  'Astoria': {
    totalPopulation: 88400,
    medianIncome: 64000,
    medianAge: 34.2,
    avgHouseholdSize: 2.4,
    renterPct: 0.72,
    ownerPct: 0.28,
    pct18to44: 0.42,
    collegePct: 0.45,
    youngProfPct: 0.35,
    under10Pct: 0.09,
    asianPct: 0.14,
    hispanicPct: 0.22,
    popDensity: 34000,
  },
  'Long Island City': {
    totalPopulation: 42200,
    medianIncome: 88000,
    medianAge: 32.8,
    avgHouseholdSize: 2.0,
    renterPct: 0.82,
    ownerPct: 0.18,
    pct18to44: 0.52,
    collegePct: 0.62,
    youngProfPct: 0.45,
    under10Pct: 0.06,
    asianPct: 0.18,
    hispanicPct: 0.20,
    popDensity: 28000,
  },
  'Jackson Heights': {
    totalPopulation: 108000,
    medianIncome: 48000,
    medianAge: 36.4,
    avgHouseholdSize: 3.4,
    renterPct: 0.78,
    ownerPct: 0.22,
    pct18to44: 0.36,
    collegePct: 0.28,
    youngProfPct: 0.22,
    under10Pct: 0.12,
    asianPct: 0.22,
    hispanicPct: 0.48,
    popDensity: 46000,
  },
  'Flushing': {
    totalPopulation: 128000,
    medianIncome: 52000,
    medianAge: 42.5,
    avgHouseholdSize: 2.8,
    renterPct: 0.62,
    ownerPct: 0.38,
    pct18to44: 0.30,
    collegePct: 0.35,
    youngProfPct: 0.20,
    under10Pct: 0.08,
    asianPct: 0.58,
    hispanicPct: 0.18,
    popDensity: 40000,
  },
  'Forest Hills': {
    totalPopulation: 72000,
    medianIncome: 72000,
    medianAge: 42.8,
    avgHouseholdSize: 2.3,
    renterPct: 0.55,
    ownerPct: 0.45,
    pct18to44: 0.30,
    collegePct: 0.52,
    youngProfPct: 0.24,
    under10Pct: 0.09,
    asianPct: 0.18,
    hispanicPct: 0.14,
    popDensity: 28000,
  },
  'Fordham': {
    totalPopulation: 68000,
    medianIncome: 28000,
    medianAge: 30.2,
    avgHouseholdSize: 3.2,
    renterPct: 0.88,
    ownerPct: 0.12,
    pct18to44: 0.40,
    collegePct: 0.15,
    youngProfPct: 0.16,
    under10Pct: 0.16,
    asianPct: 0.04,
    hispanicPct: 0.62,
    popDensity: 38000,
  },
  'Riverdale': {
    totalPopulation: 48800,
    medianIncome: 62000,
    medianAge: 44.5,
    avgHouseholdSize: 2.4,
    renterPct: 0.52,
    ownerPct: 0.48,
    pct18to44: 0.28,
    collegePct: 0.48,
    youngProfPct: 0.18,
    under10Pct: 0.10,
    asianPct: 0.06,
    hispanicPct: 0.28,
    popDensity: 18000,
  },
  'East Williamsburg': {
    totalPopulation: 28400,
    medianIncome: 52000,
    medianAge: 30.8,
    avgHouseholdSize: 2.5,
    renterPct: 0.80,
    ownerPct: 0.20,
    pct18to44: 0.48,
    collegePct: 0.40,
    youngProfPct: 0.38,
    under10Pct: 0.09,
    asianPct: 0.06,
    hispanicPct: 0.35,
    popDensity: 30000,
  },
  'Clinton Hill': {
    totalPopulation: 32600,
    medianIncome: 72000,
    medianAge: 33.4,
    avgHouseholdSize: 2.2,
    renterPct: 0.72,
    ownerPct: 0.28,
    pct18to44: 0.44,
    collegePct: 0.55,
    youngProfPct: 0.38,
    under10Pct: 0.09,
    asianPct: 0.06,
    hispanicPct: 0.12,
    popDensity: 34000,
  },
  'Fort Greene': {
    totalPopulation: 22800,
    medianIncome: 82000,
    medianAge: 34.8,
    avgHouseholdSize: 2.1,
    renterPct: 0.68,
    ownerPct: 0.32,
    pct18to44: 0.44,
    collegePct: 0.62,
    youngProfPct: 0.38,
    under10Pct: 0.08,
    asianPct: 0.05,
    hispanicPct: 0.10,
    popDensity: 36000,
  },
  'Kensington': {
    totalPopulation: 38200,
    medianIncome: 48000,
    medianAge: 36.5,
    avgHouseholdSize: 2.8,
    renterPct: 0.68,
    ownerPct: 0.32,
    pct18to44: 0.34,
    collegePct: 0.32,
    youngProfPct: 0.22,
    under10Pct: 0.12,
    asianPct: 0.16,
    hispanicPct: 0.18,
    popDensity: 28000,
  },
  'Ditmas Park': {
    totalPopulation: 28400,
    medianIncome: 68000,
    medianAge: 37.2,
    avgHouseholdSize: 2.5,
    renterPct: 0.58,
    ownerPct: 0.42,
    pct18to44: 0.36,
    collegePct: 0.48,
    youngProfPct: 0.28,
    under10Pct: 0.11,
    asianPct: 0.08,
    hispanicPct: 0.14,
    popDensity: 24000,
  },
  'Murray Hill': {
    totalPopulation: 32400,
    medianIncome: 95000,
    medianAge: 35.8,
    avgHouseholdSize: 1.8,
    renterPct: 0.78,
    ownerPct: 0.22,
    pct18to44: 0.48,
    collegePct: 0.68,
    youngProfPct: 0.42,
    under10Pct: 0.04,
    asianPct: 0.18,
    hispanicPct: 0.08,
    popDensity: 42000,
  },
  'Gramercy': {
    totalPopulation: 28600,
    medianIncome: 115000,
    medianAge: 36.2,
    avgHouseholdSize: 1.8,
    renterPct: 0.72,
    ownerPct: 0.28,
    pct18to44: 0.46,
    collegePct: 0.74,
    youngProfPct: 0.40,
    under10Pct: 0.04,
    asianPct: 0.10,
    hispanicPct: 0.08,
    popDensity: 38000,
  },
}

// ============================================================
// BUSINESS COUNTS PER NEIGHBORHOOD
// Maps to the 20 DEMAND_CATEGORIES from demandModel.js
// Realistic counts: Williamsburg has tons of coffee, UES has dry cleaners
// ============================================================

const NEIGHBORHOOD_BUSINESSES = {
  'Williamsburg': {
    coffee_shop: 28, restaurant: 85, bar: 22, bakery: 12, pizza_restaurant: 8,
    convenience_store: 18, grocery: 8, pharmacy: 6, gym: 8, yoga_studio: 6,
    hair_salon: 14, laundromat: 5, nail_salon: 8, dentist: 4, bank: 3,
    pet_store: 4, daycare: 3, dry_cleaner: 3, auto_repair: 1, fast_food: 12,
  },
  'Greenpoint': {
    coffee_shop: 16, restaurant: 42, bar: 10, bakery: 8, pizza_restaurant: 5,
    convenience_store: 12, grocery: 5, pharmacy: 4, gym: 4, yoga_studio: 3,
    hair_salon: 8, laundromat: 4, nail_salon: 5, dentist: 3, bank: 2,
    pet_store: 2, daycare: 2, dry_cleaner: 2, auto_repair: 2, fast_food: 6,
  },
  'Bushwick': {
    coffee_shop: 12, restaurant: 45, bar: 14, bakery: 5, pizza_restaurant: 8,
    convenience_store: 22, grocery: 6, pharmacy: 5, gym: 3, yoga_studio: 2,
    hair_salon: 12, laundromat: 8, nail_salon: 6, dentist: 3, bank: 2,
    pet_store: 1, daycare: 4, dry_cleaner: 1, auto_repair: 4, fast_food: 18,
  },
  'Park Slope': {
    coffee_shop: 22, restaurant: 68, bar: 12, bakery: 10, pizza_restaurant: 8,
    convenience_store: 14, grocery: 8, pharmacy: 6, gym: 6, yoga_studio: 5,
    hair_salon: 12, laundromat: 4, nail_salon: 8, dentist: 8, bank: 5,
    pet_store: 5, daycare: 8, dry_cleaner: 6, auto_repair: 2, fast_food: 8,
  },
  'Cobble Hill': {
    coffee_shop: 6, restaurant: 18, bar: 4, bakery: 3, pizza_restaurant: 2,
    convenience_store: 4, grocery: 2, pharmacy: 2, gym: 2, yoga_studio: 2,
    hair_salon: 3, laundromat: 1, nail_salon: 2, dentist: 2, bank: 1,
    pet_store: 1, daycare: 2, dry_cleaner: 2, auto_repair: 0, fast_food: 2,
  },
  'Carroll Gardens': {
    coffee_shop: 5, restaurant: 22, bar: 4, bakery: 3, pizza_restaurant: 3,
    convenience_store: 4, grocery: 2, pharmacy: 2, gym: 1, yoga_studio: 1,
    hair_salon: 4, laundromat: 1, nail_salon: 3, dentist: 2, bank: 1,
    pet_store: 1, daycare: 2, dry_cleaner: 2, auto_repair: 1, fast_food: 3,
  },
  'DUMBO': {
    coffee_shop: 5, restaurant: 12, bar: 3, bakery: 2, pizza_restaurant: 2,
    convenience_store: 2, grocery: 1, pharmacy: 1, gym: 2, yoga_studio: 1,
    hair_salon: 1, laundromat: 0, nail_salon: 1, dentist: 1, bank: 1,
    pet_store: 0, daycare: 1, dry_cleaner: 1, auto_repair: 0, fast_food: 2,
  },
  'Prospect Heights': {
    coffee_shop: 8, restaurant: 28, bar: 6, bakery: 4, pizza_restaurant: 4,
    convenience_store: 8, grocery: 3, pharmacy: 3, gym: 3, yoga_studio: 2,
    hair_salon: 5, laundromat: 3, nail_salon: 4, dentist: 2, bank: 2,
    pet_store: 1, daycare: 2, dry_cleaner: 2, auto_repair: 1, fast_food: 5,
  },
  'Crown Heights': {
    coffee_shop: 10, restaurant: 42, bar: 8, bakery: 4, pizza_restaurant: 10,
    convenience_store: 28, grocery: 8, pharmacy: 8, gym: 3, yoga_studio: 1,
    hair_salon: 18, laundromat: 8, nail_salon: 10, dentist: 5, bank: 4,
    pet_store: 1, daycare: 5, dry_cleaner: 3, auto_repair: 5, fast_food: 22,
  },
  'Bed-Stuy': {
    coffee_shop: 8, restaurant: 35, bar: 6, bakery: 3, pizza_restaurant: 10,
    convenience_store: 24, grocery: 6, pharmacy: 6, gym: 2, yoga_studio: 1,
    hair_salon: 16, laundromat: 8, nail_salon: 8, dentist: 4, bank: 3,
    pet_store: 1, daycare: 4, dry_cleaner: 2, auto_repair: 5, fast_food: 20,
  },
  'Gowanus': {
    coffee_shop: 4, restaurant: 14, bar: 5, bakery: 2, pizza_restaurant: 2,
    convenience_store: 3, grocery: 1, pharmacy: 1, gym: 2, yoga_studio: 1,
    hair_salon: 2, laundromat: 1, nail_salon: 1, dentist: 1, bank: 0,
    pet_store: 1, daycare: 1, dry_cleaner: 1, auto_repair: 3, fast_food: 3,
  },
  'Red Hook': {
    coffee_shop: 2, restaurant: 8, bar: 3, bakery: 1, pizza_restaurant: 2,
    convenience_store: 4, grocery: 1, pharmacy: 1, gym: 1, yoga_studio: 0,
    hair_salon: 2, laundromat: 2, nail_salon: 1, dentist: 1, bank: 0,
    pet_store: 0, daycare: 1, dry_cleaner: 0, auto_repair: 3, fast_food: 4,
  },
  'Bay Ridge': {
    coffee_shop: 12, restaurant: 62, bar: 8, bakery: 8, pizza_restaurant: 12,
    convenience_store: 18, grocery: 8, pharmacy: 8, gym: 4, yoga_studio: 2,
    hair_salon: 16, laundromat: 6, nail_salon: 10, dentist: 8, bank: 5,
    pet_store: 2, daycare: 4, dry_cleaner: 5, auto_repair: 6, fast_food: 16,
  },
  'Sunset Park': {
    coffee_shop: 6, restaurant: 52, bar: 4, bakery: 6, pizza_restaurant: 6,
    convenience_store: 20, grocery: 10, pharmacy: 6, gym: 2, yoga_studio: 0,
    hair_salon: 10, laundromat: 8, nail_salon: 6, dentist: 4, bank: 3,
    pet_store: 1, daycare: 4, dry_cleaner: 2, auto_repair: 8, fast_food: 18,
  },
  'Upper East Side': {
    coffee_shop: 48, restaurant: 165, bar: 18, bakery: 22, pizza_restaurant: 18,
    convenience_store: 32, grocery: 18, pharmacy: 22, gym: 14, yoga_studio: 8,
    hair_salon: 35, laundromat: 8, nail_salon: 22, dentist: 18, bank: 12,
    pet_store: 6, daycare: 8, dry_cleaner: 18, auto_repair: 2, fast_food: 28,
  },
  'Upper West Side': {
    coffee_shop: 42, restaurant: 148, bar: 16, bakery: 18, pizza_restaurant: 16,
    convenience_store: 28, grocery: 16, pharmacy: 18, gym: 12, yoga_studio: 8,
    hair_salon: 30, laundromat: 10, nail_salon: 18, dentist: 16, bank: 10,
    pet_store: 6, daycare: 8, dry_cleaner: 14, auto_repair: 2, fast_food: 24,
  },
  'Midtown East': {
    coffee_shop: 22, restaurant: 82, bar: 12, bakery: 8, pizza_restaurant: 10,
    convenience_store: 14, grocery: 6, pharmacy: 8, gym: 6, yoga_studio: 3,
    hair_salon: 12, laundromat: 2, nail_salon: 8, dentist: 8, bank: 8,
    pet_store: 2, daycare: 2, dry_cleaner: 8, auto_repair: 0, fast_food: 18,
  },
  'West Village': {
    coffee_shop: 18, restaurant: 62, bar: 14, bakery: 8, pizza_restaurant: 6,
    convenience_store: 8, grocery: 4, pharmacy: 4, gym: 4, yoga_studio: 4,
    hair_salon: 8, laundromat: 2, nail_salon: 6, dentist: 4, bank: 2,
    pet_store: 3, daycare: 1, dry_cleaner: 4, auto_repair: 0, fast_food: 6,
  },
  'East Village': {
    coffee_shop: 22, restaurant: 68, bar: 18, bakery: 6, pizza_restaurant: 8,
    convenience_store: 14, grocery: 5, pharmacy: 5, gym: 4, yoga_studio: 3,
    hair_salon: 10, laundromat: 4, nail_salon: 6, dentist: 3, bank: 2,
    pet_store: 2, daycare: 1, dry_cleaner: 2, auto_repair: 1, fast_food: 14,
  },
  'SoHo': {
    coffee_shop: 10, restaurant: 28, bar: 6, bakery: 4, pizza_restaurant: 3,
    convenience_store: 4, grocery: 2, pharmacy: 2, gym: 3, yoga_studio: 2,
    hair_salon: 6, laundromat: 1, nail_salon: 4, dentist: 2, bank: 1,
    pet_store: 1, daycare: 1, dry_cleaner: 3, auto_repair: 0, fast_food: 4,
  },
  'Tribeca': {
    coffee_shop: 8, restaurant: 35, bar: 5, bakery: 4, pizza_restaurant: 3,
    convenience_store: 4, grocery: 3, pharmacy: 3, gym: 3, yoga_studio: 2,
    hair_salon: 5, laundromat: 1, nail_salon: 4, dentist: 3, bank: 2,
    pet_store: 2, daycare: 3, dry_cleaner: 4, auto_repair: 0, fast_food: 4,
  },
  'Lower East Side': {
    coffee_shop: 14, restaurant: 58, bar: 14, bakery: 5, pizza_restaurant: 8,
    convenience_store: 16, grocery: 6, pharmacy: 5, gym: 3, yoga_studio: 1,
    hair_salon: 10, laundromat: 6, nail_salon: 6, dentist: 4, bank: 3,
    pet_store: 1, daycare: 3, dry_cleaner: 2, auto_repair: 2, fast_food: 16,
  },
  'Chelsea': {
    coffee_shop: 18, restaurant: 65, bar: 12, bakery: 6, pizza_restaurant: 6,
    convenience_store: 10, grocery: 5, pharmacy: 5, gym: 6, yoga_studio: 4,
    hair_salon: 10, laundromat: 3, nail_salon: 8, dentist: 4, bank: 3,
    pet_store: 2, daycare: 2, dry_cleaner: 5, auto_repair: 1, fast_food: 10,
  },
  'Flatiron': {
    coffee_shop: 10, restaurant: 35, bar: 5, bakery: 3, pizza_restaurant: 3,
    convenience_store: 4, grocery: 2, pharmacy: 2, gym: 4, yoga_studio: 2,
    hair_salon: 4, laundromat: 1, nail_salon: 3, dentist: 2, bank: 2,
    pet_store: 1, daycare: 1, dry_cleaner: 3, auto_repair: 0, fast_food: 6,
  },
  'Harlem': {
    coffee_shop: 10, restaurant: 52, bar: 6, bakery: 4, pizza_restaurant: 14,
    convenience_store: 32, grocery: 10, pharmacy: 10, gym: 4, yoga_studio: 1,
    hair_salon: 24, laundromat: 12, nail_salon: 14, dentist: 6, bank: 5,
    pet_store: 1, daycare: 6, dry_cleaner: 3, auto_repair: 6, fast_food: 32,
  },
  'Washington Heights': {
    coffee_shop: 8, restaurant: 62, bar: 6, bakery: 8, pizza_restaurant: 14,
    convenience_store: 38, grocery: 12, pharmacy: 12, gym: 3, yoga_studio: 0,
    hair_salon: 22, laundromat: 14, nail_salon: 12, dentist: 6, bank: 5,
    pet_store: 1, daycare: 6, dry_cleaner: 2, auto_repair: 8, fast_food: 36,
  },
  'Astoria': {
    coffee_shop: 18, restaurant: 72, bar: 12, bakery: 10, pizza_restaurant: 10,
    convenience_store: 20, grocery: 8, pharmacy: 8, gym: 5, yoga_studio: 3,
    hair_salon: 14, laundromat: 6, nail_salon: 10, dentist: 6, bank: 4,
    pet_store: 2, daycare: 4, dry_cleaner: 4, auto_repair: 4, fast_food: 16,
  },
  'Long Island City': {
    coffee_shop: 10, restaurant: 32, bar: 6, bakery: 4, pizza_restaurant: 4,
    convenience_store: 8, grocery: 3, pharmacy: 3, gym: 4, yoga_studio: 3,
    hair_salon: 5, laundromat: 2, nail_salon: 3, dentist: 2, bank: 2,
    pet_store: 1, daycare: 2, dry_cleaner: 2, auto_repair: 2, fast_food: 8,
  },
  'Jackson Heights': {
    coffee_shop: 8, restaurant: 85, bar: 4, bakery: 8, pizza_restaurant: 8,
    convenience_store: 28, grocery: 14, pharmacy: 10, gym: 3, yoga_studio: 1,
    hair_salon: 16, laundromat: 8, nail_salon: 8, dentist: 6, bank: 4,
    pet_store: 1, daycare: 5, dry_cleaner: 3, auto_repair: 6, fast_food: 24,
  },
  'Flushing': {
    coffee_shop: 12, restaurant: 98, bar: 4, bakery: 10, pizza_restaurant: 6,
    convenience_store: 24, grocery: 16, pharmacy: 10, gym: 4, yoga_studio: 1,
    hair_salon: 18, laundromat: 6, nail_salon: 14, dentist: 8, bank: 6,
    pet_store: 2, daycare: 4, dry_cleaner: 4, auto_repair: 4, fast_food: 22,
  },
  'Forest Hills': {
    coffee_shop: 12, restaurant: 52, bar: 6, bakery: 6, pizza_restaurant: 8,
    convenience_store: 14, grocery: 6, pharmacy: 6, gym: 4, yoga_studio: 2,
    hair_salon: 10, laundromat: 4, nail_salon: 8, dentist: 6, bank: 4,
    pet_store: 2, daycare: 3, dry_cleaner: 4, auto_repair: 4, fast_food: 12,
  },
  'Fordham': {
    coffee_shop: 4, restaurant: 32, bar: 4, bakery: 4, pizza_restaurant: 8,
    convenience_store: 22, grocery: 6, pharmacy: 6, gym: 2, yoga_studio: 0,
    hair_salon: 12, laundromat: 6, nail_salon: 6, dentist: 3, bank: 3,
    pet_store: 0, daycare: 3, dry_cleaner: 1, auto_repair: 6, fast_food: 20,
  },
  'Riverdale': {
    coffee_shop: 6, restaurant: 28, bar: 3, bakery: 3, pizza_restaurant: 6,
    convenience_store: 8, grocery: 4, pharmacy: 4, gym: 2, yoga_studio: 1,
    hair_salon: 6, laundromat: 2, nail_salon: 4, dentist: 4, bank: 3,
    pet_store: 1, daycare: 3, dry_cleaner: 2, auto_repair: 3, fast_food: 8,
  },
  'East Williamsburg': {
    coffee_shop: 8, restaurant: 22, bar: 6, bakery: 3, pizza_restaurant: 3,
    convenience_store: 8, grocery: 3, pharmacy: 2, gym: 2, yoga_studio: 1,
    hair_salon: 5, laundromat: 3, nail_salon: 3, dentist: 1, bank: 1,
    pet_store: 1, daycare: 1, dry_cleaner: 1, auto_repair: 3, fast_food: 6,
  },
  'Clinton Hill': {
    coffee_shop: 10, restaurant: 28, bar: 6, bakery: 4, pizza_restaurant: 4,
    convenience_store: 8, grocery: 3, pharmacy: 3, gym: 3, yoga_studio: 2,
    hair_salon: 6, laundromat: 3, nail_salon: 4, dentist: 2, bank: 2,
    pet_store: 1, daycare: 2, dry_cleaner: 2, auto_repair: 1, fast_food: 6,
  },
  'Fort Greene': {
    coffee_shop: 8, restaurant: 24, bar: 5, bakery: 3, pizza_restaurant: 3,
    convenience_store: 6, grocery: 3, pharmacy: 2, gym: 2, yoga_studio: 2,
    hair_salon: 4, laundromat: 2, nail_salon: 3, dentist: 2, bank: 1,
    pet_store: 1, daycare: 1, dry_cleaner: 2, auto_repair: 1, fast_food: 5,
  },
  'Kensington': {
    coffee_shop: 4, restaurant: 22, bar: 2, bakery: 3, pizza_restaurant: 5,
    convenience_store: 12, grocery: 4, pharmacy: 4, gym: 1, yoga_studio: 0,
    hair_salon: 6, laundromat: 4, nail_salon: 4, dentist: 3, bank: 2,
    pet_store: 0, daycare: 2, dry_cleaner: 1, auto_repair: 3, fast_food: 10,
  },
  'Ditmas Park': {
    coffee_shop: 4, restaurant: 16, bar: 2, bakery: 2, pizza_restaurant: 3,
    convenience_store: 6, grocery: 3, pharmacy: 3, gym: 1, yoga_studio: 1,
    hair_salon: 4, laundromat: 2, nail_salon: 3, dentist: 2, bank: 1,
    pet_store: 1, daycare: 2, dry_cleaner: 1, auto_repair: 2, fast_food: 6,
  },
  'Murray Hill': {
    coffee_shop: 12, restaurant: 48, bar: 8, bakery: 4, pizza_restaurant: 5,
    convenience_store: 8, grocery: 3, pharmacy: 4, gym: 4, yoga_studio: 2,
    hair_salon: 6, laundromat: 2, nail_salon: 4, dentist: 3, bank: 3,
    pet_store: 1, daycare: 1, dry_cleaner: 4, auto_repair: 0, fast_food: 10,
  },
  'Gramercy': {
    coffee_shop: 10, restaurant: 38, bar: 6, bakery: 3, pizza_restaurant: 4,
    convenience_store: 6, grocery: 3, pharmacy: 3, gym: 3, yoga_studio: 2,
    hair_salon: 5, laundromat: 2, nail_salon: 4, dentist: 3, bank: 2,
    pet_store: 1, daycare: 1, dry_cleaner: 3, auto_repair: 0, fast_food: 6,
  },
}

// ============================================================
// AGE DISTRIBUTION GENERATOR
// Creates realistic age distribution from demographic params
// ============================================================

function generateAgeDistribution(demographics) {
  const pop = demographics.totalPopulation
  const medAge = demographics.medianAge
  const youngPct = demographics.pct18to44 || 0.38

  // Distribute population across age brackets based on median age
  // Younger neighborhoods skew left, older skew right
  const youngSkew = Math.max(0, (40 - medAge) / 20) // 0 to 1, higher = younger
  const under25Pct = 0.18 + youngSkew * 0.08
  const age25to34Pct = 0.12 + youngSkew * 0.10
  const age35to44Pct = 0.14 + youngSkew * 0.02
  const age45to54Pct = 0.14 - youngSkew * 0.04
  const age55to64Pct = 0.14 - youngSkew * 0.04
  const remaining = 1 - under25Pct - age25to34Pct - age35to44Pct - age45to54Pct - age55to64Pct
  const age65plusPct = Math.max(0.06, remaining)

  return [
    { label: '<25', count: Math.round(pop * under25Pct) },
    { label: '25-34', count: Math.round(pop * age25to34Pct) },
    { label: '35-44', count: Math.round(pop * age35to44Pct) },
    { label: '45-54', count: Math.round(pop * age45to54Pct) },
    { label: '55-64', count: Math.round(pop * age55to64Pct) },
    { label: '65+', count: Math.round(pop * age65plusPct) },
  ]
}

// ============================================================
// MOCK BUSINESS LOCATIONS GENERATOR
// Creates plausible lat/lng coordinates for businesses
// ============================================================

function seededRandom(seed) {
  let s = seed
  return function () {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function generateBusinessLocations(lat, lng, radiusMiles, counts, neighborhood) {
  const businesses = []
  const rand = seededRandom(Math.round(lat * 10000 + lng * 10000))
  const radiusDeg = radiusMiles * 0.0145
  const cosLat = Math.cos(lat * Math.PI / 180)

  const CATEGORY_DISPLAY = {
    coffee_shop: 'food', restaurant: 'food', bar: 'food', fast_food: 'food',
    bakery: 'food', pizza_restaurant: 'food',
    convenience_store: 'retail', grocery: 'retail', pet_store: 'retail',
    pharmacy: 'health', dentist: 'health',
    gym: 'fitness', yoga_studio: 'fitness',
    hair_salon: 'services', laundromat: 'services', nail_salon: 'services',
    daycare: 'services', dry_cleaner: 'services', auto_repair: 'services', bank: 'services',
  }

  const BUSINESS_NAMES = {
    coffee_shop: ['Blue Bottle', 'Stumptown', 'Cha Cha Matcha', 'Toby\'s Estate', 'Devocion', 'Partners Coffee', 'Variety Coffee', 'Oslo Coffee', 'Sey Coffee', 'Cafe Grumpy'],
    restaurant: ['The Meatball Shop', 'Sweetgreen', 'DIG', 'Joe & The Juice', 'Cava', 'Lilia', 'Maison Premiere', 'Roberta\'s', 'Juliana\'s', 'Lucali'],
    bar: ['The Dead Rabbit', 'Bemelmans Bar', 'Attaboy', 'PDT', 'Death & Co', 'The Ear Inn', 'Dante', 'Bar Goto', 'Clover Club'],
    bakery: ['Dominique Ansel', 'Balthazar', 'Amy\'s Bread', 'Levain Bakery', 'Breads Bakery', 'Mah-Ze-Dahr', 'Sullivan Street'],
    pizza_restaurant: ['Joe\'s Pizza', 'Prince Street Pizza', 'L&B Spumoni', 'Di Fara', 'Artichoke Basille\'s', 'Scarr\'s', 'Emily'],
    convenience_store: ['Bodega', 'Deli & Grocery', 'Mini Mart', 'Corner Store', 'Quick Stop'],
    grocery: ['Key Food', 'Met Fresh', 'Trade Fair', 'Western Beef', 'Foodtown', 'C-Town'],
    pharmacy: ['CVS', 'Walgreens', 'Duane Reade', 'Rite Aid', 'CityMD'],
    gym: ['Equinox', 'NYSC', 'Planet Fitness', 'CrossFit', 'Blink Fitness', 'Crunch'],
    yoga_studio: ['Y7 Studio', 'Sky Ting Yoga', 'Modo Yoga', 'Laughing Lotus', 'Yoga Vida'],
    hair_salon: ['Salon de Coiffure', 'Hair Studio', 'Cuts & Color', 'The Salon', 'Mane Street'],
    laundromat: ['Suds Laundry', 'Clean Spin', 'Fresh Wash', 'Quick Clean'],
    nail_salon: ['Nail Garden', 'Polished', 'Color Bar', 'Nail Studio'],
    dentist: ['Dental Arts', 'Smile NYC', 'Manhattan Dental', 'City Dental'],
    bank: ['Chase', 'Bank of America', 'Citibank', 'TD Bank', 'Capital One'],
    pet_store: ['Petco', 'PetSmart', 'Whiskers', 'Beastie Bestie'],
    daycare: ['Bright Horizons', 'KinderCare', 'Little Stars', 'Tiny Tots'],
    dry_cleaner: ['Express Cleaners', 'Royal Dry Clean', 'Spotless', 'Classic Cleaners'],
    auto_repair: ['Midas', 'Jiffy Lube', 'Auto Zone', 'Quick Fix Auto'],
    fast_food: ['McDonald\'s', 'Subway', 'Shake Shack', 'Wendy\'s', 'Popeyes', 'Chipotle'],
  }

  let globalId = 0
  for (const [categoryId, count] of Object.entries(counts)) {
    const names = BUSINESS_NAMES[categoryId] || ['Local Business']
    for (let i = 0; i < count; i++) {
      const angle = rand() * 2 * Math.PI
      const dist = rand() * radiusDeg * 0.85 // keep within radius
      const bizLat = lat + dist * Math.cos(angle)
      const bizLng = lng + (dist * Math.sin(angle)) / cosLat

      businesses.push({
        id: `mock_${neighborhood}_${globalId++}`,
        name: names[i % names.length] + (i >= names.length ? ` #${Math.floor(i / names.length) + 1}` : ''),
        categoryId,
        displayCategory: CATEGORY_DISPLAY[categoryId] || 'services',
        lat: bizLat,
        lng: bizLng,
        tags: {},
      })
    }
  }

  return businesses
}

// ============================================================
// RADIUS-BASED POPULATION SCALING
// Scale demographics based on radius (0.25, 0.5, 1 mile)
// ============================================================

function scalePopulationForRadius(baseDemographics, radius) {
  // Base data represents roughly 0.5 mile radius
  // Scale population based on area ratio
  const baseRadius = 0.5
  const areaRatio = (radius * radius) / (baseRadius * baseRadius)

  // Don't just linearly scale, dampen for larger radii (neighborhoods overlap)
  const scaleFactor = Math.pow(areaRatio, 0.75)

  return {
    ...baseDemographics,
    totalPopulation: Math.round(baseDemographics.totalPopulation * scaleFactor),
  }
}

// ============================================================
// PUBLIC API: Drop-in replacements for Census + Overpass
// ============================================================

/**
 * Mock replacement for getDemographics from census.js
 * Returns realistic demographic data for any lat/lng in NYC
 */
export async function getMockDemographics(lat, lng, radiusMiles) {
  // Simulate network delay (200-600ms)
  await new Promise(r => setTimeout(r, 200 + Math.random() * 400))

  const neighborhood = findNeighborhood(lat, lng)
  const baseDemographics = NEIGHBORHOOD_DEMOGRAPHICS[neighborhood]

  if (!baseDemographics) {
    // Fallback: generate plausible data for unknown neighborhoods
    const fallback = {
      totalPopulation: 42000,
      medianIncome: 58000,
      medianAge: 35.5,
      avgHouseholdSize: 2.4,
      renterPct: 0.68,
      ownerPct: 0.32,
      pct18to44: 0.38,
      collegePct: 0.38,
      youngProfPct: 0.28,
      under10Pct: 0.10,
      asianPct: 0.10,
      hispanicPct: 0.20,
      popDensity: 30000,
    }
    const scaled = scalePopulationForRadius(fallback, radiusMiles)
    return {
      ...scaled,
      ageDistribution: generateAgeDistribution(scaled),
      tractCount: Math.max(1, Math.round(radiusMiles * 4)),
    }
  }

  const scaled = scalePopulationForRadius(baseDemographics, radiusMiles)
  return {
    ...scaled,
    ageDistribution: generateAgeDistribution(scaled),
    tractCount: Math.max(1, Math.round(radiusMiles * 4)),
  }
}

/**
 * Mock replacement for getBusinesses from overpass.js
 * Returns realistic business locations and counts
 */
export async function getMockBusinesses(lat, lng, radiusMiles) {
  // Simulate network delay (300-800ms)
  await new Promise(r => setTimeout(r, 300 + Math.random() * 500))

  const neighborhood = findNeighborhood(lat, lng)
  const baseCounts = NEIGHBORHOOD_BUSINESSES[neighborhood]

  if (!baseCounts) {
    // Fallback for unknown neighborhoods
    const fallbackCounts = {
      coffee_shop: 6, restaurant: 25, bar: 4, bakery: 3, pizza_restaurant: 4,
      convenience_store: 10, grocery: 4, pharmacy: 4, gym: 2, yoga_studio: 1,
      hair_salon: 6, laundromat: 3, nail_salon: 4, dentist: 2, bank: 2,
      pet_store: 1, daycare: 2, dry_cleaner: 1, auto_repair: 2, fast_food: 8,
    }
    const businesses = generateBusinessLocations(lat, lng, radiusMiles, fallbackCounts, 'unknown')
    return { businesses, counts: fallbackCounts, total: businesses.length }
  }

  // Scale business counts for radius
  const baseRadius = 0.5
  const areaRatio = (radiusMiles * radiusMiles) / (baseRadius * baseRadius)
  const scaleFactor = Math.pow(areaRatio, 0.7)

  const scaledCounts = {}
  for (const [key, val] of Object.entries(baseCounts)) {
    scaledCounts[key] = Math.round(val * scaleFactor)
  }

  const businesses = generateBusinessLocations(lat, lng, radiusMiles, scaledCounts, neighborhood)
  return { businesses, counts: scaledCounts, total: businesses.length }
}
