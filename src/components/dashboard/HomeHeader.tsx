import { useTheme } from '../../theme/useTheme'
import { NeonGlowText } from '../NeonGlowText'
import { ShadowPresence } from './ShadowPresence'

interface HomeHeaderProps {
  core: number
  streak: number
}

export function HomeHeader({ core, streak }: HomeHeaderProps) {
  const { tokens } = useTheme()

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '16px 0 8px',
        marginBottom: 8,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <ShadowPresence />
        <div style={{ minWidth: 0 }}>
          <NeonGlowText
            as="p"
            style={{
              fontFamily: '"Orbitron", sans-serif',
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: '0.35em',
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            KAGE
          </NeonGlowText>
          <p
            style={{
              margin: '2px 0 0',
              fontSize: 10,
              letterSpacing: '0.2em',
              color: tokens.textMuted,
              textTransform: 'uppercase',
            }}
          >
            {streak > 0 ? `${streak}-day streak` : 'Shadow log'}
          </p>
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <p
          style={{
            margin: 0,
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: 10,
            letterSpacing: '0.2em',
            color: tokens.textMuted,
            textTransform: 'uppercase',
          }}
        >
          Core
        </p>
        <p
          style={{
            margin: 0,
            fontFamily: '"Orbitron", sans-serif',
            fontSize: 36,
            fontWeight: 700,
            lineHeight: 1,
            background: tokens.coreGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {core}
        </p>
      </div>
    </header>
  )
}
