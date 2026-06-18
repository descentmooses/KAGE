interface CoreDisplayProps {
  value: number
}

export function CoreDisplay({ value }: CoreDisplayProps) {
  return (
    <div className="relative flex flex-col items-center">
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 animate-pulse-glow sm:h-72 sm:w-72"
        style={{
          background:
            'radial-gradient(circle, rgba(0,249,255,0.12) 0%, rgba(255,0,170,0.06) 45%, transparent 70%)',
        }}
      />

      <span
        className="relative mb-4 font-display text-[10px] tracking-[0.6em] text-mist uppercase opacity-0 animate-fade-up"
        style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
      >
        Core
      </span>

      <div
        className="relative opacity-0 animate-fade-up animate-core-breathe"
        style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
      >
        <span
          className="core-glow font-display text-[7rem] leading-none font-medium tabular-nums sm:text-[9rem]"
          aria-label={`Core score ${value}`}
        >
          {value}
        </span>
      </div>

      <div
        className="relative mt-8 h-px w-24 opacity-0 animate-fade-up"
        style={{
          animationDelay: '0.45s',
          animationFillMode: 'forwards',
          background:
            'linear-gradient(90deg, transparent, #00f9ff, #ff00aa, transparent)',
          boxShadow: '0 0 12px #00f9ff33',
        }}
      />
    </div>
  )
}
