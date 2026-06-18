import { useState } from 'react'
import { AppHeader } from './components/AppHeader'
import { HomeScreen } from './components/HomeScreen'
import { CRTOverlay } from './components/CRTOverlay'
import { BottomNav } from './components/BottomNav'
import { ActivateScreen } from './components/screens/ActivateScreen'
import { ReflectScreen } from './components/screens/ReflectScreen'
import { CodexScreen } from './components/screens/CodexScreen'
import { useRatings } from './hooks/useRatings'
import { useTheme } from './theme/useTheme'
import type { TabId } from './types'

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home')
  const { ratings, logRating } = useRatings()
  const { tokens } = useTheme()

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen ratings={ratings} onLogRating={logRating} />
      case 'activate':
        return <ActivateScreen />
      case 'reflect':
        return <ReflectScreen />
      case 'codex':
        return <CodexScreen />
      default:
        return <HomeScreen ratings={ratings} onLogRating={logRating} />
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
        transition: 'background-color 0.35s ease, color 0.35s ease',
      }}
    >
      <AppHeader />

      <div
        style={{ position: 'relative', flex: 1, minHeight: 0, overflow: 'hidden' }}
        key={activeTab}
      >
        {renderScreen()}
        <CRTOverlay />
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default App
