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
  const [isSaving, setIsSaving] = useState(false)

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

  const handleSave = () => {
    setIsSaving(true)
    onSave(selected)
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center px-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rating-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/75 backdrop-blur-lg animate-fade-in"
        onClick={onClose}
        aria-label="Close"
      />

      <div
        className="glass-panel relative w-full max-w-sm animate-modal-in overflow-hidden border border-white/[0.08] px-7 py-9 sm:px-8 sm:py-10"
        style={{
          boxShadow: `
            0 0 0 1px ${accent}18,
            0 0 48px ${accent}15,
            0 0 96px ${secondary}08,
            inset 0 1px 0 rgba(255,255,255,0.06)
          `,
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}, ${secondary}, transparent)`,
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-px opacity-40"
          style={{
            background: `linear-gradient(90deg, transparent, ${secondary}88, transparent)`,
          }}
        />

        {/* Corner accents */}
        <span
          className="absolute top-3 left-3 h-3 w-3 border-t border-l opacity-40"
          style={{ borderColor: accent }}
        />
        <span
          className="absolute top-3 right-3 h-3 w-3 border-t border-r opacity-40"
          style={{ borderColor: secondary }}
        />
        <span
          className="absolute bottom-3 left-3 h-3 w-3 border-b border-l opacity-40"
          style={{ borderColor: secondary }}
        />
        <span
          className="absolute right-3 bottom-3 h-3 w-3 border-r border-b opacity-40"
          style={{ borderColor: accent }}
        />

        <header className="relative mb-7 text-center">
          <span
            className="mb-2 block font-jp text-5xl font-extralight leading-none"
            style={{ color: accent, textShadow: `0 0 48px ${accent}66` }}
          >
            {area.kanji}
          </span>
          <h2
            id="rating-modal-title"
            className="font-display text-[10px] tracking-[0.55em] text-white/75 uppercase"
          >
            {area.label}
          </h2>
        </header>

        <div className="relative mb-7 flex flex-col items-center">
          <div
            className="pointer-events-none absolute h-36 w-36 rounded-full"
            style={{
              background: `radial-gradient(circle, ${accent}20 0%, transparent 70%)`,
            }}
          />
          <span
            className="core-glow relative font-display text-8xl font-semibold tabular-nums leading-none"
            aria-live="polite"
          >
            {selected}
          </span>
          <span className="mt-3 font-mono text-[8px] tracking-[0.4em] text-mist/70 uppercase">
            Current Rating
          </span>
        </div>

        <div
          className="relative mb-7 h-2 w-full overflow-hidden rounded-full"
          style={{
            background: 'rgba(255,255,255,0.04)',
            boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.5)',
          }}
        >
          <div
            className="absolute inset-y-0 left-0 overflow-hidden rounded-full transition-all duration-200 ease-out"
            style={{
              width: `${fillPercent}%`,
              background: `linear-gradient(90deg, ${accent}88, ${accent})`,
              boxShadow: `0 0 16px ${accent}77`,
            }}
          >
            <div className="scanline-fill absolute inset-0 opacity-50 mix-blend-multiply" />
          </div>
        </div>

        <div className="mb-7 grid grid-cols-5 gap-1.5">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => {
            const isSelected = selected === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => setSelected(value)}
                className="relative py-3 font-mono text-[11px] transition-all duration-150 active:scale-90"
                style={{
                  color: isSelected ? '#0a0a0a' : 'rgba(138,138,154,0.5)',
                  background: isSelected
                    ? `linear-gradient(145deg, ${accent}, ${secondary})`
                    : 'rgba(255,255,255,0.025)',
                  border: `1px solid ${isSelected ? `${accent}66` : 'rgba(255,255,255,0.06)'}`,
                  boxShadow: isSelected
                    ? `0 0 18px ${accent}55, inset 0 1px 0 rgba(255,255,255,0.2)`
                    : 'none',
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
          disabled={isSaving}
          className="w-full py-4 font-display text-[10px] tracking-[0.5em] text-void uppercase transition-all duration-150 hover:brightness-110 active:scale-[0.97] disabled:opacity-80"
          style={{
            background: `linear-gradient(95deg, ${accent}, ${secondary})`,
            boxShadow: `0 0 28px ${accent}55, 0 4px 24px rgba(0,0,0,0.4)`,
          }}
        >
          Log Rating
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
