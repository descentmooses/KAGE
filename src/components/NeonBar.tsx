import type { AreaConfig } from '../types'

interface NeonBarProps {
  area: AreaConfig
  rating: number | null
  delay?: number
  onTap: () => void
}

export function NeonBar({ area, rating, delay = 0, onTap }: NeonBarProps) {
  const fillPercent = rating !== null ? (rating / 10) * 100 : 0
  const accent = area.color === 'cyan' ? '#00f0ff' : '#ff00aa'
  const accentDim = area.color === 'cyan' ? '#00f0ff33' : '#ff00aa33'

  return (
    <button
      type="button"
      onClick={onTap}
      className="group relative w-full px-1 py-3 text-left opacity-0 animate-fade-up transition-colors duration-300 hover:bg-white/[0.02]"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
      aria-label={`Rate ${area.label}, current ${rating ?? 'unrated'}`}
    >
      <div className="mb-2 flex items-baseline justify-between">
        <div className="flex items-baseline gap-3">
          <span className="font-jp text-xl font-light text-white/25 transition-colors duration-300 group-hover:text-white/50">
            {area.kanji}
          </span>
          <span className="font-display text-[10px] tracking-[0.35em] text-ghost uppercase transition-colors duration-300 group-hover:text-white">
            {area.label}
          </span>
        </div>
        <span
          className="font-mono text-[10px] tracking-widest transition-colors duration-300"
          style={{ color: rating !== null ? accent : undefined }}
        >
          {rating !== null ? (
            <span className="text-ghost">
              <span style={{ color: accent }}>{rating}</span>
              <span className="text-mist/40"> / 10</span>
            </span>
          ) : (
            <span className="text-mist/40">—</span>
          )}
        </span>
      </div>

      <div className="relative h-px w-full bg-white/[0.06]">
        <div
          className="absolute inset-y-0 left-0 transition-all duration-500 ease-out"
          style={{
            width: `${fillPercent}%`,
            background: `linear-gradient(90deg, ${accentDim}, ${accent})`,
            boxShadow: `0 0 12px ${accentDim}, 0 0 4px ${accent}`,
          }}
        />
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}44, transparent)`,
          }}
        />
      </div>
    </button>
  )
}
