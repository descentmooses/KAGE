# Kage

Retro minimalist cyberpunk samurai PWA built with React, Vite, TypeScript, and Tailwind CSS.

## Features

- Dark void-black aesthetic with neon cyan and magenta accents
- Subtle CRT scanline overlay and vignette effects
- Japanese-inspired minimal UI with kanji typography
- Installable PWA with service worker and web manifest

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
npm run preview
```

## PWA

The app registers a service worker and includes a web manifest for installability on supported devices. Icons are generated from `public/icons/icon.svg`:

```bash
node scripts/generate-icons.mjs
```

## Tech Stack

- React 19
- Vite 8
- TypeScript
- Tailwind CSS 4
- vite-plugin-pwa
