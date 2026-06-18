import { NeonGlowText } from './NeonGlowText'
import { useTheme } from '../theme/useTheme'

interface CoreDisplayProps {
  value: number
  pulse?: boolean
}

export function CoreDisplay({ value, pulse }: CoreDisplayProps) {
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
        className={pulse ? 'animate-core-breathe animate-score-pulse' : 'animate-core-breathe'}
        style={{
          position: 'relative',
          display: 'inline-block',
        }}
      >
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
          transition: 'background 0.35s ease',
        }}
      />
    </div>
  )
}
