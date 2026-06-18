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
            'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.58) 100%)',
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.048]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,249,255,0.16) 2px, rgba(0,249,255,0.16) 4px)',
          animation: 'scanline-drift 0.11s linear infinite',
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(255,0,170,0.1) 4px, rgba(255,0,170,0.1) 5px)',
        }}
      />

      <div
        className="absolute inset-0 opacity-25"
        style={{
          background:
            'radial-gradient(ellipse at 50% -5%, rgba(0,249,255,0.055) 0%, transparent 48%), radial-gradient(ellipse at 50% 105%, rgba(255,0,170,0.04) 0%, transparent 48%)',
        }}
      />

      <div className="crt-noise absolute inset-0 opacity-[0.035]" />

      <div className="absolute inset-0 border border-white/[0.025]" />
    </div>
  )
}
