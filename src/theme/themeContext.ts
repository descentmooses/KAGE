import { createContext } from 'react'
import type { ThemeMode, ThemeTokens } from './tokens'

export interface ThemeContextValue {
  mode: ThemeMode
  tokens: ThemeTokens
  toggleTheme: () => void
  setMode: (mode: ThemeMode) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
