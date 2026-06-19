import type { BeforeInstallPromptEvent } from './installUtils'
import { markInstallPromptShownThisSession } from './installUtils'

let captured: BeforeInstallPromptEvent | null = null
const listeners = new Set<(event: BeforeInstallPromptEvent) => void>()

function stash(event: BeforeInstallPromptEvent) {
  captured = event
  for (const listener of listeners) listener(event)
}

/** Register before React mounts so we never miss a one-shot `beforeinstallprompt`. */
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    stash(e as BeforeInstallPromptEvent)
  })
}

export function getCapturedInstallPrompt(): BeforeInstallPromptEvent | null {
  return captured
}

export function clearCapturedInstallPrompt(): void {
  captured = null
}

export function subscribeInstallPrompt(
  listener: (event: BeforeInstallPromptEvent) => void,
): () => void {
  if (captured) listener(captured)
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export interface NativeInstallResult {
  outcome: 'accepted' | 'dismissed' | 'failed'
}

/**
 * Invoke Chrome's native install dialog. Must run soon after `beforeinstallprompt`.
 * Clears the captured prompt on success.
 */
export async function runNativeInstallPrompt(
  prompt: BeforeInstallPromptEvent,
): Promise<NativeInstallResult> {
  try {
    await prompt.prompt()
    const { outcome } = await prompt.userChoice
    clearCapturedInstallPrompt()
    markInstallPromptShownThisSession()
    return { outcome }
  } catch {
    return { outcome: 'failed' }
  }
}
