import { useState } from 'react'
import { useTheme } from '../../theme/useTheme'
import { ParkedSafetyBanner } from '../../components/ui/ParkedSafetyBanner'
import { useShadowLogs } from '../../hooks/useShadowLogs'
import { useSwipeGesture } from '../../hooks/useSwipeGesture'
import { pillarAccentColor, tapHaptic } from '../../lib/pillars'
import type { AreaConfig, AreaId } from '../../types'
import { AREA_CONFIGS } from '../../types'

interface QuickLogPanelProps {
  onAdjust: (area: AreaConfig) => void
}

function SwipeableQuickLogButton({
  area,
  value,
  isPressed,
  isSwiping,
  swipeDx,
  onTap,
  onSwipeLeft,
  onSwipeRight,
}: {
  area: AreaConfig
  value: number
  isPressed: boolean
  isSwiping: boolean
  swipeDx: number
  onTap: () => void
  onSwipeLeft: () => void
  onSwipeRight: () => void
}) {
  const { tokens } = useTheme()
  const swipe = useSwipeGesture({ onSwipeLeft, onSwipeRight })
  const accentColor = pillarAccentColor(tokens, area.color)
  const active = isPressed || isSwiping

  return (
    <button
      type="button"
      onClick={onTap}
      onTouchStart={swipe.onTouchStart}
      onTouchEnd={swipe.onTouchEnd}
      className={`kage-touch-target${isPressed ? ' animate-quick-log-press' : ''}`}
      style={{
        minHeight: 108,
        borderRadius: 16,
        border: `2px solid ${active ? tokens.crimson : tokens.border}`,
        background: active ? tokens.bannerBg : tokens.surfaceElevated,
        cursor: 'pointer',
        padding: '18px 10px',
        color: tokens.text,
        transition:
          'border-color 0.15s ease, background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease',
        transform: isSwiping
          ? `translateX(${swipeDx}px) scale(0.98)`
          : isPressed
            ? 'scale(0.97)'
            : 'scale(1)',
        boxShadow: active ? `0 0 22px ${tokens.accentGlow}` : tokens.cardShadow,
        touchAction: 'pan-y',
      }}
      aria-label={`${area.label} ${value} of 10. Tap to bump, swipe right for good score, swipe left to adjust.`}
    >
      <span style={{ fontSize: 32, display: 'block', lineHeight: 1 }}>{area.kanji}</span>
      <span
        style={{
          fontFamily: '"Orbitron", sans-serif',
          fontSize: 9,
          letterSpacing: '0.25em',
          color: tokens.textMuted,
          marginTop: 8,
          display: 'block',
        }}
      >
        {area.label}
      </span>
      <span
        className={value >= 8 ? 'animate-score-pulse' : undefined}
        style={{
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: 24,
          fontWeight: 700,
          color: accentColor,
          marginTop: 8,
          display: 'block',
        }}
      >
        {String(value).padStart(2, '0')}
      </span>
    </button>
  )
}

export function QuickLogPanel({ onAdjust }: QuickLogPanelProps) {
  const { tokens } = useTheme()
  const { ratings, quickBump, logRating } = useShadowLogs()
  const [pressedId, setPressedId] = useState<AreaId | null>(null)
  const [swipeState, setSwipeState] = useState<{ id: AreaId; dx: number } | null>(null)
  const [activeTag, setActiveTag] = useState<AreaId | null>(null)

  const handleBump = (id: AreaId) => {
    setPressedId(id)
    tapHaptic(10)
    void quickBump(id)
    setTimeout(() => setPressedId(null), 220)
  }

  const handleGoodScore = (id: AreaId) => {
    const next = Math.min(10, Math.max(ratings[id], 7))
    setSwipeState({ id, dx: 28 })
    setPressedId(id)
    tapHaptic([8, 24, 12])
    void logRating(id, next, 'quick')
    setTimeout(() => {
      setPressedId(null)
      setSwipeState(null)
    }, 280)
  }

  const handleAdjust = (area: AreaConfig) => {
    setSwipeState({ id: area.id as AreaId, dx: -28 })
    setTimeout(() => setSwipeState(null), 200)
    onAdjust(area)
  }

  const handleTag = (id: AreaId) => {
    setActiveTag(id)
    setPressedId(id)
    tapHaptic(14)
    void logRating(id, ratings[id], 'quick')
    setTimeout(() => {
      setPressedId(null)
      setActiveTag(null)
    }, 300)
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <ParkedSafetyBanner />

      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 10,
          gap: 8,
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: 10,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: tokens.textMuted,
          }}
        >
          Quick log
        </p>
        <p style={{ margin: 0, fontSize: 10, color: tokens.textSubtle }}>
          swipe → good · ← adjust
        </p>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
        }}
      >
        {AREA_CONFIGS.map((area) => {
          const id = area.id as AreaId
          const isSwiping = swipeState?.id === id
          return (
            <SwipeableQuickLogButton
              key={area.id}
              area={area}
              value={ratings[id]}
              isPressed={pressedId === id}
              isSwiping={isSwiping}
              swipeDx={isSwiping ? swipeState.dx : 0}
              onTap={() => handleBump(id)}
              onSwipeRight={() => handleGoodScore(id)}
              onSwipeLeft={() => handleAdjust(area)}
            />
          )
        })}
      </div>

      <p
        style={{
          margin: '12px 0 8px',
          fontSize: 9,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: tokens.textSubtle,
          textAlign: 'center',
        }}
      >
        Quick tags
      </p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        {AREA_CONFIGS.map((tag) => (
          <button
            key={tag.id}
            type="button"
            onClick={() => handleTag(tag.id)}
            className="kage-touch-target"
            style={{
              flex: 1,
              minHeight: 52,
              borderRadius: 10,
              border: `1px solid ${activeTag === tag.id ? tokens.crimson : tokens.border}`,
              background: activeTag === tag.id ? tokens.bannerBg : tokens.cardBg,
              color: activeTag === tag.id ? tokens.crimson : tokens.textMuted,
              fontSize: 11,
              cursor: 'pointer',
              boxShadow: activeTag === tag.id ? `0 0 14px ${tokens.accentGlow}` : 'none',
            }}
          >
            {tag.kanji} {tag.label}
          </button>
        ))}
      </div>

      <p
        style={{
          margin: '12px 0 0',
          fontSize: 11,
          color: tokens.textSubtle,
          textAlign: 'center',
        }}
      >
        Tap +1 · header mic when parked · voice confirms before save
      </p>
    </div>
  )
}

interface CompactPillarsProps {
  onAdjust: (area: AreaConfig) => void
}

export function CompactPillars({ onAdjust }: CompactPillarsProps) {
  const { tokens } = useTheme()
  const { ratings } = useShadowLogs()

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 8,
        marginBottom: 16,
      }}
    >
      {AREA_CONFIGS.map((area) => (
        <button
          key={area.id}
          type="button"
          onClick={() => onAdjust(area)}
          className="kage-touch-target"
          style={{
            minHeight: 60,
            borderRadius: 10,
            border: `1px solid ${tokens.border}`,
            background: tokens.cardBg,
            padding: '12px 8px',
            cursor: 'pointer',
            boxShadow: tokens.cardShadow,
          }}
          aria-label={`Adjust ${area.label}, ${ratings[area.id]} of 10`}
        >
          <span style={{ fontSize: 18, display: 'block' }}>{area.kanji}</span>
          <span
            style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: 16,
              fontWeight: 600,
              color: pillarAccentColor(tokens, area.color),
              marginTop: 4,
              display: 'block',
            }}
          >
            {String(ratings[area.id]).padStart(2, '0')}
          </span>
        </button>
      ))}
    </div>
  )
}
