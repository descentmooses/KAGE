import { useState, useCallback } from 'react'
import { CoreDisplay } from '../../components/CoreDisplay'
import { useTheme } from '../../theme/useTheme'
import { ShadowParticles } from '../../components/ShadowParticles'
import { useShadowLogs } from '../../hooks/useShadowLogs'
import { AffirmationBanner } from '../whispers/AffirmationBanner'
import { WhatsNewBanner } from './WhatsNewBanner'
import { RankBadge } from './RankBadge'
import { QuickLogPanel } from '../logging/QuickLogPanel'
import { GoalPanel } from '../goals/GoalPanel'
import { RatingModal } from '../logging/RatingModal'
import { HomeHeroSection } from './HomeHeroSection'
import { LazyTrendSection } from './LazyTrendSection'
import { DeepShadowSection } from './DeepShadowSection'
import { useTutorialHighlight } from '../tutorial/useTutorialHighlight'
import type { AreaConfig } from '../../types'

function tutorialRing(tokens: { crimson: string; accentGlow: string }, on: boolean) {
  if (!on) return undefined
  return {
    boxShadow: `0 0 0 2px ${tokens.crimson}, 0 0 28px ${tokens.accentGlow}`,
    borderRadius: 14,
    transition: 'box-shadow 0.25s ease',
  } as const
}

export function HomeScreen() {
  const { tokens } = useTheme()
  const { core, ratings, logRating } = useShadowLogs()
  const [activeArea, setActiveArea] = useState<AreaConfig | null>(null)
  const highlightCore = useTutorialHighlight('home-core')
  const highlightQuickLog = useTutorialHighlight('home-quick-log')
  const highlightGoals = useTutorialHighlight('home-goals')

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
        <HomeHeroSection />

        <section
          style={{
            padding: '28px 20px 56px',
            maxWidth: 400,
            margin: '0 auto',
            width: '100%',
          }}
        >
          <WhatsNewBanner />
          <AffirmationBanner />
          <div
            id="tutorial-home-core"
            style={{
              marginBottom: 16,
              ...tutorialRing(tokens, highlightCore),
            }}
          >
            <CoreDisplay value={core} pulse={highScore} />
            <RankBadge />
          </div>

          <div
            id="tutorial-home-quick-log"
            style={{
              marginBottom: 16,
              ...tutorialRing(tokens, highlightQuickLog),
            }}
          >
            <QuickLogPanel onAdjust={openAdjust} />
          </div>

          <LazyTrendSection />
          <div
            id="tutorial-home-goals"
            style={{
              ...tutorialRing(tokens, highlightGoals),
            }}
          >
            <GoalPanel />
          </div>
          <DeepShadowSection />
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
