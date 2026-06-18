import { useEffect, useState } from 'react'
import { useTheme } from '../../theme/useTheme'
import { useStreakAndXP } from '../../hooks/useStreakAndXP'
import { cardSurface } from '../../theme/componentStyles'
import { NeonProgress } from '../../components/ui/NeonProgress'
import { xpProgressInLevel } from '../../lib/gamification'
import { isStreakMilestone } from '../../lib/affirmations'

const RANK_STORAGE_KEY = 'kage-last-rank'

export function RankBadge() {
  const { tokens } = useTheme()
  const { gamification } = useStreakAndXP()
  const progress = xpProgressInLevel(gamification.xp, gamification.level)
  const milestone = isStreakMilestone(gamification.currentStreak)
  const [rankFlash, setRankFlash] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem(RANK_STORAGE_KEY)
    if (stored && stored !== gamification.rank) {
      const start = window.setTimeout(() => setRankFlash(true), 0)
      const end = window.setTimeout(() => setRankFlash(false), 2400)
      sessionStorage.setItem(RANK_STORAGE_KEY, gamification.rank)
      return () => {
        clearTimeout(start)
        clearTimeout(end)
      }
    }
    sessionStorage.setItem(RANK_STORAGE_KEY, gamification.rank)
  }, [gamification.rank])

  const milestoneTier =
    gamification.currentStreak >= 100
      ? 'legend'
      : gamification.currentStreak >= 30
        ? 'major'
        : gamification.currentStreak >= 14
          ? 'strong'
          : gamification.currentStreak >= 7
            ? 'week'
            : null

  return (
    <div
      className={[
        milestone ? 'animate-milestone' : '',
        rankFlash ? 'animate-rank-flash' : '',
        milestoneTier === 'legend' ? 'animate-streak-aura' : '',
      ]
        .filter(Boolean)
        .join(' ') || undefined}
      style={cardSurface(tokens, {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '18px 20px',
        marginBottom: 20,
        border: `1px solid ${milestone || rankFlash ? tokens.gold : tokens.border}`,
        boxShadow: rankFlash ? `0 0 28px ${tokens.accentGlow}` : tokens.cardShadow,
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
      })}
    >
      <div
        className={rankFlash ? 'animate-rank-emblem' : undefined}
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: `2px solid ${milestone || rankFlash ? tokens.gold : tokens.crimson}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '"Noto Sans JP", sans-serif',
          fontSize: 24,
          color: milestone || rankFlash ? tokens.gold : tokens.crimson,
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
            color: rankFlash ? tokens.gold : tokens.crimson,
            textTransform: 'uppercase',
            transition: 'color 0.35s ease',
          }}
        >
          {gamification.rank}
          {rankFlash ? ' ↑' : ''}
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
        <NeonProgress
          value={Math.round(progress * 100)}
          variant="xp"
          fillClassName={rankFlash ? 'animate-xp-surge' : undefined}
          trackStyle={{ marginTop: 10 }}
          aria-label="XP progress to next level"
        />
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
        {milestoneTier && (
          <p
            style={{
              margin: '4px 0 0',
              fontSize: 8,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: tokens.gold,
            }}
          >
            {milestoneTier === 'legend'
              ? 'legend'
              : milestoneTier === 'major'
                ? 'milestone'
                : milestoneTier === 'strong'
                  ? 'fortnight'
                  : 'week'}
          </p>
        )}
      </div>
    </div>
  )
}
