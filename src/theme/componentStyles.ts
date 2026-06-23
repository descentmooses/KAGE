import type { CSSProperties } from 'react'
import type { ThemeTokens } from './tokens'

export const FONTS = {
  orbitron: '"Orbitron", sans-serif',
  mono: '"Share Tech Mono", monospace',
  jp: '"Noto Sans JP", sans-serif',
} as const

/** Orbitron uppercase section label (e.g. "Freedom goals"). */
export function orbitronCaps(
  tokens: ThemeTokens,
  options?: { size?: number; spacing?: string; color?: string; margin?: string },
): CSSProperties {
  return {
    margin: options?.margin ?? '0 0 4px',
    fontFamily: FONTS.orbitron,
    fontSize: options?.size ?? 9,
    letterSpacing: options?.spacing ?? '0.35em',
    textTransform: 'uppercase',
    color: options?.color ?? tokens.textMuted,
  }
}

/** Share Tech Mono uppercase micro label. */
export function monoCaps(
  tokens: ThemeTokens,
  options?: { size?: number; spacing?: string; color?: string },
): CSSProperties {
  return {
    margin: 0,
    fontFamily: FONTS.mono,
    fontSize: options?.size ?? 9,
    letterSpacing: options?.spacing ?? '0.2em',
    textTransform: 'uppercase',
    color: options?.color ?? tokens.crimson,
  }
}

/** Standard elevated card surface used across home panels. */
export function cardSurface(tokens: ThemeTokens, overrides?: CSSProperties): CSSProperties {
  return {
    padding: '16px 14px',
    borderRadius: 12,
    border: `1px solid ${tokens.border}`,
    background: tokens.cardBg,
    boxShadow: tokens.cardShadow,
    ...overrides,
  }
}

/** Accent notice banner surface. */
export function bannerSurface(tokens: ThemeTokens, overrides?: CSSProperties): CSSProperties {
  return {
    marginBottom: 14,
    padding: '10px 12px',
    borderRadius: 10,
    border: `1px solid ${tokens.borderAccent}`,
    background: tokens.bannerBg,
    ...overrides,
  }
}
