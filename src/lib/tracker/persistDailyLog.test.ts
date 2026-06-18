import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_GAMIFICATION } from '../gamification'
import { persistDailyLog } from './persistDailyLog'
import type { DailyLog } from '../../types'

const dbMocks = vi.hoisted(() => ({
  putDailyLog: vi.fn(),
  putGamification: vi.fn(),
  getDailyLog: vi.fn(),
  getAllDailyLogs: vi.fn(),
}))

const installMocks = vi.hoisted(() => ({
  emitFirstShadowLog: vi.fn(),
  emitShadowLogged: vi.fn(),
}))

vi.mock('../db', () => dbMocks)
vi.mock('../pwa/installUtils', () => installMocks)

const { putDailyLog, putGamification, getDailyLog, getAllDailyLogs } = dbMocks
const { emitFirstShadowLog, emitShadowLogged } = installMocks

describe('persistDailyLog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getDailyLog.mockResolvedValue(null)
    getAllDailyLogs.mockResolvedValue([])
    putDailyLog.mockResolvedValue(undefined)
    putGamification.mockResolvedValue(undefined)
  })

  it('writes log, updates streak, awards XP, and fires install hooks on first log', async () => {
    const celebrations: string[] = []
    const applyGamificationXp = vi.fn(async (g) => g)

    const log = await persistDailyLog({
      patch: { mind: 8, body: 8, spirit: 8 },
      source: 'quick',
      date: '2026-06-18',
      gamification: DEFAULT_GAMIFICATION,
      onCelebration: (m) => celebrations.push(m),
      applyGamificationXp,
    })

    expect(log.core).toBe(80)
    expect(log.source).toBe('quick')
    expect(putDailyLog).toHaveBeenCalledOnce()
    expect(applyGamificationXp).toHaveBeenCalled()
    expect(emitFirstShadowLog).toHaveBeenCalledOnce()
    expect(emitShadowLogged).toHaveBeenCalledOnce()
    expect(log.mind).toBe(8)
  })

  it('skips streak update when replacing an existing log', async () => {
    const existing: DailyLog = {
      date: '2026-06-18',
      mind: 5,
      body: 5,
      spirit: 5,
      core: 50,
      source: 'quick',
      loggedAt: '2026-06-18T08:00:00.000Z',
    }
    getDailyLog.mockResolvedValue(existing)

    const applyGamificationXp = vi.fn(async (g) => g)
    await persistDailyLog({
      patch: { mind: 9, body: 9, spirit: 9 },
      source: 'quick',
      date: '2026-06-18',
      gamification: { ...DEFAULT_GAMIFICATION, currentStreak: 5, lastLogDate: '2026-06-17' },
      onCelebration: () => {},
      applyGamificationXp,
    })

    expect(applyGamificationXp).toHaveBeenCalled()
    expect(emitFirstShadowLog).not.toHaveBeenCalled()
  })

  it('uses silent path without celebration toast message', async () => {
    const applyGamificationXp = vi.fn(async (g) => g)
    await persistDailyLog({
      patch: { mind: 7, body: 7, spirit: 7 },
      source: 'reflect',
      date: '2026-06-18',
      gamification: DEFAULT_GAMIFICATION,
      options: { silent: true },
      onCelebration: () => {},
      applyGamificationXp,
    })

    expect(applyGamificationXp).not.toHaveBeenCalled()
    expect(putGamification).toHaveBeenCalled()
    expect(emitShadowLogged).not.toHaveBeenCalled()
  })

  it('celebrates peak core when crossing 85 threshold', async () => {
    const celebrations: string[] = []
    const applyGamificationXp = vi.fn(async (g) => g)

    await persistDailyLog({
      patch: { mind: 9, body: 9, spirit: 8 },
      source: 'quick',
      date: '2026-06-18',
      gamification: DEFAULT_GAMIFICATION,
      onCelebration: (m) => celebrations.push(m),
      applyGamificationXp,
    })

    expect(celebrations).toContain('Core ascendant — peak shadow state')
  })
})
