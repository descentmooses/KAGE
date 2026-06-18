import { createContext, useContext } from 'react'
import type { TrackerContextValue } from './trackerTypes'

export const TrackerContext = createContext<TrackerContextValue | null>(null)

export function useTracker() {
  const ctx = useContext(TrackerContext)
  if (!ctx) throw new Error('useTracker must be used within TrackerProvider')
  return ctx
}
