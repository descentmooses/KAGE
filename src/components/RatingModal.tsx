import { useEffect, useState } from 'react'
import type { AreaConfig } from '../types'

interface RatingModalProps {
  area: AreaConfig | null
  initialValue: number | null
  onClose: () => void
  onSave: (value: number) => void
}

interface RatingModalContentProps {
  area: AreaConfig
  initialValue: number | null
  onClose: () => void
  onSave: (value: number) => void
}

function RatingModalContent({
  area,
  initialValue,
  onClose,
  onSave,
}: RatingModalContentProps) {
  const [selected, setSelected] = useState(initialValue ?? 5)
  const fillPercent = (selected / 10) * 100

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rating-modal-title"
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
        onClick={onClose}
        aria-label="Close"
        style={{
          position: 'absolute',
          inset: 0,
          border: 'none',
          background: 'rgba(0,0,0,0.8)',
          cursor: 'pointer',
        }}
      />

      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 380,
          padding: '28px 24px',
          background: 'rgba(8,8,10,0.95)',
          border: '1px solid rgba(0,249,255,0.2)',
          boxShadow: '0 0 40px rgba(0,249,255,0.15)',
        }}
      >

        <header style={{ textAlign: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: 48, color: '#00f9ff', textShadow: '0 0 30px rgba(0,249,255,0.6)', fontFamily: '"Noto Sans JP", sans-serif' }}>
            {area.kanji}
          </span>
          <h2 id="rating-modal-title" style={{ fontFamily: '"Orbitron", sans-serif', fontSize: 9, letterSpacing: '0.5em', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', marginTop: 8 }}>
            {area.label}
          </h2>
        </header>

        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <span
            style={{
              fontFamily: '"Orbitron", sans-serif',
              fontSize: 72,
              fontWeight: 700,
              background: 'linear-gradient(155deg, #00f9ff, #ff00aa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {selected}
          </span>
        </div>

        <div style={{ marginBottom: 20, height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${fillPercent}%`, background: 'linear-gradient(90deg, #00f9ff, #ff00aa)', boxShadow: '0 0 12px #00f9ff' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 20 }}>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => {
            const isSelected = selected === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => setSelected(value)}
                style={{
                  padding: '10px 0',
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: 12,
                  cursor: 'pointer',
                  color: isSelected ? '#0a0a0a' : '#8a8a9a',
                  background: isSelected ? 'linear-gradient(145deg, #00f9ff, #ff00aa)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isSelected ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                {value}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => onSave(selected)}
          style={{
            width: '100%',
            padding: '14px 0',
            border: 'none',
            cursor: 'pointer',
            fontFamily: '"Orbitron", sans-serif',
            fontSize: 10,
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            color: '#0a0a0a',
            fontWeight: 600,
            background: 'linear-gradient(95deg, #00f9ff, #ff00aa)',
            boxShadow: '0 0 24px rgba(0,249,255,0.45)',
          }}
        >
          LOG RATING
        </button>
      </div>
    </div>
  )
}

export function RatingModal({
  area,
  initialValue,
  onClose,
  onSave,
}: RatingModalProps) {
  if (!area) return null

  return (
    <RatingModalContent
      key={area.id}
      area={area}
      initialValue={initialValue}
      onClose={onClose}
      onSave={onSave}
    />
  )
}
