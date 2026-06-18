import { useTheme } from '../theme/useTheme'
import { useInstallPrompt } from '../hooks/useInstallPrompt'

export function InstallPrompt() {
  const { tokens } = useTheme()
  const { canInstall, promptInstall } = useInstallPrompt()

  if (!canInstall) return null

  return (
    <button
      type="button"
      onClick={() => void promptInstall()}
      className="kage-touch-target animate-fade-in"
      aria-label="Install KAGE as an app"
      style={{
        position: 'fixed',
        bottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        padding: '12px 22px',
        borderRadius: 999,
        border: `1px solid ${tokens.crimson}`,
        background: `linear-gradient(180deg, ${tokens.modalBg}, ${tokens.surfaceElevated})`,
        color: tokens.crimson,
        fontFamily: '"Orbitron", sans-serif',
        fontSize: 10,
        letterSpacing: '0.28em',
        cursor: 'pointer',
        boxShadow: `0 8px 28px rgba(0,0,0,0.3), 0 0 16px ${tokens.accentGlow}`,
      }}
    >
      INSTALL KAGE
    </button>
  )
}
