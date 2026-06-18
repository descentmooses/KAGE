import type { ReactNode } from 'react'
import { useTheme } from '../theme/useTheme'

interface ScreenShellProps {
  title: string
  kanji: string
  subtitle: string
  children?: ReactNode
}

export function ScreenShell({ title, kanji, subtitle, children }: ScreenShellProps) {
  const { tokens } = useTheme()

  return (
    <main className="relative flex h-full w-full flex-col items-center justify-center px-6 py-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/3 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full opacity-[0.04]"
          style={{
            background: `radial-gradient(circle, ${tokens.crimson} 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute bottom-1/4 right-0 h-[250px] w-[250px] rounded-full opacity-[0.03]"
          style={{
            background: `radial-gradient(circle, ${tokens.ember} 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        <span
          className="font-jp text-6xl font-extralight"
          style={{ color: tokens.textSubtle }}
        >
          {kanji}
        </span>
        <div className="flex flex-col gap-2">
          <h1
            className="font-display text-sm tracking-[0.45em] uppercase"
            style={{ color: tokens.text }}
          >
            {title}
          </h1>
          <p
            className="font-jp text-xs font-light tracking-[0.15em]"
            style={{ color: tokens.textMuted }}
          >
            {subtitle}
          </p>
        </div>
        <div
          className="h-px w-16"
          style={{ background: tokens.dividerGradient }}
        />
        {children}
      </div>
    </main>
  )
}
