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
      className="group relative w-full rounded-sm px-2 py-5 text-left opacity-0 animate-fade-up transition-all duration-200 hover:bg-white/[0.02] active:scale-[0.985] active:bg-white/[0.03]"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
      aria-label={`${area.label} ${value} out of 10. Tap to log rating.`}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ boxShadow: `inset 0 0 24px ${accent}08` }}
      />

      <div className="relative mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <span
            className="font-jp text-[1.65rem] font-extralight leading-none text-white/40 transition-all duration-300 group-hover:text-white/75"
            style={{ textShadow: '0 0 0 transparent' }}
          >
            {area.kanji}
          </span>
          <span className="font-display text-[8px] tracking-[0.5em] text-mist/90 uppercase transition-colors duration-300 group-hover:text-ghost">
            {area.label}
          </span>
        </div>
        <span className="font-mono text-[10px] tracking-[0.15em] tabular-nums text-mist/35">
          <span
            className="transition-all duration-300 group-hover:brightness-125"
            style={{ color: accent, textShadow: `0 0 12px ${accent}77` }}
          >
            {String(value).padStart(2, '0')}
          </span>
        </span>
      </div>

      <div
        className="relative h-2.5 w-full overflow-hidden rounded-full transition-all duration-300 group-hover:h-3"
        style={{
          background: 'rgba(255,255,255,0.035)',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)',
        }}
      >
        <div
          className="pointer-events-none absolute -inset-2 rounded-full opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: `${accent}18` }}
        />

        <div
          className="absolute inset-y-0 left-0 overflow-hidden rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${fillPercent}%`,
            background: `linear-gradient(90deg, ${accent}66 0%, ${accent} 55%, ${secondary} 100%)`,
            boxShadow: `
              0 0 14px ${accent}99,
              0 0 28px ${accent}44,
              inset 0 1px 0 rgba(255,255,255,0.3)
            `,
          }}
        >
          <div className="scanline-fill absolute inset-0 opacity-60 mix-blend-multiply" />
        </div>

        <div
          className="absolute top-1/2 z-10 -translate-y-1/2 rounded-full transition-all duration-700 ease-out"
          style={{
            left: `clamp(0px, calc(${fillPercent}% - 5px), calc(100% - 10px))`,
            width: '10px',
            height: '10px',
            background: 'radial-gradient(circle, #fff 0%, #fff8 40%, transparent 70%)',
            boxShadow: `0 0 6px #fff, 0 0 14px ${accent}, 0 0 28px ${accent}aa`,
            opacity: fillPercent > 3 ? 1 : 0,
          }}
        />

        <div
          className="absolute inset-0 -translate-x-full opacity-0 transition-all duration-500 group-hover:translate-x-full group-hover:opacity-100"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${accent}33 50%, transparent 100%)`,
          }}
        />
      </div>
    </button>
  )
}
