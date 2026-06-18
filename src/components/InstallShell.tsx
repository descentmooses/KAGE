import type { ReactNode } from 'react'
import { InstallPromptProvider } from '../context/InstallPromptProvider'
import { InstallInviteSheet } from './install/InstallInviteSheet'
import { InstallFloatingPill } from './install/InstallFloatingPill'
import { useTracker } from '../context/trackerContext'
import { useToast } from '../hooks/useToast'

export function InstallShell({ children }: { children: ReactNode }) {
  const { allLogs, settings } = useTracker()
  const { showToast } = useToast()
  const isReturnVisit = allLogs.length > 0 || !!settings.hasOnboarded

  return (
    <InstallPromptProvider
      isReturnVisit={isReturnVisit}
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
