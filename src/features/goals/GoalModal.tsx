import { useState } from 'react'
import { useTheme } from '../../theme/useTheme'
import { ModalShell } from '../../components/ui/ModalShell'
import type { Goal, GoalCategory, GoalMilestone } from '../../types'

const CATEGORIES: { id: GoalCategory; label: string }[] = [
  { id: 'wealth', label: 'Wealth' },
  { id: 'health', label: 'Health' },
  { id: 'family', label: 'Family' },
  { id: 'craft', label: 'Craft' },
  { id: 'custom', label: 'Custom' },
]

export interface GoalFormData {
  title: string
  category: GoalCategory
  target?: string
  targetDate?: string
  milestones: GoalMilestone[]
}

interface GoalModalFormProps {
  goal?: Goal | null
  onClose: () => void
  onSave: (data: GoalFormData) => void
}

function uid() {
  return crypto.randomUUID()
}

function GoalModalForm({ goal, onClose, onSave }: GoalModalFormProps) {
  const { tokens } = useTheme()
  const [title, setTitle] = useState(goal?.title ?? '')
  const [category, setCategory] = useState<GoalCategory>(goal?.category ?? 'wealth')
  const [target, setTarget] = useState(goal?.target ?? '')
  const [targetDate, setTargetDate] = useState(goal?.targetDate ?? '')
  const [milestones, setMilestones] = useState<GoalMilestone[]>(goal?.milestones ?? [])
  const [milestoneInput, setMilestoneInput] = useState('')

  const addMilestone = () => {
    const label = milestoneInput.trim()
    if (!label) return
    setMilestones((m) => [...m, { id: uid(), label, done: false }])
    setMilestoneInput('')
  }

  const removeMilestone = (id: string) => {
    setMilestones((m) => m.filter((x) => x.id !== id))
  }

  const handleSubmit = () => {
    if (!title.trim()) return
    onSave({
      title: title.trim(),
      category,
      target: target.trim() || undefined,
      targetDate: targetDate || undefined,
      milestones,
    })
    onClose()
  }

  return (
    <div
      className="animate-modal-in"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 360,
        maxHeight: 'min(85dvh, 640px)',
        overflowY: 'auto',
        padding: '24px 20px',
        background: tokens.modalBg,
        border: `1px solid ${tokens.modalBorder}`,
        boxShadow: tokens.modalShadow,
        borderRadius: 12,
      }}
    >
      <h2
        style={{
          margin: '0 0 16px',
          fontFamily: '"Orbitron", sans-serif',
          fontSize: 9,
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: tokens.crimson,
        }}
      >
        {goal ? 'Edit goal' : 'New freedom goal'}
      </h2>

      <label style={{ display: 'block', marginBottom: 12 }}>
        <span style={{ fontSize: 11, color: tokens.textMuted }}>Title</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: '100%',
            marginTop: 6,
            padding: '10px 12px',
            borderRadius: 8,
            border: `1px solid ${tokens.inputBorder}`,
            background: tokens.inputBg,
            color: tokens.text,
            fontSize: 14,
          }}
        />
      </label>

      <p style={{ margin: '0 0 8px', fontSize: 11, color: tokens.textMuted }}>Pillar</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            style={{
              fontSize: 9,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '8px 10px',
              minHeight: 40,
              borderRadius: 6,
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

      <label style={{ display: 'block', marginBottom: 12 }}>
        <span style={{ fontSize: 11, color: tokens.textMuted }}>Target (optional)</span>
        <input
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="e.g. LLC filed, 12% body fat"
          style={{
            width: '100%',
            marginTop: 6,
            padding: '10px 12px',
            borderRadius: 8,
            border: `1px solid ${tokens.inputBorder}`,
            background: tokens.inputBg,
            color: tokens.text,
            fontSize: 13,
          }}
        />
      </label>

      <label style={{ display: 'block', marginBottom: 16 }}>
        <span style={{ fontSize: 11, color: tokens.textMuted }}>Target date (optional)</span>
        <input
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          style={{
            width: '100%',
            marginTop: 6,
            padding: '10px 12px',
            borderRadius: 8,
            border: `1px solid ${tokens.inputBorder}`,
            background: tokens.inputBg,
            color: tokens.text,
            fontSize: 13,
          }}
        />
      </label>

      <p style={{ margin: '0 0 8px', fontSize: 11, color: tokens.textMuted }}>Milestones</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        <input
          value={milestoneInput}
          onChange={(e) => setMilestoneInput(e.target.value)}
          placeholder="Step toward freedom…"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addMilestone()
            }
          }}
          style={{
            flex: 1,
            padding: '10px 12px',
            borderRadius: 8,
            border: `1px solid ${tokens.inputBorder}`,
            background: tokens.inputBg,
            color: tokens.text,
            fontSize: 13,
          }}
        />
        <button
          type="button"
          onClick={addMilestone}
          className="kage-touch-target"
          style={{
            minHeight: 44,
            padding: '0 14px',
            borderRadius: 8,
            border: `1px solid ${tokens.crimson}`,
            background: tokens.bannerBg,
            color: tokens.crimson,
            fontSize: 11,
            cursor: 'pointer',
          }}
        >
          Add
        </button>
      </div>
      {milestones.map((m) => (
        <div
          key={m.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            padding: '8px 0',
            borderBottom: `1px solid ${tokens.border}`,
          }}
        >
          <span style={{ fontSize: 12, color: tokens.text }}>{m.label}</span>
          <button
            type="button"
            onClick={() => removeMilestone(m.id)}
            style={{
              fontSize: 10,
              padding: '4px 8px',
              border: 'none',
              background: 'transparent',
              color: tokens.crimson,
              cursor: 'pointer',
            }}
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={handleSubmit}
        className="kage-touch-target"
        style={{
          width: '100%',
          minHeight: 48,
          marginTop: 16,
          border: 'none',
          borderRadius: 8,
          background: tokens.btnGradient,
          color: tokens.btnText,
          fontFamily: '"Orbitron", sans-serif',
          fontSize: 10,
          letterSpacing: '0.3em',
          cursor: 'pointer',
        }}
      >
        {goal ? 'SAVE CHANGES' : 'ADD GOAL'}
      </button>
    </div>
  )
}

interface GoalModalProps {
  open: boolean
  goal?: Goal | null
  onClose: () => void
  onSave: (data: GoalFormData) => void
}

export function GoalModal({ open, goal, onClose, onSave }: GoalModalProps) {
  return (
    <ModalShell open={open} onClose={onClose} maxWidth={360}>
      {open ? (
        <GoalModalForm key={goal?.id ?? 'new'} goal={goal} onClose={onClose} onSave={onSave} />
      ) : null}
    </ModalShell>
  )
}
