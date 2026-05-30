import { Link } from 'react-router-dom'
import { DEMAND_CATEGORIES, SATURATION_TIERS, DISPLAY_CATEGORIES } from '../data/demandModel'
import DemoBanner from '../components/DemoBanner'

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3">
          <Link to="/" className="text-sm text-muted hover:text-text transition-colors flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Back
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        <div>
          <h1 className="text-2xl font-bold text-text tracking-tight">Methodology</h1>
          <p className="text-sm text-muted mt-2 leading-relaxed">
            How Gap Finder estimates business demand and calculates saturation scores.
            No black box. Every ratio and filter is shown below.
          </p>
        </div>

        <DemoBanner />

        {/* What the numbers in this demo actually are */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-text uppercase tracking-wider">About This Demo</h2>
          <div className="bg-surface border border-border rounded-xl p-5 space-y-3 text-sm text-text/80 leading-relaxed">
            <p>
              This deployment runs on illustrative sample data. The population, income,
              age, and business counts you see are hand-built estimates designed to show
              how the tool works. They are not live measurements and should not drive a
              real lease or business decision.
            </p>
            <p>
              The codebase does include a real data path that reads U.S. Census ACS
              5-Year estimates and queries OpenStreetMap through the Overpass API, but
              that path is not active in this demo. Wiring it up for production is a
              separate effort. The steps below describe how the model works on whatever
              data it receives.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-text uppercase tracking-wider">How it works</h2>
          <div className="bg-surface border border-border rounded-xl p-5 space-y-3 text-sm text-text/80 leading-relaxed">
            <p>
              1. You drop a pin on the map and choose a radius (0.25, 0.5, or 1 mile).
            </p>
            <p>
              2. The model takes demographics for the area: population, income, age, and
              housing tenure. In this demo these are illustrative sample values. The real
              data path is built to source them from Census Bureau ACS 5-Year estimates.
            </p>
            <p>
              3. The model takes a count of nearby commercial businesses, categorized into
              one of 20 categories. In this demo these counts are sample values. The real
              data path is built to query OpenStreetMap through the Overpass API.
            </p>
            <p>
              4. For each category, we calculate how many businesses the population "should" support
              using a simple per-capita ratio: 1 coffee shop per 5,000 residents, 1 restaurant per 1,200, etc.
              Some categories also have a demographic filter (income, age, renter ratio).
            </p>
            <p>
              5. Saturation = existing / expected. If there are 2 coffee shops and the model says
              there should be 6, saturation is 33%. That's a gap.
            </p>
          </div>
        </section>

        {/* Saturation tiers */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-text uppercase tracking-wider">Saturation Tiers</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SATURATION_TIERS.map(tier => (
              <div key={tier.id} className="bg-surface border border-border rounded-lg p-3 text-center">
                <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: tier.color }} />
                <p className="text-xs font-medium text-text">{tier.label}</p>
                <p className="text-[10px] text-muted mt-0.5">
                  {tier.max === Infinity ? `${Math.round(tier.min * 100)}%+` : `${Math.round(tier.min * 100)}-${Math.round(tier.max * 100)}%`}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Demand ratios table */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-text uppercase tracking-wider">
            Demand Ratios (all 20 categories)
          </h2>
          <p className="text-xs text-muted leading-relaxed">
            These ratios estimate how many of each business type a neighborhood should have
            based on population. "1 per 2,000" means for every 2,000 residents in the radius,
            we expect 1 business of this type.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2.5 pr-4 text-muted font-medium">Category</th>
                  <th className="text-left py-2.5 pr-4 text-muted font-medium">Type</th>
                  <th className="text-right py-2.5 pr-4 text-muted font-medium">Ratio</th>
                  <th className="text-left py-2.5 text-muted font-medium">Filter</th>
                </tr>
              </thead>
              <tbody>
                {DEMAND_CATEGORIES.map(cat => {
                  const displayCat = DISPLAY_CATEGORIES[cat.displayCategory]
                  return (
                    <tr key={cat.id} className="border-b border-border/30 hover:bg-surface/50">
                      <td className="py-2.5 pr-4">
                        <span className="mr-2">{cat.icon}</span>
                        <span className="text-text">{cat.label}</span>
                      </td>
                      <td className="py-2.5 pr-4">
                        <span
                          className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium"
                          style={{ backgroundColor: displayCat?.color + '20', color: displayCat?.color }}
                        >
                          {displayCat?.label || cat.displayCategory}
                        </span>
                      </td>
                      <td className="py-2.5 pr-4 text-right font-mono text-text">
                        1 per {cat.ratio.toLocaleString()}
                      </td>
                      <td className="py-2.5 text-muted">
                        {cat.filterLabel}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Data sources */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-text uppercase tracking-wider">Intended Data Sources</h2>
          <p className="text-xs text-muted leading-relaxed">
            These are the sources the real data path is built to use. They are not active
            in this demo, which runs on illustrative sample data. Map rendering is live.
          </p>
          <div className="space-y-2">
            {[
              {
                name: 'U.S. Census Bureau ACS 5-Year',
                desc: 'Intended source for population, income, age distribution, and housing tenure. Not active in this demo.',
                url: 'https://www.census.gov/data/developers/data-sets/acs-5year.html',
              },
              {
                name: 'FCC Area API',
                desc: 'Intended to convert lat/lng coordinates to Census FIPS codes (state, county, tract). Not active in this demo.',
                url: 'https://geo.fcc.gov/api/census/',
              },
              {
                name: 'OpenStreetMap / Overpass API',
                desc: 'Intended source for business locations and types. Community-maintained, coverage varies by area. Not active in this demo.',
                url: 'https://wiki.openstreetmap.org/wiki/Overpass_API',
              },
              {
                name: 'Mapbox GL JS',
                desc: 'Map rendering and geocoding. Live in this demo.',
                url: 'https://www.mapbox.com/',
              },
            ].map(source => (
              <div key={source.name} className="bg-surface border border-border rounded-lg p-4">
                <p className="text-sm text-text font-medium">{source.name}</p>
                <p className="text-xs text-muted mt-0.5">{source.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Limitations */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-text uppercase tracking-wider">Known Limitations</h2>
          <ul className="space-y-2 text-sm text-text/80">
            <li className="flex items-start gap-2">
              <span className="text-warning mt-0.5 shrink-0">*</span>
              <span>This demo uses illustrative sample data, not live measurements. Numbers are for demonstration only.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-warning mt-0.5 shrink-0">*</span>
              <span>Demand ratios are reasonable per-capita estimates, not empirically calibrated against actual NYC density.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-warning mt-0.5 shrink-0">*</span>
              <span>When the real data path is enabled, OpenStreetMap coverage varies and some businesses may be missing, especially in less-mapped areas.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-warning mt-0.5 shrink-0">*</span>
              <span>When the real data path is enabled, population is estimated from the nearest census tract(s). Where a radius spans multiple tracts, this is approximate.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-warning mt-0.5 shrink-0">*</span>
              <span>The model doesn't account for commuter foot traffic, subway proximity, or tourism. A Midtown location has different dynamics than the ratio alone suggests.</span>
            </li>
          </ul>
        </section>

        {/* Footer */}
        <div className="border-t border-border pt-6 pb-8">
          <p className="text-[10px] text-muted/50 text-center">
            Gap Finder NYC. Demo running on illustrative sample data. Map by Mapbox.
          </p>
        </div>
      </div>
    </div>
  )
}
