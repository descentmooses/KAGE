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
