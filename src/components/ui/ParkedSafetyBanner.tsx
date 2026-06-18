import { useTheme } from '../../theme/useTheme'

interface ParkedSafetyBannerProps {
  /** Short headline (defaults to standard safety copy). */
  title?: string
  /** Supporting line under the headline. */
  detail?: string
}

/** Shared parked-only safety notice for logging surfaces. */
export function ParkedSafetyBanner({
  title = 'Parked only — safety first',
  detail = 'Log only when safely parked. Never while driving or on Autopilot.',
}: ParkedSafetyBannerProps) {
  const { tokens } = useTheme()

  return (
    <div
      role="note"
      style={{
        marginBottom: 14,
        padding: '10px 12px',
        borderRadius: 10,
        border: `1px solid ${tokens.borderAccent}`,
        background: tokens.bannerBg,
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: 9,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: tokens.crimson,
        }}
      >
        {title}
      </p>
      <p style={{ margin: '4px 0 0', fontSize: 11, lineHeight: 1.45, color: tokens.textMuted }}>
        {detail}
      </p>
    </div>
  )
}
