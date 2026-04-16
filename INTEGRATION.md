# Integration Guide — Roof Calculator Widget

## What You Get After Building

Running `npm run build:widget` produces the following output in `dist/`:

```
dist/
├── widget.js        # widget bundle (React + calculator), ~315 KB / ~78 KB gzip
├── widget.css       # widget styles
└── images/          # roof type and material images
    ├── roofs/
    └── materials/
```

---

## Embedding in a CMS (MODx, WordPress, Bitrix, etc.)

### Step 1 — Upload files to your server

Upload to your server (e.g. into `/assets/calc/`):
- `widget.js`
- `widget.css`
- the `images/` folder (with all its contents)

### Step 2 — Add to your page

In the `<head>` of your page, include the stylesheet:

```html
<link rel="stylesheet" href="/assets/calc/widget.css" />
```

Place the mount point where you want the calculator to appear:

```html
<div id="roof-calc"></div>
```

Before the closing `</body>` tag, include the script:

```html
<script src="/assets/calc/widget.js"></script>
```

### Full example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="stylesheet" href="/assets/calc/widget.css" />
</head>
<body>

  <!-- Your page content... -->

  <div id="roof-calc"></div>

  <script src="/assets/calc/widget.js"></script>
</body>
</html>
```

---

## Requirements

| Requirement | Value |
|---|---|
| React on the page | **Not required** — React is bundled inside `widget.js` |
| External dependencies | **None** — the widget is fully self-contained |
| Browsers | Chrome 80+, Firefox 75+, Safari 13+, Edge 80+ |
| Node.js on the server | **Not required** — static files only |

---

## Image Paths

The widget references images using absolute paths `/images/roofs/` and `/images/materials/`.
By default the images must be served from those paths on the same site:

```
https://your-site.com/images/roofs/single.png
https://your-site.com/images/roofs/double.png
...
```

If you need to host images elsewhere, update the paths in `src/data/roof-types.json`
and `src/data/materials.json` before rebuilding.

---

## Building from Source

```bash
# Install dependencies
npm install

# Development mode (hot reload)
npm run dev

# Build widget → dist/widget.js + dist/widget.css
npm run build:widget

# Standard SPA build (for local preview)
npm run build
```

---

## Testing the Integration Locally

After `npm run build:widget`, serve the `dist/` folder with any HTTP server:

```bash
cd dist && python3 -m http.server 8080
# open http://localhost:8080/widget-test.html
```

`widget-test.html` simulates a CMS page with its own styles to verify that the widget's styles don't leak into the surrounding page.
