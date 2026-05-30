# Gap Finder NYC: Audience Pass Suggestions

Last refreshed: 2026-05-30. Builds on the prior honesty and design pass (commit dd61014).

## The evangelist

Maya, an aspiring first-time small-business owner in her early 30s who reads r/smallbusiness, r/Entrepreneur, and r/nyc, and lurks in local-business Discords. She is trying to decide where to open a coffee shop, laundromat, pilates studio, or daycare and has no money for a CoStar or Placer.ai subscription. Today she eyeballs Google Maps, counts competitors by hand, and asks Reddit "is Astoria saturated for coffee." What makes her screenshot Gap Finder is one punchy line she can paste into a thread: "Bed-Stuy has 2 laundromats where the population supports 12." That single sentence is the product. What makes her bounce in 5 seconds: a report that looks authoritative but turns out to be made up (she would feel tricked and never share it), a blank map because the Mapbox token is missing, or a wall of small ranked rows with no obvious headline takeaway.

## Ground truth (repo HEAD, verified)

Working and honest. Evidence:

- Honesty fix from the prior pass is present and solid in HEAD. `DemoBanner.jsx` renders an unmissable "Illustrative demo data. These are not real Census or OpenStreetMap measurements. Do not use this for a real lease or business decision." banner on the homepage (`HomePage.jsx` line 42) and on every report (`ReportPage.jsx` line 169).
- No false authoritative sourcing in user-facing copy. `ReportPage.jsx` footer reads "Illustrative sample data, not live Census or OpenStreetMap." The data toggle in `dataService.js` is `USE_MOCK_DATA = true` and is honest about it.
- Real APIs are stubbed and ready, not falsely claimed: `census.js` and `overpass.js` exist and are dynamically imported only when the toggle flips. The mock layer (`mockData.js`) drives current numbers.
- Gap math is real, not random. `gapAnalysis.js` computes existing vs expected from a population/ratio demand model (`demandModel.js`), sorts by saturation, and the prior pass recalibrated the 20 ratios so results are plausible. No pseudo-random score generator in the user path.
- No hardcoded secret in the client bundle. Mapbox token comes from `import.meta.env.VITE_MAPBOX_TOKEN`; grep of `dist/` found no `pk.` token. `MapView.jsx` shows a graceful "Add VITE_MAPBOX_TOKEN" fallback when absent.
- Build passes clean (`npm run build`, Vite 8).

Note, not a code bug: `mockData.js` line 3 has an internal comment "Source patterns: Census ACS 2022 estimates." It is a developer comment, not user-facing, and the loud on-screen disclaimer covers it. Left as is.

Deploy status: the prior honesty fix was committed and pushed but never deployed. The live URL at gap-finder-nyc.vercel.app is a client-rendered SPA, so the static shell does not reveal the disclaimer either way. Treat the live build as possibly stale versus HEAD. This needs a deploy, not a re-fix. See flags.

## Prioritized plan

### Quick wins

1. DONE THIS PASS. Hero opportunity card on the report. New `HeroGap.jsx`, wired into `ReportPage.jsx` above `GapRanking`. Shows the single biggest gap as a headline ("Biggest opportunity in Williamsburg: Laundromat, only 2 where the population supports 12, a gap of 10") with a category-tinted saturation meter and a "See it on the map" button. Why it matters to Maya: this is the screenshot. It turns a ranked table into one shareable sentence. Effort S. No deploy needed to verify logic, but needs deploy to go live.

2. Recolor the competitive map markers by opportunity. In `CompetitiveMap.jsx`, tint the radius fill and the gap callout using the top gap's `DISPLAY_CATEGORIES` color (already imported pattern exists in `GapRanking`). Why: visually ties the headline gap to the map. Effort S. Deploy to verify visually.

3. Slug deep links and a copyable share string. `ReportPage.handleShare` already builds a `/report?lat=&lng=&r=` URL and `vercel.json` rewrites deep links to index.html. Add a small "Copied" toast on the clipboard fallback (currently silent, see the `// Could add a toast here` TODO at line 117). Why: Maya needs confidence the link copied before she pastes it into Reddit. Effort S. No deploy needed to verify.

4. Show the headline gap in the document title. Set `document.title` to "Gap Finder: {neighborhood}, {topGap.label}" in `ReportPage` once analysis completes. Why: better browser tab and link-preview text when shared. Effort S. Deploy to verify.

### Bigger bets

5. Dynamic Open Graph image per report. Current `index.html` points all shares at a single static `/og.png`. A per-report OG card showing the neighborhood and headline gap would make every shared link look bespoke. Needs a serverless OG route (for example a Vercel `@vercel/og` function) since this is a static SPA today. Effort M to L. Deploy required.

6. Wire real Census plus Overpass (the headline credibility bet). Flip `USE_MOCK_DATA` to false and harden `census.js` and `overpass.js`. Risks already noted in the prior pass: client-side Overpass hits CORS and 406/User-Agent issues, same class as the Random Pin app. Mitigation: route both through a thin serverless proxy. When this lands, the `DemoBanner` comes down and the footer claim becomes true. Effort L. Deploy required. This is what turns a demo into a tool Maya would actually trust for a lease decision.

7. Code-split the bundle. The single JS chunk is about 2.1 MB (586 kB gzip), mostly mapbox-gl plus motion. Lazy-load the report and compare routes. Why: faster first paint on the homepage map, lower bounce. Effort M. Deploy to verify.

## Flags

- DEPLOY NEEDED: the prior honesty fix and this pass's hero card live only in the repo. They must be deployed for the live site to be honest and improved.
