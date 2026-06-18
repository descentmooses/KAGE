import { useCallback, useState } from 'react'
import type { AreaId } from '../types'

export interface ReflectionLog {
  mind: number
  body: number
  spirit: number
  journal: string
  loggedAt: string
}

const STORAGE_KEY = 'kage-reflection-log'

function loadLog(): ReflectionLog | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function useReflectionLog() {
  const [lastLog, setLastLog] = useState<ReflectionLog | null>(loadLog)

  const saveReflection = useCallback(
    (ratings: Record<AreaId, number>, journal: string) => {
      const entry: ReflectionLog = {
        mind: ratings.mind,
        body: ratings.body,
        spirit: ratings.spirit,
        journal: journal.trim(),
        loggedAt: new Date().toISOString(),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entry))
      setLastLog(entry)
      return entry
    },
    [],
  )

  return { lastLog, saveReflection }
}
