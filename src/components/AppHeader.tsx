export function AppHeader() {
  return (
    <header
      className="fixed top-0 right-0 left-0 z-40 h-14 border-b border-white/[0.05] bg-void/92 backdrop-blur-2xl"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 8%, #00f9ff66 42%, #ff00aa66 58%, transparent 92%)',
          boxShadow: '0 1px 14px #00f9ff28',
        }}
      />

      <div className="mx-auto flex h-full max-w-md items-center justify-center gap-3.5 px-6">
        <span
          className="font-jp text-[1.35rem] font-extralight leading-none text-white/55"
          style={{ textShadow: '0 0 24px #00f9ff44' }}
          aria-hidden="true"
        >
          影
        </span>

        <span
          className="h-4 w-px shrink-0"
          style={{
            background: 'linear-gradient(180deg, transparent, #00f9ff55, #ff00aa55, transparent)',
          }}
          aria-hidden="true"
        />

        <h1
          className="font-display text-[13px] font-semibold tracking-[0.62em] text-white"
          style={{
            textShadow: '0 0 20px #00f9ff55, 0 0 40px #ff00aa28',
          }}
        >
          KAGE
        </h1>
      </div>
    </header>
  )
}
