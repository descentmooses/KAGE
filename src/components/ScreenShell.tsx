import type { ReactNode } from 'react'

interface ScreenShellProps {
  title: string
  kanji: string
  subtitle: string
  children?: ReactNode
}

export function ScreenShell({ title, kanji, subtitle, children }: ScreenShellProps) {
  return (
    <main className="relative flex h-full w-full flex-col items-center justify-center px-6 py-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/3 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full opacity-[0.05]"
          style={{
            background: 'radial-gradient(circle, #00f9ff 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-1/4 right-0 h-[250px] w-[250px] rounded-full opacity-[0.03]"
          style={{
            background: 'radial-gradient(circle, #ff00aa 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        <span
          className="font-jp text-6xl font-extralight text-white/12"
          style={{ textShadow: '0 0 48px #00f9ff18' }}
        >
          {kanji}
        </span>
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-sm tracking-[0.45em] text-white/55 uppercase">
            {title}
          </h1>
          <p className="font-jp text-xs font-light tracking-[0.15em] text-mist">
            {subtitle}
          </p>
        </div>
        <div
          className="h-px w-16"
          style={{
            background: 'linear-gradient(90deg, transparent, #00f9ff55, #ff00aa55, transparent)',
          }}
        />
        {children}
      </div>
    </main>
  )
}
