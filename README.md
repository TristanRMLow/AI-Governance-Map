# AI Governance Map

An interactive world map of AI governance: policy, regulation, key institutions, companies, and
research ecosystems for 20 jurisdictions, plus a Compare tool for side-by-side analysis.

Each jurisdiction's data lives in `data/countries/{code}.json`, structured per `lib/types.ts`'s
`CountryData` interface — overview, current policy direction, recent developments, companies,
government institutions, key people, sources, and explicitly flagged `notableGaps` where the
picture is genuinely incomplete rather than silently thin. Content is written in deliberately
hedged, evidence-based language rather than sweeping claims — see the source-weighting note on
each country page.

## Getting started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Data integrity

```bash
npm run validate-data
```

Runs cheap sanity checks over every file in `data/countries/` — dangling source-ID references,
malformed URLs, out-of-range `cloudInfrastructure.dominance` shares, missing required fields.
This doesn't check factual accuracy, only structural integrity; `npm run build`'s TypeScript pass
catches shape mismatches on top of this.

## Structure

- `app/` — Next.js App Router pages (`/`, `/country/[code]`, `/compare`, `/compare/[slug]`)
- `data/countries/` — one JSON file per jurisdiction
- `data/comparisons/` — hand-curated Compare pairs; any other 2-3 country combination falls back
  to `lib/buildDynamicComparison.ts`, which assembles a comparison from each country's own data
- `components/country/`, `components/compare/` — page sections
- `lib/types.ts` — the `CountryData` and `ComparisonData` schemas
