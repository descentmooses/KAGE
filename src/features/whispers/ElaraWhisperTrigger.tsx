import { useTheme } from '../../theme/useTheme'
import { useElara } from '../../context/elaraContext'
import { useTracker } from '../../context/trackerContext'

export function ElaraWhisperTrigger() {
  const { tokens } = useTheme()
  const { openElara } = useElara()
  const { settings } = useTracker()

  if (!settings.elaraWhispers) return null

  return (
    <button
      type="button"
      onClick={openElara}
      aria-label="Open Elara whispers"
      title="Whisper from Elara"
      className="animate-shadow-presence"
      style={{
        minWidth: 44,
        minHeight: 44,
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        background: tokens.bannerBg,
        border: `1px solid ${tokens.borderAccent}`,
        borderRadius: 8,
        color: tokens.crimson,
        cursor: 'pointer',
        padding: '0 8px',
        boxShadow: `0 0 12px ${tokens.accentGlow}`,
      }}
    >
      <span style={{ fontSize: 14, lineHeight: 1 }} aria-hidden>
        ✦
      </span>
      <span
        style={{
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: 6,
          letterSpacing: '0.06em',
        }}
      >
        ELARA
      </span>
    </button>
  )
}
