import { useState } from 'react'
import { useTheme } from '../theme/useTheme'
import { useTracker } from '../context/trackerContext'
import { ThemeToggle } from './ThemeToggle'

interface SettingsPanelProps {
  open: boolean
  onClose: () => void
}

export function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const { tokens } = useTheme()
  const { exportData, resetDemoData } = useTracker()
  const [confirmReset, setConfirmReset] = useState(false)

  if (!open) return null

  const handleReset = async () => {
    if (!confirmReset) {
      setConfirmReset(true)
      return
    }
    await resetDemoData()
    setConfirmReset(false)
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
      className="animate-fade-in"
      style={{ position: 'fixed', inset: 0, zIndex: 90 }}
    >
      <button
        type="button"
        aria-label="Close settings"
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          border: 'none',
          background: tokens.modalBackdrop,
          cursor: 'pointer',
        }}
      />
      <div
        className="animate-modal-in"
        style={{
          position: 'absolute',
          top: 'max(56px, calc(48px + env(safe-area-inset-top)))',
          right: 12,
          width: 'min(92vw, 320px)',
          padding: '18px 16px',
          borderRadius: 12,
          border: `1px solid ${tokens.modalBorder}`,
          background: tokens.modalBg,
          boxShadow: tokens.modalShadow,
        }}
      >
        <p
          style={{
            margin: '0 0 14px',
            fontFamily: '"Orbitron", sans-serif',
            fontSize: 9,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: tokens.crimson,
          }}
        >
          Settings
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 14,
            minHeight: 48,
          }}
        >
          <span style={{ fontSize: 13, color: tokens.text }}>Theme</span>
          <ThemeToggle />
        </div>

        <button
          type="button"
          onClick={() => void exportData()}
          className="kage-touch-target"
          style={{
            width: '100%',
            minHeight: 48,
            marginBottom: 8,
            borderRadius: 8,
            border: `1px solid ${tokens.border}`,
            background: tokens.surfaceElevated,
            color: tokens.text,
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          Export JSON backup
        </button>

        <button
          type="button"
          onClick={() => void handleReset()}
          className="kage-touch-target"
          style={{
            width: '100%',
            minHeight: 48,
            borderRadius: 8,
            border: `1px solid ${confirmReset ? tokens.crimson : tokens.border}`,
            background: confirmReset ? tokens.bannerBg : 'transparent',
            color: confirmReset ? tokens.crimson : tokens.textMuted,
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          {confirmReset ? 'Tap again to reset demo data' : 'Reset to demo'}
        </button>
      </div>
    </div>
  )
}
