import type { ReactNode } from 'react'

interface TabScreenProps {
  kanji: string
  title: string
  subtitle: string
  children: ReactNode
}

export function TabScreen({ kanji, title, subtitle, children }: TabScreenProps) {
  return (
    <main className="h-full overflow-y-auto pb-4">
      <div className="relative mx-auto max-w-md px-5 py-6">
        <header className="mb-7 text-center">
          <span
            className="mb-2 block font-jp text-4xl font-extralight"
            style={{ color: 'rgba(255,255,255,0.2)' }}
          >
            {kanji}
          </span>
          <h2
            className="font-display text-[10px] tracking-[0.5em] uppercase"
            style={{ color: 'rgba(255,255,255,0.75)' }}
          >
            {title}
          </h2>
          <p className="mt-2 font-jp text-xs" style={{ color: 'rgba(138,138,154,0.95)' }}>
            {subtitle}
          </p>
          <div
            className="mx-auto mt-4 h-px w-20"
            style={{
              background: 'linear-gradient(90deg, transparent, #00f9ff, #ff00aa, transparent)',
            }}
          />
        </header>

        {children}
      </div>
    </main>
  )
}

interface ConfirmBannerProps {
  message: string
}

export function ConfirmBanner({ message }: ConfirmBannerProps) {
  return (
    <div
      className="mb-5 border px-4 py-3 text-center font-mono text-[10px] tracking-wider"
      style={{
        color: '#00f9ff',
        borderColor: 'rgba(0, 249, 255, 0.35)',
        backgroundColor: 'rgba(0, 249, 255, 0.08)',
        boxShadow: '0 0 20px rgba(0, 249, 255, 0.15)',
      }}
    >
      {message}
    </div>
  )
}
