import { describe, expect, it } from 'vitest'
import { TUTORIAL_STEPS, tutorialTargetId } from '../features/tutorial/tutorialSteps'

describe('demo tutorial', () => {
  it('defines a full Elara-guided walkthrough', () => {
    expect(TUTORIAL_STEPS.length).toBeGreaterThanOrEqual(8)
    expect(TUTORIAL_STEPS[0].elara).toMatch(/Elara/i)
    expect(TUTORIAL_STEPS[0].elara).toMatch(/demo/i)
    expect(TUTORIAL_STEPS.at(-1)?.id).toBe('complete')
    expect(TUTORIAL_STEPS.at(-1)?.elara).toMatch(/archive/i)
  })

  it('maps highlight targets to DOM ids', () => {
    expect(tutorialTargetId('home-core')).toBe('tutorial-home-core')
    expect(tutorialTargetId(null)).toBeNull()
  })

  it('visits each main tab during the tour', () => {
    const tabs = new Set(TUTORIAL_STEPS.map((s) => s.tab))
    expect(tabs.has('home')).toBe(true)
    expect(tabs.has('activate')).toBe(true)
    expect(tabs.has('reflect')).toBe(true)
    expect(tabs.has('codex')).toBe(true)
  })
})
