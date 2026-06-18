import { lazy, Suspense } from 'react'
import { LoadingScreen } from '../../components/LoadingScreen'

const TrendSection = lazy(() =>
  import('./TrendSection').then((m) => ({ default: m.TrendSection })),
)

export function LazyTrendSection() {
  return (
    <Suspense fallback={<LoadingScreen message="Loading trends…" />}>
      <TrendSection />
    </Suspense>
  )
}
