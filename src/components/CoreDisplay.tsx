import { NeonGlowText } from './NeonGlowText'
import { useTheme } from '../theme/useTheme'
import { THEME_TRANSITION } from '../theme/transitions'

interface CoreDisplayProps {
  value: number
}

export function CoreDisplay({ value }: CoreDisplayProps) {
  const { tokens } = useTheme()

  return (
    <div style={{ textAlign: 'center', padding: '8px 0' }}>
      <p
        style={{
          fontFamily: '"Orbitron", sans-serif',
          fontSize: 9,
          letterSpacing: '0.6em',
          color: tokens.textMuted,
          textTransform: 'uppercase',
          marginBottom: 16,
          transition: 'color 0.35s ease',
        }}
      >
        Core
      </p>

      <div
        className="animate-core-breathe"
        style={{
          position: 'relative',
          display: 'inline-block',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: '-20%',
            background: `radial-gradient(circle, ${tokens.cyanGlow} 0%, transparent 70%)`,
            opacity: 0.4,
            filter: 'blur(20px)',
            pointerEvents: 'none',
            transition: THEME_TRANSITION,
          }}
        />
        <NeonGlowText
          as="p"
          style={{
            fontFamily: '"Orbitron", sans-serif',
            fontSize: 'clamp(3.25rem, 15vw, 5rem)',
            fontWeight: 700,
          }}
        >
          {value}
        </NeonGlowText>
      </div>

      <div
        style={{
          margin: '24px auto 0',
          height: 1,
          width: 100,
          background: tokens.dividerGradient,
          boxShadow: `0 0 12px ${tokens.cyanGlow}`,
          transition: 'background 0.35s ease',
        }}
      />
    </div>
  )
}
