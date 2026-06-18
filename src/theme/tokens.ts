export type ThemeMode = 'dark' | 'light'

/** Warm white for light-mode surfaces. */
export const LIGHT_WHITE = '#faf8f6'

/** Core palette — single source of truth for KAGE crimson standard. */
export const PALETTE = {
  void: '#050505',
  ink: '#0a0a0a',
  charcoal: '#121014',
  crimson: '#c41e3a',
  deepCrimson: '#8b1a2d',
  ember: '#e85d4c',
  gold: '#c9a227',
  warmWhite: '#f8f0f2',
  mist: '#9a9198',
} as const

export interface ThemeTokens {
  bg: string
  text: string
  textMuted: string
  textSubtle: string
  surface: string
  surfaceElevated: string
  border: string
  borderAccent: string
  crimson: string
  ember: string
  deepCrimson: string
  gold: string
  accentGlow: string
  coreGradient: string
  coreGlow: string
  dividerGradient: string
  neonFill: string
  neonTrack: string
  neonCap: string
  headerShadow: string
  navShadow: string
  navActiveBg: string
  modalBackdrop: string
  modalBg: string
  modalBorder: string
  modalShadow: string
  cardBg: string
  cardBorder: string
  cardShadow: string
  cardShadowAlt: string
  inputBg: string
  inputBorder: string
  inputFocusBorder: string
  inputFocusShadow: string
  btnGradient: string
  btnText: string
  btnShadow: string
  segmentSelected: string
  segmentUnselected: string
  segmentBorder: string
  segmentText: string
  segmentTextSelected: string
  bannerBg: string
  bannerBorder: string
  bannerText: string
  crtVignette: string
  crtScanline: string
  crtOpacity: number
  selectionBg: string
  selectionText: string
  toggleTrack: string
  toggleTrackActive: string
  toggleThumb: string
  toggleThumbLight: string
  toggleIcon: string
  xpGradient: string
  chartSpirit: string
  chartCore: string
  focusRing: string
}

export const darkTokens: ThemeTokens = {
  bg: PALETTE.void,
  text: PALETTE.warmWhite,
  textMuted: PALETTE.mist,
  textSubtle: 'rgba(248,240,242,0.45)',
  surface: PALETTE.ink,
  surfaceElevated: PALETTE.charcoal,
  border: 'rgba(248,240,242,0.08)',
  borderAccent: 'rgba(196,30,58,0.4)',
  crimson: PALETTE.crimson,
  ember: PALETTE.ember,
  deepCrimson: PALETTE.deepCrimson,
  gold: PALETTE.gold,
  accentGlow: 'rgba(196,30,58,0.35)',
  coreGradient: `linear-gradient(155deg, ${PALETTE.crimson} 0%, ${PALETTE.warmWhite} 42%, ${PALETTE.deepCrimson} 100%)`,
  coreGlow: 'none',
  dividerGradient: `linear-gradient(90deg, transparent, ${PALETTE.crimson}, ${PALETTE.deepCrimson}, transparent)`,
  neonFill: `linear-gradient(90deg, rgba(196,30,58,0.4) 0%, ${PALETTE.crimson} 65%, ${PALETTE.deepCrimson} 100%)`,
  neonTrack: 'rgba(248,240,242,0.06)',
  neonCap: PALETTE.warmWhite,
  headerShadow: '0 1px 0 rgba(248,240,242,0.04)',
  navShadow: '0 -1px 0 rgba(248,240,242,0.06)',
  navActiveBg: 'linear-gradient(180deg, rgba(196,30,58,0.12), transparent)',
  modalBackdrop: 'rgba(5,5,5,0.85)',
  modalBg: 'rgba(12,10,12,0.98)',
  modalBorder: 'rgba(196,30,58,0.28)',
  modalShadow: '0 16px 48px rgba(0,0,0,0.55)',
  cardBg: 'rgba(248,240,242,0.02)',
  cardBorder: 'rgba(248,240,242,0.08)',
  cardShadow: '0 4px 24px rgba(0,0,0,0.35)',
  cardShadowAlt: '0 4px 20px rgba(196,30,58,0.06)',
  inputBg: 'rgba(248,240,242,0.04)',
  inputBorder: 'rgba(248,240,242,0.1)',
  inputFocusBorder: PALETTE.crimson,
  inputFocusShadow: '0 0 0 1px rgba(196,30,58,0.35)',
  btnGradient: `linear-gradient(95deg, ${PALETTE.crimson}, ${PALETTE.deepCrimson})`,
  btnText: PALETTE.warmWhite,
  btnShadow: '0 4px 20px rgba(0,0,0,0.4)',
  segmentSelected: `linear-gradient(145deg, ${PALETTE.crimson}, ${PALETTE.deepCrimson})`,
  segmentUnselected: 'rgba(248,240,242,0.04)',
  segmentBorder: 'rgba(248,240,242,0.08)',
  segmentText: PALETTE.mist,
  segmentTextSelected: PALETTE.warmWhite,
  bannerBg: 'rgba(196,30,58,0.1)',
  bannerBorder: 'rgba(196,30,58,0.32)',
  bannerText: PALETTE.ember,
  crtVignette: 'radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,0.6) 100%)',
  crtScanline:
    'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(248,240,242,0.03) 2px, rgba(248,240,242,0.03) 4px)',
  crtOpacity: 1,
  selectionBg: 'rgba(196,30,58,0.25)',
  selectionText: PALETTE.ember,
  toggleTrack: 'rgba(248,240,242,0.08)',
  toggleTrackActive: 'rgba(196,30,58,0.15)',
  toggleThumb: `linear-gradient(145deg, ${PALETTE.crimson}, ${PALETTE.deepCrimson})`,
  toggleThumbLight: PALETTE.warmWhite,
  toggleIcon: PALETTE.warmWhite,
  xpGradient: `linear-gradient(90deg, ${PALETTE.crimson}, ${PALETTE.gold})`,
  chartSpirit: '#7a6e72',
  chartCore: 'rgba(248,240,242,0.35)',
  focusRing: 'rgba(196,30,58,0.5)',
}

export const lightTokens: ThemeTokens = {
  bg: LIGHT_WHITE,
  text: '#1a1416',
  textMuted: '#6e6568',
  textSubtle: 'rgba(26,20,22,0.45)',
  surface: LIGHT_WHITE,
  surfaceElevated: '#f3eeeb',
  border: 'rgba(26,20,22,0.1)',
  borderAccent: 'rgba(163,24,48,0.22)',
  crimson: '#a31830',
  ember: '#c44a3a',
  deepCrimson: '#7a1528',
  gold: '#a68b2a',
  accentGlow: 'rgba(163,24,48,0.2)',
  coreGradient: 'linear-gradient(155deg, #a31830 0%, #3a2a2e 48%, #7a1528 100%)',
  coreGlow: 'none',
  dividerGradient: 'linear-gradient(90deg, transparent, #a31830, #7a1528, transparent)',
  neonFill: 'linear-gradient(90deg, rgba(163,24,48,0.25) 0%, #a31830 70%, #7a1528 100%)',
  neonTrack: 'rgba(26,20,22,0.07)',
  neonCap: LIGHT_WHITE,
  headerShadow: '0 1px 0 rgba(26,20,22,0.06)',
  navShadow: '0 -1px 0 rgba(26,20,22,0.06)',
  navActiveBg: 'linear-gradient(180deg, rgba(163,24,48,0.08), transparent)',
  modalBackdrop: 'rgba(26,20,22,0.35)',
  modalBg: 'rgba(250,248,246,0.98)',
  modalBorder: 'rgba(163,24,48,0.18)',
  modalShadow: '0 12px 40px rgba(26,20,22,0.12)',
  cardBg: 'rgba(255,255,255,0.85)',
  cardBorder: 'rgba(26,20,22,0.08)',
  cardShadow: '0 4px 20px rgba(26,20,22,0.06)',
  cardShadowAlt: '0 4px 16px rgba(163,24,48,0.05)',
  inputBg: '#ffffff',
  inputBorder: 'rgba(26,20,22,0.12)',
  inputFocusBorder: '#a31830',
  inputFocusShadow: '0 0 0 2px rgba(163,24,48,0.15)',
  btnGradient: 'linear-gradient(95deg, #a31830, #7a1528)',
  btnText: '#ffffff',
  btnShadow: '0 4px 16px rgba(163,24,48,0.2)',
  segmentSelected: 'linear-gradient(145deg, #a31830, #7a1528)',
  segmentUnselected: 'rgba(26,20,22,0.04)',
  segmentBorder: 'rgba(26,20,22,0.1)',
  segmentText: '#6e6568',
  segmentTextSelected: '#ffffff',
  bannerBg: 'rgba(163,24,48,0.06)',
  bannerBorder: 'rgba(163,24,48,0.2)',
  bannerText: '#a31830',
  crtVignette: 'radial-gradient(ellipse at center, transparent 72%, rgba(26,20,22,0.03) 100%)',
  crtScanline:
    'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(26,20,22,0.02) 3px, rgba(26,20,22,0.02) 5px)',
  crtOpacity: 0,
  selectionBg: 'rgba(163,24,48,0.14)',
  selectionText: '#a31830',
  toggleTrack: 'rgba(26,20,22,0.08)',
  toggleTrackActive: 'rgba(163,24,48,0.12)',
  toggleThumb: 'linear-gradient(145deg, #a31830, #7a1528)',
  toggleThumbLight: '#faf8f6',
  toggleIcon: '#1a1416',
  xpGradient: 'linear-gradient(90deg, #a31830, #a68b2a)',
  chartSpirit: '#8a7e82',
  chartCore: 'rgba(26,20,22,0.35)',
  focusRing: 'rgba(163,24,48,0.4)',
}

export function getTokens(mode: ThemeMode): ThemeTokens {
  return mode === 'dark' ? darkTokens : lightTokens
}

/** Gradient string for hero/score text — theme-aware via tokens.coreGradient in components. */
export const SCORE_GRADIENT_DARK =
  'linear-gradient(155deg, #c41e3a 0%, #f8f0f2 42%, #8b1a2d 100%)'
export const SCORE_GRADIENT_LIGHT =
  'linear-gradient(155deg, #a31830 0%, #3a2a2e 48%, #7a1528 100%)'
