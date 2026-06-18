interface CoreDisplayProps {
  value: number
}

export function CoreDisplay({ value }: CoreDisplayProps) {
  return (
    <div className="relative flex flex-col items-center">
      <div
        className="core-halo pointer-events-none absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-96 sm:w-96"
        aria-hidden="true"
      />

      <span
        className="relative mb-6 font-display text-[8px] tracking-[0.75em] text-mist/70 uppercase"
      >
        Core
      </span>

      <div className="relative">
        <span
          className="core-glow animate-core-breathe font-display text-[9.5rem] leading-[0.82] font-bold tabular-nums sm:text-[12.5rem]"
          aria-label={`Core score ${value}`}
        >
          {value}
        </span>
      </div>

      <div
        className="relative mt-12 h-px w-36 sm:w-44"
        style={{
          background:
            'linear-gradient(90deg, transparent, #00f9ff, #ff00aa, transparent)',
          boxShadow: '0 0 20px #00f9ff55, 0 0 32px #ff00aa33',
        }}
      />
    </div>
  )
}
