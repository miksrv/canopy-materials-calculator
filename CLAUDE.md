# CLAUDE.md — Canopy Materials Calculator

Project-specific instructions for Claude Code. These override default behavior.

---

## Project Overview

Embeddable React/TypeScript widget that calculates roof materials (sheets, area, ridge length). Deployed as two static files: `dist/widget.js` + `dist/widget.css`. No server required. Integrates into any CMS via `<script>` + `<div id="roof-calc">`.

---

## Key Commands

```bash
npm run dev               # Vite dev server with HMR
npm run build             # TypeScript check + SPA build (for local preview)
npm run build:widget      # TypeScript check + widget IIFE build → dist/
npm run eslint:check      # ESLint (no fix)
npm run eslint:fix        # ESLint with auto-fix
npm run prettier:check    # Prettier dry run
npm run prettier:fix      # Prettier write
```

Testing the built widget locally:
```bash
npm run build:widget
cd dist && python3 -m http.server 8080
# open http://localhost:8080/widget-test.html
```

---

## Architecture

```
src/
├── widget.tsx             # IIFE entry — mounts <App/> into #roof-calc
├── App.tsx                # Root component, wraps everything in .rc-widget
├── data/                  # Static JSON (no backend needed)
│   ├── materials.json
│   ├── roof-types.json
│   ├── surface-types.json
│   ├── colors.json
│   ├── profiles.json
│   ├── coatings.json
│   └── thickness.json
├── engine/                # Pure calculation functions (no React)
│   ├── roof.ts
│   └── types.ts
├── components/
│   ├── RoofCalculator/    # Main form + results
│   ├── diagrams/          # Inline SVG diagrams (RoofSingleSlope, etc.)
│   └── ui/                # Atomic components
│       ├── ColorSwatch/
│       ├── NumberInput/
│       ├── OptionChip/
│       ├── RadioCard/
│       ├── ResultTable/
│       └── SelectDropdown/
└── styles/
    ├── global.css         # CSS Variables, typography (scoped to .rc-widget)
    └── widget.css         # Scoped reset — isolates widget from host page
```

**Widget isolation:** All styles are scoped to `.rc-widget *`. The reset in `widget.css` prevents host page styles from bleeding in. Do not add global `body` or `*` rules.

**Build config:** `vite.widget.config.ts` builds IIFE format. `process.env.NODE_ENV` must be replaced via `define` in that config — React requires it and IIFE bundles don't have it automatically.

---

## Code Conventions

### TypeScript
- Strict mode enabled via `tsconfig.app.json`
- Prefer `type` imports over `import type` at top level — use inline: `import Foo, { type Bar } from '...'`
- No `any` without a warning comment

### React
- Functional components only, explicit return type `React.JSX.Element`
- State setters for config selections (`selectedSurface`, `selectedColor`, etc.) go through `handleSelectionChange(setter, id)` — this marks results as stale
- Diagram animation: wrap diagram in `<div key={selectedRoofType}>` to force remount and trigger CSS `@keyframes`

### CSS
- CSS Modules for all component styles (`.module.css`)
- Equal-width tile grids: `grid-template-columns: repeat(auto-fill, minmax(155px, 1fr))`
- `OptionChip` must use `display: flex` (not `inline-flex`) so it stretches in grid cells
- Mobile breakpoints: ≤480px (mobile), ≤768px (tablet), ≥1280px (desktop)

### ESLint / Prettier
- `eqeqeq` with `null: 'never'` — use `!= null` / `== null` for null checks, not `!== null`
- `import/consistent-type-specifier-style: prefer-inline` — inline `type` in mixed imports
- Prettier: 4-space indent, no semicolons, single quotes, `singleAttributePerLine`, printWidth 120
- CSS, JSON, Markdown, and config files (`vite.*.ts`, `eslint.config.mjs`) are excluded from Prettier

---

## Important Patterns

### Calculation disabled state
```ts
const calcDisabled = hasFormErrors || !allSelectionsComplete
```
All five selections (surface, color, profile, coating, thickness) must be non-null before the calculate button enables.

### Null comparisons (eqeqeq rule)
```ts
// Correct
const hasErrors = values.some((e) => e != null)
const isComplete = selectedSurface != null && selectedColor != null

// Wrong — ESLint error
const hasErrors = values.some((e) => e !== null)
```

### Import style
```ts
// Correct — single import with inline type
import ResultTable, { type ResultRow } from '../ui/ResultTable/ResultTable'

// Wrong — two imports from same module (no-duplicate-imports)
import type { ResultRow } from '../ui/ResultTable/ResultTable'
import ResultTable from '../ui/ResultTable/ResultTable'
```

---

## Things to Avoid

- Do not add `process.env.NODE_ENV` checks in source — it's replaced at build time for the widget
- Do not use Shadow DOM — CSS isolation is done with `.rc-widget` scoping
- Do not split CSS per chunk (`cssCodeSplit: false` in widget config)
- Do not add fence calculator code — fence section was intentionally removed
- Do not touch `SelectTabs` component — it's unused and pending cleanup
- Do not use `emptyOutDir: true` for widget build without also copying `widget-test.html` back
