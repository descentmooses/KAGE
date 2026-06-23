import { useTheme } from '../../theme/useTheme'
import { useTracker } from '../../context/trackerContext'

export function DemoModeBanner() {
  const { tokens } = useTheme()
  const { settings } = useTracker()

  if (!settings.demoMode || !settings.tutorialComplete) return null

  return (
    <div
      style={{
        padding: '12px 14px',
        borderRadius: 10,
        border: `1px solid ${tokens.borderAccent}`,
        background: tokens.bannerBg,
        marginBottom: 16,
      }}
    >
      <p
        style={{
          margin: '0 0 4px',
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: 9,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: tokens.crimson,
        }}
      >
        Demo mode
      </p>
      <p style={{ margin: 0, fontSize: 12, lineHeight: 1.55, color: tokens.textMuted }}>
        Sample data only. When you are ready, open Settings → Start my archive for a clean slate.
      </p>
    </div>
  )
}
