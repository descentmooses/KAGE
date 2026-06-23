import { useState } from 'react'
import { TabScreen, ConfirmBanner } from '../../components/TabScreen'
import { NeonBar } from '../../components/NeonBar'
import { RatingModal } from '../logging/RatingModal'
import { NeonInput } from '../../components/ui/NeonInput'
import { NeonButton } from '../../components/ui/NeonButton'
import { useTracker } from '../../context/trackerContext'
import { useTheme } from '../../theme/useTheme'
import type { AreaConfig, AreaId, ReflectionEntry } from '../../types'
import { AREA_CONFIGS } from '../../types'

const EVENING_PHASES = [
  'Exhale the day — you made it through.',
  'Score the triad without flinching.',
  'Archive one truth the day tried to erase.',
]

function ReflectForm({ initial }: { initial: ReflectionEntry | null }) {
  const { tokens } = useTheme()
  const { saveReflection } = useTracker()
  const [phase, setPhase] = useState(0)
  const [saved, setSaved] = useState(false)
  const [mind, setMind] = useState(initial?.mind ?? 0)
  const [body, setBody] = useState(initial?.body ?? 0)
  const [spirit, setSpirit] = useState(initial?.spirit ?? 0)
  const [journal, setJournal] = useState(initial?.journal ?? '')
  const [activeArea, setActiveArea] = useState<AreaConfig | null>(null)

  const ratings = { mind, body, spirit }
  const hasRating = Math.max(mind, body, spirit) >= 1

  const handleSaveRating = (value: number) => {
    if (!activeArea) return
    if (activeArea.id === 'mind') setMind(value)
    if (activeArea.id === 'body') setBody(value)
    if (activeArea.id === 'spirit') setSpirit(value)
    setActiveArea(null)
  }

  const handleLog = () => {
    if (!hasRating) return
    void saveReflection({ mind, body, spirit }, journal)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <>
      {saved && (
        <ConfirmBanner message="Shadow archive sealed. Pillars synced. Elara remembers. +50 XP" />
      )}

      <div
        className="animate-fade-in"
        style={{
          padding: '16px 18px',
          borderRadius: 12,
          border: `1px solid ${tokens.borderAccent}`,
          background: `linear-gradient(180deg, ${tokens.bannerBg} 0%, transparent 100%)`,
          marginBottom: 24,
        }}
      >
        <p
          style={{
            margin: '0 0 8px',
            fontFamily: '"Orbitron", sans-serif',
            fontSize: 9,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: tokens.crimson,
            textAlign: 'center',
          }}
        >
          Evening ritual · phase {phase + 1}/3
        </p>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            lineHeight: 1.65,
            color: tokens.text,
            textAlign: 'center',
            fontStyle: 'italic',
          }}
        >
          {EVENING_PHASES[phase]}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {phase === 0 && (
          <NeonButton onClick={() => setPhase(1)}>BEGIN REFLECTION</NeonButton>
        )}

        {phase >= 1 && (
          <>
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
          </>
        )}

        {phase >= 2 && (
          <NeonInput
            label="What did you learn or overcome today?"
            value={journal}
            onChange={setJournal}
            placeholder="A line or two in the shadow log..."
            multiline
          />
        )}

        {phase === 1 && (
          <NeonButton onClick={() => setPhase(2)}>CONTINUE TO ARCHIVE</NeonButton>
        )}
        {phase === 2 && (
          <NeonButton onClick={handleLog} disabled={!hasRating}>
            SEAL SHADOW ARCHIVE
          </NeonButton>
        )}
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
      subtitle="内省 — close the loop with honor"
    >
      <ReflectForm key={reflectionToday?.id ?? 'new'} initial={reflectionToday} />
    </TabScreen>
  )
}
