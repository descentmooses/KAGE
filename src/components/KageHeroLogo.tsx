import { NeonGlowText } from './NeonGlowText'
import { useTheme } from '../theme/useTheme'

export function KageHeroLogo() {
  const { mode } = useTheme()
  const isLight = mode === 'light'

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(24px, 8vw, 56px)',
        textAlign: 'center',
        padding: '0 20px',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          width: 'min(95vw, 480px)',
          height: 'min(95vw, 480px)',
          background: isLight
            ? 'radial-gradient(circle, rgba(0,0,0,0.06) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(0,249,255,0.35) 0%, rgba(255,0,170,0.2) 35%, transparent 70%)',
          opacity: isLight ? 1 : 0.5,
          filter: 'blur(48px)',
          pointerEvents: 'none',
          transform: 'scale(1.6)',
        }}
      />

      <div
        aria-hidden
        style={{
          position: 'absolute',
          width: 'min(70vw, 320px)',
          height: 'min(28vw, 120px)',
          bottom: '18%',
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%)',
          opacity: isLight ? 0.35 : 0.55,
          filter: 'blur(20px)',
          pointerEvents: 'none',
          transform: 'scale(1.6)',
        }}
      />

      <NeonGlowText
        variant="hero"
        as="p"
        style={{
          fontFamily: '"Orbitron", sans-serif',
          fontSize: 'clamp(3.5rem, 16vw, 6rem)',
          fontWeight: 600,
          letterSpacing: '0.55em',
          marginLeft: '0.55em',
        }}
      >
        KAGE
      </NeonGlowText>

      <NeonGlowText
        variant="hero"
        as="h1"
        style={{
          fontFamily: '"Noto Sans JP", sans-serif',
          fontSize: 'clamp(14rem, 76vw, 26rem)',
          fontWeight: 500,
        }}
      >
        影
      </NeonGlowText>
    </div>
  )
}
