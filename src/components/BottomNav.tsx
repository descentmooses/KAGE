import { useTheme } from '../theme/useTheme'
import type { TabConfig, TabId } from '../types'
import { useTutorialHighlight } from '../features/tutorial/useTutorialHighlight'
import type { TutorialTarget } from '../features/tutorial/tutorialSteps'

const TABS: TabConfig[] = [
  { id: 'home', label: 'Home', kanji: '宅' },
  { id: 'activate', label: 'Activate', kanji: '活' },
  { id: 'reflect', label: 'Reflect', kanji: '省' },
  { id: 'codex', label: 'Codex', kanji: '典' },
]

const NAV_TARGETS: Partial<Record<TabId, TutorialTarget>> = {
  activate: 'nav-activate',
  reflect: 'nav-reflect',
  codex: 'nav-codex',
}

interface BottomNavProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

function NavTabButton({
  tab,
  active,
  onSelect,
}: {
  tab: TabConfig
  active: boolean
  onSelect: () => void
}) {
  const { tokens, mode } = useTheme()
  const navTarget = NAV_TARGETS[tab.id] ?? null
  const highlighted = useTutorialHighlight(navTarget)

  return (
    <button
      id={navTarget ? `tutorial-${navTarget}` : undefined}
      type="button"
      onClick={onSelect}
      aria-current={active ? 'page' : undefined}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        border: 'none',
        background: active ? tokens.navActiveBg : 'transparent',
        cursor: 'pointer',
        padding: 0,
        minHeight: 56,
        WebkitTapHighlightColor: 'transparent',
        transition: 'background 0.2s ease',
        boxShadow: highlighted
          ? `inset 0 0 0 2px ${tokens.crimson}, 0 0 16px ${tokens.accentGlow}`
          : undefined,
      }}
    >
      {active && (
        <span
          style={{
            position: 'absolute',
            top: 0,
            width: 48,
            height: 2,
            background: `linear-gradient(90deg, ${tokens.crimson}, ${tokens.ember})`,
            boxShadow: mode === 'dark' ? 'none' : `0 0 8px ${tokens.crimson}`,
            transition: 'background 0.35s ease',
          }}
        />
      )}
      <span
        style={{
          fontFamily: '"Noto Sans JP", sans-serif',
          fontSize: 18,
          color: active ? tokens.crimson : tokens.textSubtle,
          textShadow: 'none',
          transition: 'color 0.2s ease, text-shadow 0.2s ease',
        }}
      >
        {tab.kanji}
      </span>
      <span
        style={{
          fontFamily: '"Orbitron", sans-serif',
          fontSize: 7,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: active ? tokens.text : tokens.textMuted,
          transition: 'color 0.2s ease',
        }}
      >
        {tab.label}
      </span>
    </button>
  )
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { tokens } = useTheme()

  return (
    <nav
      aria-label="Main navigation"
      style={{
        flexShrink: 0,
        backgroundColor: tokens.surface,
        borderTop: `1px solid ${tokens.border}`,
        boxShadow: tokens.navShadow,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        transition: 'background-color 0.35s ease, border-color 0.35s ease',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          height: 64,
          maxWidth: 480,
          margin: '0 auto',
        }}
      >
        {TABS.map((tab) => (
          <NavTabButton
            key={tab.id}
            tab={tab}
            active={activeTab === tab.id}
            onSelect={() => onTabChange(tab.id)}
          />
        ))}
      </div>
    </nav>
  )
}
