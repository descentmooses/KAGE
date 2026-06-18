import { useTheme } from '../../theme/useTheme'
import { aggregateGoalGrowth } from '../../lib/goals'
import type { Goal } from '../../types'

interface SeedBonsaiProps {
  goals: Goal[]
  size?: number
}

export function SeedBonsai({ goals, size = 88 }: SeedBonsaiProps) {
  const { tokens } = useTheme()
  const growth = aggregateGoalGrowth(goals)
  const stage = growth === 0 ? 0 : growth < 25 ? 1 : growth < 50 ? 2 : growth < 75 ? 3 : 4
  const opacity = 0.35 + (growth / 100) * 0.65

  return (
    <div
      aria-hidden
      className={growth >= 50 ? 'animate-core-breathe' : undefined}
      style={{
        width: size,
        height: size,
        position: 'relative',
        flexShrink: 0,
      }}
    >
      <svg viewBox="0 0 80 80" width={size} height={size} style={{ opacity }}>
        {/* soil / kage shadow */}
        <ellipse cx="40" cy="68" rx="28" ry="8" fill="rgba(0,0,0,0.45)" />
        {/* pot */}
        <path
          d="M22 58 L26 72 L54 72 L58 58 Z"
          fill="none"
          stroke={tokens.border}
          strokeWidth="1.2"
        />
        {/* seed stage */}
        {stage === 0 && (
          <ellipse cx="40" cy="52" rx="6" ry="8" fill={tokens.crimson} opacity="0.5" />
        )}
        {/* sprout */}
        {stage >= 1 && (
          <>
            <path
              d="M40 58 Q38 44 40 32"
              fill="none"
              stroke={tokens.crimson}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {stage >= 2 && (
              <path
                d="M40 42 Q28 38 24 30 M40 38 Q52 34 56 26"
                fill="none"
                stroke={tokens.ember}
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            )}
            {stage >= 3 && (
              <>
                <circle cx="24" cy="28" r="3" fill={tokens.crimson} opacity="0.7" />
                <circle cx="56" cy="24" r="3" fill={tokens.ember} opacity="0.7" />
              </>
            )}
            {stage >= 4 && (
              <path
                d="M40 30 Q32 18 40 12 Q48 18 40 30"
                fill="none"
                stroke={tokens.gold}
                strokeWidth="1"
                opacity="0.85"
              />
            )}
          </>
        )}
      </svg>
      <span
        style={{
          position: 'absolute',
          bottom: -2,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: 8,
          letterSpacing: '0.1em',
          color: tokens.textSubtle,
        }}
      >
        {growth}%
      </span>
    </div>
  )
}
