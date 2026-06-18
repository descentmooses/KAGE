export function CRTOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[55]"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 48%, rgba(0,0,0,0.62) 100%)',
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,249,255,0.18) 2px, rgba(0,249,255,0.18) 4px)',
          animation: 'scanline-drift 0.1s linear infinite',
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,0,170,0.08) 3px, rgba(255,0,170,0.08) 4px)',
        }}
      />

      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse at 50% -10%, rgba(0,249,255,0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 110%, rgba(255,0,170,0.05) 0%, transparent 50%)',
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="absolute inset-0 border border-white/[0.03]" />
    </div>
  )
}
