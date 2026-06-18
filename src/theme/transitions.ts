/** Shared duration for theme switches — keeps surfaces and effects in sync. */
export const THEME_TRANSITION_MS = 500

/** Dark neon/ambient effects bloom in after the shell has mostly darkened. */
export const DARK_EFFECTS_DELAY_MS = 380
export const DARK_EFFECTS_DURATION_MS = 700
export const LIGHT_EFFECTS_DURATION_MS = 450

const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)'
const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)'

export const THEME_TRANSITION = [
  `background-color ${THEME_TRANSITION_MS}ms ${EASE}`,
  `color ${THEME_TRANSITION_MS}ms ${EASE}`,
  `border-color ${THEME_TRANSITION_MS}ms ${EASE}`,
  `box-shadow ${THEME_TRANSITION_MS}ms ${EASE}`,
  `opacity ${THEME_TRANSITION_MS}ms ${EASE}`,
  `background ${THEME_TRANSITION_MS}ms ${EASE}`,
  `filter ${THEME_TRANSITION_MS}ms ${EASE}`,
].join(', ')

const THEME_EFFECT_TRANSITION_IN = `opacity ${DARK_EFFECTS_DURATION_MS}ms ${EASE_OUT} ${DARK_EFFECTS_DELAY_MS}ms`
const THEME_EFFECT_TRANSITION_OUT = `opacity ${LIGHT_EFFECTS_DURATION_MS}ms ${EASE}`

/** Asymmetric opacity timing — bloom in slowly after darkening, fade out promptly in light. */
export function themeEffectTransition(visible: boolean): string {
  return visible ? THEME_EFFECT_TRANSITION_IN : THEME_EFFECT_TRANSITION_OUT
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export type ThemeTransitionDirection = 'to-dark' | 'to-light'

/** Crossfade the whole UI when the browser supports View Transitions. */
export function withThemeTransition(
  apply: () => void,
  direction: ThemeTransitionDirection,
): void {
  if (prefersReducedMotion() || !document.startViewTransition) {
    apply()
    return
  }

  const root = document.documentElement
  root.dataset.themeEntering = direction === 'to-dark' ? 'dark' : 'light'

  const transition = document.startViewTransition(apply)
  void transition.finished.finally(() => {
    delete root.dataset.themeEntering
  })
}
