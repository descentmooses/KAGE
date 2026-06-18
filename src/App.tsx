import { HomeScreen } from './components/HomeScreen'
import { CRTOverlay } from './components/CRTOverlay'

function App() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-void">
      <HomeScreen />
      <CRTOverlay />
    </div>
  )
}

export default App
