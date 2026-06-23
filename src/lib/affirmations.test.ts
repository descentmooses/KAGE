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
    mentionsDriving: false,
    history: {},
    ...overrides,
  }
}

describe('pickAffirmation', () => {
  it('shows welcome copy before the first log today', () => {
    const message = pickAffirmation(baseCtx())
    expect(message).toMatch(/archive|clean page|showing up/i)
  })

  it('uses universal pools when driving is not mentioned', () => {
    const message = pickAffirmation(
      baseCtx({
        hasLoggedToday: true,
        mind: 8,
        body: 8,
        spirit: 8,
        core: 80,
        nonce: 42,
      }),
    )
    expect(message).not.toMatch(/\bdash\b/i)
    expect(message).not.toMatch(/\bmile/i)
    expect(message).not.toMatch(/\broad\b/i)
  })

  it('may use driving pools when the user mentions driving', () => {
    const drivingMessages = new Set<string>()
    for (let nonce = 0; nonce < 200; nonce++) {
      drivingMessages.add(
        pickAffirmation(
          baseCtx({
            hasLoggedToday: true,
            mentionsDriving: true,
            mind: 8,
            body: 8,
            spirit: 8,
            core: 80,
            nonce,
          }),
        ),
      )
    }
    const hasDrivingTheme = [...drivingMessages].some(
      (m) => /\b(dash|mile|road|gig|drive)\b/i.test(m),
    )
    expect(hasDrivingTheme).toBe(true)
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
