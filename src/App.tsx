import { useState } from 'react'
import { AppHeader } from './components/AppHeader'
import { HomeScreen } from './components/HomeScreen'
import { CRTOverlay } from './components/CRTOverlay'
import { BottomNav } from './components/BottomNav'
import { ActivateScreen } from './components/screens/ActivateScreen'
import { ReflectScreen } from './components/screens/ReflectScreen'
import { CodexScreen } from './components/screens/CodexScreen'
import { useRatings } from './hooks/useRatings'
import type { TabId } from './types'

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home')
  const { ratings, logRating } = useRatings()

  return (
    <div
      className="app-shell grid h-full w-full grid-rows-[auto_1fr_auto] overflow-hidden text-white"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      <AppHeader />

      <div className="relative min-h-0 overflow-hidden">
        {activeTab === 'home' && (
          <HomeScreen ratings={ratings} onLogRating={logRating} />
        )}
        {activeTab === 'activate' && <ActivateScreen />}
        {activeTab === 'reflect' && <ReflectScreen />}
        {activeTab === 'codex' && <CodexScreen />}
        <CRTOverlay />
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default App
