import { useState } from 'react'
import { TabScreen, ConfirmBanner } from '../TabScreen'
import { NeonBar } from '../NeonBar'
import { RatingModal } from '../RatingModal'
import { NeonInput } from '../ui/NeonInput'
import { NeonButton } from '../ui/NeonButton'
import { useTracker } from '../../context/trackerContext'
import { useTheme } from '../../theme/useTheme'
import type { AreaConfig, AreaId, ReflectionEntry } from '../../types'
import { AREA_CONFIGS } from '../../types'

function ReflectForm({ initial }: { initial: ReflectionEntry | null }) {
  const { tokens } = useTheme()
  const { saveReflection } = useTracker()
  const [saved, setSaved] = useState(false)
  const [mind, setMind] = useState(initial?.mind ?? 7)
  const [body, setBody] = useState(initial?.body ?? 7)
  const [spirit, setSpirit] = useState(initial?.spirit ?? 7)
  const [journal, setJournal] = useState(initial?.journal ?? '')
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
    void saveReflection({ mind, body, spirit }, journal)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <>
      {saved && (
        <ConfirmBanner message="Reflection logged. Archive updated. Pillars synced to home." />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <p
          style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: 9,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            margin: 0,
            color: tokens.textMuted,
          }}
        >
          How did you do today?
        </p>

        {AREA_CONFIGS.map((area) => (
          <NeonBar
            key={area.id}
            area={area}
            value={ratings[area.id as AreaId]}
            onTap={() => setActiveArea(area)}
          />
        ))}

        <NeonInput
          label="What did you learn or overcome today?"
          value={journal}
          onChange={setJournal}
          placeholder="A line or two in the shadow log..."
          multiline
        />

        <NeonButton onClick={handleLog}>LOG REFLECTION</NeonButton>
      </div>

      <RatingModal
        area={activeArea}
        initialValue={activeArea ? ratings[activeArea.id as AreaId] : null}
        onClose={() => setActiveArea(null)}
        onSave={handleSaveRating}
      />
    </>
  )
}

export function ReflectScreen() {
  const { reflectionToday } = useTracker()

  return (
    <TabScreen
      kanji="省"
      title="Evening Reflection"
      subtitle="内省 — review the shadow you cast today"
    >
      <ReflectForm key={reflectionToday?.id ?? 'new'} initial={reflectionToday} />
    </TabScreen>
  )
}
