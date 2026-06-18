export function CRTOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      aria-hidden="true"
    >
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Scanlines */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,240,255,0.15) 2px, rgba(0,240,255,0.15) 4px)',
          animation: 'scanline-drift 0.1s linear infinite',
        }}
      />

      {/* Subtle screen curvature glow */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(0,240,255,0.03) 0%, transparent 60%), radial-gradient(ellipse at 50% 100%, rgba(255,0,170,0.03) 0%, transparent 60%)',
        }}
      />

      {/* CRT edge glow */}
      <div className="absolute inset-0 border border-white/[0.03] rounded-sm" />
    </div>
  )
}
