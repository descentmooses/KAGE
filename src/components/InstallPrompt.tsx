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
      className="kage-touch-target"
      aria-label="Install KAGE as an app"
      style={{
        position: 'fixed',
        bottom: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        padding: '10px 18px',
        borderRadius: 999,
        border: `1px solid ${tokens.crimson}`,
        background: tokens.modalBg,
        color: tokens.crimson,
        fontFamily: '"Orbitron", sans-serif',
        fontSize: 9,
        letterSpacing: '0.25em',
        cursor: 'pointer',
        boxShadow: tokens.modalShadow,
      }}
    >
      INSTALL KAGE
    </button>
  )
}
