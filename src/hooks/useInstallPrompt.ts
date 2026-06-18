import { useCallback, useEffect, useState } from 'react'
import {
  type BeforeInstallPromptEvent,
  canOfferInstall,
  isIOSSafari,
  isStandaloneMode,
} from '../lib/pwa/installUtils'

/** Low-level install prompt capture — prefer useInstallPromptContext in UI. */
export function useInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(isStandaloneMode)

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    const onInstalled = () => {
      setInstalled(true)
      setDeferred(null)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const promptInstall = useCallback(async () => {
    if (!deferred) return false
    await deferred.prompt()
    const { outcome } = await deferred.userChoice
    setDeferred(null)
    return outcome === 'accepted'
  }, [deferred])

  return {
    canInstall: canOfferInstall(deferred) && !installed,
    isIOS: isIOSSafari(),
    installed,
    promptInstall,
  }
}
