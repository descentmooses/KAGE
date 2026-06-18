import { useTheme } from '../../theme/useTheme'
import { monoCaps, bannerSurface } from '../../theme/componentStyles'

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
    <div role="note" style={bannerSurface(tokens)}>
      <p style={monoCaps(tokens)}>{title}</p>
      <p style={{ margin: '4px 0 0', fontSize: 11, lineHeight: 1.45, color: tokens.textMuted }}>
        {detail}
      </p>
    </div>
  )
}
