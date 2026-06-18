import type { ThemeTokens } from '../theme/tokens'
import type { AreaConfig } from '../types'

/** Pillar accent from theme tokens (crimson vs ember). */
export function pillarAccentColor(tokens: ThemeTokens, color: AreaConfig['color']): string {
  return color === 'ember' ? tokens.ember : tokens.crimson
}

/** Light haptic feedback for touch interactions; no-op when unsupported. */
export function tapHaptic(pattern: number | number[] = 12): void {
  try {
    navigator.vibrate?.(pattern)
  } catch {
    /* unsupported */
  }
}
