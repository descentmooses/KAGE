import { useMemo } from 'react'
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'
import { useTheme } from '../../theme/useTheme'
import { useTracker } from '../../context/trackerContext'

export function BalanceRadar() {
  const { tokens } = useTheme()
  const { ratings } = useTracker()

  const data = useMemo(
    () => [
      { pillar: '心 Mind', value: ratings.mind, fullMark: 10 },
      { pillar: '体 Body', value: ratings.body, fullMark: 10 },
      { pillar: '魂 Spirit', value: ratings.spirit, fullMark: 10 },
    ],
    [ratings],
  )

  const balance =
    10 -
    Math.max(ratings.mind, ratings.body, ratings.spirit) +
    Math.min(ratings.mind, ratings.body, ratings.spirit)
  const balanceLabel =
    balance >= 8 ? 'Harmonic' : balance >= 5 ? 'Shifting' : 'Asymmetric'

  return (
    <div
      style={{
        padding: '16px 14px',
        borderRadius: 12,
        border: `1px solid ${tokens.border}`,
        background: tokens.cardBg,
        marginBottom: 20,
        boxShadow: tokens.cardShadow,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 4,
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: '"Orbitron", sans-serif',
            fontSize: 9,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: tokens.textMuted,
          }}
        >
          MBS balance
        </p>
        <span
          style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: 10,
            color: tokens.crimson,
          }}
        >
          {balanceLabel}
        </span>
      </div>
      <p style={{ margin: '0 0 8px', fontSize: 11, color: tokens.textSubtle }}>
        Holistic triad — today&apos;s silhouette
      </p>

      <div style={{ width: '100%', height: 168, minHeight: 168 }}>
        <ResponsiveContainer width="100%" height={168} minWidth={0}>
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="68%">
            <PolarGrid stroke={tokens.border} />
            <PolarAngleAxis
              dataKey="pillar"
              tick={{ fill: tokens.textMuted, fontSize: 9 }}
            />
            <Radar
              name="Today"
              dataKey="value"
              stroke={tokens.crimson}
              fill={tokens.crimson}
              fillOpacity={0.22}
              strokeWidth={2}
              isAnimationActive
              animationDuration={500}
              className="animate-pillar-shift"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
