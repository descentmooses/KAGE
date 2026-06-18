import { useTheme } from '../theme/useTheme'

export function LoadingScreen({ message = 'Loading shadow archive…' }: { message?: string }) {
  const { tokens } = useTheme()

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        background: tokens.bg,
        color: tokens.crimson,
      }}
    >
      <div className="kage-spinner" aria-hidden />
      <p
        style={{
          margin: 0,
          fontFamily: '"Orbitron", sans-serif',
          letterSpacing: '0.45em',
          fontSize: 11,
          textTransform: 'uppercase',
        }}
      >
        KAGE
      </p>
      <p
        style={{
          margin: 0,
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: 10,
          letterSpacing: '0.12em',
          color: tokens.textMuted,
          textAlign: 'center',
          padding: '0 24px',
        }}
      >
        {message}
      </p>
    </div>
  )
}
