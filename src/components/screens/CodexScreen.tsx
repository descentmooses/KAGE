import { ScreenShell } from '../ScreenShell'

export function CodexScreen() {
  return (
    <ScreenShell
      kanji="典"
      title="Codex"
      subtitle="典籍 — knowledge fragments locked"
    >
      <p className="mt-4 max-w-xs font-mono text-[10px] leading-relaxed tracking-wider text-mist/60">
        <span className="text-cyan">[</span>
        access restricted
        <span className="text-cyan">]</span>
      </p>
    </ScreenShell>
  )
}
