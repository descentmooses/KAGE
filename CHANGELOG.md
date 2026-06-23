# Changelog

## [0.7.1] — 2026-06-18

### Universal defaults & Elara voice

- Mind / Body / Spirit default to **0** until you log (no phantom 7s)
- Elara shows **welcome** whispers before your first log today — not low-energy messaging
- Driving-themed copy only appears when **you** mention driving in logs or rituals
- Rituals, goals, and insights use universal language by default

## [0.7.0] — 2026-06-22

### GitHub Shadow Vault (free private sync)

- Optional **GitHub sync** — your data in a private repo you control (`kage-shadow-vault`)
- Personal access token (classic) with `repo` scope; token stored only in browser IndexedDB
- Auto-sync on saves (debounced) + manual Sync Now / Pull from GitHub
- First-log bottom sheet invites GitHub connect after your first shadow entry
- Expanded Settings panel with GitHub Sync section and header sync status dot
- Timestamp-based merge for cross-device logs, goals, and gamification

### Polish

- Quick log **SEALED** confirmation flash on tap/swipe
- Elara whispers: gentle **body-low** movement suggestions
- MBS radar chart refinements
- Settings drawer layout (profile, sync, data)

## [0.6.3] — 2026-06-18

### Android WebAPK install fix

- Manifest uses absolute `https://descentmooses.github.io/KAGE/` URLs for `id`, `scope`, `start_url`, and icons
- Service worker registers inline (before app bundle) for Chrome installability
- Manifest served as `manifest.json`; PNG favicons for shortcut icons
- Native `beforeinstallprompt` opens one-tap **Install KAGE** sheet (real app drawer install)
- Android guidance warns against .io bookmark files vs **Install app**

## [0.6.2] — 2026-06-18

### Install prompt visibility fix

- Install UI no longer requires `beforeinstallprompt` or iOS Safari to appear
- Floating **Add to Home Screen** pill surfaces within 6s on all non-standalone visits
- Platform-specific install steps for iOS (all browsers), Android Chrome, and desktop
- Shadow log triggers install invite; header Install button always visible when not installed

## [0.6.1] — 2026-06-18

### PWA installability & install invitation

- Hardened `vite-plugin-pwa` manifest for `/KAGE/` base: `id`, `scope`, `start_url`, maskable icon, screenshots
- Fixed duplicate/wrong manifest link in `index.html`; enriched iOS meta tags and apple-touch-icon sizes
- Once-per-session **Install invite** bottom sheet (Android `beforeinstallprompt` + iOS Safari steps)
- Triggers after first shadow log or ~50s on return visits; header/settings manual install affordance
- Quick-log haptics, Elara whisper favorites, streak/core milestone celebrations

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
