import { describe, expect, it } from 'vitest'
import {
  DEFAULT_GAMIFICATION,
  applyXpDelta,
  levelFromXp,
  rankForLevel,
  resetQuestsIfNewDay,
  updateStreak,
  xpForDailyLog,
  xpForLevel,
  xpProgressInLevel,
} from './gamification'
import type { DailyLog } from '../types'

describe('gamification', () => {
  it('computes XP required per level', () => {
    expect(xpForLevel(1)).toBe(120)
    expect(xpForLevel(5)).toBe(600)
  })

  it('derives level from total XP', () => {
    expect(levelFromXp(0)).toBe(1)
    expect(levelFromXp(119)).toBe(1)
    expect(levelFromXp(120)).toBe(2)
    expect(levelFromXp(360)).toBe(3)
  })

  it('maps level to shadow rank', () => {
    expect(rankForLevel(1)).toBe('Initiate')
    expect(rankForLevel(3)).toBe('Shade')
    expect(rankForLevel(22)).toBe('Kage')
  })

  it('applyXpDelta reports level and rank changes', () => {
    const low = { ...DEFAULT_GAMIFICATION, xp: 100, level: 1, rank: 'Initiate' as const }
    const delta = applyXpDelta(low, 50)
    expect(delta.leveledUp).toBe(true)
    expect(delta.state.level).toBeGreaterThan(1)
  })

  it('resets quests on a new calendar day', () => {
    const state = {
      ...DEFAULT_GAMIFICATION,
      questDate: '2020-01-01',
      completedQuestIds: ['a'],
    }
    const next = resetQuestsIfNewDay(state, '2026-06-18')
    expect(next.questDate).toBe('2026-06-18')
    expect(next.completedQuestIds).toEqual([])
  })

  it('increments streak on consecutive days', () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayKey = yesterday.toISOString().slice(0, 10)

    const state = { ...DEFAULT_GAMIFICATION, lastLogDate: yesterdayKey, currentStreak: 3 }
    const next = updateStreak(state, '2026-06-18')
    expect(next.currentStreak).toBe(4)
    expect(next.longestStreak).toBe(4)
  })

  it('resets streak after a gap', () => {
    const state = { ...DEFAULT_GAMIFICATION, lastLogDate: '2020-01-01', currentStreak: 9 }
    const next = updateStreak(state, '2026-06-18')
    expect(next.currentStreak).toBe(1)
  })

  it('awards XP from daily log pillar average', () => {
    const log: DailyLog = {
      date: '2026-06-18',
      mind: 8,
      body: 6,
      spirit: 7,
      core: 70,
      source: 'quick',
      loggedAt: '2026-06-18T12:00:00.000Z',
    }
    expect(xpForDailyLog(log)).toBe(81)
  })

  it('computes in-level XP progress', () => {
    expect(xpProgressInLevel(60, 1)).toBeCloseTo(0.5)
  })
})
