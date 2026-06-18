import { KageHeroLogo } from '../../components/KageHeroLogo'
import { useTheme } from '../../theme/useTheme'

/** Viewport minus app header + bottom nav (scroll content lives below hero). */
export const HOME_HERO_MIN_HEIGHT =
  'calc(100dvh - 48px - 64px - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px))'

export function HomeHeroSection() {
  const { tokens } = useTheme()

  return (
    <section
      style={{
        position: 'relative',
        minHeight: HOME_HERO_MIN_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        backgroundColor: tokens.surface,
      }}
    >
      <KageHeroLogo />
      <p
        aria-hidden
        style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          margin: 0,
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: 9,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: tokens.textSubtle,
          opacity: 0.85,
        }}
      >
        Scroll ↓
      </p>
    </section>
  )
}
