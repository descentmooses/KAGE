import { useTheme } from '../theme/useTheme'
import { THEME_TRANSITION } from '../theme/transitions'

export function CRTOverlay() {
  const { tokens, mode } = useTheme()
  const isLight = mode === 'light'

  return (
    <div
      aria-hidden="true"
      style={{
        pointerEvents: 'none',
        position: 'fixed',
        inset: 0,
        zIndex: 5,
        background: tokens.crtVignette,
        opacity: isLight ? 0 : tokens.crtOpacity,
        transition: THEME_TRANSITION,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: isLight ? 0 : 0.05,
          backgroundImage: tokens.crtScanline,
          transition: THEME_TRANSITION,
        }}
      />
    </div>
  )
}
