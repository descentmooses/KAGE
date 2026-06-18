import { NeonGlowText } from './NeonGlowText'
import { useTheme } from '../theme/useTheme'

export function KageHeroLogo() {
  const { tokens } = useTheme()

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
          width: 'min(90vw, 420px)',
          height: 'min(90vw, 420px)',
          background: `radial-gradient(circle, ${tokens.cyanGlow} 0%, transparent 65%)`,
          opacity: 0.45,
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      <NeonGlowText
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
