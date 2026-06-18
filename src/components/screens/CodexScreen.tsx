import { ScreenShell } from '../ScreenShell'

export function CodexScreen() {
  return (
    <ScreenShell
      kanji="典"
      title="Codex"
      subtitle="典籍 — knowledge sealed"
    >
      <p className="mt-2 max-w-xs font-mono text-[10px] leading-relaxed tracking-wider text-mist/50">
        <span className="text-cyan">[</span>
        clearance required
        <span className="text-cyan">]</span>
      </p>
    </ScreenShell>
  )
}
