import type { AreaConfig } from '../types'

interface StatBarProps {
  area: AreaConfig
  value: number
  delay?: number
  onTap: () => void
}

export function StatBar({ area, value, delay = 0, onTap }: StatBarProps) {
  const fillPercent = (value / 10) * 100
  const accent = area.color === 'cyan' ? '#00f9ff' : '#ff00aa'
  const secondary = area.color === 'cyan' ? '#ff00aa' : '#00f9ff'

  return (
    <button
      type="button"
      onClick={onTap}
      className="group relative w-full py-4 text-left opacity-0 animate-fade-up active:scale-[0.99] transition-transform duration-200"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
      aria-label={`${area.label} ${value} out of 10. Tap to edit.`}
    >
      <div className="mb-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span
            className="font-jp text-2xl font-extralight text-white/35 transition-all duration-300 group-hover:text-white/70"
            style={{
              textShadow: '0 0 0 transparent',
            }}
          >
            {area.kanji}
          </span>
          <span className="font-display text-[9px] tracking-[0.45em] text-mist uppercase transition-colors duration-300 group-hover:text-ghost">
            {area.label}
          </span>
        </div>
        <span className="font-mono text-[10px] tracking-widest tabular-nums text-mist/40 transition-colors duration-300 group-hover:text-mist/70">
          <span style={{ color: accent, textShadow: `0 0 10px ${accent}66` }}>{value}</span>
          <span> / 10</span>
        </span>
      </div>

      {/* Neon track */}
      <div
        className="relative h-2 w-full overflow-hidden rounded-full transition-all duration-300 group-hover:h-2.5"
        style={{
          background: 'rgba(255,255,255,0.04)',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.6)',
        }}
      >
        {/* Ambient hover glow behind track */}
        <div
          className="pointer-events-none absolute -inset-1 rounded-full opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: `${accent}22` }}
        />

        {/* Fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${fillPercent}%`,
            background: `linear-gradient(90deg, ${accent}55 0%, ${accent} 60%, ${secondary}cc 100%)`,
            boxShadow: `
              0 0 12px ${accent}88,
              0 0 24px ${accent}44,
              inset 0 1px 0 rgba(255,255,255,0.25)
            `,
          }}
        />

        {/* Leading edge spark */}
        <div
          className="absolute top-1/2 -translate-y-1/2 rounded-full transition-all duration-700 ease-out"
          style={{
            left: `calc(${fillPercent}% - 4px)`,
            width: '8px',
            height: '8px',
            background: '#fff',
            boxShadow: `0 0 8px #fff, 0 0 16px ${accent}, 0 0 24px ${accent}88`,
            opacity: fillPercent > 2 ? 1 : 0,
          }}
        />

        {/* Scan shimmer on hover */}
        <div
          className="absolute inset-0 -translate-x-full rounded-full opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}44, transparent)`,
          }}
        />
      </div>

      {/* Tap hint */}
      <span className="mt-2 block font-mono text-[8px] tracking-[0.2em] text-mist/0 uppercase transition-all duration-300 group-hover:text-mist/40">
        tap to adjust
      </span>
    </button>
  )
}
