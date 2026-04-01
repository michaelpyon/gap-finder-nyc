// Demand Estimation Model
// 20 curated business categories with population-based demand ratios
// and demographic filters. Transparent, shown on methodology page.
//
// Formula: expected = floor(population_in_radius / ratio)
//   if demographic filter passes, else expected = 0
//
// Saturation tiers:
//   0-40%   = Highly Underserved (green)
//   40-70%  = Underserved (yellow)
//   70-100% = Adequately Served (gray)
//   100%+   = Saturated (red)

export const DEMAND_CATEGORIES = [
  {
    id: 'coffee_shop',
    label: 'Coffee Shop',
    osmTags: ['amenity=cafe'],
    ratio: 2000,
    filter: { field: 'medianIncome', op: '>=', value: 40000 },
    filterLabel: 'Median income >= $40K',
    icon: '☕',
    displayCategory: 'food',
  },
  {
    id: 'restaurant',
    label: 'Restaurant',
    osmTags: ['amenity=restaurant'],
    ratio: 500,
    filter: null,
    filterLabel: 'No filter (universal demand)',
    icon: '🍽',
    displayCategory: 'food',
  },
  {
    id: 'bar',
    label: 'Bar',
    osmTags: ['amenity=bar', 'amenity=pub'],
    ratio: 1500,
    filter: { field: 'pct18to44', op: '>=', value: 0.25 },
    filterLabel: 'Age 18-44 >= 25% of population',
    icon: '🍺',
    displayCategory: 'food',
  },
  {
    id: 'bakery',
    label: 'Bakery',
    osmTags: ['shop=bakery'],
    ratio: 4000,
    filter: null,
    filterLabel: 'No filter (universal demand)',
    icon: '🥐',
    displayCategory: 'food',
  },
  {
    id: 'pizza_restaurant',
    label: 'Pizza Restaurant',
    osmTags: ['amenity=restaurant[cuisine=pizza]', 'amenity=fast_food[cuisine=pizza]'],
    ratio: 3000,
    filter: null,
    filterLabel: 'No filter (universal demand)',
    icon: '🍕',
    displayCategory: 'food',
  },
  {
    id: 'convenience_store',
    label: 'Convenience Store',
    osmTags: ['shop=convenience'],
    ratio: 2000,
    filter: null,
    filterLabel: 'No filter (universal demand)',
    icon: '🏪',
    displayCategory: 'retail',
  },
  {
    id: 'grocery',
    label: 'Grocery Store',
    osmTags: ['shop=supermarket', 'shop=greengrocer'],
    ratio: 3000,
    filter: null,
    filterLabel: 'No filter (universal demand)',
    icon: '🛒',
    displayCategory: 'retail',
  },
  {
    id: 'pharmacy',
    label: 'Pharmacy',
    osmTags: ['amenity=pharmacy', 'healthcare=pharmacy'],
    ratio: 4000,
    filter: null,
    filterLabel: 'No filter (universal demand)',
    icon: '💊',
    displayCategory: 'health',
  },
  {
    id: 'gym',
    label: 'Gym / Fitness Center',
    osmTags: ['leisure=fitness_centre'],
    ratio: 4000,
    filter: { field: 'medianIncome', op: '>=', value: 50000 },
    filterLabel: 'Median income >= $50K, age 18-54 weighted',
    icon: '🏋️',
    displayCategory: 'fitness',
  },
  {
    id: 'yoga_studio',
    label: 'Yoga Studio',
    osmTags: ['sport=yoga', 'leisure=yoga'],
    ratio: 5000,
    filter: { field: 'medianIncome', op: '>=', value: 60000 },
    filterLabel: 'Median income >= $60K',
    icon: '🧘',
    displayCategory: 'fitness',
  },
  {
    id: 'hair_salon',
    label: 'Hair Salon',
    osmTags: ['shop=hairdresser'],
    ratio: 2500,
    filter: null,
    filterLabel: 'No filter (universal demand)',
    icon: '💇',
    displayCategory: 'services',
  },
  {
    id: 'laundromat',
    label: 'Laundromat',
    osmTags: ['shop=laundry'],
    ratio: 3000,
    filter: { field: 'renterPct', op: '>=', value: 0.50 },
    filterLabel: 'Renter ratio >= 50%',
    icon: '🧺',
    displayCategory: 'services',
  },
  {
    id: 'nail_salon',
    label: 'Nail Salon',
    osmTags: ['shop=beauty'],
    ratio: 3500,
    filter: null,
    filterLabel: 'No filter (universal demand)',
    icon: '💅',
    displayCategory: 'services',
  },
  {
    id: 'dentist',
    label: 'Dentist',
    osmTags: ['amenity=dentist', 'healthcare=dentist'],
    ratio: 4000,
    filter: null,
    filterLabel: 'No filter (universal demand)',
    icon: '🦷',
    displayCategory: 'health',
  },
  {
    id: 'bank',
    label: 'Bank / Credit Union',
    osmTags: ['amenity=bank'],
    ratio: 5000,
    filter: null,
    filterLabel: 'No filter (universal demand)',
    icon: '🏦',
    displayCategory: 'services',
  },
  {
    id: 'pet_store',
    label: 'Pet Store',
    osmTags: ['shop=pet'],
    ratio: 8000,
    filter: { field: 'medianIncome', op: '>=', value: 50000 },
    filterLabel: 'Median income >= $50K',
    icon: '🐾',
    displayCategory: 'retail',
  },
  {
    id: 'daycare',
    label: 'Daycare / Childcare',
    osmTags: ['amenity=childcare', 'amenity=kindergarten'],
    ratio: 3000,
    filter: { field: 'avgHouseholdSize', op: '>=', value: 2.5 },
    filterLabel: 'Average household size >= 2.5',
    icon: '👶',
    displayCategory: 'services',
  },
  {
    id: 'dry_cleaner',
    label: 'Dry Cleaner',
    osmTags: ['shop=dry_cleaning'],
    ratio: 5000,
    filter: { field: 'medianIncome', op: '>=', value: 50000 },
    filterLabel: 'Median income >= $50K',
    icon: '👔',
    displayCategory: 'services',
  },
  {
    id: 'auto_repair',
    label: 'Auto Repair',
    osmTags: ['shop=car_repair'],
    ratio: 6000,
    filter: { field: 'renterPct', op: '<', value: 0.60 },
    filterLabel: 'Renter ratio < 60% (car ownership proxy)',
    icon: '🔧',
    displayCategory: 'services',
  },
  {
    id: 'fast_food',
    label: 'Fast Food',
    osmTags: ['amenity=fast_food'],
    ratio: 1500,
    filter: null,
    filterLabel: 'No filter (universal demand)',
    icon: '🍔',
    displayCategory: 'food',
  },
]

// Display category metadata
export const DISPLAY_CATEGORIES = {
  food: { label: 'Food & Drink', color: '#fbbf24' },
  retail: { label: 'Retail', color: '#34d399' },
  health: { label: 'Health', color: '#f87171' },
  fitness: { label: 'Fitness', color: '#a78bfa' },
  services: { label: 'Services', color: '#60a5fa' },
}

// Saturation tier definitions
export const SATURATION_TIERS = [
  { id: 'highly_underserved', label: 'Highly Underserved', min: 0, max: 0.40, color: '#4ade80', bgColor: '#4ade8020' },
  { id: 'underserved', label: 'Underserved', min: 0.40, max: 0.70, color: '#fbbf24', bgColor: '#fbbf2420' },
  { id: 'adequately_served', label: 'Adequately Served', min: 0.70, max: 1.0, color: '#6b7280', bgColor: '#6b728020' },
  { id: 'saturated', label: 'Saturated', min: 1.0, max: Infinity, color: '#f87171', bgColor: '#f8717120' },
]

export function getSaturationTier(saturationPct) {
  for (const tier of SATURATION_TIERS) {
    if (saturationPct >= tier.min && saturationPct < tier.max) return tier
  }
  return SATURATION_TIERS[SATURATION_TIERS.length - 1]
}
