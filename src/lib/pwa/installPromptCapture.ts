import type { BeforeInstallPromptEvent } from './installUtils'

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
