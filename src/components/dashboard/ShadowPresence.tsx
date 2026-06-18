import { useMemo } from 'react'
import { useTheme } from '../../theme/useTheme'
import { useTracker } from '../../context/trackerContext'
import { buildPillarHistory, shadowPresenceStrength } from '../../lib/pillarHistory'

export function ShadowPresence() {
  const { tokens } = useTheme()
  const { allLogs, gamification } = useTracker()

  const strength = useMemo(() => {
    const history = buildPillarHistory(allLogs)
    return shadowPresenceStrength(history, gamification.currentStreak)
  }, [allLogs, gamification.currentStreak])

  const size = 10 + strength * 10
  const opacity = 0.35 + strength * 0.55
  const glow = 4 + strength * 14

  return (
    <div
      role="img"
      aria-label={`Shadow presence ${Math.round(strength * 100)} percent`}
      title="Shadow presence grows with consistent logging"
      style={{
        position: 'relative',
        width: size + 8,
        height: size + 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <span
        className={strength >= 0.7 ? 'animate-shadow-presence' : undefined}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${tokens.crimson} 0%, ${tokens.deepCrimson} 70%)`,
          opacity,
          boxShadow: `0 0 ${glow}px ${tokens.accentGlow}`,
        }}
      />
      <span
        aria-hidden
        style={{
          position: 'absolute',
          fontFamily: '"Noto Sans JP", sans-serif',
          fontSize: 8,
          color: tokens.text,
          opacity: 0.85,
        }}
      >
        影
      </span>
    </div>
  )
}
