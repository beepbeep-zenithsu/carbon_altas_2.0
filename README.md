# Carbon Atlas 2.0

A carbon footprint calculator for garment factories. Version 2.0 keeps the same site, flow and design as the original, but every heading, subheading, emission factor and example now comes from three reference files:

| File | What it supplies |
| --- | --- |
| `Tarasima-Resources-Consumption.xlsx` | Fuel and energy column headings (Natural Gas, CNG, Diesel, Petrol/Octane, Biomass, Purchased electricity, Solar) and the 2023 / 2024 / 2025 example data |
| `Emission-Calculator.xlsx` | Scope 1 / Scope 2 structure, MJ-per-unit conversions and the 0.62 kgCO₂e/kWh electricity factor |
| `FEM-2024-Emission-Factor-Reference.xlsx` | kgCO₂e-per-MJ fuel factors, purchased steam / heating / chilled-water factors, refrigerant GWPs |

See [`docs/DATA_SOURCES.md`](docs/DATA_SOURCES.md) for the exact mapping and every factor used.

## What changed from 1.0

* All images were removed (category photos and the unused starter assets). The two background videos remain.
* The six modules are now: Stationary Combustion, Biomass & Waste Fuels, Mobile Combustion, Fugitive Emissions (Scope 1) and Purchased Electricity, Purchased Steam / Heat / Cooling (Scope 2). The old "Process Emissions" module was replaced by "Biomass & Waste Fuels" because the reference data has no process emission factors.
* 48 placeholder questions became 20 questions that map to real columns or factors.
* The sample factors were replaced with verified factors (`src/data/factors.json`).
* "Try an example" now offers Tarasima Apparels Ltd. annual totals for 2025, 2024 and 2023.
* The report has a new "Emission Factors Applied" table showing the factor and source behind every line.

## Getting Started

Prerequisites: Node.js 20+ and npm.

```bash
npm install --legacy-peer-deps
npm run dev      # development server
npm run build    # type-check + production build
npm test         # unit tests
```

`--legacy-peer-deps` is needed because of peer-dependency conflicts between React 19 and `@react-three/fiber`.

`vite.config.ts` sets `base: '/carbon-atlas/'` for GitHub Pages. Change it to match your repository name (or `'/'`) before deploying.

## Structure

* `src/domain/`: pure calculation, recommendation and action-plan logic (no React).
* `src/data/factors.json`: emission factors, with source text per factor.
* `src/data/activities.json`: the 20 activities and their units.
* `src/data/examples/tarasima.json`: the 2023–2025 example datasets.
* `src/features/`: assessment, landing, results and chatbot UI.
* `tests/`: unit tests, including checks against the spreadsheet values.
