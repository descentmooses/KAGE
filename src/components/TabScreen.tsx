import type { ReactNode } from 'react'

interface TabScreenProps {
  kanji: string
  title: string
  subtitle: string
  children: ReactNode
}

export function TabScreen({ kanji, title, subtitle, children }: TabScreenProps) {
  return (
    <main className="relative h-full w-full overflow-y-auto">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #00f9ff 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-md px-5 py-6">
        <header className="mb-8 text-center">
          <span className="mb-2 block font-jp text-4xl font-extralight text-white/20">
            {kanji}
          </span>
          <h2 className="font-display text-[10px] tracking-[0.5em] text-white/70 uppercase">
            {title}
          </h2>
          <p className="mt-2 font-jp text-xs text-mist/80">{subtitle}</p>
          <div
            className="mx-auto mt-5 h-px w-20"
            style={{
              background:
                'linear-gradient(90deg, transparent, #00f9ff55, #ff00aa55, transparent)',
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
      className="mb-6 border border-cyan/30 bg-cyan/10 px-4 py-3 text-center font-mono text-[10px] tracking-wider text-cyan animate-fade-in"
      style={{ boxShadow: '0 0 24px #00f9ff22' }}
    >
      {message}
    </div>
  )
}
