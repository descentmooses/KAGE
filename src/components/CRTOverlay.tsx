import { useTheme } from '../theme/useTheme'
import { THEME_TRANSITION, themeEffectTransition } from '../theme/transitions'

export function CRTOverlay() {
  const { tokens, mode, showDarkEffects } = useTheme()
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
        opacity: isLight ? 0 : showDarkEffects ? tokens.crtOpacity : 0,
        transition: isLight
          ? THEME_TRANSITION
          : themeEffectTransition(showDarkEffects),
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: isLight ? 0 : showDarkEffects ? 0.05 : 0,
          backgroundImage: tokens.crtScanline,
          transition: isLight
            ? THEME_TRANSITION
            : themeEffectTransition(showDarkEffects),
        }}
      />
    </div>
  )
}
