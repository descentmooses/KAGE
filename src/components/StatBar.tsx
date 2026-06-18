import type { AreaConfig } from '../types'

const CYAN = '#00f9ff'
const MAGENTA = '#ff00aa'

interface StatBarProps {
  area: AreaConfig
  value: number
  onTap: () => void
}

export function StatBar({ area, value, onTap }: StatBarProps) {
  const fillPercent = (value / 10) * 100

  return (
    <button
      type="button"
      onClick={onTap}
      className="group w-full rounded-md px-1 py-4 text-left transition-colors hover:bg-white/5 active:scale-[0.98] sm:py-5"
      aria-label={`${area.label} ${value} out of 10. Tap to adjust.`}
    >
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <span className="font-jp text-2xl font-extralight text-white/50 group-hover:text-white/80">
            {area.kanji}
          </span>
          <span
            className="font-display text-[7px] tracking-[0.45em] uppercase"
            style={{ color: 'rgba(138,138,154,0.9)' }}
          >
            {area.label}
          </span>
        </div>
        <span
          className="font-mono text-[10px] tabular-nums"
          style={{ color: CYAN, textShadow: `0 0 12px ${CYAN}` }}
        >
          {String(value).padStart(2, '0')}
        </span>
      </div>

      <div className="neon-track relative h-3 w-full overflow-hidden rounded-full">
        <div
          className="neon-fill absolute inset-y-0 left-0 overflow-hidden rounded-full"
          style={{ width: `${fillPercent}%` }}
        >
          <div className="crt-bar-texture absolute inset-0" />
          <div
            className="absolute inset-y-0 right-0 w-5"
            style={{ background: `linear-gradient(90deg, transparent, ${MAGENTA})` }}
          />
        </div>
        <div
          className="neon-cap absolute top-1/2 -translate-y-1/2"
          style={{
            left: `clamp(2px, calc(${fillPercent}% - 6px), calc(100% - 14px))`,
            opacity: fillPercent > 4 ? 1 : 0,
          }}
        />
      </div>
    </button>
  )
}
