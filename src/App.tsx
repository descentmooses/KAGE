import { HomeScreen } from './components/HomeScreen'
import { CRTOverlay } from './components/CRTOverlay'
import { useRatings } from './hooks/useRatings'

function App() {
  const { ratings, logRating } = useRatings()

  return (
    <div className="relative h-full w-full overflow-hidden bg-void">
      <HomeScreen ratings={ratings} onLogRating={logRating} />
      <CRTOverlay />
    </div>
  )
}

export default App
