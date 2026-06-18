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
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-void text-white">
      <AppHeader />

      <div className="relative z-10 min-h-0 flex-1 overflow-hidden pt-14">
        {activeTab === 'home' && (
          <HomeScreen ratings={ratings} onLogRating={logRating} />
        )}
        {activeTab === 'activate' && <ActivateScreen />}
        {activeTab === 'reflect' && <ReflectScreen />}
        {activeTab === 'codex' && <CodexScreen />}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      <CRTOverlay />
    </div>
  )
}

export default App
