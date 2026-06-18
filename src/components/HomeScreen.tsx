import { useState, useCallback } from 'react'
import { KageHeroLogo } from './KageHeroLogo'
import { CoreDisplay } from './CoreDisplay'
import { NeonBar } from './NeonBar'
import { RatingModal } from './RatingModal'
import { useTheme } from '../theme/useTheme'
import { useTracker } from '../context/trackerContext'
import { AffirmationBanner } from './dashboard/AffirmationBanner'
import { OnboardingHint } from './dashboard/OnboardingHint'
import { WhatsNewBanner } from './dashboard/WhatsNewBanner'
import { VoiceConfirmBanner } from './dashboard/VoiceConfirmBanner'
import { RankBadge } from './dashboard/RankBadge'
import { QuickLogPanel, CompactPillars } from './dashboard/QuickLogPanel'
import { ShadowLogForm } from './dashboard/ShadowLogForm'
import { ProgressChart } from './dashboard/ProgressChart'
import { BalanceRadar } from './dashboard/BalanceRadar'
import { InsightCards, QuestList } from './dashboard/InsightCards'
import { GoalPanel } from './dashboard/GoalPanel'
import { ShadowParticles } from './ShadowParticles'
import { CollapsibleSection } from './ui/CollapsibleSection'
import { AREA_CONFIGS, type AreaConfig } from '../types'

/** Viewport minus app header + bottom nav (scroll content lives below hero). */
const HERO_MIN_HEIGHT =
  'calc(100dvh - 48px - 64px - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px))'

export function HomeScreen() {
  const { tokens } = useTheme()
  const { ratings, core, logRating } = useTracker()
  const [activeArea, setActiveArea] = useState<AreaConfig | null>(null)

  const highScore = core >= 85

  const handleSave = (value: number) => {
    if (!activeArea) return
    void logRating(activeArea.id, value)
    setActiveArea(null)
  }

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
            position: 'relative',
            minHeight: HERO_MIN_HEIGHT,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            backgroundColor: tokens.surface,
          }}
        >
          <KageHeroLogo />
          <p
            aria-hidden
            style={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              margin: 0,
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: 9,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: tokens.textSubtle,
              opacity: 0.85,
            }}
          >
            Scroll ↓
          </p>
        </section>

        <section
          style={{
            padding: '28px 20px 56px',
            maxWidth: 400,
            margin: '0 auto',
            width: '100%',
          }}
        >
          <OnboardingHint />
          <WhatsNewBanner />
          <VoiceConfirmBanner />
          <AffirmationBanner />
          <CoreDisplay value={core} pulse={highScore} />
          <RankBadge />

          <QuickLogPanel onAdjust={openAdjust} />
          <CompactPillars onAdjust={openAdjust} />

          <ProgressChart />
          <BalanceRadar />

          <GoalPanel />

          <CollapsibleSection
            title="Parked shadow log"
            subtitle="Sliders + save today's entry"
            defaultOpen={false}
          >
            <ShadowLogForm />
          </CollapsibleSection>

          <CollapsibleSection
            title="Deeper shadow"
            subtitle="Insights, quests, pillar detail"
            defaultOpen={false}
          >
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
