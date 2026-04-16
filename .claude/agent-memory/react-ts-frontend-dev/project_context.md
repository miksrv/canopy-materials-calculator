---
name: Project context
description: Stack, architecture, sections, formulas, reference UI for the canopy-materials-calculator project
type: project
---

Embeddable React/TypeScript widget for calculating roofing and fence materials.

**Stack:** React 18 + TypeScript 5, Vite (dev mode on port 3000), CSS Modules, no UI libraries.

**Sections:**
- Кровля (5 types: single, double, mansard, hip, pyramid)
- Заборы (3 types: corrugated, picket, louvre) — stub in App.tsx, engine in fence.ts

**Key data files:**
- `src/data/materials.json` — proflist / metalltile / falc with X / X1 in mm
- `src/data/roof-types.json` — id, label, params list
- `src/data/fence-types.json`

**Calculation engine:**
- `src/engine/roof.ts` — `calcRoof(typeId, params, material)` dispatcher
- `src/engine/fence.ts` — individual fence calc functions

**UI components:**
- `RadioCard` — selectable card (image + label)
- `NumberInput` — number input with colored param badge + unit suffix
- `SelectTabs` — horizontal tab switcher
- `ResultTable` — two-column results display

**SVG diagrams** in `src/components/diagrams/` — one per roof type, `activeParam` prop highlights the focused dimension in orange (#f57c00).

**Reference images** downloaded from calcroof.metallprofil.ru into `public/images/roofs/` and `public/images/materials/`.

**Why:** Widget for a metal roofing company, intended for future embedding in CMS (MODx) via `dist/widget.js`. Phase 7 (lib mode build) not yet done.
