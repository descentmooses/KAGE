import type { ReactNode } from 'react'
import { InstallPromptProvider } from '../context/InstallPromptProvider'
import { InstallInviteSheet } from './install/InstallInviteSheet'
import { InstallFloatingPill } from './install/InstallFloatingPill'
import { useToast } from '../hooks/useToast'

/**
 * Install UI shell — mounts immediately (outside TrackerProvider loading gate)
 * so `beforeinstallprompt` is never missed while IndexedDB bootstraps.
 */
export function InstallPromptRoot({ children }: { children: ReactNode }) {
  const { showToast } = useToast()

  return (
    <InstallPromptProvider
      onInstalled={() =>
        showToast('KAGE is now on your home screen. The path continues with you.', 'success')
      }
    >
      {children}
      <InstallFloatingPill />
      <InstallInviteSheet />
    </InstallPromptProvider>
  )
}
