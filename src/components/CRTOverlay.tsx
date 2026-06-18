export function CRTOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,249,255,0.12) 2px, rgba(0,249,255,0.12) 4px)',
          animation: 'scanline-drift 0.12s linear infinite',
        }}
      />

      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(0,249,255,0.04) 0%, transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(255,0,170,0.03) 0%, transparent 55%)',
        }}
      />

      <div className="absolute inset-0 border border-white/[0.02]" />
    </div>
  )
}
