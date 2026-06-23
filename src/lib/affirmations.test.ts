import { describe, expect, it } from 'vitest'
import { pickAffirmation, type AffirmationContext } from './affirmations'
import type { ElaraPersona } from '../types'

function baseCtx(overrides: Partial<AffirmationContext> = {}): AffirmationContext {
  return {
    elara: true,
    mind: 0,
    body: 0,
    spirit: 0,
    core: 0,
    streak: 0,
    hasLoggedToday: false,
    history: {},
    ...overrides,
  }
}

describe('pickAffirmation', () => {
  it('shows welcome copy before the first log today', () => {
    const message = pickAffirmation(baseCtx())
    expect(message).toMatch(/archive|clean page|showing up/i)
  })

  it('never uses driving-themed language', () => {
    const messages = new Set<string>()
    for (let nonce = 0; nonce < 300; nonce++) {
      messages.add(
        pickAffirmation(
          baseCtx({
            hasLoggedToday: true,
            mind: 8,
            body: 3,
            spirit: 7,
            core: 60,
            streak: 14,
            morningLogged: true,
            reflectionLogged: true,
            nonce,
          }),
        ),
      )
    }
    for (const message of messages) {
      expect(message).not.toMatch(/\b(dash|mile|road|gig|drive|tesla|uber|lyft)\b/i)
    }
  })

  it('skips low-energy copy when all pillar scores are zero', () => {
    const message = pickAffirmation(
      baseCtx({
        hasLoggedToday: true,
        mind: 0,
        body: 0,
        spirit: 0,
        core: 0,
        nonce: 1,
      }),
    )
    expect(message).not.toMatch(/Low numbers are data/i)
  })

  it('uses personal whispers when persona has evolved', () => {
    const persona: ElaraPersona = {
      relationshipDepth: 72,
      stage: 'intimate',
      themes: ['family'],
      anchorPillar: 'spirit',
      tenderPillar: 'body',
      recurringWords: ['Stay present with my family tonight'],
      morningCount: 6,
      reflectionCount: 5,
      logDays: 20,
      lastEvolvedAt: '2026-06-18T00:00:00.000Z',
    }

    const messages = new Set<string>()
    for (let nonce = 0; nonce < 400; nonce++) {
      messages.add(
        pickAffirmation(
          baseCtx({
            hasLoggedToday: true,
            mind: 7,
            body: 6,
            spirit: 8,
            core: 70,
            streak: 10,
            persona,
            nonce,
          }),
        ),
      )
    }

    const hasPersonal = [...messages].some(
      (m) =>
        m.includes('Stay present with my family tonight') ||
        m.includes('family') ||
        m.includes('20 days in the archive'),
    )
    expect(hasPersonal).toBe(true)
  })
})
