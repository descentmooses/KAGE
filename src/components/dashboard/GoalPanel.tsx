import { useState } from 'react'
import { useTheme } from '../../theme/useTheme'
import { useTracker } from '../../context/trackerContext'
import type { GoalCategory } from '../../types'

const CATEGORIES: { id: GoalCategory; label: string }[] = [
  { id: 'wealth', label: 'Wealth' },
  { id: 'health', label: 'Health' },
  { id: 'family', label: 'Family' },
  { id: 'craft', label: 'Craft' },
]

export function GoalPanel() {
  const { tokens } = useTheme()
  const { goals, addGoal, updateGoalProgress } = useTracker()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<GoalCategory>('wealth')

  const handleAdd = () => {
    if (!title.trim()) return
    void addGoal(title.trim(), category)
    setTitle('')
  }

  return (
    <div
      style={{
        padding: '16px 14px',
        borderRadius: 10,
        border: `1px solid ${tokens.border}`,
        background: tokens.cardBg,
        marginBottom: 24,
      }}
    >
      <p
        style={{
          margin: '0 0 12px',
          fontFamily: '"Orbitron", sans-serif',
          fontSize: 9,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: tokens.textMuted,
        }}
      >
        Freedom goals
      </p>

      {goals.length === 0 && (
        <p style={{ margin: '0 0 12px', fontSize: 12, color: tokens.textMuted }}>
          Set targets for wealth, recovery, family, or patent/LLC progress.
        </p>
      )}

      {goals.map((goal) => (
        <div key={goal.id} style={{ marginBottom: 14 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: 13, color: tokens.text }}>{goal.title}</span>
            <span style={{ fontSize: 10, color: tokens.crimson }}>{goal.progress}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={goal.progress}
            onChange={(e) => void updateGoalProgress(goal.id, Number(e.target.value))}
            style={{ width: '100%', accentColor: tokens.crimson }}
            aria-label={`${goal.title} progress`}
          />
        </div>
      ))}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New goal…"
          style={{
            padding: '10px 12px',
            borderRadius: 6,
            border: `1px solid ${tokens.inputBorder}`,
            background: tokens.inputBg,
            color: tokens.text,
            fontSize: 13,
          }}
        />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              style={{
                fontSize: 9,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '6px 10px',
                borderRadius: 4,
                border: `1px solid ${category === c.id ? tokens.crimson : tokens.border}`,
                background: category === c.id ? tokens.bannerBg : 'transparent',
                color: category === c.id ? tokens.crimson : tokens.textMuted,
                cursor: 'pointer',
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleAdd}
          style={{
            padding: '10px',
            borderRadius: 6,
            border: 'none',
            background: tokens.btnGradient,
            color: tokens.btnText,
            fontFamily: '"Orbitron", sans-serif',
            fontSize: 9,
            letterSpacing: '0.3em',
            cursor: 'pointer',
          }}
        >
          ADD GOAL
        </button>
      </div>
    </div>
  )
}
