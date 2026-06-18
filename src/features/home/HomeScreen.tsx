import { useState, useCallback } from 'react'
import { CoreDisplay } from '../../components/CoreDisplay'
import { useTheme } from '../../theme/useTheme'
import { ShadowParticles } from '../../components/ShadowParticles'
import { useShadowLogs } from '../../hooks/useShadowLogs'
import { AffirmationBanner } from '../whispers/AffirmationBanner'
import { OnboardingHint } from './OnboardingHint'
import { WhatsNewBanner } from './WhatsNewBanner'
import { VoiceConfirmBanner } from '../logging/VoiceConfirmBanner'
import { RankBadge } from './RankBadge'
import { QuickLogPanel, CompactPillars } from '../logging/QuickLogPanel'
import { GoalPanel } from '../goals/GoalPanel'
import { RatingModal } from '../logging/RatingModal'
import { HomeHeroSection } from './HomeHeroSection'
import { LazyTrendSection } from './LazyTrendSection'
import { DeepShadowSection } from './DeepShadowSection'
import type { AreaConfig } from '../../types'

export function HomeScreen() {
  const { tokens } = useTheme()
  const { core, ratings, logRating } = useShadowLogs()
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
        <HomeHeroSection />

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

          <LazyTrendSection />
          <GoalPanel />
          <DeepShadowSection onAdjust={openAdjust} />
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
