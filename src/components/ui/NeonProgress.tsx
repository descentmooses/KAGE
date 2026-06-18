import type { CSSProperties } from 'react'
import { useTheme } from '../../theme/useTheme'

type NeonProgressVariant = 'xp' | 'growth' | 'neon'

interface NeonProgressProps {
  /** 0–100 */
  value: number
  variant?: NeonProgressVariant
  height?: number
  /** Used by `growth` variant for gradient fill color. */
  color?: string
  fillClassName?: string
  trackStyle?: CSSProperties
  'aria-label'?: string
}

/**
 * Theme-aware progress track. Variants match RankBadge XP bar and goal growth bars.
 */
export function NeonProgress({
  value,
  variant = 'neon',
  height = 6,
  color,
  fillClassName,
  trackStyle,
  'aria-label': ariaLabel,
}: NeonProgressProps) {
  const { tokens } = useTheme()
  const clamped = Math.min(100, Math.max(0, value))

  const track: CSSProperties = {
    height,
    borderRadius: variant === 'xp' ? 999 : 3,
    overflow: 'hidden',
    ...(variant === 'growth'
      ? { background: 'rgba(255,255,255,0.06)' }
      : { background: tokens.neonTrack }),
    ...trackStyle,
  }

  const fill: CSSProperties =
    variant === 'xp'
      ? {
          height: '100%',
          width: `${clamped}%`,
          background: tokens.xpGradient,
          transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }
      : variant === 'growth' && color
        ? {
            height: '100%',
            width: `${clamped}%`,
            borderRadius: 3,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: clamped >= 75 ? `0 0 12px ${color}55` : 'none',
            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }
        : {
            height: '100%',
            width: `${clamped}%`,
            background: tokens.neonFill,
            boxShadow: `0 0 10px ${tokens.accentGlow}`,
            transition: 'width 0.2s ease',
          }

  return (
    <div
      style={track}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
    >
      <div className={fillClassName} style={fill} />
    </div>
  )
}
