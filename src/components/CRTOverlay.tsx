export function CRTOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-20"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,249,255,0.14) 2px, rgba(0,249,255,0.14) 4px)',
          animation: 'scanline-drift 0.11s linear infinite',
        }}
      />

      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(0,249,255,0.05) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(255,0,170,0.04) 0%, transparent 50%)',
        }}
      />

      <div className="crt-noise absolute inset-0 opacity-[0.03]" />
    </div>
  )
}
