import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  type BeforeInstallPromptEvent,
  FIRST_SHADOW_LOG_EVENT,
  isAndroidDevice,
  isIOSDevice,
  isStandaloneMode,
  markInstallPromptShownThisSession,
  SHADOW_LOGGED_EVENT,
  shouldShowInstallUI,
  wasInstallPromptShownThisSession,
} from '../lib/pwa/installUtils'
import {
  getCapturedInstallPrompt,
  runNativeInstallPrompt,
  subscribeInstallPrompt,
} from '../lib/pwa/installPromptCapture'
import {
  InstallPromptContext,
  InstallPromptInternalContext,
} from './installPromptContext'

const ENGAGEMENT_DELAY_MS = 45_000
const PILL_DELAY_MS = 1_500
/** Wait longer before falling back to manual install steps — BIP often follows SW activation. */
const ANDROID_MANUAL_FALLBACK_MS = 30_000

function shouldAutoOpenSheet(): boolean {
  return !isStandaloneMode() && !wasInstallPromptShownThisSession()
}

export function InstallPromptProvider({
  children,
  onInstalled,
}: {
  children: ReactNode
  onInstalled?: () => void
}) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [standalone, setStandalone] = useState(isStandaloneMode)
  const [open, setOpen] = useState(false)
  const [pillVisible, setPillVisible] = useState(false)
  const [isReturnVisit, setReturnVisit] = useState(false)
  const engagementTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pillTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const manualFallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const triedAutoShow = useRef(false)
  const deferredRef = useRef<BeforeInstallPromptEvent | null>(null)
  const onInstalledRef = useRef(onInstalled)

  useEffect(() => {
    onInstalledRef.current = onInstalled
  }, [onInstalled])

  useEffect(() => {
    deferredRef.current = deferred
  }, [deferred])

  const clearManualFallback = useCallback(() => {
    if (manualFallbackTimer.current) {
      clearTimeout(manualFallbackTimer.current)
      manualFallbackTimer.current = null
    }
  }, [])

  const isIOS = isIOSDevice()
  const isAndroid = isAndroidDevice()
  const showInstallUI = shouldShowInstallUI() && !standalone
  const hasNativePrompt = !!deferred
  const sessionDismissed = wasInstallPromptShownThisSession()

  const dismissForSession = useCallback(() => {
    markInstallPromptShownThisSession()
    setOpen(false)
    setPillVisible(false)
    clearManualFallback()
  }, [clearManualFallback])

  const openInstallInvite = useCallback(() => {
    if (standalone) return
    setOpen(true)
  }, [standalone])

  const closeInstallInvite = useCallback(() => {
    setOpen(false)
  }, [])

  const openManualFallback = useCallback(() => {
    if (triedAutoShow.current || standalone || wasInstallPromptShownThisSession()) return
    if (deferredRef.current) return
    triedAutoShow.current = true
    setPillVisible(true)
    setOpen(true)
  }, [standalone])

  const triggerNativeInstall = useCallback(async (prompt: BeforeInstallPromptEvent) => {
    setDeferred(prompt)
    clearManualFallback()
    setPillVisible(false)
    setOpen(false)

    if (!shouldAutoOpenSheet()) return

    triedAutoShow.current = true
    const result = await runNativeInstallPrompt(prompt)

    if (result.outcome === 'accepted') {
      setDeferred(null)
      onInstalledRef.current?.()
      return
    }

    if (result.outcome === 'dismissed') {
      setDeferred(null)
      setPillVisible(true)
      return
    }

    // prompt() failed — show sheet with INSTALL KAGE button as fallback
    setOpen(true)
  }, [clearManualFallback])

  const scheduleManualFallback = useCallback(() => {
    if (triedAutoShow.current || standalone || wasInstallPromptShownThisSession()) return
    if (deferredRef.current) return

    if (isAndroidDevice()) {
      clearManualFallback()
      manualFallbackTimer.current = setTimeout(() => {
        if (!deferredRef.current && !standalone && !wasInstallPromptShownThisSession()) {
          openManualFallback()
        }
      }, ANDROID_MANUAL_FALLBACK_MS)
      return
    }

    openManualFallback()
  }, [clearManualFallback, openManualFallback, standalone])

  const maybeAutoShow = useCallback(() => {
    if (triedAutoShow.current || standalone || wasInstallPromptShownThisSession()) return
    if (deferredRef.current) {
      void triggerNativeInstall(deferredRef.current)
      return
    }
    scheduleManualFallback()
  }, [scheduleManualFallback, standalone, triggerNativeInstall])

  useEffect(() => {
    const runIfCaptured = (prompt: BeforeInstallPromptEvent) => {
      queueMicrotask(() => {
        void triggerNativeInstall(prompt)
      })
    }

    const captured = getCapturedInstallPrompt()
    if (captured) runIfCaptured(captured)

    const unsubscribe = subscribeInstallPrompt(runIfCaptured)

    const onInstalled = () => {
      setStandalone(true)
      setDeferred(null)
      setOpen(false)
      setPillVisible(false)
      markInstallPromptShownThisSession()
      clearManualFallback()
      onInstalledRef.current?.()
    }

    const onControllerChange = () => {
      const late = getCapturedInstallPrompt()
      if (late && !deferredRef.current) runIfCaptured(late)
    }

    window.addEventListener('appinstalled', onInstalled)
    navigator.serviceWorker?.addEventListener('controllerchange', onControllerChange)

    return () => {
      unsubscribe()
      window.removeEventListener('appinstalled', onInstalled)
      navigator.serviceWorker?.removeEventListener('controllerchange', onControllerChange)
      clearManualFallback()
    }
  }, [clearManualFallback, triggerNativeInstall])

  useEffect(() => {
    if (!isReturnVisit || standalone || wasInstallPromptShownThisSession()) return

    engagementTimer.current = setTimeout(() => {
      maybeAutoShow()
    }, ENGAGEMENT_DELAY_MS)

    return () => {
      if (engagementTimer.current) clearTimeout(engagementTimer.current)
    }
  }, [isReturnVisit, maybeAutoShow, standalone])

  useEffect(() => {
    if (standalone || wasInstallPromptShownThisSession()) return

    pillTimer.current = setTimeout(() => {
      setPillVisible(true)
    }, PILL_DELAY_MS)

    return () => {
      if (pillTimer.current) clearTimeout(pillTimer.current)
    }
  }, [standalone])

  useEffect(() => {
    const onFirstLog = () => {
      if (engagementTimer.current) clearTimeout(engagementTimer.current)
      maybeAutoShow()
    }
    window.addEventListener(FIRST_SHADOW_LOG_EVENT, onFirstLog)
    return () => window.removeEventListener(FIRST_SHADOW_LOG_EVENT, onFirstLog)
  }, [maybeAutoShow])

  useEffect(() => {
    const onShadowLogged = () => {
      if (!wasInstallPromptShownThisSession() && !triedAutoShow.current) {
        maybeAutoShow()
      }
    }
    window.addEventListener(SHADOW_LOGGED_EVENT, onShadowLogged)
    return () => window.removeEventListener(SHADOW_LOGGED_EVENT, onShadowLogged)
  }, [maybeAutoShow])

  const promptInstall = useCallback(async (): Promise<'accepted' | 'dismissed' | 'unavailable'> => {
    if (!deferred) return 'unavailable'
    const result = await runNativeInstallPrompt(deferred)
    setDeferred(null)
    setOpen(false)
    setPillVisible(false)
    if (result.outcome === 'accepted') onInstalledRef.current?.()
    if (result.outcome === 'failed') return 'unavailable'
    return result.outcome
  }, [deferred])

  const tryNativeInstall = useCallback(async () => {
    if (deferred) {
      return promptInstall()
    }
    openInstallInvite()
    return 'unavailable' as const
  }, [deferred, openInstallInvite, promptInstall])

  const value = useMemo(
    () => ({
      deferredPrompt: deferred,
      isStandalone: standalone,
      isIOS,
      isAndroid,
      showInstallUI,
      hasNativePrompt,
      sessionDismissed,
      open,
      pillVisible,
      openInstallInvite,
      closeInstallInvite,
      dismissForSession,
      promptInstall,
      tryNativeInstall,
    }),
    [
      deferred,
      standalone,
      isIOS,
      isAndroid,
      showInstallUI,
      hasNativePrompt,
      sessionDismissed,
      open,
      pillVisible,
      openInstallInvite,
      closeInstallInvite,
      dismissForSession,
      promptInstall,
      tryNativeInstall,
    ],
  )

  const internalValue = useMemo(() => ({ setReturnVisit }), [])

  return (
    <InstallPromptInternalContext.Provider value={internalValue}>
      <InstallPromptContext.Provider value={value}>{children}</InstallPromptContext.Provider>
    </InstallPromptInternalContext.Provider>
  )
}
