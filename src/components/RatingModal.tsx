import { useEffect, useState } from 'react'
import type { AreaConfig } from '../types'

interface RatingModalProps {
  area: AreaConfig | null
  initialValue: number | null
  onClose: () => void
  onLog: (value: number) => void
}

interface RatingModalContentProps {
  area: AreaConfig
  initialValue: number | null
  onClose: () => void
  onLog: (value: number) => void
}

function RatingModalContent({
  area,
  initialValue,
  onClose,
  onLog,
}: RatingModalContentProps) {
  const [selected, setSelected] = useState(initialValue ?? 5)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const accent = area.color === 'cyan' ? '#00f9ff' : '#ff00aa'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rating-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-label="Close"
      />

      <div
        className="relative w-full max-w-sm border border-white/[0.06] bg-ink/95 px-8 py-10 animate-fade-up"
        style={{
          boxShadow: `0 0 40px ${accent}11, inset 0 1px 0 rgba(255,255,255,0.04)`,
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          }}
        />

        <header className="mb-10 text-center">
          <span
            className="mb-3 block font-jp text-4xl font-light"
            style={{ color: accent, textShadow: `0 0 30px ${accent}44` }}
          >
            {area.kanji}
          </span>
          <h2
            id="rating-modal-title"
            className="font-display text-sm tracking-[0.45em] text-white uppercase"
          >
            {area.label}
          </h2>
        </header>

        <div className="mb-3 flex items-baseline justify-between">
          <span className="font-mono text-[9px] tracking-widest text-mist uppercase">
            Intensity
          </span>
          <span
            className="font-mono text-2xl tabular-nums"
            style={{ color: accent, textShadow: `0 0 16px ${accent}55` }}
          >
            {selected}
          </span>
        </div>

        <div className="mb-10 grid grid-cols-5 gap-1.5">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => {
            const isSelected = selected === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => setSelected(value)}
                className="relative py-2.5 font-mono text-[11px] transition-all duration-200"
                style={{
                  color: isSelected ? accent : 'rgba(138,138,154,0.5)',
                  background: isSelected ? `${accent}14` : 'transparent',
                  border: `1px solid ${isSelected ? `${accent}55` : 'rgba(255,255,255,0.06)'}`,
                  boxShadow: isSelected ? `0 0 12px ${accent}33` : 'none',
                }}
              >
                {value}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => onLog(selected)}
          className="w-full py-3 font-display text-[10px] tracking-[0.4em] text-void uppercase transition-all duration-300 hover:brightness-110"
          style={{
            background: `linear-gradient(90deg, ${accent}cc, ${area.color === 'cyan' ? '#ff00aa' : '#00f9ff'}cc)`,
            boxShadow: `0 0 20px ${accent}33`,
          }}
        >
          Log
        </button>
      </div>
    </div>
  )
}

export function RatingModal({
  area,
  initialValue,
  onClose,
  onLog,
}: RatingModalProps) {
  if (!area) return null

  return (
    <RatingModalContent
      key={area.id}
      area={area}
      initialValue={initialValue}
      onClose={onClose}
      onLog={onLog}
    />
  )
}
