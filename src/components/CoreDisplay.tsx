import type { CSSProperties } from 'react'
import { useTheme } from '../theme/useTheme'

interface CoreDisplayProps {
  value: number
}

export function CoreDisplay({ value }: CoreDisplayProps) {
  const { tokens, mode } = useTheme()
  const isLight = mode === 'light'

  const numberStyle: CSSProperties = {
    position: 'relative',
    fontFamily: '"Orbitron", sans-serif',
    fontSize: 'clamp(3.25rem, 15vw, 5rem)',
    fontWeight: 700,
    lineHeight: 1,
    margin: 0,
    transition: 'color 0.35s ease, text-shadow 0.35s ease, filter 0.35s ease',
    ...(isLight
      ? {
          color: tokens.cyan,
          textShadow: `0 0 18px ${tokens.cyanGlow}, 0 2px 12px ${tokens.magentaGlow}`,
        }
      : {
          background: tokens.coreGradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
          filter: tokens.coreGlow,
        }),
  }

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
            opacity: isLight ? 0.25 : 0.4,
            filter: 'blur(20px)',
            pointerEvents: 'none',
          }}
        />
        <p style={numberStyle}>{value}</p>
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
