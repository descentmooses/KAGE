import { describe, expect, it } from 'vitest'
import { mergeSettingsPatch, shouldIgnoreTutorialStepPatch } from './settingsMerge'

describe('mergeSettingsPatch', () => {
  it('preserves graduation when a stale tutorial step write arrives late', () => {
    const graduated = {
      affirmationsEnabled: true,
      elaraWhispers: true,
      demoMode: false,
      tutorialComplete: true,
      tutorialStep: 8,
    }

    const merged = mergeSettingsPatch(graduated, { tutorialStep: 3, demoMode: true })

    expect(merged.demoMode).toBe(false)
    expect(merged.tutorialComplete).toBe(true)
    expect(merged.tutorialStep).toBe(3)
  })
})

describe('shouldIgnoreTutorialStepPatch', () => {
  it('drops tutorial step writes after graduation', () => {
    expect(
      shouldIgnoreTutorialStepPatch(
        {
          affirmationsEnabled: true,
          elaraWhispers: true,
          demoMode: false,
          tutorialComplete: true,
        },
        { tutorialStep: 2 },
      ),
    ).toBe(true)
  })
})
