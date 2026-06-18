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
      className="fixed inset-0 z-[70] flex items-end justify-center px-4 pb-6 sm:items-center sm:px-5 sm:pb-0"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rating-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/78 backdrop-blur-xl animate-fade-in"
        onClick={onClose}
        aria-label="Close"
      />

      <div className="glass-panel relative w-full max-w-sm animate-modal-in overflow-hidden border border-white/[0.09] px-6 py-8 sm:px-8 sm:py-9">
        <div className="modal-border-glow pointer-events-none absolute inset-0" />

        <header className="relative mb-6 text-center">
          <span
            className="mb-1.5 block font-jp text-[3.25rem] font-extralight leading-none text-cyan"
            style={{ textShadow: '0 0 40px #00f9ff66' }}
          >
            {area.kanji}
          </span>
          <h2
            id="rating-modal-title"
            className="font-display text-[9px] tracking-[0.55em] text-white/70 uppercase"
          >
            {area.label}
          </h2>
        </header>

        <div className="relative mb-6 flex flex-col items-center">
          <span
            className="core-glow font-display text-[5.5rem] font-bold leading-none tabular-nums sm:text-8xl"
            aria-live="polite"
          >
            {selected}
          </span>
          <span className="mt-2 font-mono text-[7px] tracking-[0.45em] text-mist/60 uppercase">
            Current Rating
          </span>
        </div>

        <div className="neon-track relative mb-6 h-2 w-full overflow-hidden rounded-full">
          <div
            className="neon-fill absolute inset-y-0 left-0 overflow-hidden rounded-full transition-[width] duration-150 ease-out"
            style={{ width: `${fillPercent}%` }}
          >
            <div className="crt-bar-texture absolute inset-0 opacity-60" />
          </div>
        </div>

        <div className="mb-6 grid grid-cols-5 gap-1.5">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => {
            const isSelected = selected === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => setSelected(value)}
                className="py-2.5 font-mono text-[11px] transition-all duration-100 active:scale-90"
                style={{
                  color: isSelected ? '#0a0a0a' : 'rgba(138,138,154,0.48)',
                  background: isSelected
                    ? 'linear-gradient(145deg, #00f9ff, #ff00aa)'
                    : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isSelected ? 'transparent' : 'rgba(255,255,255,0.07)'}`,
                  boxShadow: isSelected ? '0 0 20px #00f9ff55' : 'none',
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
          className="log-rating-btn w-full py-3.5 font-display text-[9px] tracking-[0.55em] text-void uppercase transition-transform duration-100 active:scale-[0.96]"
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
