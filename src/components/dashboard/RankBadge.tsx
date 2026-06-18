import { useTheme } from '../../theme/useTheme'
import { useTracker } from '../../context/trackerContext'
import { xpProgressInLevel } from '../../lib/gamification'
import type { AreaId } from '../../types'
import { AREA_CONFIGS } from '../../types'

export function RankBadge() {
  const { tokens } = useTheme()
  const { gamification } = useTracker()
  const progress = xpProgressInLevel(gamification.xp, gamification.level)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '16px 18px',
        borderRadius: 10,
        border: `1px solid ${tokens.border}`,
        background: tokens.cardBg,
        marginBottom: 20,
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          border: `2px solid ${tokens.crimson}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '"Noto Sans JP", sans-serif',
          fontSize: 22,
          color: tokens.crimson,
        }}
      >
        影
      </div>
      <div style={{ flex: 1 }}>
        <p
          style={{
            margin: 0,
            fontFamily: '"Orbitron", sans-serif',
            fontSize: 11,
            letterSpacing: '0.35em',
            color: tokens.crimson,
            textTransform: 'uppercase',
          }}
        >
          {gamification.rank}
        </p>
        <p
          style={{
            margin: '4px 0 0',
            fontSize: 12,
            color: tokens.textMuted,
          }}
        >
          Level {gamification.level} · {gamification.xp} XP
        </p>
        <div
          style={{
            marginTop: 8,
            height: 4,
            borderRadius: 999,
            background: tokens.neonTrack,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${Math.round(progress * 100)}%`,
              height: '100%',
              background: tokens.btnGradient,
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <p
          style={{
            margin: 0,
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: 20,
            color: tokens.text,
          }}
        >
          {gamification.currentStreak}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: 9,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: tokens.textMuted,
          }}
        >
          day streak
        </p>
      </div>
    </div>
  )
}

interface QuickLogPanelProps {
  onVoiceNote?: (text: string) => void
}

export function QuickLogPanel({ onVoiceNote }: QuickLogPanelProps) {
  const { tokens } = useTheme()
  const { ratings, quickBump } = useTracker()

  return (
    <div style={{ marginBottom: 24 }}>
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
        Quick log — driving mode
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10,
        }}
      >
        {AREA_CONFIGS.map((area) => (
          <button
            key={area.id}
            type="button"
            onClick={() => void quickBump(area.id as AreaId)}
            style={{
              minHeight: 72,
              borderRadius: 10,
              border: `1px solid ${tokens.border}`,
              background: tokens.surfaceElevated,
              cursor: 'pointer',
              padding: '10px 8px',
              color: tokens.text,
            }}
            aria-label={`Quick bump ${area.label}`}
          >
            <span style={{ fontSize: 22, display: 'block' }}>{area.kanji}</span>
            <span
              style={{
                fontFamily: '"Orbitron", sans-serif',
                fontSize: 8,
                letterSpacing: '0.25em',
                color: tokens.textMuted,
              }}
            >
              {area.label}
            </span>
            <span
              className={ratings[area.id] >= 8 ? 'animate-score-pulse' : undefined}
              style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: 16,
                color: area.color === 'ember' ? tokens.ember : tokens.crimson,
                marginTop: 4,
                display: 'block',
              }}
            >
              {String(ratings[area.id]).padStart(2, '0')}
            </span>
          </button>
        ))}
      </div>
      {onVoiceNote && (
        <p
          style={{
            margin: '10px 0 0',
            fontSize: 11,
            color: tokens.textSubtle,
            textAlign: 'center',
          }}
        >
          Tap mic in header for voice notes (parked only)
        </p>
      )}
    </div>
  )
}
