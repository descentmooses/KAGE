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
          className="absolute top-1/3 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full opacity-[0.04]"
          style={{
            background: 'radial-gradient(circle, #00f0ff 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        <span
          className="font-jp text-6xl font-light text-white/15"
          style={{ textShadow: '0 0 40px #00f0ff11' }}
        >
          {kanji}
        </span>
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-sm tracking-[0.45em] text-white/60 uppercase">
            {title}
          </h1>
          <p className="font-jp text-xs font-light tracking-[0.15em] text-mist">
            {subtitle}
          </p>
        </div>
        {children}
      </div>
    </main>
  )
}
