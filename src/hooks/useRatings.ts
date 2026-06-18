import { useCallback, useEffect, useState } from 'react'
import type { AreaId, Ratings } from '../types'

const STORAGE_KEY = 'kage-ratings'

const DEFAULT_RATINGS: Ratings = {
  mind: null,
  body: null,
  spirit: null,
}

function loadRatings(): Ratings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_RATINGS
    return { ...DEFAULT_RATINGS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_RATINGS
  }
}

export function useRatings() {
  const [ratings, setRatings] = useState<Ratings>(loadRatings)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings))
  }, [ratings])

  const logRating = useCallback((area: AreaId, value: number) => {
    setRatings((prev) => ({ ...prev, [area]: value }))
  }, [])

  return { ratings, logRating }
}
