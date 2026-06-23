import { useState } from 'react'
import { ErrorBoundary } from './components/ErrorBoundary'
import { InstallPromptRoot } from './components/InstallPromptRoot'
import { InstallReturnVisitSync } from './components/install/InstallReturnVisitSync'
import { AppShell } from './components/layout/AppShell'
import { TrackerProvider } from './context/TrackerProvider'
import { GitHubSyncProvider } from './context/GitHubSyncProvider'
import { ElaraProvider } from './context/ElaraProvider'
import { TutorialProvider } from './context/TutorialProvider'
import { ToastProvider } from './context/ToastProvider'
import type { TabId } from './types'

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home')

  return (
    <ErrorBoundary>
      <ToastProvider>
        <InstallPromptRoot>
          <TrackerProvider>
            <GitHubSyncProvider>
              <InstallReturnVisitSync />
              <ElaraProvider>
                <TutorialProvider activeTab={activeTab} onTabChange={setActiveTab}>
                  <AppShell activeTab={activeTab} onTabChange={setActiveTab} />
                </TutorialProvider>
              </ElaraProvider>
            </GitHubSyncProvider>
          </TrackerProvider>
        </InstallPromptRoot>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
