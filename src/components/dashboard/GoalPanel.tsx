import { useState } from 'react'
import { useTheme } from '../../theme/useTheme'
import { useTracker } from '../../context/trackerContext'
import type { Goal, GoalCategory } from '../../types'
import { GoalModal } from './GoalModal'

const CATEGORY_LABEL: Record<GoalCategory, string> = {
  wealth: 'Wealth',
  health: 'Health',
  family: 'Family',
  craft: 'Craft',
  custom: 'Custom',
}

export function GoalPanel() {
  const { tokens } = useTheme()
  const { goals, addGoal, updateGoal, updateGoalProgress, removeGoal } = useTracker()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Goal | null>(null)

  const openAdd = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (goal: Goal) => {
    setEditing(goal)
    setModalOpen(true)
  }

  const handleSave = (data: { title: string; category: GoalCategory; target?: string }) => {
    if (editing) {
      void updateGoal(editing.id, data)
    } else {
      void addGoal(data.title, data.category, data.target)
    }
  }

  const grouped = goals.reduce<Record<string, Goal[]>>((acc, g) => {
    const key = g.category
    acc[key] = acc[key] ?? []
    acc[key].push(g)
    return acc
  }, {})

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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
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
          Freedom goals
        </p>
        <button
          type="button"
          onClick={openAdd}
          className="kage-touch-target"
          style={{
            minHeight: 40,
            padding: '0 12px',
            borderRadius: 6,
            border: 'none',
            background: tokens.btnGradient,
            color: tokens.btnText,
            fontSize: 9,
            letterSpacing: '0.2em',
            cursor: 'pointer',
          }}
        >
          ADD GOAL
        </button>
      </div>

      {goals.length === 0 && (
        <p style={{ margin: '0 0 12px', fontSize: 12, color: tokens.textMuted }}>
          Wealth, health, family, craft — plant seeds for life after the dash.
        </p>
      )}

      {Object.entries(grouped).map(([category, list]) => (
        <div key={category} style={{ marginBottom: 16 }}>
          <p
            style={{
              margin: '0 0 8px',
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: tokens.crimson,
            }}
          >
            {CATEGORY_LABEL[category as GoalCategory] ?? category}
          </p>
          {list.map((goal) => (
            <div
              key={goal.id}
              style={{
                padding: '12px 0',
                borderBottom: `1px solid ${tokens.border}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <div>
                  <span style={{ fontSize: 13, color: tokens.text }}>{goal.title}</span>
                  {goal.target && (
                    <p style={{ margin: '4px 0 0', fontSize: 11, color: tokens.textMuted }}>
                      {goal.target}
                    </p>
                  )}
                </div>
                <span style={{ fontSize: 10, color: tokens.gold }}>{goal.progress}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={goal.progress}
                onChange={(e) => void updateGoalProgress(goal.id, Number(e.target.value))}
                style={{ width: '100%', accentColor: tokens.crimson, minHeight: 36 }}
                aria-label={`${goal.title} progress`}
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => openEdit(goal)}
                  style={{
                    fontSize: 10,
                    padding: '6px 10px',
                    borderRadius: 4,
                    border: `1px solid ${tokens.border}`,
                    background: 'transparent',
                    color: tokens.textMuted,
                    cursor: 'pointer',
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => void removeGoal(goal.id)}
                  style={{
                    fontSize: 10,
                    padding: '6px 10px',
                    borderRadius: 4,
                    border: `1px solid ${tokens.border}`,
                    background: 'transparent',
                    color: tokens.crimson,
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}

      <GoalModal
        open={modalOpen}
        goal={editing}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  )
}
