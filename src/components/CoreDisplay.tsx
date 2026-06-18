interface CoreDisplayProps {
  value: number
}

export function CoreDisplay({ value }: CoreDisplayProps) {
  return (
    <div className="relative flex flex-col items-center py-2">
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 animate-pulse-glow sm:h-80 sm:w-80"
        style={{
          background:
            'radial-gradient(circle, rgba(0,249,255,0.18) 0%, rgba(255,0,170,0.08) 40%, transparent 68%)',
        }}
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 sm:h-60 sm:w-60"
        style={{
          background:
            'radial-gradient(circle, transparent 40%, rgba(0,249,255,0.06) 70%, transparent 100%)',
          boxShadow: '0 0 60px #00f9ff22, 0 0 100px #ff00aa11',
        }}
      />

      <span
        className="relative mb-5 font-display text-[9px] tracking-[0.7em] text-mist/80 uppercase opacity-0 animate-fade-up"
        style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
      >
        Core
      </span>

      <div
        className="relative opacity-0 animate-fade-up"
        style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
      >
        <span
          className="core-glow animate-core-breathe font-display text-[8.5rem] leading-[0.85] font-semibold tabular-nums sm:text-[11rem]"
          aria-label={`Core score ${value}`}
        >
          {value}
        </span>
      </div>

      <div
        className="relative mt-10 h-px w-32 opacity-0 animate-fade-up sm:w-40"
        style={{
          animationDelay: '0.4s',
          animationFillMode: 'forwards',
          background:
            'linear-gradient(90deg, transparent, #00f9ff, #ff00aa, transparent)',
          boxShadow: '0 0 16px #00f9ff44, 0 0 24px #ff00aa22',
        }}
      />
    </div>
  )
}
