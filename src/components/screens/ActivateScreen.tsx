import { ScreenShell } from '../ScreenShell'

export function ActivateScreen() {
  return (
    <ScreenShell
      kanji="活"
      title="Activate"
      subtitle="覚醒 — neural protocols dormant"
    >
      <p className="mt-2 max-w-xs font-mono text-[10px] leading-relaxed tracking-wider text-mist/50">
        <span className="text-cyan">[</span>
        awaiting signal
        <span className="text-cyan">]</span>
      </p>
    </ScreenShell>
  )
}
