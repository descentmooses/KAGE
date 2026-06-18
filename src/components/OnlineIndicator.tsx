import { useEffect, useState } from 'react'
import { useTheme } from '../theme/useTheme'

export function OnlineIndicator() {
  const { tokens } = useTheme()
  const [online, setOnline] = useState(
    () => typeof navigator !== 'undefined' && navigator.onLine,
  )
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const onOnline = () => {
      setOnline(true)
      setDismissed(false)
    }
    const onOffline = () => {
      setOnline(false)
      setDismissed(false)
    }
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  if (online || dismissed) return null

  return (
    <div
      role="status"
      style={{
        position: 'fixed',
        top: 'max(52px, calc(48px + env(safe-area-inset-top)))',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 15,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 14px',
        borderRadius: 999,
        border: `1px solid ${tokens.crimson}`,
        background: tokens.modalBg,
        boxShadow: tokens.modalShadow,
        maxWidth: 'min(92vw, 360px)',
      }}
    >
      <span
        aria-hidden
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: tokens.crimson,
          flexShrink: 0,
        }}
      />
      <p style={{ margin: 0, fontSize: 11, color: tokens.text, lineHeight: 1.4 }}>
        Offline — logs save locally and sync when you reconnect.
      </p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss offline notice"
        style={{
          minWidth: 44,
          minHeight: 44,
          margin: -8,
          border: 'none',
          background: 'transparent',
          color: tokens.textMuted,
          cursor: 'pointer',
          fontSize: 16,
        }}
      >
        ×
      </button>
    </div>
  )
}
