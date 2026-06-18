import { ScreenShell } from '../ScreenShell'

export function ReflectScreen() {
  return (
    <ScreenShell
      kanji="省"
      title="Reflect"
      subtitle="内省 — shadow archive empty"
    >
      <p className="mt-2 max-w-xs font-mono text-[10px] leading-relaxed tracking-wider text-mist/50">
        <span className="text-magenta">[</span>
        no logs recorded
        <span className="text-magenta">]</span>
      </p>
    </ScreenShell>
  )
}
