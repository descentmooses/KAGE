export function AppHeader() {
  return (
    <header
      className="relative z-50 border-b border-white/10"
      style={{
        backgroundColor: 'rgba(10, 10, 10, 0.96)',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        boxShadow: '0 1px 0 rgba(0, 249, 255, 0.15), 0 4px 24px rgba(0, 0, 0, 0.4)',
      }}
    >
      <div className="mx-auto flex h-14 max-w-md items-center justify-center gap-3 px-6">
        <h1
          className="font-display text-sm font-semibold tracking-[0.55em]"
          style={{
            color: '#f0f0f8',
            textShadow: '0 0 20px rgba(0, 249, 255, 0.5)',
          }}
        >
          KAGE
        </h1>
        <span className="h-4 w-px bg-white/20" aria-hidden="true" />
        <span
          className="font-jp text-xl font-extralight"
          style={{ color: 'rgba(255,255,255,0.55)', textShadow: '0 0 16px rgba(0,249,255,0.35)' }}
        >
          影
        </span>
      </div>
    </header>
  )
}
