import { useTheme } from '../../theme/useTheme'
import { useInstallPromptContext } from '../../context/installPromptContext'

/** Compact header affordance — manual install entry. */
export function InstallHeaderButton() {
  const { tokens } = useTheme()
  const { isStandalone, showInstallUI, openInstallInvite } = useInstallPromptContext()

  if (isStandalone || !showInstallUI) return null

  return (
    <button
      type="button"
      onClick={openInstallInvite}
      aria-label="Install KAGE on your device"
      title="Install KAGE"
      style={{
        minWidth: 44,
        minHeight: 44,
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        background: 'transparent',
        border: `1px solid ${tokens.border}`,
        borderRadius: 8,
        color: tokens.textMuted,
        cursor: 'pointer',
        padding: '0 8px',
      }}
    >
      <span style={{ fontSize: 13, lineHeight: 1 }} aria-hidden>
        ⬇
      </span>
      <span
        style={{
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: 6,
          letterSpacing: '0.06em',
        }}
      >
        INSTALL
      </span>
    </button>
  )
}
