import { useTheme } from '../../theme/useTheme'
import { NeonButton } from '../../components/ui/NeonButton'
import { useGitHubSync } from '../../context/githubSyncContext'

interface GitHubFirstLogSheetProps {
  open: boolean
  onMaybeLater: () => void
  onConnectClick: () => void
}

/** Shown once after the user's first shadow log — invites GitHub sync. */
export function GitHubFirstLogSheet({
  open,
  onMaybeLater,
  onConnectClick,
}: GitHubFirstLogSheetProps) {
  const { tokens } = useTheme()
  const { openConnect } = useGitHubSync()

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sync your shadow journey"
      className="animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 120,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      <button
        type="button"
        aria-label="Dismiss"
        onClick={onMaybeLater}
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
          position: 'relative',
          width: '100%',
          maxWidth: 480,
          padding: '24px 20px calc(24px + env(safe-area-inset-bottom))',
          borderRadius: '20px 20px 0 0',
          border: `1px solid ${tokens.modalBorder}`,
          borderBottom: 'none',
          background: `linear-gradient(180deg, ${tokens.modalBg}, ${tokens.surfaceElevated})`,
          boxShadow: tokens.modalShadow,
        }}
      >
        <p
          style={{
            margin: '0 0 8px',
            fontFamily: '"Noto Sans JP", sans-serif',
            fontSize: 28,
            color: tokens.crimson,
            opacity: 0.9,
          }}
          aria-hidden
        >
          影
        </p>
        <p
          style={{
            margin: '0 0 12px',
            fontFamily: '"Orbitron", sans-serif',
            fontSize: 11,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: tokens.crimson,
          }}
        >
          First shadow sealed
        </p>
        <p style={{ margin: '0 0 20px', fontSize: 14, lineHeight: 1.65, color: tokens.text }}>
          Your first shadow entry is now safe on this device.
          <br />
          <br />
          To keep your entire journey synced across phone, desktop, and Tesla browser — completely
          free and 100% private in a repository only you control — connect your GitHub account.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <NeonButton
            onClick={() => {
              onConnectClick()
              openConnect()
            }}
          >
            Connect GitHub (recommended)
          </NeonButton>
          <button
            type="button"
            onClick={onMaybeLater}
            style={{
              width: '100%',
              padding: '12px 0',
              border: `1px solid ${tokens.border}`,
              borderRadius: 2,
              background: 'transparent',
              color: tokens.textMuted,
              fontFamily: '"Orbitron", sans-serif',
              fontSize: 9,
              letterSpacing: '0.35em',
              cursor: 'pointer',
            }}
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
