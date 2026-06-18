import { useMemo, useState } from 'react'
import { useTheme } from '../../theme/useTheme'
import { useTracker } from '../../context/trackerContext'
import { filterLogsByPeriod } from '../../lib/insights'
import { pickWeeklySummary } from '../../lib/affirmations'

export function InsightCards() {
  const { tokens } = useTheme()
  const { insights, allLogs } = useTracker()

  const weeklySummary = useMemo(() => {
    const week = filterLogsByPeriod(allLogs, 'weekly')
    return pickWeeklySummary(week)
  }, [allLogs])

  if (insights.length === 0 && !weeklySummary) return null

  return (
    <div style={{ marginBottom: 20 }}>
      {weeklySummary && (
        <div
          style={{
            padding: '14px 16px',
            borderRadius: 10,
            border: `1px solid ${tokens.borderAccent}`,
            background: tokens.bannerBg,
            marginBottom: 10,
          }}
        >
          <p
            style={{
              margin: '0 0 6px',
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: 9,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: tokens.crimson,
            }}
          >
            Weekly shadow read
          </p>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: tokens.text }}>
            {weeklySummary}
          </p>
        </div>
      )}
      {insights.map((insight) => (
        <div
          key={insight.id}
          style={{
            padding: '14px 16px',
            borderRadius: 10,
            border: `1px solid ${tokens.border}`,
            background: tokens.surfaceElevated,
            marginBottom: 8,
          }}
        >
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: tokens.text }}>
            {insight.message}
          </p>
        </div>
      ))}
    </div>
  )
}

export function QuestList() {
  const { tokens } = useTheme()
  const { quests, claimQuest } = useTracker()
  const [claimingId, setClaimingId] = useState<string | null>(null)

  const handleQuest = async (id: string) => {
    setClaimingId(id)
    try {
      await claimQuest(id)
    } finally {
      setTimeout(() => setClaimingId(null), 400)
    }
  }

  return (
    <div
      style={{
        padding: '16px 14px',
        borderRadius: 10,
        border: `1px solid ${tokens.border}`,
        background: tokens.cardBg,
        marginBottom: 20,
      }}
    >
      <p
        style={{
          margin: '0 0 12px',
          fontFamily: '"Orbitron", sans-serif',
          fontSize: 9,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: tokens.textMuted,
        }}
      >
        Daily quests — tap to claim
      </p>
      {quests.map((quest) => {
        const glowing = claimingId === quest.id
        return (
          <button
            key={quest.id}
            type="button"
            onClick={() => void handleQuest(quest.id)}
            disabled={quest.done}
            className={glowing ? 'animate-quest-claim' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              width: '100%',
              padding: '12px 10px',
              marginBottom: 6,
              borderRadius: 8,
              border: `1px solid ${
                quest.done
                  ? tokens.crimson
                  : quest.eligible
                    ? tokens.borderAccent
                    : tokens.border
              }`,
              background: quest.done
                ? tokens.bannerBg
                : quest.eligible
                  ? tokens.surfaceElevated
                  : 'transparent',
              cursor: quest.done ? 'default' : 'pointer',
              opacity: quest.done ? 0.7 : 1,
              textAlign: 'left',
              minHeight: 56,
            }}
          >
            <span
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                border: `1px solid ${quest.done ? tokens.crimson : tokens.border}`,
                background: quest.done ? tokens.bannerBg : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                color: tokens.crimson,
                flexShrink: 0,
              }}
            >
              {quest.done ? '✓' : quest.eligible ? '◎' : ''}
            </span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 13, color: tokens.text }}>{quest.title}</p>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: tokens.textMuted }}>
                {quest.description}
              </p>
            </div>
            <span
              style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: 10,
                color: tokens.gold,
              }}
            >
              +{quest.xp}
            </span>
          </button>
        )
      })}
    </div>
  )
}
