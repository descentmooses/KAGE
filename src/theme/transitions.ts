/** Shared duration for theme switches — keeps surfaces and effects in sync. */
export const THEME_TRANSITION_MS = 500

const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)'

export const THEME_TRANSITION = [
  `background-color ${THEME_TRANSITION_MS}ms ${EASE}`,
  `color ${THEME_TRANSITION_MS}ms ${EASE}`,
  `border-color ${THEME_TRANSITION_MS}ms ${EASE}`,
  `box-shadow ${THEME_TRANSITION_MS}ms ${EASE}`,
  `opacity ${THEME_TRANSITION_MS}ms ${EASE}`,
  `background ${THEME_TRANSITION_MS}ms ${EASE}`,
  `filter ${THEME_TRANSITION_MS}ms ${EASE}`,
].join(', ')

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Crossfade the whole UI when the browser supports View Transitions. */
export function withThemeTransition(apply: () => void): void {
  if (prefersReducedMotion() || !document.startViewTransition) {
    apply()
    return
  }
  document.startViewTransition(apply)
}
