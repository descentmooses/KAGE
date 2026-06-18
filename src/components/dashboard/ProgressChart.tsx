import { useMemo } from 'react'
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
import { buildTrendForPeriod, trendTitleForPeriod } from '../../lib/insights'
import type { Period } from '../../types'

const PERIODS: { id: Period; label: string }[] = [
  { id: 'daily', label: 'Day' },
  { id: 'weekly', label: 'Week' },
  { id: 'monthly', label: 'Month' },
]

export function ProgressChart() {
  const { tokens } = useTheme()
  const { allLogs, period, setPeriod } = useTracker()

  const chartData = useMemo(() => {
    return buildTrendForPeriod(allLogs, period).map((p) => ({
      ...p,
      // Core is stored 0–100; pillars are 1–10 — normalize for one axis
      coreDisplay: Math.round(p.core / 10),
    }))
  }, [allLogs, period])

  const chartHeight = period === 'monthly' ? 200 : 180
  const xInterval = period === 'monthly' ? 4 : period === 'weekly' ? 0 : 0

  return (
    <div
      style={{
        padding: '20px 16px',
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
          alignItems: 'center',
          marginBottom: 16,
          gap: 8,
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
          {trendTitleForPeriod(period)}
        </p>
        <div style={{ display: 'flex', gap: 6 }} role="group" aria-label="Chart time range">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriod(p.id)}
              aria-pressed={period === p.id}
              className="kage-touch-target"
              style={{
                fontSize: 9,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                padding: '6px 10px',
                borderRadius: 6,
                border: `1px solid ${period === p.id ? tokens.crimson : tokens.border}`,
                background: period === p.id ? tokens.bannerBg : 'transparent',
                color: period === p.id ? tokens.crimson : tokens.textMuted,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          width: '100%',
          height: chartHeight,
          minHeight: chartHeight,
          position: 'relative',
        }}
        aria-label={`${trendTitleForPeriod(period)} chart`}
      >
        <ResponsiveContainer width="100%" height={chartHeight} minWidth={0}>
          <LineChart
            key={period}
            data={chartData}
            margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
          >
            <XAxis
              dataKey="label"
              tick={{ fill: tokens.textMuted, fontSize: period === 'monthly' ? 8 : 10 }}
              axisLine={false}
              tickLine={false}
              interval={xInterval}
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
                border: `1px solid ${tokens.borderAccent}`,
                borderRadius: 8,
                fontSize: 12,
                color: tokens.text,
              }}
              itemStyle={{ color: tokens.text }}
              labelStyle={{ color: tokens.textMuted, marginBottom: 4 }}
            />
            <Line
              type="monotone"
              dataKey="mind"
              stroke={tokens.crimson}
              strokeWidth={2}
              dot={period === 'daily'}
              name="Mind"
              isAnimationActive
              animationDuration={400}
            />
            <Line
              type="monotone"
              dataKey="body"
              stroke={tokens.ember}
              strokeWidth={2}
              dot={period === 'daily'}
              name="Body"
              isAnimationActive
              animationDuration={500}
            />
            <Line
              type="monotone"
              dataKey="spirit"
              stroke={tokens.chartSpirit}
              strokeWidth={2}
              dot={period === 'daily'}
              name="Spirit"
              isAnimationActive
              animationDuration={600}
            />
            <Line
              type="monotone"
              dataKey="coreDisplay"
              stroke={tokens.chartCore}
              strokeWidth={1}
              strokeDasharray="4 4"
              dot={false}
              name="Core"
              isAnimationActive
              animationDuration={350}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
