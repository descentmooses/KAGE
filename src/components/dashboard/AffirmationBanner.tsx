import { useMemo } from 'react'
import { useTheme } from '../../theme/useTheme'
import { pickAffirmation } from '../../lib/affirmations'
import { buildPillarHistory } from '../../lib/pillarHistory'
import { useTracker } from '../../context/trackerContext'

export function AffirmationBanner() {
  const { tokens } = useTheme()
  const { settings, ratings, core, gamification, allLogs } = useTracker()

  const history = useMemo(() => buildPillarHistory(allLogs), [allLogs])

  if (!settings.affirmationsEnabled) return null

  const message = pickAffirmation({
    elara: settings.elaraWhispers,
    mind: ratings.mind,
    body: ratings.body,
    spirit: ratings.spirit,
    core,
    streak: gamification.currentStreak,
    history,
  })

  const isPoetic = message.length > 90

  return (
    <div
      className="animate-fade-in"
      style={{
        padding: '16px 18px',
        borderRadius: 12,
        border: `1px solid ${tokens.borderAccent}`,
        background: tokens.bannerBg,
        marginBottom: 16,
        boxShadow: tokens.cardShadowAlt,
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: 10,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: tokens.crimson,
          marginBottom: 8,
        }}
      >
        {settings.elaraWhispers ? 'Elara whispers' : 'Shadow note'}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: isPoetic ? 15 : 14,
          lineHeight: isPoetic ? 1.65 : 1.55,
          color: tokens.text,
          fontStyle: settings.elaraWhispers && isPoetic ? 'italic' : 'normal',
        }}
      >
        {message}
      </p>
    </div>
  )
}
