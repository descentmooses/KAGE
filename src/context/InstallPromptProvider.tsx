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
  canOfferInstall,
  FIRST_SHADOW_LOG_EVENT,
  isIOSSafari,
  isStandaloneMode,
  markInstallPromptShownThisSession,
  wasInstallPromptShownThisSession,
} from '../lib/pwa/installUtils'
import { InstallPromptContext } from './installPromptContext'

const ENGAGEMENT_DELAY_MS = 50_000

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
  const engagementTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const triedAutoShow = useRef(false)

  const isIOS = isIOSSafari()
  const canInstall = canOfferInstall(deferred)

  const dismissForSession = useCallback(() => {
    markInstallPromptShownThisSession()
    setOpen(false)
  }, [])

  const openInstallInvite = useCallback(() => {
    if (standalone) return
    if (!canOfferInstall(deferred) && !isIOSSafari()) return
    setOpen(true)
  }, [deferred, standalone])

  const closeInstallInvite = useCallback(() => {
    setOpen(false)
  }, [])

  const maybeAutoShow = useCallback(() => {
    if (triedAutoShow.current) return
    if (standalone || wasInstallPromptShownThisSession()) return
    if (!canOfferInstall(deferred) && !isIOSSafari()) return

    triedAutoShow.current = true
    markInstallPromptShownThisSession()
    setOpen(true)
  }, [deferred, standalone])

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    const onInstalled = () => {
      setStandalone(true)
      setDeferred(null)
      setOpen(false)
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
    if (!canOfferInstall(deferred) && !isIOSSafari()) return

    engagementTimer.current = setTimeout(() => {
      maybeAutoShow()
    }, ENGAGEMENT_DELAY_MS)

    return () => {
      if (engagementTimer.current) clearTimeout(engagementTimer.current)
    }
  }, [deferred, isReturnVisit, maybeAutoShow, standalone])

  useEffect(() => {
    const onFirstLog = () => {
      if (engagementTimer.current) clearTimeout(engagementTimer.current)
      maybeAutoShow()
    }
    window.addEventListener(FIRST_SHADOW_LOG_EVENT, onFirstLog)
    return () => window.removeEventListener(FIRST_SHADOW_LOG_EVENT, onFirstLog)
  }, [maybeAutoShow])

  const promptInstall = useCallback(async (): Promise<'accepted' | 'dismissed' | 'unavailable'> => {
    if (!deferred) return 'unavailable'
    await deferred.prompt()
    const { outcome } = await deferred.userChoice
    setDeferred(null)
    markInstallPromptShownThisSession()
    setOpen(false)
    return outcome
  }, [deferred])

  const value = useMemo(
    () => ({
      deferredPrompt: deferred,
      isStandalone: standalone,
      isIOS,
      canInstall,
      open,
      openInstallInvite,
      closeInstallInvite,
      dismissForSession,
      promptInstall,
    }),
    [
      deferred,
      standalone,
      isIOS,
      canInstall,
      open,
      openInstallInvite,
      closeInstallInvite,
      dismissForSession,
      promptInstall,
    ],
  )

  return <InstallPromptContext.Provider value={value}>{children}</InstallPromptContext.Provider>
}
