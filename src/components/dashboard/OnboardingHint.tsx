import { useTheme } from '../../theme/useTheme'
import { useTracker } from '../../context/trackerContext'

export function OnboardingHint() {
  const { tokens } = useTheme()
  const { allLogs, settings, updateSettings } = useTracker()

  if (settings.hasOnboarded || allLogs.length > 0) return null

  return (
    <div
      style={{
        padding: '14px 16px',
        borderRadius: 10,
        border: `1px dashed ${tokens.borderAccent}`,
        background: tokens.bannerBg,
        marginBottom: 16,
      }}
    >
      <p
        style={{
          margin: '0 0 6px',
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: 9,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: tokens.crimson,
        }}
      >
        First shadow
      </p>
      <p style={{ margin: '0 0 10px', fontSize: 13, lineHeight: 1.55, color: tokens.text }}>
        Your first shadow log plants the seed. Tap a pillar to quick-log, or save a full entry when
        parked.
      </p>
      <button
        type="button"
        onClick={() => void updateSettings({ hasOnboarded: true })}
        className="kage-touch-target"
        style={{
          minHeight: 44,
          padding: '0 14px',
          borderRadius: 8,
          border: `1px solid ${tokens.border}`,
          background: 'transparent',
          color: tokens.textMuted,
          fontSize: 11,
          cursor: 'pointer',
        }}
      >
        Got it
      </button>
    </div>
  )
}
