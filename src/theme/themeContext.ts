import { createContext } from 'react'
import type { ThemeMode, ThemeTokens } from './tokens'

export interface ThemeContextValue {
  mode: ThemeMode
  tokens: ThemeTokens
  /** Neon glow + hero ambient layers — delayed when entering dark mode. */
  showDarkEffects: boolean
  toggleTheme: () => void
  setMode: (mode: ThemeMode) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
