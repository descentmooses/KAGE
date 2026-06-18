/** Session flag — prompt shown or dismissed this browser session. */
export const INSTALL_SESSION_KEY = 'kage-install-prompt-shown'

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function isStandaloneMode(): boolean {
  if (typeof window === 'undefined') return false
  const nav = navigator as Navigator & { standalone?: boolean }
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    nav.standalone === true
  )
}

/** iOS Safari (not Chrome/Firefox on iOS). */
export function isIOSSafari(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  if (!isIOS) return false
  if ((window as Window & { MSStream?: unknown }).MSStream) return false
  return /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua)
}

export function canOfferInstall(deferred: BeforeInstallPromptEvent | null): boolean {
  if (isStandaloneMode()) return false
  if (deferred) return true
  return isIOSSafari()
}

export function wasInstallPromptShownThisSession(): boolean {
  try {
    return sessionStorage.getItem(INSTALL_SESSION_KEY) === '1'
  } catch {
    return false
  }
}

export function markInstallPromptShownThisSession(): void {
  try {
    sessionStorage.setItem(INSTALL_SESSION_KEY, '1')
  } catch {
    /* private browsing */
  }
}

/** Custom event fired after the user's first-ever shadow log. */
export const FIRST_SHADOW_LOG_EVENT = 'kage:first-shadow-log'

export function emitFirstShadowLog(): void {
  window.dispatchEvent(new CustomEvent(FIRST_SHADOW_LOG_EVENT))
}
