import { useState } from 'react'
import { useTheme } from '../../theme/useTheme'
import { useTracker } from '../../context/trackerContext'
import type { AreaId } from '../../types'
import { AREA_CONFIGS } from '../../types'

interface ShadowLogFieldsProps {
  mind: number
  body: number
  spirit: number
  initialNote?: string
}

function ShadowLogFields({ mind, body, spirit, initialNote = '' }: ShadowLogFieldsProps) {
  const { tokens } = useTheme()
  const { saveTodayShadow } = useTracker()
  const [m, setM] = useState(mind)
  const [b, setB] = useState(body)
  const [s, setS] = useState(spirit)
  const [note, setNote] = useState(initialNote)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveTodayShadow({ mind: m, body: b, spirit: s }, note.trim() || undefined, 'quick')
      setNote('')
    } finally {
      setSaving(false)
    }
  }

  const values = { mind: m, body: b, spirit: s }
  const setters = { mind: setM, body: setB, spirit: setS }

  return (
    <>
      {AREA_CONFIGS.map((area) => {
        const id = area.id as AreaId
        const value = values[id]
        const setValue = setters[id]
        return (
          <label key={area.id} style={{ display: 'block', marginBottom: 14 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 6,
                fontSize: 12,
                color: tokens.text,
              }}
            >
              <span>
                {area.kanji} {area.label}
              </span>
              <span
                style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  color: area.color === 'ember' ? tokens.ember : tokens.crimson,
                }}
              >
                {value}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              style={{ width: '100%', accentColor: tokens.crimson, minHeight: 44 }}
              aria-label={`${area.label} rating`}
            />
          </label>
        )
      })}

      <label style={{ display: 'block', marginBottom: 14 }}>
        <span style={{ display: 'block', marginBottom: 6, fontSize: 11, color: tokens.textMuted }}>
          Note (optional)
        </span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="Voice or typed note…"
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 8,
            border: `1px solid ${tokens.inputBorder}`,
            background: tokens.inputBg,
            color: tokens.text,
            fontSize: 13,
            resize: 'none',
          }}
        />
      </label>

      <button
        type="button"
        onClick={() => void handleSave()}
        disabled={saving}
        className="kage-touch-target"
        style={{
          width: '100%',
          minHeight: 52,
          border: 'none',
          borderRadius: 10,
          background: tokens.btnGradient,
          color: tokens.btnText,
          fontFamily: '"Orbitron", sans-serif',
          fontSize: 10,
          letterSpacing: '0.35em',
          cursor: saving ? 'wait' : 'pointer',
          opacity: saving ? 0.85 : 1,
          boxShadow: tokens.btnShadow,
        }}
      >
        SAVE TODAY&apos;S SHADOW
      </button>
    </>
  )
}

export function ShadowLogForm() {
  const { tokens } = useTheme()
  const { ratings, pendingVoiceNote } = useTracker()

  return (
    <div
      style={{
        padding: '16px 14px',
        borderRadius: 12,
        border: `1px solid ${tokens.border}`,
        background: tokens.cardBg,
        marginBottom: 16,
      }}
    >
      <p
        style={{
          margin: '0 0 4px',
          fontFamily: '"Orbitron", sans-serif',
          fontSize: 9,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: tokens.textMuted,
        }}
      >
        Full shadow log
      </p>
      <p style={{ margin: '0 0 14px', fontSize: 11, color: tokens.textSubtle }}>
        Parked only — sliders for an honest daily seal
      </p>

      <ShadowLogFields
        key={`${ratings.mind}-${ratings.body}-${ratings.spirit}-${pendingVoiceNote ?? ''}`}
        mind={ratings.mind}
        body={ratings.body}
        spirit={ratings.spirit}
        initialNote={pendingVoiceNote ?? ''}
      />
    </div>
  )
}
