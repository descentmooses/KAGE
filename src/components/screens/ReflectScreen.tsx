import { useState } from 'react'
import { TabScreen, ConfirmBanner } from '../TabScreen'
import { NeonBar } from '../NeonBar'
import { RatingModal } from '../RatingModal'
import { NeonInput } from '../ui/NeonInput'
import { NeonButton } from '../ui/NeonButton'
import { useReflectionLog } from '../../hooks/useReflectionLog'
import { useTheme } from '../../theme/useTheme'
import type { AreaConfig, AreaId } from '../../types'

const AREAS: AreaConfig[] = [
  { id: 'mind', label: 'Mind', kanji: '心', color: 'cyan' },
  { id: 'body', label: 'Body', kanji: '体', color: 'magenta' },
  { id: 'spirit', label: 'Spirit', kanji: '魂', color: 'cyan' },
]

export function ReflectScreen() {
  const { tokens } = useTheme()
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
        {saved && <ConfirmBanner message="Reflection logged. Archive updated." />}

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

          {AREAS.map((area) => (
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
