# Changelog

## [0.4.0] — 2026-06-18

### Crimson standard — full palette unification

- Eliminated all remaining cyan/magenta tokens, CSS vars, glows, and icon colors
- `tokens.ts` is now the single source of truth: void `#050505`, crimson `#c41e3a`, ember `#e85d4c`, gold `#c9a227`
- Refreshed light/dark mode toggle with crimson track and warm thumb styling
- Home and Codex screens polished as palette showcases — refined cards, rank list, protocol layout
- Contextual Elara whispers tied to time of day, streaks, core score, and weak pillars
- Quick-log press feedback, larger touch targets, XP gold gradient, streak milestone glow
- Recharts trend lines use theme tokens with staggered animations
- Global `:focus-visible` ring, `prefers-reduced-motion` respected
- PWA icons updated to crimson cyber-Japanese standard

## [0.3.1] — 2026-06-18

### Polish for daily mobile use

- Loading spinner while IndexedDB archive opens on app start
- Error boundary around the app with reload fallback
- Load-error screen with retry if database bootstrap fails
- Offline banner + header connection dot (online/offline)
- Toast feedback for export, import, and voice capture
- Voice input: “PARKED” label, tooltips, and Codex safety copy
- Cache bust only on deploy version change (preserves PWA offline cache)
- `version.json` now includes `appVersion` for clearer update checks
- Larger touch targets for quick-log, nav, and header actions (Tesla/phone)
- `viewport-fit=cover` for notched devices

## [0.3.0] — 2026-06-18

### Shadow mastery tracker expansion

- IndexedDB persistence with localStorage migration
- Unified daily logging (home + evening reflection)
- 7-day trend charts, insights, streaks, daily quests
- XP, levels, shadow ranks (Initiate → Kage)
- Freedom goals, Elara whispers, affirmations
- Quick-log driving mode, PWA manifest + service worker
- Crimson cyber-Japanese visual refresh
- JSON export/import backup

## [0.2.0] and earlier

- Theme toggle, hero logo, light/dark polish, GitHub Pages deploy
