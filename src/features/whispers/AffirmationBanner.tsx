import { useMemo, useState } from 'react'
import { useTheme } from '../../theme/useTheme'
import { pickAffirmation } from '../../lib/affirmations'
import { buildAffirmationContext } from '../../lib/affirmationContext'
import { useTracker } from '../../context/trackerContext'
import { useElara } from '../../context/elaraContext'

export function AffirmationBanner() {
  const { tokens } = useTheme()
  const { openElara } = useElara()
  const {
    settings,
    ratings,
    core,
    gamification,
    allLogs,
    goals,
    todayLog,
    morningToday,
    reflectionToday,
    saveWhisper,
  } = useTracker()
  const [nonce, setNonce] = useState(0)
  const [display, setDisplay] = useState<string | null>(null)

  const ctx = useMemo(
    () =>
      buildAffirmationContext({
        elara: settings.elaraWhispers,
        mind: ratings.mind,
        body: ratings.body,
        spirit: ratings.spirit,
        core,
        streak: gamification.currentStreak,
        allLogs,
        goals,
        morningToday,
        reflectionToday,
        todayLog,
        nonce,
      }),
    [
      settings.elaraWhispers,
      ratings,
      core,
      gamification.currentStreak,
      allLogs,
      goals,
      todayLog,
      morningToday,
      reflectionToday,
      nonce,
    ],
  )

  if (!settings.affirmationsEnabled) return null

  const message = display ?? pickAffirmation(ctx)
  const isPoetic = message.length > 90

  const receiveWhisper = () => {
    const nextNonce = Date.now()
    setNonce(nextNonce)
    const fresh = pickAffirmation({ ...ctx, nonce: nextNonce })
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
        <button
          type="button"
          onClick={settings.elaraWhispers ? openElara : undefined}
          style={{
            margin: 0,
            padding: 0,
            border: 'none',
            background: 'transparent',
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: tokens.crimson,
            cursor: settings.elaraWhispers ? 'pointer' : 'default',
          }}
        >
          {settings.elaraWhispers ? 'Elara whispers' : 'Shadow note'}
        </button>
        <div style={{ display: 'flex', gap: 6 }}>
          {settings.elaraWhispers && (
            <button
              type="button"
              onClick={openElara}
              className="kage-touch-target"
              style={{
                minHeight: 40,
                padding: '0 10px',
                borderRadius: 999,
                border: `1px solid ${tokens.borderAccent}`,
                background: tokens.surfaceElevated,
                color: tokens.crimson,
                fontSize: 9,
                letterSpacing: '0.08em',
                cursor: 'pointer',
              }}
            >
              Open
            </button>
          )}
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
