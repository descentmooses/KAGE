import { useState } from 'react'
import { useTheme } from '../theme/useTheme'
import { useTracker } from '../context/trackerContext'
import { ThemeToggle } from './ThemeToggle'
import { useInstallPromptContext } from '../context/installPromptContext'
import { GitHubSyncSection } from '../features/sync/GitHubSyncSection'

interface SettingsPanelProps {
  open: boolean
  onClose: () => void
}

export function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const { tokens } = useTheme()
  const { exportData, resetDemoData } = useTracker()
  const { isStandalone, showInstallUI, openInstallInvite } = useInstallPromptContext()
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
          top: 'max(48px, env(safe-area-inset-top))',
          right: 0,
          bottom: 0,
          width: 'min(92vw, 360px)',
          padding: '20px 16px calc(24px + env(safe-area-inset-bottom))',
          borderRadius: '16px 0 0 16px',
          border: `1px solid ${tokens.modalBorder}`,
          borderRight: 'none',
          background: tokens.modalBg,
          boxShadow: tokens.modalShadow,
          overflowY: 'auto',
        }}
      >
        <p
          style={{
            margin: '0 0 18px',
            fontFamily: '"Orbitron", sans-serif',
            fontSize: 10,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: tokens.crimson,
          }}
        >
          Settings
        </p>

        <GitHubSyncSection />

        <section style={{ marginBottom: 18 }}>
          <p
            style={{
              margin: '0 0 10px',
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: 8,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: tokens.textMuted,
            }}
          >
            Profile
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: 48,
              padding: '0 4px',
            }}
          >
            <span style={{ fontSize: 13, color: tokens.text }}>Theme</span>
            <ThemeToggle />
          </div>
        </section>

        <section style={{ marginBottom: 18 }}>
          <p
            style={{
              margin: '0 0 10px',
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: 8,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: tokens.textMuted,
            }}
          >
            Data
          </p>
          <p style={{ margin: '0 0 12px', fontSize: 11, color: tokens.textMuted, lineHeight: 1.55 }}>
            Your shadow archive lives on this device first. Export anytime — import from Codex.
          </p>

          {!isStandalone && showInstallUI && (
            <button
              type="button"
              onClick={openInstallInvite}
              className="kage-touch-target"
              style={{
                width: '100%',
                minHeight: 48,
                marginBottom: 8,
                borderRadius: 8,
                border: `1px solid ${tokens.borderAccent}`,
                background: tokens.bannerBg,
                color: tokens.crimson,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              Install KAGE on home screen
            </button>
          )}

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
        </section>

        <p style={{ margin: 0, fontSize: 10, color: tokens.textMuted, lineHeight: 1.6 }}>
          Log only when parked. KAGE never uploads data unless you connect GitHub sync.
        </p>
      </div>
    </div>
  )
}
