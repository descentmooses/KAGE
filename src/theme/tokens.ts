export type ThemeMode = 'dark' | 'light'

/** Single white used for all light-mode surfaces (header, footer, content). */
export const LIGHT_WHITE = '#ffffff'

export interface ThemeTokens {
  bg: string
  text: string
  textMuted: string
  textSubtle: string
  surface: string
  surfaceElevated: string
  border: string
  borderAccent: string
  cyan: string
  magenta: string
  cyanGlow: string
  magentaGlow: string
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
  cardShadowCyan: string
  cardShadowMagenta: string
  inputBg: string
  inputBorder: string
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
  toggleThumb: string
  toggleIcon: string
}

export const darkTokens: ThemeTokens = {
  bg: '#0a0a0a',
  text: '#e8e8f0',
  textMuted: '#8a8a9a',
  textSubtle: 'rgba(255,255,255,0.45)',
  surface: 'rgba(10,10,10,0.97)',
  surfaceElevated: 'rgba(8,8,10,0.95)',
  border: 'rgba(255,255,255,0.08)',
  borderAccent: 'rgba(0,249,255,0.2)',
  cyan: '#00f9ff',
  magenta: '#ff00aa',
  cyanGlow: 'transparent',
  magentaGlow: 'rgba(255,0,170,0.4)',
  coreGradient: 'linear-gradient(155deg, #00f9ff 0%, #eef0f8 40%, #ff00aa 100%)',
  coreGlow: 'none',
  dividerGradient: 'linear-gradient(90deg, transparent, #00f9ff, #ff00aa, transparent)',
  neonFill: 'linear-gradient(90deg, rgba(0,249,255,0.5) 0%, #00f9ff 70%, #ff00aa 100%)',
  neonTrack: 'rgba(255,255,255,0.06)',
  neonCap: '#ffffff',
  headerShadow: '0 1px 20px rgba(0,0,0,0.35)',
  navShadow: '0 -4px 24px rgba(0,0,0,0.5)',
  navActiveBg: 'linear-gradient(180deg, rgba(0,249,255,0.12), transparent)',
  modalBackdrop: 'rgba(0,0,0,0.8)',
  modalBg: 'rgba(8,8,10,0.95)',
  modalBorder: 'rgba(0,249,255,0.2)',
  modalShadow: '0 8px 40px rgba(0,0,0,0.45)',
  cardBg: 'rgba(255,255,255,0.02)',
  cardBorder: 'rgba(255,255,255,0.08)',
  cardShadowCyan: 'none',
  cardShadowMagenta: '0 0 16px rgba(255,0,170,0.06)',
  inputBg: 'rgba(255,255,255,0.04)',
  inputBorder: 'rgba(255,255,255,0.1)',
  inputFocusShadow: '0 0 0 1px rgba(255,255,255,0.12)',
  btnGradient: 'linear-gradient(95deg, #00f9ff, #ff00aa)',
  btnText: '#0a0a0a',
  btnShadow: '0 4px 20px rgba(0,0,0,0.35)',
  segmentSelected: 'linear-gradient(145deg, #00f9ff, #ff00aa)',
  segmentUnselected: 'rgba(255,255,255,0.04)',
  segmentBorder: 'rgba(255,255,255,0.08)',
  segmentText: '#8a8a9a',
  segmentTextSelected: '#0a0a0a',
  bannerBg: 'rgba(0,249,255,0.08)',
  bannerBorder: 'rgba(0,249,255,0.35)',
  bannerText: '#00f9ff',
  crtVignette: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)',
  crtScanline:
    'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.04) 2px, rgba(255,255,255,0.04) 4px)',
  crtOpacity: 1,
  selectionBg: 'rgba(0,249,255,0.2)',
  selectionText: '#00f9ff',
  toggleTrack: 'rgba(255,255,255,0.08)',
  toggleThumb: 'linear-gradient(145deg, #00f9ff, #ff00aa)',
  toggleIcon: '#e8e8f0',
}

export const lightTokens: ThemeTokens = {
  bg: LIGHT_WHITE,
  text: '#1c1c24',
  textMuted: '#6a6878',
  textSubtle: 'rgba(28,28,36,0.45)',
  surface: LIGHT_WHITE,
  surfaceElevated: LIGHT_WHITE,
  border: 'rgba(28,28,36,0.1)',
  borderAccent: 'rgba(0,152,168,0.25)',
  cyan: '#0098a8',
  magenta: '#c4007a',
  cyanGlow: 'rgba(0,152,168,0.35)',
  magentaGlow: 'rgba(196,0,122,0.25)',
  coreGradient: 'linear-gradient(155deg, #0098a8 0%, #2a2a32 45%, #c4007a 100%)',
  coreGlow:
    'drop-shadow(0 0 20px rgba(0,152,168,0.35)) drop-shadow(0 0 40px rgba(196,0,122,0.2))',
  dividerGradient: 'linear-gradient(90deg, transparent, #0098a8, #c4007a, transparent)',
  neonFill: 'linear-gradient(90deg, rgba(0,152,168,0.35) 0%, #0098a8 70%, #c4007a 100%)',
  neonTrack: 'rgba(28,28,36,0.08)',
  neonCap: LIGHT_WHITE,
  headerShadow: '0 1px 16px rgba(0,152,168,0.08)',
  navShadow: '0 0 24px rgba(28,28,36,0.06)',
  navActiveBg: 'linear-gradient(180deg, rgba(0,152,168,0.1), transparent)',
  modalBackdrop: 'rgba(28,28,36,0.35)',
  modalBg: 'rgba(255,255,255,0.97)',
  modalBorder: 'rgba(0,152,168,0.2)',
  modalShadow: '0 8px 40px rgba(28,28,36,0.12), 0 0 24px rgba(0,152,168,0.08)',
  cardBg: 'rgba(255,255,255,0.7)',
  cardBorder: 'rgba(28,28,36,0.08)',
  cardShadowCyan: '0 2px 16px rgba(0,152,168,0.08)',
  cardShadowMagenta: '0 2px 16px rgba(196,0,122,0.06)',
  inputBg: 'rgba(255,255,255,0.9)',
  inputBorder: 'rgba(28,28,36,0.12)',
  inputFocusShadow: '0 0 12px rgba(0,152,168,0.15)',
  btnGradient: 'linear-gradient(95deg, #0098a8, #c4007a)',
  btnText: '#ffffff',
  btnShadow: '0 4px 20px rgba(0,152,168,0.25)',
  segmentSelected: 'linear-gradient(145deg, #0098a8, #c4007a)',
  segmentUnselected: 'rgba(28,28,36,0.04)',
  segmentBorder: 'rgba(28,28,36,0.1)',
  segmentText: '#6a6878',
  segmentTextSelected: '#ffffff',
  bannerBg: 'rgba(0,152,168,0.08)',
  bannerBorder: 'rgba(0,152,168,0.25)',
  bannerText: '#0098a8',
  crtVignette: 'radial-gradient(ellipse at center, transparent 70%, rgba(28,28,36,0.04) 100%)',
  crtScanline:
    'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,152,168,0.04) 3px, rgba(0,152,168,0.04) 5px)',
  crtOpacity: 0,
  selectionBg: 'rgba(0,152,168,0.15)',
  selectionText: '#0098a8',
  toggleTrack: 'rgba(28,28,36,0.08)',
  toggleThumb: 'linear-gradient(145deg, #0098a8, #c4007a)',
  toggleIcon: '#1c1c24',
}

export function getTokens(mode: ThemeMode): ThemeTokens {
  return mode === 'dark' ? darkTokens : lightTokens
}
