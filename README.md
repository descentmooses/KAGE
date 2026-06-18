# KAGE

Shadow mastery tracker — mind (心), body (体), spirit (魂). Built with React, Vite, TypeScript, and Tailwind CSS.

**Live:** https://descentmooses.github.io/KAGE/

## Features

- Crimson cyber-Japanese dark aesthetic (light mode available)
- IndexedDB daily logs, streaks, XP, and shadow ranks
- 7-day trend charts, insights, daily quests, freedom goals
- Morning activation + evening reflection
- Quick-log panel for one-handed / Tesla glances
- Elara whispers affirmations (toggleable)
- Installable PWA with offline support
- JSON export/import backup (privacy-first, no cloud required)

See [CHANGELOG.md](./CHANGELOG.md) for release notes.

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run lint
npm run preview
```

Production build uses base path `/KAGE/` for GitHub Pages.

## GitHub Pages

Pushes to `main` deploy automatically via GitHub Actions to the `gh-pages` branch.

1. [Repository Settings → Pages](https://github.com/descentmooses/KAGE/settings/pages)
2. Source: **Deploy from a branch** → `gh-pages` → `/ (root)`

### Post-merge deploy checklist

1. Merge the feature PR into `main` (or push directly to `main`).
2. Open **Actions** and wait for the `pages-build-deployment` workflow to finish green.
3. Visit https://descentmooses.github.io/KAGE/
4. Hard-refresh (`Ctrl+Shift+R` / `Cmd+Shift+R`) or open in a private tab.
5. If the UI still looks stale, append `?bust=<version>` (e.g. `?bust=0.5.0`) — `version.json` and `cacheBust.ts` reload when the deploy version changes.

After deploy, hard-refresh or open in a private tab if you still see an old version.

## PWA icons

```bash
node scripts/generate-icons.mjs
```

## Tech Stack

- React 19 · Vite 8 · TypeScript · Tailwind CSS 4
- IndexedDB (`idb`) · Recharts · vite-plugin-pwa
