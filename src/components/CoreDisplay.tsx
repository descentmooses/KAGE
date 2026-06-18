interface CoreDisplayProps {
  value: number
}

export function CoreDisplay({ value }: CoreDisplayProps) {
  return (
    <div className="relative flex flex-col items-center py-2">
      <div className="core-halo pointer-events-none absolute h-64 w-64 rounded-full sm:h-80 sm:w-80" />

      <span
        className="relative mb-4 font-display text-[8px] tracking-[0.7em] uppercase"
        style={{ color: 'rgba(138,138,154,0.9)' }}
      >
        Core
      </span>

      <span
        className="core-glow animate-core-breathe font-display text-[9rem] font-bold leading-none tabular-nums sm:text-[11rem]"
        aria-label={`Core score ${value}`}
      >
        {value}
      </span>

      <div
        className="mt-8 h-px w-32"
        style={{
          background: 'linear-gradient(90deg, transparent, #00f9ff, #ff00aa, transparent)',
          boxShadow: '0 0 16px rgba(0, 249, 255, 0.4)',
        }}
      />
    </div>
  )
}
