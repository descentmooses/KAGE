import { createContext, useContext } from 'react'
import type { BeforeInstallPromptEvent } from '../lib/pwa/installUtils'

export interface InstallPromptContextValue {
  deferredPrompt: BeforeInstallPromptEvent | null
  isStandalone: boolean
  isIOS: boolean
  isAndroid: boolean
  showInstallUI: boolean
  hasNativePrompt: boolean
  sessionDismissed: boolean
  pillVisible: boolean
  open: boolean
  openInstallInvite: () => void
  closeInstallInvite: () => void
  dismissForSession: () => void
  promptInstall: () => Promise<'accepted' | 'dismissed' | 'unavailable'>
  tryNativeInstall: () => Promise<'accepted' | 'dismissed' | 'unavailable'>
}

export const InstallPromptContext = createContext<InstallPromptContextValue | null>(null)

export function useInstallPromptContext() {
  const ctx = useContext(InstallPromptContext)
  if (!ctx) throw new Error('useInstallPromptContext must be used within InstallPromptProvider')
  return ctx
}
