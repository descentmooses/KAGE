import { useTheme } from '../../theme/useTheme'
import { useTracker } from '../../context/trackerContext'

export function InsightCards() {
  const { tokens } = useTheme()
  const { insights } = useTracker()

  if (insights.length === 0) return null

  return (
    <div style={{ marginBottom: 20 }}>
      {insights.map((insight) => (
        <div
          key={insight.id}
          style={{
            padding: '12px 14px',
            borderRadius: 8,
            border: `1px solid ${tokens.border}`,
            background: tokens.surfaceElevated,
            marginBottom: 8,
          }}
        >
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: tokens.text }}>
            {insight.message}
          </p>
        </div>
      ))}
    </div>
  )
}

export function QuestList() {
  const { tokens } = useTheme()
  const { quests } = useTracker()

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
        Daily quests
      </p>
      {quests.map((quest) => (
        <div
          key={quest.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 0',
            borderBottom: `1px solid ${tokens.border}`,
            opacity: quest.done ? 0.55 : 1,
          }}
        >
          <span
            style={{
              width: 22,
              height: 22,
              borderRadius: 4,
              border: `1px solid ${quest.done ? tokens.crimson : tokens.border}`,
              background: quest.done ? tokens.bannerBg : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              color: tokens.crimson,
            }}
          >
            {quest.done ? '✓' : ''}
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
              color: tokens.crimson,
            }}
          >
            +{quest.xp}
          </span>
        </div>
      ))}
    </div>
  )
}
