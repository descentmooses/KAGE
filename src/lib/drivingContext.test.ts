import { describe, expect, it } from 'vitest'
import { userMentionsDriving } from './drivingContext'
import type { DailyLog } from '../types'

function log(notes: string): DailyLog {
  return {
    date: '2026-06-18',
    mind: 5,
    body: 5,
    spirit: 5,
    core: 50,
    notes,
    source: 'quick',
    loggedAt: '2026-06-18T12:00:00.000Z',
  }
}

describe('userMentionsDriving', () => {
  it('returns false with no driving-related text', () => {
    expect(userMentionsDriving([], null, null)).toBe(false)
    expect(userMentionsDriving([log('Energy shift after lunch')], null, null)).toBe(false)
    expect(userMentionsDriving([log('Gym and meditation')], null, null)).toBe(false)
  })

  it('detects driving keywords in daily log notes', () => {
    expect(userMentionsDriving([log('Long drive home tonight')], null, null)).toBe(true)
    expect(userMentionsDriving([log('Finished my Uber shift')], null, null)).toBe(true)
    expect(userMentionsDriving([log('Ten miles on the road')], null, null)).toBe(true)
  })

  it('detects driving keywords in today morning and reflection rituals', () => {
    expect(
      userMentionsDriving(
        [],
        { id: 'm1', date: '2026-06-18', energy: 7, intention: 'Stay calm on the dash', discipline: 'Hydrate', loggedAt: '2026-06-18T08:00:00.000Z' },
        null,
      ),
    ).toBe(true)

    expect(
      userMentionsDriving(
        [],
        null,
        { id: 'r1', date: '2026-06-18', mind: 6, body: 5, spirit: 7, journal: 'Tough commute today', loggedAt: '2026-06-18T22:00:00.000Z' },
      ),
    ).toBe(true)
  })
})
