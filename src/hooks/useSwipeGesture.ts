import { useCallback, useRef, type TouchEvent } from 'react'

interface SwipeGestureOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  threshold?: number
  maxVerticalDrift?: number
}

export function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  threshold = 56,
  maxVerticalDrift = 48,
}: SwipeGestureOptions) {
  const startRef = useRef<{ x: number; y: number } | null>(null)

  const onTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0]
    if (!touch) return
    startRef.current = { x: touch.clientX, y: touch.clientY }
  }, [])

  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      const start = startRef.current
      startRef.current = null
      if (!start) return

      const touch = e.changedTouches[0]
      if (!touch) return

      const dx = touch.clientX - start.x
      const dy = touch.clientY - start.y

      if (Math.abs(dy) > maxVerticalDrift) return
      if (Math.abs(dx) < threshold) return

      if (dx > 0) onSwipeRight?.()
      else onSwipeLeft?.()
    },
    [maxVerticalDrift, onSwipeLeft, onSwipeRight, threshold],
  )

  return { onTouchStart, onTouchEnd }
}
