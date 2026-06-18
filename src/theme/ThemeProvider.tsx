import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeContext } from './themeContext'
import { getTokens, type ThemeMode } from './tokens'

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
  const [mode, setModeState] = useState<ThemeMode>(readStoredTheme)

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setMode(mode === 'dark' ? 'light' : 'dark')
  }, [mode, setMode])

  const tokens = useMemo(() => getTokens(mode), [mode])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode)
    document.body.style.backgroundColor = tokens.bg
    document.body.style.color = tokens.text
  }, [mode, tokens])

  const value = useMemo(
    () => ({ mode, tokens, toggleTheme, setMode }),
    [mode, tokens, toggleTheme, setMode],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
