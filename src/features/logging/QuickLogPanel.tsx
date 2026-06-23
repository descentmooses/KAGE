import { useState } from 'react'
import { useTheme } from '../../theme/useTheme'
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
  saved,
  onTap,
  onSwipeLeft,
  onSwipeRight,
}: {
  area: AreaConfig
  value: number
  isPressed: boolean
  isSwiping: boolean
  swipeDx: number
  saved: boolean
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
        position: 'relative',
        overflow: 'hidden',
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
      {saved && (
        <span
          aria-hidden
          className="animate-fade-in"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `${tokens.crimson}22`,
            fontFamily: '"Orbitron", sans-serif',
            fontSize: 10,
            letterSpacing: '0.2em',
            color: tokens.crimson,
          }}
        >
          SEALED
        </span>
      )}
    </button>
  )
}

export function QuickLogPanel({ onAdjust }: QuickLogPanelProps) {
  const { tokens } = useTheme()
  const { ratings, quickBump, logRating } = useShadowLogs()
  const [pressedId, setPressedId] = useState<AreaId | null>(null)
  const [swipeState, setSwipeState] = useState<{ id: AreaId; dx: number } | null>(null)
  const [savedFlash, setSavedFlash] = useState<AreaId | null>(null)

  const flashSaved = (id: AreaId) => {
    setSavedFlash(id)
    setTimeout(() => setSavedFlash(null), 650)
  }

  const handleBump = (id: AreaId) => {
    setPressedId(id)
    tapHaptic(10)
    void quickBump(id)
    flashSaved(id)
    setTimeout(() => setPressedId(null), 220)
  }

  const handleGoodScore = (id: AreaId) => {
    const next = Math.min(10, Math.max(ratings[id], 7))
    setSwipeState({ id, dx: 28 })
    setPressedId(id)
    tapHaptic([8, 24, 12])
    void logRating(id, next, 'quick')
    flashSaved(id)
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

  return (
    <div style={{ marginBottom: 20 }}>
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
              saved={savedFlash === id}
              onTap={() => handleBump(id)}
              onSwipeRight={() => handleGoodScore(id)}
              onSwipeLeft={() => handleAdjust(area)}
            />
          )
        })}
      </div>

      <p
        style={{
          margin: '12px 0 0',
          fontSize: 11,
          color: tokens.textSubtle,
          textAlign: 'center',
          lineHeight: 1.5,
        }}
      >
        Tap +1 · swipe left to fine-tune · full log with sliders below
      </p>
    </div>
  )
}
