import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTheme } from '../../theme/useTheme'
import { useTracker } from '../../context/trackerContext'
import type { Period } from '../../types'

const PERIODS: { id: Period; label: string }[] = [
  { id: 'daily', label: 'Day' },
  { id: 'weekly', label: 'Week' },
  { id: 'monthly', label: 'Month' },
]

export function ProgressChart() {
  const { tokens } = useTheme()
  const { trend, period, setPeriod } = useTracker()

  const chartData = trend.map((p) => ({
    ...p,
    label: p.label,
  }))

  return (
    <div
      style={{
        padding: '18px 14px',
        borderRadius: 10,
        border: `1px solid ${tokens.border}`,
        background: tokens.cardBg,
        marginBottom: 20,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14,
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
          7-day shadow trend
        </p>
        <div style={{ display: 'flex', gap: 6 }}>
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriod(p.id)}
              style={{
                fontSize: 9,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                padding: '4px 8px',
                borderRadius: 4,
                border: `1px solid ${period === p.id ? tokens.crimson : tokens.border}`,
                background: period === p.id ? tokens.bannerBg : 'transparent',
                color: period === p.id ? tokens.crimson : tokens.textMuted,
                cursor: 'pointer',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ width: '100%', height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <XAxis
              dataKey="label"
              tick={{ fill: tokens.textMuted, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 10]}
              tick={{ fill: tokens.textMuted, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: tokens.modalBg,
                border: `1px solid ${tokens.border}`,
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey="mind"
              stroke={tokens.crimson}
              strokeWidth={2}
              dot={false}
              name="Mind"
            />
            <Line
              type="monotone"
              dataKey="body"
              stroke={tokens.ember}
              strokeWidth={2}
              dot={false}
              name="Body"
            />
            <Line
              type="monotone"
              dataKey="spirit"
              stroke="#a8a8b8"
              strokeWidth={2}
              dot={false}
              name="Spirit"
            />
            <Line
              type="monotone"
              dataKey="core"
              stroke={tokens.textSubtle}
              strokeWidth={1}
              strokeDasharray="4 4"
              dot={false}
              name="Core"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
