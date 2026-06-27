import { describe, expect, it } from 'vitest'
import { mergeSyncPayloads } from './mergeState'
import type { KageSyncPayload } from './types'
import { DEFAULT_GAMIFICATION } from '../gamification'

function basePayload(overrides: Partial<KageSyncPayload> = {}): KageSyncPayload {
  return {
    version: 2,
    exportedAt: '2026-06-01T12:00:00.000Z',
    dailyLogs: [],
    morningLogs: [],
    reflectionLogs: [],
    goals: [],
    gamification: { ...DEFAULT_GAMIFICATION },
    settings: {
      affirmationsEnabled: true,
      elaraWhispers: true,
    },
    ...overrides,
  }
}

describe('mergeSyncPayloads', () => {
  it('keeps the newer daily log for the same date', () => {
    const local = basePayload({
      dailyLogs: [
        {
          date: '2026-06-18',
          mind: 5,
          body: 5,
          spirit: 5,
          core: 50,
          source: 'quick',
          loggedAt: '2026-06-18T08:00:00.000Z',
        },
      ],
    })
    const remote = basePayload({
      exportedAt: '2026-06-19T08:00:00.000Z',
      dailyLogs: [
        {
          date: '2026-06-18',
          mind: 8,
          body: 7,
          spirit: 6,
          core: 70,
          source: 'quick',
          loggedAt: '2026-06-18T20:00:00.000Z',
        },
      ],
    })

    const merged = mergeSyncPayloads(local, remote)
    expect(merged.dailyLogs).toHaveLength(1)
    expect(merged.dailyLogs[0].mind).toBe(8)
  })

  it('combines logs from both devices', () => {
    const local = basePayload({
      dailyLogs: [
        {
          date: '2026-06-17',
          mind: 6,
          body: 6,
          spirit: 6,
          core: 60,
          source: 'quick',
          loggedAt: '2026-06-17T08:00:00.000Z',
        },
      ],
    })
    const remote = basePayload({
      dailyLogs: [
        {
          date: '2026-06-18',
          mind: 7,
          body: 7,
          spirit: 7,
          core: 70,
          source: 'quick',
          loggedAt: '2026-06-18T08:00:00.000Z',
        },
      ],
    })

    const merged = mergeSyncPayloads(local, remote)
    expect(merged.dailyLogs).toHaveLength(2)
  })

  it('does not restore demo mode after local tutorial graduation', () => {
    const local = basePayload({
      settings: {
        affirmationsEnabled: true,
        elaraWhispers: true,
        demoMode: false,
        tutorialComplete: true,
      },
    })
    const remote = basePayload({
      settings: {
        affirmationsEnabled: true,
        elaraWhispers: true,
        demoMode: true,
        tutorialComplete: false,
      },
    })

    const merged = mergeSyncPayloads(local, remote)
    expect(merged.settings.demoMode).toBe(false)
    expect(merged.settings.tutorialComplete).toBe(true)
  })
})
