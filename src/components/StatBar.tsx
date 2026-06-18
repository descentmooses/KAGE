import type { AreaConfig } from '../types'

const CYAN = '#00f9ff'
const MAGENTA = '#ff00aa'

interface StatBarProps {
  area: AreaConfig
  value: number
  delay?: number
  onTap: () => void
}

export function StatBar({ area, value, delay = 0, onTap }: StatBarProps) {
  const fillPercent = (value / 10) * 100

  return (
    <button
      type="button"
      onClick={onTap}
      className="neon-bar group relative w-full rounded-md px-1 py-4 text-left transition-all duration-200 hover:bg-white/[0.025] active:scale-[0.98] active:bg-white/[0.04] sm:py-5"
      style={{ animationDelay: `${delay}ms` }}
      aria-label={`${area.label} ${value} out of 10. Tap to log rating.`}
    >
      <div className="relative mb-3.5 flex items-baseline justify-between gap-4">
        <div className="flex min-w-0 items-baseline gap-3">
          <span className="font-jp text-2xl font-extralight leading-none text-white/45 transition-colors duration-200 group-hover:text-white/80">
            {area.kanji}
          </span>
          <span className="font-display text-[7px] tracking-[0.48em] text-mist/80 uppercase transition-colors duration-200 group-hover:text-ghost">
            {area.label}
          </span>
        </div>
        <span
          className="shrink-0 font-mono text-[10px] tracking-[0.12em] tabular-nums transition-all duration-200 group-hover:brightness-125"
          style={{ color: CYAN, textShadow: `0 0 14px ${CYAN}88` }}
        >
          {String(value).padStart(2, '0')}
        </span>
      </div>

      <div className="neon-track relative h-3 w-full overflow-hidden rounded-full transition-all duration-200 group-hover:h-3.5">
        <div
          className="neon-fill absolute inset-y-0 left-0 overflow-hidden rounded-full transition-[width] duration-700 ease-out"
          style={{ width: `${fillPercent}%` }}
        >
          <div className="crt-bar-texture absolute inset-0 opacity-70" />
          <div
            className="absolute inset-y-0 right-0 w-6"
            style={{
              background: `linear-gradient(90deg, transparent, ${MAGENTA}cc)`,
            }}
          />
        </div>

        <div
          className="neon-cap absolute top-1/2 z-10 -translate-y-1/2 rounded-full transition-all duration-700 ease-out"
          style={{
            left: `clamp(2px, calc(${fillPercent}% - 6px), calc(100% - 14px))`,
            opacity: fillPercent > 4 ? 1 : 0,
          }}
        />
      </div>
    </button>
  )
}
