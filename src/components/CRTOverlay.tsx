import { useTheme } from '../theme/useTheme'

export function CRTOverlay() {
  const { tokens } = useTheme()

  return (
    <div
      aria-hidden="true"
      style={{
        pointerEvents: 'none',
        position: 'fixed',
        inset: 0,
        zIndex: 5,
        background: tokens.crtVignette,
        opacity: tokens.crtOpacity,
        transition: 'opacity 0.35s ease, background 0.35s ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          backgroundImage: tokens.crtScanline,
          transition: 'background-image 0.35s ease',
        }}
      />
    </div>
  )
}
