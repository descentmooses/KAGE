import { useMemo, useState } from 'react'
import { useTheme } from '../../theme/useTheme'
import { pickAffirmation } from '../../lib/affirmations'
import { buildPillarHistory } from '../../lib/pillarHistory'
import { useTracker } from '../../context/trackerContext'

export function AffirmationBanner() {
  const { tokens } = useTheme()
  const { settings, ratings, core, gamification, allLogs, saveWhisper } = useTracker()
  const [nonce, setNonce] = useState(0)
  const [display, setDisplay] = useState<string | null>(null)

  const history = useMemo(() => buildPillarHistory(allLogs), [allLogs])

  if (!settings.affirmationsEnabled) return null

  const message =
    display ??
    pickAffirmation({
      elara: settings.elaraWhispers,
      mind: ratings.mind,
      body: ratings.body,
      spirit: ratings.spirit,
      core,
      streak: gamification.currentStreak,
      history,
      nonce,
    })

  const isPoetic = message.length > 90

  const receiveWhisper = () => {
    const nextNonce = Date.now()
    setNonce(nextNonce)
    const fresh = pickAffirmation({
      elara: settings.elaraWhispers,
      mind: ratings.mind,
      body: ratings.body,
      spirit: ratings.spirit,
      core,
      streak: gamification.currentStreak,
      history,
      nonce: nextNonce,
    })
    setDisplay(fresh)
    void saveWhisper(fresh)
  }

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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 8,
          marginBottom: 8,
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
          }}
        >
          {settings.elaraWhispers ? 'Elara whispers' : 'Shadow note'}
        </p>
        <button
          type="button"
          onClick={receiveWhisper}
          className="kage-touch-target"
          style={{
            minHeight: 40,
            padding: '0 12px',
            borderRadius: 999,
            border: `1px solid ${tokens.crimson}`,
            background: 'transparent',
            color: tokens.crimson,
            fontSize: 9,
            letterSpacing: '0.12em',
            cursor: 'pointer',
          }}
        >
          New whisper
        </button>
      </div>
      <p
        key={message}
        className="animate-fade-in"
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
      {(settings.whisperHistory?.length ?? 0) > 0 && (
        <p style={{ margin: '10px 0 0', fontSize: 10, color: tokens.textSubtle }}>
          {settings.whisperHistory!.length} whispers remembered
        </p>
      )}
    </div>
  )
}
