import { useState } from 'react'
import { useTheme } from '../../theme/useTheme'
import { ModalShell } from '../../components/ui/ModalShell'
import { pillarAccentColor } from '../../lib/pillars'
import type { AreaConfig } from '../../types'

interface RatingModalProps {
  area: AreaConfig | null
  initialValue: number | null
  onClose: () => void
  onSave: (value: number) => void
}

interface RatingModalContentProps {
  area: AreaConfig
  initialValue: number | null
  onSave: (value: number) => void
}

function RatingModalContent({ area, initialValue, onSave }: RatingModalContentProps) {
  const { tokens } = useTheme()
  const [selected, setSelected] = useState(initialValue ?? 5)
  const [saving, setSaving] = useState(false)
  const fillPercent = (selected / 10) * 100
  const accentColor = pillarAccentColor(tokens, area.color)

  const handleSave = () => {
    setSaving(true)
    onSave(selected)
  }

  return (
    <div
      style={{
        padding: '28px 24px',
        background: tokens.modalBg,
        border: `1px solid ${tokens.modalBorder}`,
        boxShadow: tokens.modalShadow,
        transition: 'background 0.35s ease, border-color 0.35s ease',
      }}
    >
      <header style={{ textAlign: 'center', marginBottom: 20 }}>
        <span
          style={{
            fontSize: 48,
            color: accentColor,
            fontFamily: '"Noto Sans JP", sans-serif',
            transition: 'color 0.35s ease',
          }}
        >
          {area.kanji}
        </span>
        <h2
          id="rating-modal-title"
          style={{
            fontFamily: '"Orbitron", sans-serif',
            fontSize: 9,
            letterSpacing: '0.5em',
            color: tokens.text,
            textTransform: 'uppercase',
            marginTop: 8,
            transition: 'color 0.35s ease',
          }}
        >
          {area.label}
        </h2>
      </header>

      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <span
          style={{
            fontFamily: '"Orbitron", sans-serif',
            fontSize: 72,
            fontWeight: 700,
            background: tokens.coreGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: tokens.coreGlow,
            transition: 'filter 0.35s ease',
          }}
        >
          {selected}
        </span>
      </div>

      <div
        style={{
          marginBottom: 20,
          height: 8,
          borderRadius: 999,
          background: tokens.neonTrack,
          overflow: 'hidden',
          transition: 'background 0.35s ease',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${fillPercent}%`,
            background: tokens.neonFill,
            boxShadow: `0 0 10px ${tokens.accentGlow}`,
            transition: 'width 0.2s ease, background 0.35s ease',
          }}
        />
      </div>

      <div
        role="group"
        aria-label={`${area.label} rating`}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 6,
          marginBottom: 20,
        }}
      >
        {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => {
          const isSelected = selected === value
          return (
            <button
              key={value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelected(value)}
              style={{
                minHeight: 48,
                padding: '12px 0',
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: 13,
                cursor: 'pointer',
                color: isSelected ? tokens.segmentTextSelected : tokens.segmentText,
                background: isSelected ? tokens.segmentSelected : tokens.segmentUnselected,
                border: `1px solid ${isSelected ? 'transparent' : tokens.segmentBorder}`,
                boxShadow: isSelected ? `0 0 12px ${tokens.accentGlow}` : 'none',
                transition: 'all 0.15s ease',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              {value}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={handleSave}
        className="kage-touch-target"
        style={{
          width: '100%',
          padding: '16px 0',
          border: 'none',
          cursor: 'pointer',
          fontFamily: '"Orbitron", sans-serif',
          fontSize: 10,
          letterSpacing: '0.45em',
          textTransform: 'uppercase',
          color: tokens.btnText,
          fontWeight: 600,
          background: tokens.btnGradient,
          boxShadow: tokens.btnShadow,
          transition: 'all 0.15s ease',
          transform: saving ? 'scale(0.97)' : 'scale(1)',
          opacity: saving ? 0.85 : 1,
        }}
      >
        LOG RATING
      </button>
    </div>
  )
}

export function RatingModal({
  area,
  initialValue,
  onClose,
  onSave,
}: RatingModalProps) {
  return (
    <ModalShell open={!!area} onClose={onClose} labelledBy="rating-modal-title">
      {area ? (
        <RatingModalContent
          key={area.id}
          area={area}
          initialValue={initialValue}
          onSave={onSave}
        />
      ) : null}
    </ModalShell>
  )
}
