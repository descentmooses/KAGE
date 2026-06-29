import type { AppSettings } from '../types'

/** Apply a settings patch without undoing tutorial graduation from stale async writes. */
export function mergeSettingsPatch(
  current: AppSettings,
  patch: Partial<AppSettings>,
): AppSettings {
  const next: AppSettings = { ...current, ...patch }

  if (current.tutorialComplete) {
    next.tutorialComplete = true
    if (current.demoMode === false) {
      next.demoMode = false
    }
  }

  return next
}

/** Ignore late tutorial-step writes once the user has left demo mode. */
export function shouldIgnoreTutorialStepPatch(
  current: AppSettings,
  patch: Partial<AppSettings>,
): boolean {
  return (
    'tutorialStep' in patch &&
    (current.tutorialComplete === true || current.demoMode === false)
  )
}
