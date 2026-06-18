import { useState } from 'react'
import { useTheme } from '../../theme/useTheme'
import { useTracker } from '../../context/trackerContext'
import { xpProgressInLevel } from '../../lib/gamification'
import { isStreakMilestone } from '../../lib/affirmations'
import type { AreaId } from '../../types'
import { AREA_CONFIGS } from '../../types'

export function RankBadge() {
  const { tokens } = useTheme()
  const { gamification } = useTracker()
  const progress = xpProgressInLevel(gamification.xp, gamification.level)
  const milestone = isStreakMilestone(gamification.currentStreak)

  return (
    <div
      className={milestone ? 'animate-milestone' : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '18px 20px',
        borderRadius: 12,
        border: `1px solid ${milestone ? tokens.gold : tokens.border}`,
        background: tokens.cardBg,
        marginBottom: 20,
        boxShadow: tokens.cardShadow,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: `2px solid ${milestone ? tokens.gold : tokens.crimson}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '"Noto Sans JP", sans-serif',
          fontSize: 24,
          color: milestone ? tokens.gold : tokens.crimson,
          background: tokens.bannerBg,
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
            marginTop: 10,
            height: 5,
            borderRadius: 999,
            background: tokens.neonTrack,
            overflow: 'hidden',
          }}
          role="progressbar"
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="XP progress to next level"
        >
          <div
            style={{
              width: `${Math.round(progress * 100)}%`,
              height: '100%',
              background: tokens.xpGradient,
              transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <p
          style={{
            margin: 0,
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: 22,
            color: milestone ? tokens.gold : tokens.text,
            transition: 'color 0.35s ease',
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
  const [pressedId, setPressedId] = useState<AreaId | null>(null)

  const handleBump = (id: AreaId) => {
    setPressedId(id)
    void quickBump(id)
    setTimeout(() => setPressedId(null), 200)
  }

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
        {AREA_CONFIGS.map((area) => {
          const isPressed = pressedId === area.id
          return (
            <button
              key={area.id}
              type="button"
              onClick={() => handleBump(area.id as AreaId)}
              className={`kage-touch-target${isPressed ? ' animate-quick-log-press' : ''}`}
              style={{
                minHeight: 88,
                borderRadius: 12,
                border: `1px solid ${isPressed ? tokens.crimson : tokens.border}`,
                background: isPressed ? tokens.bannerBg : tokens.surfaceElevated,
                cursor: 'pointer',
                padding: '14px 8px',
                color: tokens.text,
                transition: 'border-color 0.15s ease, background 0.15s ease, transform 0.15s ease',
                transform: isPressed ? 'scale(0.97)' : 'scale(1)',
              }}
              aria-label={`Quick bump ${area.label}, currently ${ratings[area.id]} of 10`}
            >
              <span style={{ fontSize: 26, display: 'block', lineHeight: 1 }}>{area.kanji}</span>
              <span
                style={{
                  fontFamily: '"Orbitron", sans-serif',
                  fontSize: 8,
                  letterSpacing: '0.25em',
                  color: tokens.textMuted,
                  marginTop: 4,
                  display: 'block',
                }}
              >
                {area.label}
              </span>
              <span
                className={ratings[area.id] >= 8 ? 'animate-score-pulse' : undefined}
                style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: 18,
                  fontWeight: 600,
                  color: area.color === 'ember' ? tokens.ember : tokens.crimson,
                  marginTop: 6,
                  display: 'block',
                }}
              >
                {String(ratings[area.id]).padStart(2, '0')}
              </span>
            </button>
          )
        })}
      </div>
      {onVoiceNote && (
        <p
          style={{
            margin: '12px 0 0',
            fontSize: 11,
            color: tokens.textSubtle,
            textAlign: 'center',
          }}
        >
          Tap header mic when parked — never while driving
        </p>
      )}
    </div>
  )
}
