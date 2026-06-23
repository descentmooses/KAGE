import { useState } from 'react'
import { useTheme } from '../../theme/useTheme'
import { useShadowLogs } from '../../hooks/useShadowLogs'
import { pillarAccentColor } from '../../lib/pillars'
import { NeonCard } from '../../components/ui/NeonCard'
import { AREA_CONFIGS, type AreaId } from '../../types'

interface ShadowLogFieldsProps {
  mind: number
  body: number
  spirit: number
}

function ShadowLogFields({ mind, body, spirit }: ShadowLogFieldsProps) {
  const { tokens } = useTheme()
  const { saveTodayShadow } = useShadowLogs()
  const [m, setM] = useState(mind)
  const [b, setB] = useState(body)
  const [s, setS] = useState(spirit)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  const values = { mind: m, body: b, spirit: s }
  const hasRating = Math.max(m, b, s) >= 1

  const handleSave = async () => {
    if (!hasRating) return
    setSaving(true)
    try {
      await saveTodayShadow(values, note.trim() || undefined, 'quick')
      setNote('')
    } finally {
      setSaving(false)
    }
  }

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
                  color: pillarAccentColor(tokens, area.color),
                }}
              >
                {value}
              </span>
            </div>
            <input
              type="range"
              min={0}
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
          placeholder="Optional note…"
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
        disabled={saving || !hasRating}
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
  const { ratings } = useShadowLogs()

  return (
    <NeonCard style={{ marginBottom: 0 }}>
      <ShadowLogFields
        key={`${ratings.mind}-${ratings.body}-${ratings.spirit}`}
        mind={ratings.mind}
        body={ratings.body}
        spirit={ratings.spirit}
      />
    </NeonCard>
  )
}
