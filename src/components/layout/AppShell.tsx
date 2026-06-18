import { CelebrationListener } from '../CelebrationListener'
import { AppHeader } from '../AppHeader'
import { HomeScreen } from '../../features/home/HomeScreen'
import { CRTOverlay } from '../CRTOverlay'
import { BottomNav } from '../BottomNav'
import { OnlineIndicator } from '../OnlineIndicator'
import { ActivateScreen } from '../../features/rituals/ActivateScreen'
import { ReflectScreen } from '../../features/rituals/ReflectScreen'
import { CodexScreen } from '../../features/codex/CodexScreen'
import { useTheme } from '../../theme/useTheme'
import { THEME_TRANSITION } from '../../theme/transitions'
import type { TabId } from '../../types'

interface AppShellProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

/**
 * Main app chrome: header, tab content, CRT overlay, bottom nav.
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
        {renderScreen()}
        <CRTOverlay />
      </div>

      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  )
}
