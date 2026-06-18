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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const accent = area.color === 'cyan' ? '#00f9ff' : '#ff00aa'
  const secondary = area.color === 'cyan' ? '#ff00aa' : '#00f9ff'
  const fillPercent = (selected / 10) * 100

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rating-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in"
        onClick={onClose}
        aria-label="Close"
      />

      <div
        className="relative w-full max-w-sm border border-white/[0.07] bg-void/95 px-8 py-10 animate-fade-up"
        style={{
          boxShadow: `0 0 60px ${accent}18, 0 0 120px ${secondary}08, inset 0 1px 0 rgba(255,255,255,0.05)`,
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}, ${secondary}, transparent)`,
          }}
        />

        <header className="mb-8 text-center">
          <span
            className="mb-2 block font-jp text-5xl font-extralight"
            style={{ color: accent, textShadow: `0 0 40px ${accent}55` }}
          >
            {area.kanji}
          </span>
          <h2
            id="rating-modal-title"
            className="font-display text-[11px] tracking-[0.5em] text-white/80 uppercase"
          >
            {area.label}
          </h2>
        </header>

        {/* Large rating display */}
        <div className="relative mb-8 flex flex-col items-center">
          <div
            className="pointer-events-none absolute h-32 w-32 rounded-full opacity-50"
            style={{
              background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)`,
            }}
          />
          <span
            className="core-glow relative font-display text-7xl font-medium tabular-nums leading-none"
            aria-live="polite"
          >
            {selected}
          </span>
          <span className="mt-2 font-mono text-[9px] tracking-[0.35em] text-mist uppercase">
            of 10
          </span>
        </div>

        {/* Preview bar */}
        <div
          className="relative mb-8 h-1.5 w-full overflow-hidden rounded-full"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
            style={{
              width: `${fillPercent}%`,
              background: `linear-gradient(90deg, ${accent}88, ${accent})`,
              boxShadow: `0 0 12px ${accent}66`,
            }}
          />
        </div>

        {/* Segmented 1–10 */}
        <div className="mb-8 grid grid-cols-5 gap-2">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => {
            const isSelected = selected === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => setSelected(value)}
                className="relative py-3 font-mono text-xs transition-all duration-200 active:scale-95"
                style={{
                  color: isSelected ? '#0a0a0a' : 'rgba(138,138,154,0.55)',
                  background: isSelected
                    ? `linear-gradient(135deg, ${accent}, ${secondary})`
                    : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isSelected ? 'transparent' : 'rgba(255,255,255,0.07)'}`,
                  boxShadow: isSelected ? `0 0 16px ${accent}55` : 'none',
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
          className="w-full py-3.5 font-display text-[10px] tracking-[0.45em] text-void uppercase transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
          style={{
            background: `linear-gradient(90deg, ${accent}, ${secondary})`,
            boxShadow: `0 0 24px ${accent}44`,
          }}
        >
          Save
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
