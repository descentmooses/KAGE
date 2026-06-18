import { ScreenShell } from '../ScreenShell'

export function ActivateScreen() {
  return (
    <ScreenShell
      kanji="活"
      title="Activate"
      subtitle="覚醒 — protocols awaiting deployment"
    >
      <p className="mt-4 max-w-xs font-mono text-[10px] leading-relaxed tracking-wider text-mist/60">
        <span className="text-cyan">[</span>
        standby
        <span className="text-cyan">]</span>
      </p>
    </ScreenShell>
  )
}
