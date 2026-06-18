import { useTheme } from '../theme/useTheme'

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
          }}
        />
        <p
          style={{
            position: 'relative',
            fontFamily: '"Orbitron", sans-serif',
            fontSize: 'clamp(5rem, 22vw, 8rem)',
            fontWeight: 700,
            lineHeight: 1,
            margin: 0,
            background: tokens.coreGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: tokens.coreGlow,
            transition: 'filter 0.35s ease',
          }}
        >
          {value}
        </p>
      </div>

      <div
        style={{
          margin: '28px auto 0',
          height: 1,
          width: 120,
          background: tokens.dividerGradient,
          boxShadow: `0 0 12px ${tokens.cyanGlow}`,
          transition: 'background 0.35s ease',
        }}
      />
    </div>
  )
}
