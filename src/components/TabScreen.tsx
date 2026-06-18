import type { ReactNode } from 'react'
import { useTheme } from '../theme/useTheme'

export function TabScreen({
  kanji,
  title,
  subtitle,
  children,
}: {
  kanji: string
  title: string
  subtitle: string
  children: ReactNode
}) {
  const { tokens } = useTheme()

  return (
    <main style={{ height: '100%', overflowY: 'auto', padding: '24px 20px 28px' }}>
      <div style={{ maxWidth: 420, margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: 32 }}>
          <span
            style={{
              fontSize: 40,
              color: tokens.textSubtle,
              fontFamily: '"Noto Sans JP", sans-serif',
              transition: 'color 0.35s ease',
            }}
          >
            {kanji}
          </span>
          <h2
            style={{
              fontFamily: '"Orbitron", sans-serif',
              fontSize: 10,
              letterSpacing: '0.45em',
              color: tokens.text,
              textTransform: 'uppercase',
              marginTop: 8,
              transition: 'color 0.35s ease',
            }}
          >
            {title}
          </h2>
          <p
            style={{
              fontSize: 12,
              color: tokens.textMuted,
              marginTop: 8,
              lineHeight: 1.5,
              transition: 'color 0.35s ease',
            }}
          >
            {subtitle}
          </p>
        </header>
        {children}
      </div>
    </main>
  )
}

export function ConfirmBanner({ message }: { message: string }) {
  const { tokens } = useTheme()

  return (
    <div
      className="animate-fade-in"
      style={{
        marginBottom: 20,
        padding: '12px 16px',
        textAlign: 'center',
        fontFamily: '"Share Tech Mono", monospace',
        fontSize: 11,
        color: tokens.bannerText,
        border: `1px solid ${tokens.bannerBorder}`,
        background: tokens.bannerBg,
        boxShadow: `0 0 12px ${tokens.accentGlow}`,
        transition: 'all 0.35s ease',
      }}
    >
      {message}
    </div>
  )
}
