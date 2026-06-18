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
import { InstallPromptContext } from './installPromptContext'

const ENGAGEMENT_DELAY_MS = 45_000
const PILL_DELAY_MS = 6_000
const ANDROID_NATIVE_WAIT_MS = 5_000

export function InstallPromptProvider({
  children,
  isReturnVisit,
  onInstalled,
}: {
  children: ReactNode
  isReturnVisit: boolean
  onInstalled?: () => void
}) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [standalone, setStandalone] = useState(isStandaloneMode)
  const [open, setOpen] = useState(false)
  const [pillVisible, setPillVisible] = useState(false)
  const engagementTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pillTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const nativeWaitTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const triedAutoShow = useRef(false)
  const deferredRef = useRef<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    deferredRef.current = deferred
  }, [deferred])

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

    if (isAndroidDevice() && !deferred) {
      if (nativeWaitTimer.current) clearTimeout(nativeWaitTimer.current)
      nativeWaitTimer.current = setTimeout(() => {
        if (!deferredRef.current && !standalone && !wasInstallPromptShownThisSession()) {
          openAutoInvite()
        }
      }, ANDROID_NATIVE_WAIT_MS)
      return
    }

    openAutoInvite()
  }, [deferred, openAutoInvite, standalone])

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      e.preventDefault()
      const prompt = e as BeforeInstallPromptEvent
      setDeferred(prompt)
      if (!isStandaloneMode() && !wasInstallPromptShownThisSession()) {
        if (nativeWaitTimer.current) clearTimeout(nativeWaitTimer.current)
        setPillVisible(false)
        setOpen(true)
        triedAutoShow.current = true
      }
    }
    const onInstalled = () => {
      setStandalone(true)
      setDeferred(null)
      setOpen(false)
      setPillVisible(false)
      markInstallPromptShownThisSession()
      onInstalled?.()
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [onInstalled])

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

  return <InstallPromptContext.Provider value={value}>{children}</InstallPromptContext.Provider>
}
