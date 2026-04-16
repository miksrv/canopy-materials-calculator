import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

/**
 * Widget build — produces dist/widget.js + dist/widget.css.
 * React and all dependencies are bundled; no external dependencies required.
 * Usage: npm run build:widget
 */
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/widget.tsx'),
      name: 'RoofCalc',
      fileName: 'widget',
      formats: ['iife'],
    },
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      // Bundle everything including React — no external deps required on host page
      external: [],
      output: {
        entryFileNames: 'widget.js',
        assetFileNames: (asset) => {
          if (asset.names?.some((n) => n.endsWith('.css'))) return 'widget.css'
          return asset.names?.[0] ?? 'asset'
        },
      },
    },
  },
})
