import { useState } from 'react'
import { TabScreen, ConfirmBanner } from '../TabScreen'
import { SegmentedControl } from '../ui/SegmentedControl'
import { NeonInput } from '../ui/NeonInput'
import { NeonButton } from '../ui/NeonButton'
import { useReflectionLog } from '../../hooks/useReflectionLog'

export function ReflectScreen() {
  const { lastLog, saveReflection } = useReflectionLog()
  const [saved, setSaved] = useState(false)
  const [mind, setMind] = useState(lastLog?.mind ?? 7)
  const [body, setBody] = useState(lastLog?.body ?? 7)
  const [spirit, setSpirit] = useState(lastLog?.spirit ?? 7)
  const [journal, setJournal] = useState(lastLog?.journal ?? '')

  const handleLog = () => {
    saveReflection({ mind, body, spirit }, journal)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <TabScreen
      kanji="省"
      title="Evening Reflection"
      subtitle="内省 — review the shadow you cast today"
    >
      {saved && (
        <ConfirmBanner message="Reflection logged. Archive updated." />
      )}

      <div className="space-y-7">
        <div>
          <p className="mb-4 font-mono text-[8px] tracking-[0.35em] text-mist uppercase">
            How did you do today?
          </p>
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <span className="w-10 font-jp text-lg text-white/35">心</span>
              <div className="flex-1">
                <SegmentedControl value={mind} onChange={setMind} />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-10 font-jp text-lg text-white/35">体</span>
              <div className="flex-1">
                <SegmentedControl value={body} onChange={setBody} />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-10 font-jp text-lg text-white/35">魂</span>
              <div className="flex-1">
                <SegmentedControl value={spirit} onChange={setSpirit} />
              </div>
            </div>
          </div>
        </div>

        <NeonInput
          label="What did you learn or overcome today?"
          value={journal}
          onChange={setJournal}
          placeholder="A line or two in the shadow log..."
          multiline
        />

        <NeonButton onClick={handleLog}>LOG REFLECTION</NeonButton>
      </div>
    </TabScreen>
  )
}
