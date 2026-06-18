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
/** Floating pill appears quickly so install is never invisible. */
const PILL_DELAY_MS = 6_000

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
  const triedAutoShow = useRef(false)

  const isIOS = isIOSDevice()
  const isAndroid = isAndroidDevice()
  const showInstallUI = shouldShowInstallUI() && !standalone
  const hasNativePrompt = !!deferred

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

  const maybeAutoShow = useCallback(() => {
    if (triedAutoShow.current) return
    if (standalone || wasInstallPromptShownThisSession()) return
    if (!shouldShowInstallUI()) return

    triedAutoShow.current = true
    markInstallPromptShownThisSession()
    setPillVisible(false)
    setOpen(true)
  }, [standalone])

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
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

  // Return visit: earned timing after engagement (no beforeinstallprompt required)
  useEffect(() => {
    if (!isReturnVisit || standalone || wasInstallPromptShownThisSession()) return

    engagementTimer.current = setTimeout(() => {
      maybeAutoShow()
    }, ENGAGEMENT_DELAY_MS)

    return () => {
      if (engagementTimer.current) clearTimeout(engagementTimer.current)
    }
  }, [isReturnVisit, maybeAutoShow, standalone])

  // Floating pill — always surfaces install within a few seconds if not standalone
  useEffect(() => {
    if (standalone || wasInstallPromptShownThisSession()) return

    pillTimer.current = setTimeout(() => {
      setPillVisible(true)
    }, PILL_DELAY_MS)

    return () => {
      if (pillTimer.current) clearTimeout(pillTimer.current)
    }
  }, [standalone])

  // First-ever shadow log
  useEffect(() => {
    const onFirstLog = () => {
      if (engagementTimer.current) clearTimeout(engagementTimer.current)
      maybeAutoShow()
    }
    window.addEventListener(FIRST_SHADOW_LOG_EVENT, onFirstLog)
    return () => window.removeEventListener(FIRST_SHADOW_LOG_EVENT, onFirstLog)
  }, [maybeAutoShow])

  // Any shadow log — triggers invite if user hasn't dismissed this session (e.g. daily log)
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

  const value = useMemo(
    () => ({
      deferredPrompt: deferred,
      isStandalone: standalone,
      isIOS,
      isAndroid,
      showInstallUI,
      hasNativePrompt,
      open,
      pillVisible,
      openInstallInvite,
      closeInstallInvite,
      dismissForSession,
      promptInstall,
    }),
    [
      deferred,
      standalone,
      isIOS,
      isAndroid,
      showInstallUI,
      hasNativePrompt,
      open,
      pillVisible,
      openInstallInvite,
      closeInstallInvite,
      dismissForSession,
      promptInstall,
    ],
  )

  return <InstallPromptContext.Provider value={value}>{children}</InstallPromptContext.Provider>
}
