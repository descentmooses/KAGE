import { useState } from 'react'
import { useTheme } from '../../theme/useTheme'
import { useFreedomGoals } from '../../hooks/useFreedomGoals'
import type { Goal, GoalCategory } from '../../types'
import { GOAL_CATEGORY_LABEL } from '../../lib/goals'
import { GoalModal, type GoalFormData } from './GoalModal'
import { SeedBonsai } from './SeedBonsai'
import { NeonCard } from '../../components/ui/NeonCard'
import { NeonProgress } from '../../components/ui/NeonProgress'
import { orbitronCaps } from '../../theme/componentStyles'

function GrowthBar({ progress, color }: { progress: number; color: string }) {
  return (
    <NeonProgress
      value={progress}
      variant="growth"
      color={color}
      fillClassName="animate-growth-fill"
      trackStyle={{ marginTop: 8 }}
      aria-label="Goal progress"
    />
  )
}

export function GoalPanel() {
  const { tokens } = useTheme()
  const {
    goals,
    addGoal,
    updateGoal,
    updateGoalProgress,
    toggleMilestone,
    removeGoal,
  } = useFreedomGoals()
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

  const handleSave = (data: GoalFormData) => {
    if (editing) {
      void updateGoal(editing.id, data)
    } else {
      void addGoal(data)
    }
  }

  const grouped = goals.reduce<Record<string, Goal[]>>((acc, g) => {
    acc[g.category] = acc[g.category] ?? []
    acc[g.category].push(g)
    return acc
  }, {})

  return (
    <NeonCard style={{ marginBottom: 24 }}>
      <div
        style={{
          display: 'flex',
          gap: 14,
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <SeedBonsai goals={goals} />
        <div style={{ flex: 1 }}>
          <p style={orbitronCaps(tokens)}>Freedom goals</p>
          <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: tokens.textSubtle }}>
            Wealth · health · family · craft — seeds for the life you are building
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="kage-touch-target"
          style={{
            minHeight: 44,
            padding: '0 12px',
            borderRadius: 8,
            border: 'none',
            background: tokens.btnGradient,
            color: tokens.btnText,
            fontSize: 9,
            letterSpacing: '0.2em',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          ADD
        </button>
      </div>

      {goals.length === 0 && (
        <p style={{ margin: '0 0 12px', fontSize: 13, lineHeight: 1.55, color: tokens.textMuted }}>
          Plant your first seed — a named goal with optional milestones. Elara will learn its
          rhythm.
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
            {GOAL_CATEGORY_LABEL[category as GoalCategory] ?? category}
          </p>
          {list.map((goal) => (
            <div
              key={goal.id}
              style={{
                padding: '14px 0',
                borderBottom: `1px solid ${tokens.border}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: 14,
                      color: goal.completedAt ? tokens.textMuted : tokens.text,
                      textDecoration: goal.completedAt ? 'line-through' : 'none',
                    }}
                  >
                    {goal.title}
                  </span>
                  {goal.target && (
                    <p style={{ margin: '4px 0 0', fontSize: 11, color: tokens.textMuted }}>
                      {goal.target}
                    </p>
                  )}
                  {goal.targetDate && (
                    <p style={{ margin: '2px 0 0', fontSize: 10, color: tokens.textSubtle }}>
                      by {goal.targetDate}
                    </p>
                  )}
                </div>
                <span
                  className={goal.progress >= 75 ? 'animate-milestone' : undefined}
                  style={{ fontSize: 11, color: tokens.gold, fontFamily: '"Share Tech Mono", monospace' }}
                >
                  {goal.progress}%
                </span>
              </div>

              <GrowthBar progress={goal.progress} color={tokens.crimson} />

              {goal.milestones.length > 0 ? (
                <div style={{ marginTop: 10 }}>
                  {goal.milestones.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => void toggleMilestone(goal.id, m.id)}
                      className="kage-touch-target"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        width: '100%',
                        minHeight: 44,
                        padding: '6px 0',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <span
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 6,
                          border: `1px solid ${m.done ? tokens.crimson : tokens.border}`,
                          background: m.done ? tokens.bannerBg : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 11,
                          color: tokens.crimson,
                          flexShrink: 0,
                        }}
                      >
                        {m.done ? '✓' : ''}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: m.done ? tokens.textMuted : tokens.text,
                          textDecoration: m.done ? 'line-through' : 'none',
                        }}
                      >
                        {m.label}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={goal.progress}
                  onChange={(e) => void updateGoalProgress(goal.id, Number(e.target.value))}
                  style={{ width: '100%', accentColor: tokens.crimson, minHeight: 44, marginTop: 8 }}
                  aria-label={`${goal.title} progress`}
                />
              )}

              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => openEdit(goal)}
                  className="kage-touch-target"
                  style={{
                    fontSize: 10,
                    padding: '8px 12px',
                    minHeight: 40,
                    borderRadius: 6,
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
                  className="kage-touch-target"
                  style={{
                    fontSize: 10,
                    padding: '8px 12px',
                    minHeight: 40,
                    borderRadius: 6,
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
    </NeonCard>
  )
}
