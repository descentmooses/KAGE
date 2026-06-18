import { useEffect, useState } from 'react'
import { useTheme } from '../../theme/useTheme'
import type { Goal, GoalCategory } from '../../types'

const CATEGORIES: { id: GoalCategory; label: string }[] = [
  { id: 'wealth', label: 'Wealth' },
  { id: 'health', label: 'Health' },
  { id: 'family', label: 'Family' },
  { id: 'craft', label: 'Craft' },
  { id: 'custom', label: 'Custom' },
]

interface GoalModalFormProps {
  goal?: Goal | null
  onClose: () => void
  onSave: (data: { title: string; category: GoalCategory; target?: string }) => void
}

function GoalModalForm({ goal, onClose, onSave }: GoalModalFormProps) {
  const { tokens } = useTheme()
  const [title, setTitle] = useState(goal?.title ?? '')
  const [category, setCategory] = useState<GoalCategory>(goal?.category ?? 'wealth')
  const [target, setTarget] = useState(goal?.target ?? '')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleSubmit = () => {
    if (!title.trim()) return
    onSave({ title: title.trim(), category, target: target.trim() || undefined })
    onClose()
  }

  return (
    <div
      className="animate-modal-in"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 360,
        padding: '24px 20px',
        background: tokens.modalBg,
        border: `1px solid ${tokens.modalBorder}`,
        boxShadow: tokens.modalShadow,
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

      <p style={{ margin: '0 0 8px', fontSize: 11, color: tokens.textMuted }}>
        Pillar
      </p>
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

      <label style={{ display: 'block', marginBottom: 16 }}>
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

      <button
        type="button"
        onClick={handleSubmit}
        className="kage-touch-target"
        style={{
          width: '100%',
          minHeight: 48,
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
  onSave: (data: { title: string; category: GoalCategory; target?: string }) => void
}

export function GoalModal({ open, goal, onClose, onSave }: GoalModalProps) {
  const { tokens } = useTheme()

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          border: 'none',
          background: tokens.modalBackdrop,
          cursor: 'pointer',
        }}
      />
      <GoalModalForm key={goal?.id ?? 'new'} goal={goal} onClose={onClose} onSave={onSave} />
    </div>
  )
}
