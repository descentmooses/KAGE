import { useCallback, useEffect, useState } from 'react'
import {
  type BeforeInstallPromptEvent,
  hasNativeInstallPrompt,
  isIOSDevice,
  isStandaloneMode,
  shouldShowInstallUI,
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
    canInstall: shouldShowInstallUI() && !installed,
    hasNativePrompt: hasNativeInstallPrompt(deferred),
    isIOS: isIOSDevice(),
    installed,
    promptInstall,
  }
}
