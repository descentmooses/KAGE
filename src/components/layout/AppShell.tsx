import { lazy, Suspense } from 'react'
import { CelebrationListener } from '../CelebrationListener'
import { AppHeader } from '../AppHeader'
import { CRTOverlay } from '../CRTOverlay'
import { BottomNav } from '../BottomNav'
import { OnlineIndicator } from '../OnlineIndicator'
import { LoadingScreen } from '../LoadingScreen'
import { useTheme } from '../../theme/useTheme'
import { THEME_TRANSITION } from '../../theme/transitions'
import type { TabId } from '../../types'

const HomeScreen = lazy(() =>
  import('../../features/home/HomeScreen').then((m) => ({ default: m.HomeScreen })),
)
const ActivateScreen = lazy(() =>
  import('../../features/rituals/ActivateScreen').then((m) => ({ default: m.ActivateScreen })),
)
const ReflectScreen = lazy(() =>
  import('../../features/rituals/ReflectScreen').then((m) => ({ default: m.ReflectScreen })),
)
const CodexScreen = lazy(() =>
  import('../../features/codex/CodexScreen').then((m) => ({ default: m.CodexScreen })),
)

interface AppShellProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

function TabFallback() {
  return <LoadingScreen message="Loading…" />
}

/**
 * Main app chrome: header, tab content, CRT overlay, bottom nav.
 * Tab screens are lazy-loaded to split the main bundle (Recharts, rituals, codex).
 */
export function AppShell({ activeTab, onTabChange }: AppShellProps) {
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
        <Suspense fallback={<TabFallback />}>{renderScreen()}</Suspense>
        <CRTOverlay />
      </div>

      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  )
}
