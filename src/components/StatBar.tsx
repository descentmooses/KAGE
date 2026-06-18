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

  return (
    <button
      type="button"
      onClick={onTap}
      className="group relative w-full py-5 text-left opacity-0 animate-fade-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
      aria-label={`${area.label} ${value} out of 10`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span
            className="font-jp text-2xl font-extralight text-white/30 transition-all duration-300 group-hover:text-white/60"
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
        <span
          className="font-mono text-[10px] tracking-widest tabular-nums transition-all duration-300"
          style={{ color: `${accent}99` }}
        >
          <span className="transition-all duration-300 group-hover:text-[var(--hover-accent)]" style={{ ['--hover-accent' as string]: accent }}>
            {value}
          </span>
          <span className="text-mist/30"> / 10</span>
        </span>
      </div>

      <div className="relative h-[2px] w-full overflow-hidden bg-white/[0.04]">
        <div
          className="absolute inset-y-0 left-0 transition-all duration-700 ease-out"
          style={{
            width: `${fillPercent}%`,
            background: `linear-gradient(90deg, ${accent}44, ${accent})`,
            boxShadow: `0 0 8px ${accent}55, 0 0 20px ${accent}22`,
          }}
        />
        <div
          className="absolute inset-0 -translate-x-full opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}33, transparent)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ boxShadow: `inset 0 0 12px ${accent}22` }}
        />
      </div>
    </button>
  )
}
