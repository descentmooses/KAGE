import { useTheme } from '../../theme/useTheme'
import { pickAffirmation } from '../../lib/affirmations'
import { useTracker } from '../../context/trackerContext'

export function AffirmationBanner() {
  const { tokens } = useTheme()
  const { settings } = useTracker()

  if (!settings.affirmationsEnabled) return null

  const message = pickAffirmation(settings.elaraWhispers)

  return (
    <div
      className="animate-fade-in"
      style={{
        padding: '14px 16px',
        borderRadius: 8,
        border: `1px solid ${tokens.borderAccent}`,
        background: tokens.bannerBg,
        marginBottom: 20,
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
          fontSize: 13,
          lineHeight: 1.55,
          color: tokens.text,
        }}
      >
        {message}
      </p>
    </div>
  )
}
