import { useMemo, useState } from 'react'
import { useTheme } from '../../theme/useTheme'
import { pickAffirmation, pickCompanionWhisper, contextChips } from '../../lib/affirmations'
import { buildAffirmationContext } from '../../lib/affirmationContext'
import { useTracker } from '../../context/trackerContext'

interface ElaraWhispersModalProps {
  open: boolean
  onClose: () => void
}

export function ElaraWhispersModal({ open, onClose }: ElaraWhispersModalProps) {
  const { tokens } = useTheme()
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
    toggleFavoriteWhisper,
  } = useTracker()
  const [nonce, setNonce] = useState(0)

  const ctx = useMemo(
    () =>
      buildAffirmationContext({
        elara: true,
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

  const primary = useMemo(() => pickAffirmation(ctx), [ctx])
  const companion = useMemo(() => pickCompanionWhisper(ctx, primary), [ctx, primary])
  const chips = useMemo(() => contextChips(ctx), [ctx])
  const isFavorited = settings.favoriteWhispers?.includes(primary) ?? false

  if (!open || !settings.elaraWhispers) return null

  const drawNew = () => {
    const next = Date.now()
    setNonce(next)
    const fresh = pickAffirmation({ ...ctx, nonce: next })
    void saveWhisper(fresh)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Elara Whispers"
      className="animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 120,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: '0 0 max(20px, env(safe-area-inset-bottom))',
      }}
    >
      <button
        type="button"
        aria-label="Close Elara whispers"
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          border: 'none',
          background: tokens.modalBackdrop,
          cursor: 'pointer',
        }}
      />
      <div
        className="animate-modal-in animate-whisper-glow"
        style={{
          position: 'relative',
          width: 'min(400px, calc(100% - 32px))',
          maxHeight: 'min(78dvh, 560px)',
          overflowY: 'auto',
          borderRadius: '20px 20px 16px 16px',
          border: `1px solid ${tokens.borderAccent}`,
          background: `linear-gradient(165deg, ${tokens.modalBg} 0%, rgba(10,5,8,0.98) 100%)`,
          boxShadow: `0 -8px 48px rgba(0,0,0,0.55), 0 0 32px ${tokens.accentGlow}`,
          padding: '24px 22px 20px',
        }}
      >
        <div
          style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            background: tokens.border,
            margin: '0 auto 18px',
            opacity: 0.6,
          }}
        />

        <p
          style={{
            margin: '0 0 6px',
            fontFamily: '"Orbitron", sans-serif',
            fontSize: 9,
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            color: tokens.crimson,
            textAlign: 'center',
          }}
        >
          Whisper from Elara
        </p>
        <p
          style={{
            margin: '0 0 16px',
            fontSize: 11,
            color: tokens.textSubtle,
            textAlign: 'center',
            fontStyle: 'italic',
          }}
        >
          Context-aware · client-side · only for you
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
            justifyContent: 'center',
            marginBottom: 18,
          }}
        >
          {chips.map((chip) => (
            <span
              key={chip}
              style={{
                fontSize: 9,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '5px 10px',
                borderRadius: 999,
                border: `1px solid ${tokens.border}`,
                color: tokens.textMuted,
                background: tokens.surfaceElevated,
              }}
            >
              {chip}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
          <button
            type="button"
            onClick={() => void toggleFavoriteWhisper(primary)}
            className="kage-touch-target"
            aria-label={isFavorited ? 'Unfavorite whisper' : 'Favorite whisper'}
            style={{
              minHeight: 44,
              padding: '0 16px',
              borderRadius: 999,
              border: `1px solid ${isFavorited ? tokens.gold : tokens.border}`,
              background: isFavorited ? tokens.bannerBg : 'transparent',
              color: isFavorited ? tokens.gold : tokens.textMuted,
              fontSize: 11,
              cursor: 'pointer',
            }}
          >
            {isFavorited ? '★ Favored' : '☆ Keep close'}
          </button>
        </div>

        <p
          key={primary}
          className="animate-fade-in"
          style={{
            margin: '0 0 14px',
            fontSize: 17,
            lineHeight: 1.7,
            color: tokens.text,
            fontStyle: 'italic',
            textAlign: 'center',
          }}
        >
          {primary}
        </p>

        <p
          style={{
            margin: '0 0 20px',
            fontSize: 13,
            lineHeight: 1.6,
            color: tokens.textMuted,
            textAlign: 'center',
            borderTop: `1px solid ${tokens.border}`,
            paddingTop: 14,
          }}
        >
          {companion}
        </p>

        <button
          type="button"
          onClick={drawNew}
          className="kage-touch-target"
          style={{
            width: '100%',
            minHeight: 52,
            borderRadius: 12,
            border: `1px solid ${tokens.crimson}`,
            background: tokens.bannerBg,
            color: tokens.crimson,
            fontFamily: '"Orbitron", sans-serif',
            fontSize: 10,
            letterSpacing: '0.3em',
            cursor: 'pointer',
            marginBottom: 10,
          }}
        >
          ANOTHER WHISPER
        </button>

        {(settings.favoriteWhispers?.length ?? 0) > 0 && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${tokens.border}` }}>
            <p
              style={{
                margin: '0 0 8px',
                fontSize: 9,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: tokens.gold,
                textAlign: 'center',
              }}
            >
              Kept close
            </p>
            {settings.favoriteWhispers!.slice(0, 2).map((w) => (
              <p
                key={w.slice(0, 32)}
                style={{
                  margin: '0 0 6px',
                  fontSize: 11,
                  lineHeight: 1.5,
                  color: tokens.textSubtle,
                  fontStyle: 'italic',
                  textAlign: 'center',
                }}
              >
                “{w.length > 72 ? `${w.slice(0, 72)}…` : w}”
              </p>
            ))}
          </div>
        )}

        {(settings.whisperHistory?.length ?? 0) > 0 && (
          <div style={{ marginTop: 8 }}>
            <p
              style={{
                margin: '0 0 8px',
                fontSize: 9,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: tokens.textSubtle,
                textAlign: 'center',
              }}
            >
              Remembered
            </p>
            {settings.whisperHistory!.slice(0, 3).map((w, i) => (
              <p
                key={`${i}-${w.slice(0, 24)}`}
                style={{
                  margin: '0 0 6px',
                  fontSize: 11,
                  lineHeight: 1.5,
                  color: tokens.textSubtle,
                  fontStyle: 'italic',
                  textAlign: 'center',
                }}
              >
                “{w.length > 80 ? `${w.slice(0, 80)}…` : w}”
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
