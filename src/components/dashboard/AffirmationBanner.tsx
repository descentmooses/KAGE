import { useTheme } from '../../theme/useTheme'
import { pickAffirmation } from '../../lib/affirmations'
import { useTracker } from '../../context/trackerContext'

export function AffirmationBanner() {
  const { tokens } = useTheme()
  const { settings, ratings, core, gamification } = useTracker()

  if (!settings.affirmationsEnabled) return null

  const message = pickAffirmation({
    elara: settings.elaraWhispers,
    mind: ratings.mind,
    body: ratings.body,
    spirit: ratings.spirit,
    core,
    streak: gamification.currentStreak,
  })

  return (
    <div
      className="animate-fade-in"
      style={{
        padding: '16px 18px',
        borderRadius: 10,
        border: `1px solid ${tokens.borderAccent}`,
        background: tokens.bannerBg,
        marginBottom: 20,
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
          fontSize: 14,
          lineHeight: 1.6,
          color: tokens.text,
        }}
      >
        {message}
      </p>
    </div>
  )
}
