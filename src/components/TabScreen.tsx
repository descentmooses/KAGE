import type { ReactNode } from 'react'

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
  return (
    <main style={{ height: '100%', overflowY: 'auto', padding: '20px 20px 24px' }}>
      <div style={{ maxWidth: 420, margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: 28 }}>
          <span style={{ fontSize: 40, color: 'rgba(255,255,255,0.2)', fontFamily: '"Noto Sans JP", sans-serif' }}>
            {kanji}
          </span>
          <h2
            style={{
              fontFamily: '"Orbitron", sans-serif',
              fontSize: 10,
              letterSpacing: '0.45em',
              color: 'rgba(255,255,255,0.8)',
              textTransform: 'uppercase',
              marginTop: 8,
            }}
          >
            {title}
          </h2>
          <p style={{ fontSize: 12, color: '#8a8a9a', marginTop: 8 }}>{subtitle}</p>
        </header>
        {children}
      </div>
    </main>
  )
}

export function ConfirmBanner({ message }: { message: string }) {
  return (
    <div
      style={{
        marginBottom: 20,
        padding: '12px 16px',
        textAlign: 'center',
        fontFamily: '"Share Tech Mono", monospace',
        fontSize: 11,
        color: '#00f9ff',
        border: '1px solid rgba(0,249,255,0.35)',
        background: 'rgba(0,249,255,0.08)',
        boxShadow: '0 0 16px rgba(0,249,255,0.15)',
      }}
    >
      {message}
    </div>
  )
}
