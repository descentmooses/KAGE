import { useEffect } from 'react'
import { useTracker } from '../context/trackerContext'
import { useToast } from '../hooks/useToast'

/** Bridges TrackerProvider celebrations to ToastProvider (sibling-safe). */
export function CelebrationListener() {
  const { celebration, clearCelebration } = useTracker()
  const { showToast } = useToast()

  useEffect(() => {
    if (!celebration) return
    showToast(celebration.message, celebration.type === 'info' ? 'info' : 'success')
    clearCelebration()
  }, [celebration, clearCelebration, showToast])

  return null
}
