import { useState } from 'react'
import { TabScreen, ConfirmBanner } from '../TabScreen'
import { StatBar } from '../StatBar'
import { RatingModal } from '../RatingModal'
import { NeonInput } from '../ui/NeonInput'
import { NeonButton } from '../ui/NeonButton'
import { useReflectionLog } from '../../hooks/useReflectionLog'
import type { AreaConfig, AreaId } from '../../types'

const AREAS: AreaConfig[] = [
  { id: 'mind', label: 'Mind', kanji: '心', color: 'cyan' },
  { id: 'body', label: 'Body', kanji: '体', color: 'magenta' },
  { id: 'spirit', label: 'Spirit', kanji: '魂', color: 'cyan' },
]

export function ReflectScreen() {
  const { saveReflection } = useReflectionLog()
  const [saved, setSaved] = useState(false)
  const [mind, setMind] = useState(7)
  const [body, setBody] = useState(7)
  const [spirit, setSpirit] = useState(7)
  const [journal, setJournal] = useState('')
  const [activeArea, setActiveArea] = useState<AreaConfig | null>(null)

  const ratings = { mind, body, spirit }

  const handleSaveRating = (value: number) => {
    if (!activeArea) return
    if (activeArea.id === 'mind') setMind(value)
    if (activeArea.id === 'body') setBody(value)
    if (activeArea.id === 'spirit') setSpirit(value)
    setActiveArea(null)
  }

  const handleLog = () => {
    saveReflection({ mind, body, spirit }, journal)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <>
      <TabScreen
        kanji="省"
        title="Evening Reflection"
        subtitle="内省 — review the shadow you cast today"
      >
        {saved && (
          <ConfirmBanner message="Reflection logged. Archive updated." />
        )}

        <div className="space-y-6">
          <p
            className="font-mono text-[8px] tracking-[0.35em] uppercase"
            style={{ color: 'rgba(138,138,154,0.9)' }}
          >
            How did you do today?
          </p>

          <div className="space-y-2">
            {AREAS.map((area) => (
              <StatBar
                key={area.id}
                area={area}
                value={ratings[area.id as AreaId]}
                onTap={() => setActiveArea(area)}
              />
            ))}
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

      <RatingModal
        area={activeArea}
        initialValue={activeArea ? ratings[activeArea.id as AreaId] : null}
        onClose={() => setActiveArea(null)}
        onSave={handleSaveRating}
      />
    </>
  )
}
