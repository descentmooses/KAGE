import { useState, useCallback } from 'react'
import { NeonBar } from './NeonBar'
import { RatingModal } from './RatingModal'
import { useTheme } from '../theme/useTheme'
import { useTracker } from '../context/trackerContext'
import { AffirmationBanner } from './dashboard/AffirmationBanner'
import { HomeHeader } from './dashboard/HomeHeader'
import { RankBadge } from './dashboard/RankBadge'
import { QuickLogPanel, CompactPillars } from './dashboard/QuickLogPanel'
import { ProgressChart } from './dashboard/ProgressChart'
import { InsightCards, QuestList } from './dashboard/InsightCards'
import { GoalPanel } from './dashboard/GoalPanel'
import { ShadowParticles } from './ShadowParticles'
import { CollapsibleSection } from './ui/CollapsibleSection'
import { AREA_CONFIGS, type AreaConfig } from '../types'

export function HomeScreen() {
  const { tokens } = useTheme()
  const { ratings, core, logRating, gamification } = useTracker()
  const [activeArea, setActiveArea] = useState<AreaConfig | null>(null)
  const [voiceNote, setVoiceNote] = useState<string | null>(null)

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

  const openAdjust = useCallback((area: AreaConfig) => {
    setActiveArea(area)
  }, [])

  return (
    <>
      <main
        style={{
          height: '100%',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          backgroundColor: tokens.bg,
        }}
      >
        {highScore && <ShadowParticles />}

        <section
          style={{
            padding: '12px 20px 56px',
            maxWidth: 400,
            margin: '0 auto',
            width: '100%',
          }}
        >
          <HomeHeader core={core} streak={gamification.currentStreak} />
          <AffirmationBanner />
          <QuickLogPanel onVoiceNote={onVoiceNote} onAdjust={openAdjust} />
          <CompactPillars onAdjust={openAdjust} />

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

          <CollapsibleSection
            title="Deeper shadow"
            subtitle="Rank, trends, quests, goals"
            defaultOpen={false}
          >
            <RankBadge />
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
              Pillar detail
            </p>
            <div style={{ marginBottom: 24 }}>
              {AREA_CONFIGS.map((area) => (
                <NeonBar
                  key={area.id}
                  area={area}
                  value={ratings[area.id]}
                  onTap={() => openAdjust(area)}
                />
              ))}
            </div>

            <GoalPanel />
          </CollapsibleSection>
        </section>
      </main>

      <RatingModal
        area={activeArea}
        initialValue={activeArea ? ratings[activeArea.id] : null}
        onClose={() => setActiveArea(null)}
        onSave={handleSave}
      />
    </>
  )
}
