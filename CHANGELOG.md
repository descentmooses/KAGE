# Changelog

## [0.6.0] — 2026-06-18

### Elara Whispers · Freedom Goals · Visual elevation

- **Elara Whispers** — context-aware modal with companion whispers, context chips, whisper history; header ✦ trigger and banner “Open”
- **Freedom goals** — target dates, milestone steps, growth bars, seed/bonsai metaphor; goals influence quest hints and Elara tone
- **MBS balance radar** — compact Recharts radar for holistic triad view
- **Quick log** — larger touch targets, parked-only safety banner, pillar quick-tags, voice confirmation flow
- **Rituals** — guided dawn and evening ceremonies on Activate / Reflect screens
- **What's new** — v0.6.0 banner with acknowledge dismiss
- Export/import normalizes goal milestones; export format version 2

## [0.5.2] — 2026-06-18

### Home hero & chart

- Restored full-viewport `KageHeroLogo` hero — dashboard content appears only after scroll
- Moved trend chart out of collapsed section so Recharts renders reliably
- Explicit chart dimensions for ResponsiveContainer

## [0.5.1] — 2026-06-18

### Functional core — persistence, loop, quests, goals, Elara

- Fixed streak bug (first log of day now correctly increments streak)
- Quest day-boundary reset on refresh; tap-to-claim quests with XP toasts
- Level-up and rank-up celebration toasts
- Shadow log form with sliders + “Save Today’s Shadow” (parked section)
- Voice capture routes to shadow note field via `pendingVoiceNote`
- Period-aware trend chart (3 / 7 / 30 days)
- Goals: add/edit/delete modal, target field, grouped by pillar
- Elara “New whisper” button + whisper history in settings
- Settings gear panel: theme, export, reset demo data
- First-time onboarding hint; `clearAllData()` for demo reset

## [0.5.0] — 2026-06-18

### Irreplaceable companion polish

- **Driving-first Home** — compact header (core + shadow presence + streak), quick-log above the fold, collapsible “Deeper shadow” section
- **Swipe quick-log** — swipe right for a “good” score (7+), swipe left to open rating modal; lightweight touch hook (no extra deps)
- **Larger touch targets** — 56px minimum, 96px quick-log cards, enhanced press glow
- **Elara depth** — whispers use 7-day pillar history (steady/rising/soft pillars, mixed days, vision, poetic vs grounding tone)
- **Shadow presence** — orb grows with logging consistency and streak
- **Rank & streak moments** — gold rank-up flash, milestone aura tiers, XP surge animation
- **Actionable insights** — weekly shadow read on Home and Codex
- **PWA polish** — premium install pill and offline banner with crimson accent

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
