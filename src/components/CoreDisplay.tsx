interface CoreDisplayProps {
  value: number
}

export function CoreDisplay({ value }: CoreDisplayProps) {
  return (
    <div style={{ textAlign: 'center', padding: '8px 0' }}>
      <p
        style={{
          fontFamily: '"Orbitron", sans-serif',
          fontSize: 9,
          letterSpacing: '0.6em',
          color: '#8a8a9a',
          textTransform: 'uppercase',
          marginBottom: 16,
        }}
      >
        Core
      </p>
      <p
        style={{
          fontFamily: '"Orbitron", sans-serif',
          fontSize: 'clamp(5rem, 22vw, 8rem)',
          fontWeight: 700,
          lineHeight: 1,
          margin: 0,
          background: 'linear-gradient(155deg, #00f9ff, #eef0f8 40%, #ff00aa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 0 24px rgba(0,249,255,0.8)) drop-shadow(0 0 48px rgba(255,0,170,0.4))',
        }}
      >
        {value}
      </p>
      <div
        style={{
          margin: '28px auto 0',
          height: 1,
          width: 120,
          background: 'linear-gradient(90deg, transparent, #00f9ff, #ff00aa, transparent)',
          boxShadow: '0 0 12px rgba(0,249,255,0.5)',
        }}
      />
    </div>
  )
}
