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
      aria-live="polite"
      style={{
        position: 'fixed',
        top: 'max(52px, calc(48px + env(safe-area-inset-top)))',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 15,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 16px',
        borderRadius: 999,
        border: `1px solid ${tokens.borderAccent}`,
        background: tokens.modalBg,
        boxShadow: `0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px ${tokens.accentGlow}`,
        maxWidth: 'min(92vw, 360px)',
      }}
    >
      <span
        aria-hidden
        className="animate-shadow-presence"
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: tokens.crimson,
          flexShrink: 0,
          boxShadow: `0 0 8px ${tokens.accentGlow}`,
        }}
      />
      <p style={{ margin: 0, fontSize: 12, color: tokens.text, lineHeight: 1.45 }}>
        Offline — your logs stay safe on this device until you reconnect.
      </p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss offline notice"
        className="kage-touch-target"
        style={{
          margin: -8,
          border: 'none',
          background: 'transparent',
          color: tokens.textMuted,
          cursor: 'pointer',
          fontSize: 18,
        }}
      >
        ×
      </button>
    </div>
  )
}
