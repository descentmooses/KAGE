import { useState } from 'react'
import { ErrorBoundary } from './components/ErrorBoundary'
import { InstallShell } from './components/InstallShell'
import { AppShell } from './components/layout/AppShell'
import { TrackerProvider } from './context/TrackerProvider'
import { ElaraProvider } from './context/ElaraProvider'
import { ToastProvider } from './context/ToastProvider'
import type { TabId } from './types'

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home')

  return (
    <ErrorBoundary>
      <ToastProvider>
        <TrackerProvider>
          <InstallShell>
            <ElaraProvider>
              <AppShell activeTab={activeTab} onTabChange={setActiveTab} />
            </ElaraProvider>
          </InstallShell>
        </TrackerProvider>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
