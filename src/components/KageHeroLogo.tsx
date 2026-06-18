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
        gap: 'clamp(16px, 5vw, 40px)',
        textAlign: 'center',
        padding: '0 12px',
        width: '100%',
        maxWidth: '100vw',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          width: 'min(120vw, 640px)',
          height: 'min(120vw, 640px)',
          background: isLight
            ? 'radial-gradient(circle, rgba(0,0,0,0.06) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(0,249,255,0.35) 0%, rgba(255,0,170,0.2) 35%, transparent 70%)',
          opacity: isLight ? 1 : 0.5,
          filter: 'blur(48px)',
          pointerEvents: 'none',
        }}
      />

      <div
        aria-hidden
        style={{
          position: 'absolute',
          width: 'min(90vw, 420px)',
          height: 'min(36vw, 160px)',
          bottom: '12%',
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%)',
          opacity: isLight ? 0.35 : 0.55,
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }}
      />

      <NeonGlowText
        variant="hero"
        as="p"
        style={{
          fontFamily: '"Orbitron", sans-serif',
          fontSize: 'clamp(2.25rem, 11vw, 4.25rem)',
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
          fontSize: 'clamp(10rem, 58vw, 22rem)',
          fontWeight: 500,
        }}
      >
        影
      </NeonGlowText>
    </div>
  )
}
