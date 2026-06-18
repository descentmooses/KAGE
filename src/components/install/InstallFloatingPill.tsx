import { useTheme } from '../../theme/useTheme'
import { useInstallPromptContext } from '../../context/installPromptContext'

/** Persistent install affordance above bottom nav — visible until dismissed or installed. */
export function InstallFloatingPill() {
  const { tokens } = useTheme()
  const { showInstallUI, pillVisible, open, openInstallInvite, dismissForSession } =
    useInstallPromptContext()

  if (!showInstallUI || !pillVisible || open) return null

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        bottom: 'calc(72px + env(safe-area-inset-bottom, 0px))',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 25,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        maxWidth: 'min(360px, calc(100% - 32px))',
      }}
    >
      <button
        type="button"
        onClick={openInstallInvite}
        className="kage-touch-target animate-shadow-presence"
        aria-label="Install KAGE on your home screen"
        style={{
          flex: 1,
          minHeight: 52,
          padding: '0 20px',
          borderRadius: 999,
          border: `1px solid ${tokens.crimson}`,
          background: `linear-gradient(180deg, ${tokens.modalBg}, ${tokens.surfaceElevated})`,
          color: tokens.crimson,
          fontFamily: '"Orbitron", sans-serif',
          fontSize: 10,
          letterSpacing: '0.22em',
          cursor: 'pointer',
          boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${tokens.accentGlow}`,
        }}
      >
        <span style={{ marginRight: 8, fontFamily: '"Noto Sans JP", sans-serif' }} aria-hidden>
          影
        </span>
        ADD TO HOME SCREEN
      </button>
      <button
        type="button"
        onClick={dismissForSession}
        aria-label="Dismiss install prompt for this session"
        className="kage-touch-target"
        style={{
          minWidth: 44,
          minHeight: 44,
          borderRadius: '50%',
          border: `1px solid ${tokens.border}`,
          background: tokens.modalBg,
          color: tokens.textMuted,
          fontSize: 16,
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        ×
      </button>
    </div>
  )
}
