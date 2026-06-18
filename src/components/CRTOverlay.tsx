export function CRTOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        pointerEvents: 'none',
        position: 'fixed',
        inset: 0,
        zIndex: 5,
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,249,255,0.15) 2px, rgba(0,249,255,0.15) 4px)',
        }}
      />
    </div>
  )
}
