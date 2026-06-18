import { NeonGlowText } from './NeonGlowText'
import { useTheme } from '../theme/useTheme'

export function KageHeroLogo() {
  const { tokens, mode } = useTheme()
  const isLight = mode === 'light'

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(12px, 4vw, 28px)',
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
          background: `radial-gradient(circle, ${tokens.cyanGlow} 0%, ${tokens.magentaGlow} 35%, transparent 70%)`,
          opacity: isLight ? 0.55 : 0.5,
          filter: 'blur(48px)',
          pointerEvents: 'none',
        }}
      />

      <div
        aria-hidden
        style={{
          position: 'absolute',
          width: 'min(70vw, 320px)',
          height: 'min(28vw, 120px)',
          bottom: '18%',
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.35) 0%, transparent 70%)',
          opacity: isLight ? 0.25 : 0.55,
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }}
      />

      <NeonGlowText
        variant="hero"
        as="p"
        style={{
          fontFamily: '"Orbitron", sans-serif',
          fontSize: 'clamp(1.75rem, 8vw, 3rem)',
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
          fontSize: 'clamp(7rem, 38vw, 13rem)',
          fontWeight: 500,
        }}
      >
        影
      </NeonGlowText>
    </div>
  )
}
