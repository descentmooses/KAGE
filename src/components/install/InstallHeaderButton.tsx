import { useTheme } from '../../theme/useTheme'
import { useInstallPromptContext } from '../../context/installPromptContext'
import { useToast } from '../../hooks/useToast'

/** Compact header affordance — manual install entry. */
export function InstallHeaderButton() {
  const { tokens } = useTheme()
  const { isStandalone, showInstallUI, hasNativePrompt, tryNativeInstall, openInstallInvite } =
    useInstallPromptContext()
  const { showToast } = useToast()

  if (isStandalone || !showInstallUI) return null

  const handleClick = async () => {
    if (hasNativePrompt) {
      const outcome = await tryNativeInstall()
      if (outcome === 'accepted') {
        showToast('KAGE is now in your app drawer. The path continues with you.', 'success')
      }
      return
    }
    openInstallInvite()
  }

  return (
    <button
      type="button"
      onClick={() => void handleClick()}
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
        background: hasNativePrompt ? tokens.bannerBg : 'transparent',
        border: `1px solid ${hasNativePrompt ? tokens.crimson : tokens.border}`,
        borderRadius: 8,
        color: hasNativePrompt ? tokens.crimson : tokens.textMuted,
        cursor: 'pointer',
        padding: '0 8px',
        boxShadow: hasNativePrompt ? `0 0 12px ${tokens.accentGlow}` : 'none',
      }}
    >
      <span style={{ fontSize: 13, lineHeight: 1 }} aria-hidden>
        {hasNativePrompt ? '⬇' : '⬇'}
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
