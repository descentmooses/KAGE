import { describe, expect, it } from 'vitest'
import { pickAffirmation, type AffirmationContext } from './affirmations'

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
})
