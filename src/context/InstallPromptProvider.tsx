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
  subscribeInstallPrompt,
} from '../lib/pwa/installPromptCapture'
import {
  InstallPromptContext,
  InstallPromptInternalContext,
} from './installPromptContext'

const ENGAGEMENT_DELAY_MS = 45_000
const PILL_DELAY_MS = 2_000
const ANDROID_NATIVE_WAIT_MS = 5_000

function shouldAutoOpenSheet(): boolean {
  return !isStandaloneMode() && !wasInstallPromptShownThisSession()
}

function applyCapturedPrompt(
  prompt: BeforeInstallPromptEvent,
  triedAutoShow: { current: boolean },
  setDeferred: (p: BeforeInstallPromptEvent) => void,
  setOpen: (open: boolean) => void,
  setPillVisible: (visible: boolean) => void,
  clearNativeWait: () => void,
) {
  setDeferred(prompt)
  if (!shouldAutoOpenSheet() || triedAutoShow.current) return
  triedAutoShow.current = true
  clearNativeWait()
  setPillVisible(false)
  setOpen(true)
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
  const nativeWaitTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const triedAutoShow = useRef(false)
  const deferredRef = useRef<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    deferredRef.current = deferred
  }, [deferred])

  const clearNativeWait = useCallback(() => {
    if (nativeWaitTimer.current) {
      clearTimeout(nativeWaitTimer.current)
      nativeWaitTimer.current = null
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
  }, [])

  const openInstallInvite = useCallback(() => {
    if (standalone) return
    setOpen(true)
  }, [standalone])

  const closeInstallInvite = useCallback(() => {
    setOpen(false)
  }, [])

  const openAutoInvite = useCallback(() => {
    if (triedAutoShow.current || standalone || wasInstallPromptShownThisSession()) return
    triedAutoShow.current = true
    setPillVisible(false)
    setOpen(true)
  }, [standalone])

  const maybeAutoShow = useCallback(() => {
    if (triedAutoShow.current || standalone || wasInstallPromptShownThisSession()) return

    if (isAndroidDevice() && !deferredRef.current) {
      clearNativeWait()
      nativeWaitTimer.current = setTimeout(() => {
        if (!deferredRef.current && !standalone && !wasInstallPromptShownThisSession()) {
          openAutoInvite()
        }
      }, ANDROID_NATIVE_WAIT_MS)
      return
    }

    openAutoInvite()
  }, [clearNativeWait, openAutoInvite, standalone])

  useEffect(() => {
    const captured = getCapturedInstallPrompt()
    if (captured) {
      applyCapturedPrompt(
        captured,
        triedAutoShow,
        setDeferred,
        setOpen,
        setPillVisible,
        clearNativeWait,
      )
    }

    const unsubscribe = subscribeInstallPrompt((prompt) => {
      applyCapturedPrompt(
        prompt,
        triedAutoShow,
        setDeferred,
        setOpen,
        setPillVisible,
        clearNativeWait,
      )
    })

    const onInstalled = () => {
      setStandalone(true)
      setDeferred(null)
      setOpen(false)
      setPillVisible(false)
      markInstallPromptShownThisSession()
      onInstalled?.()
    }

    window.addEventListener('appinstalled', onInstalled)

    return () => {
      unsubscribe()
      window.removeEventListener('appinstalled', onInstalled)
      clearNativeWait()
    }
  }, [clearNativeWait, onInstalled])

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
    await deferred.prompt()
    const { outcome } = await deferred.userChoice
    setDeferred(null)
    markInstallPromptShownThisSession()
    setOpen(false)
    setPillVisible(false)
    return outcome
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
