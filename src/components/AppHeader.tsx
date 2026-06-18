export function AppHeader() {
  return (
    <header
      className="fixed top-0 right-0 left-0 z-50 h-14 shrink-0 border-b border-white/[0.06] bg-void/95 backdrop-blur-xl"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 8%, #00f9ff66 42%, #ff00aa66 58%, transparent 92%)',
        }}
      />

      <div className="mx-auto flex h-full max-w-md items-center justify-center gap-3 px-6">
        <h1
          className="font-display text-[13px] font-semibold tracking-[0.55em] text-white"
          style={{ textShadow: '0 0 20px #00f9ff55' }}
        >
          KAGE
        </h1>
        <span
          className="h-4 w-px shrink-0 bg-white/15"
          aria-hidden="true"
        />
        <span
          className="font-jp text-xl font-extralight leading-none text-white/55"
          style={{ textShadow: '0 0 20px #00f9ff44' }}
        >
          影
        </span>
      </div>
    </header>
  )
}
