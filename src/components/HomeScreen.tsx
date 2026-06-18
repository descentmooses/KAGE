import { useMemo, useState, useCallback } from 'react'
import { KageHeroLogo } from './KageHeroLogo'
import { CoreDisplay } from './CoreDisplay'
import { NeonBar } from './NeonBar'
import { RatingModal } from './RatingModal'
import { useTheme } from '../theme/useTheme'
import { useTracker } from '../context/trackerContext'
import { AffirmationBanner } from './dashboard/AffirmationBanner'
import { RankBadge, QuickLogPanel } from './dashboard/RankBadge'
import { ProgressChart } from './dashboard/ProgressChart'
import { InsightCards, QuestList } from './dashboard/InsightCards'
import { GoalPanel } from './dashboard/GoalPanel'
import { ShadowParticles } from './ShadowParticles'
import { AREA_CONFIGS, type AreaConfig } from '../types'

export function HomeScreen() {
  const { tokens } = useTheme()
  const { ratings, core, logRating } = useTracker()
  const [activeArea, setActiveArea] = useState<AreaConfig | null>(null)
  const [voiceNote, setVoiceNote] = useState<string | null>(null)

  const stats = useMemo(() => ratings, [ratings])
  const highScore = core >= 85

  const handleSave = (value: number) => {
    if (!activeArea) return
    void logRating(activeArea.id, value)
    setActiveArea(null)
  }

  const onVoiceNote = useCallback((text: string) => {
    setVoiceNote(text)
    setTimeout(() => setVoiceNote(null), 4000)
  }, [])

  return (
    <>
      <main
        style={{
          height: '100%',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          backgroundColor: tokens.surface,
        }}
      >
        {highScore && <ShadowParticles />}

        <section
          style={{
            position: 'relative',
            minHeight: 'min(100%, 520px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            backgroundColor: tokens.surface,
          }}
        >
          <KageHeroLogo />
        </section>

        <section
          style={{
            padding: '24px 20px 48px',
            maxWidth: 400,
            margin: '0 auto',
            width: '100%',
          }}
        >
          <AffirmationBanner />
          <RankBadge />
          <CoreDisplay value={core} pulse={highScore} />

          <QuickLogPanel onVoiceNote={onVoiceNote} />
          {voiceNote && (
            <p
              className="animate-fade-in"
              style={{
                fontSize: 12,
                color: tokens.textMuted,
                margin: '0 0 16px',
                fontStyle: 'italic',
              }}
            >
              Voice: {voiceNote}
            </p>
          )}

          <ProgressChart />
          <InsightCards />
          <QuestList />

          <p
            style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: 9,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: tokens.textMuted,
              margin: '0 0 12px',
            }}
          >
            Pillars
          </p>
          <div style={{ marginBottom: 24 }}>
            {AREA_CONFIGS.map((area) => (
              <NeonBar
                key={area.id}
                area={area}
                value={stats[area.id]}
                onTap={() => setActiveArea(area)}
              />
            ))}
          </div>

          <GoalPanel />
        </section>
      </main>

      <RatingModal
        area={activeArea}
        initialValue={activeArea ? stats[activeArea.id] : null}
        onClose={() => setActiveArea(null)}
        onSave={handleSave}
      />
    </>
  )
}
