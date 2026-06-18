import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeContext } from './themeContext'
import { getTokens, type ThemeMode } from './tokens'
import {
  DARK_EFFECTS_DELAY_MS,
  THEME_TRANSITION,
  prefersReducedMotion,
  withThemeTransition,
} from './transitions'

const STORAGE_KEY = 'kage-theme'

function readStoredTheme(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* ignore */
  }
  return 'dark'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const initialMode = readStoredTheme()
  const [mode, setModeState] = useState<ThemeMode>(initialMode)
  const [showDarkEffects, setShowDarkEffects] = useState(initialMode === 'dark')

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  const toggleTheme = useCallback(() => {
    const next = mode === 'dark' ? 'light' : 'dark'
    withThemeTransition(
      () => setMode(next),
      next === 'dark' ? 'to-dark' : 'to-light',
    )
  }, [mode, setMode])

  const tokens = useMemo(() => getTokens(mode), [mode])

  useEffect(() => {
    if (mode === 'light') {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync visual effect layer to theme mode
      setShowDarkEffects(false)
      return
    }

    if (prefersReducedMotion()) {
      setShowDarkEffects(true)
      return
    }

    setShowDarkEffects(false)
    const timer = window.setTimeout(() => setShowDarkEffects(true), DARK_EFFECTS_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [mode])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode)
    document.body.style.backgroundColor = tokens.surface
    document.body.style.color = tokens.text
    document.body.style.transition = THEME_TRANSITION

    const themeColor = document.querySelector('meta[name="theme-color"]')
    if (themeColor) {
      themeColor.setAttribute('content', mode === 'dark' ? '#050505' : '#faf8f6')
    }
  }, [mode, tokens])

  const value = useMemo(
    () => ({ mode, tokens, showDarkEffects, toggleTheme, setMode }),
    [mode, tokens, showDarkEffects, toggleTheme, setMode],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
