import { useCallback, useEffect, useState } from 'react'

export interface MorningLog {
  energy: number
  intention: string
  discipline: string
  loggedAt: string
}

const STORAGE_KEY = 'kage-morning-log'

function loadLog(): MorningLog | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function useMorningLog() {
  const [lastLog, setLastLog] = useState<MorningLog | null>(loadLog)

  const saveMorning = useCallback((energy: number, intention: string, discipline: string) => {
    const entry: MorningLog = {
      energy,
      intention: intention.trim(),
      discipline: discipline.trim(),
      loggedAt: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entry))
    setLastLog(entry)
    return entry
  }, [])

  return { lastLog, saveMorning }
}

export function useConfirmMessage(durationMs = 3000) {
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!message) return
    const t = setTimeout(() => setMessage(null), durationMs)
    return () => clearTimeout(t)
  }, [message, durationMs])

  const show = useCallback((msg: string) => setMessage(msg), [])

  return { message, show }
}
