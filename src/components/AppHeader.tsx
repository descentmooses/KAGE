export function AppHeader() {
  return (
    <header
      className="relative z-30 shrink-0 border-b border-white/[0.04] bg-void/80 backdrop-blur-xl"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 5%, #00f9ff55 35%, #ff00aa55 65%, transparent 95%)',
          boxShadow: '0 0 12px #00f9ff22',
        }}
      />

      <div className="mx-auto flex max-w-lg items-center justify-center gap-4 px-6 py-4">
        <span
          className="font-jp text-2xl font-extralight leading-none text-white/50"
          style={{ textShadow: '0 0 20px #00f9ff33' }}
          aria-hidden="true"
        >
          影
        </span>

        <span
          className="h-3 w-px bg-white/10"
          aria-hidden="true"
        />

        <h1
          className="font-display text-sm font-medium tracking-[0.55em] text-white/90"
          style={{
            textShadow: '0 0 16px #00f9ff44, 0 0 32px #ff00aa22',
          }}
        >
          KAGE
        </h1>
      </div>
    </header>
  )
}
