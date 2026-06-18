/** Session flag — install invite dismissed or auto-shown this browser session. */
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

/** Any iOS device (Safari, Chrome, Firefox, etc.). */
export function isIOSDevice(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  if ((window as Window & { MSStream?: unknown }).MSStream) return false
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

/** iOS Safari specifically (for fine-tuned copy). */
export function isIOSSafari(): boolean {
  if (!isIOSDevice()) return false
  const ua = navigator.userAgent
  return /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua)
}

export function isAndroidDevice(): boolean {
  if (typeof navigator === 'undefined') return false
  return /Android/i.test(navigator.userAgent)
}

/** True when we should surface any install UI (not already installed). */
export function shouldShowInstallUI(): boolean {
  return !isStandaloneMode()
}

/** Native one-tap install via beforeinstallprompt. */
export function hasNativeInstallPrompt(deferred: BeforeInstallPromptEvent | null): boolean {
  return !!deferred && !isStandaloneMode()
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

/** Fired after any shadow log while install UI may still be shown. */
export const SHADOW_LOGGED_EVENT = 'kage:shadow-logged'

export function emitFirstShadowLog(): void {
  window.dispatchEvent(new CustomEvent(FIRST_SHADOW_LOG_EVENT))
}

export function emitShadowLogged(): void {
  window.dispatchEvent(new CustomEvent(SHADOW_LOGGED_EVENT))
}
