import { useEffect, useState } from 'react'
import { useTheme } from '../theme/useTheme'

/** Subtle online dot in header — green when online, amber when offline. */
export function ConnectionDot() {
  const { tokens } = useTheme()
  const [online, setOnline] = useState(
    () => typeof navigator !== 'undefined' && navigator.onLine,
  )

  useEffect(() => {
    const sync = () => setOnline(navigator.onLine)
    window.addEventListener('online', sync)
    window.addEventListener('offline', sync)
    return () => {
      window.removeEventListener('online', sync)
      window.removeEventListener('offline', sync)
    }
  }, [])

  return (
    <span
      title={online ? 'Online' : 'Offline — data saved locally'}
      aria-label={online ? 'Online' : 'Offline'}
      style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: online ? '#3d9970' : '#c9a227',
        boxShadow: online ? '0 0 6px rgba(61,153,112,0.5)' : '0 0 6px rgba(201,162,39,0.4)',
        flexShrink: 0,
        border: `1px solid ${tokens.border}`,
      }}
    />
  )
}
