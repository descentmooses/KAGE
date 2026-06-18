import { CelebrationListener } from './components/CelebrationListener'
import { AppHeader } from './components/AppHeader'
import { HomeScreen } from './components/HomeScreen'
import { CRTOverlay } from './components/CRTOverlay'
import { BottomNav } from './components/BottomNav'
import { InstallPrompt } from './components/InstallPrompt'
import { OnlineIndicator } from './components/OnlineIndicator'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ActivateScreen } from './components/screens/ActivateScreen'
import { ReflectScreen } from './components/screens/ReflectScreen'
import { CodexScreen } from './components/screens/CodexScreen'
import { TrackerProvider } from './context/TrackerProvider'
import { ToastProvider } from './context/ToastProvider'
import { useTheme } from './theme/useTheme'
import { THEME_TRANSITION } from './theme/transitions'
import type { TabId } from './types'
import { useState } from 'react'

function AppShell() {
  const [activeTab, setActiveTab] = useState<TabId>('home')
  const { tokens } = useTheme()

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />
      case 'activate':
        return <ActivateScreen />
      case 'reflect':
        return <ReflectScreen />
      case 'codex':
        return <CodexScreen />
      default:
        return <HomeScreen />
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: tokens.surface,
        color: tokens.text,
        transition: THEME_TRANSITION,
      }}
    >
      <AppHeader />
      <CelebrationListener />
      <OnlineIndicator />

      <div
        style={{ position: 'relative', flex: 1, minHeight: 0, overflow: 'hidden' }}
        key={activeTab}
      >
        {renderScreen()}
        <CRTOverlay />
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      <InstallPrompt />
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <TrackerProvider>
          <AppShell />
        </TrackerProvider>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
