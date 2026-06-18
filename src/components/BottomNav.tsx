import type { TabConfig, TabId } from '../types'

const TABS: TabConfig[] = [
  { id: 'home', label: 'Home', kanji: '宅' },
  { id: 'activate', label: 'Activate', kanji: '活' },
  { id: 'reflect', label: 'Reflect', kanji: '省' },
  { id: 'codex', label: 'Codex', kanji: '典' },
]

interface BottomNavProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      className="relative z-50 border-t border-white/10"
      style={{
        backgroundColor: 'rgba(10, 10, 10, 0.96)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxShadow: '0 -1px 0 rgba(255, 0, 170, 0.12), 0 -8px 32px rgba(0, 0, 0, 0.45)',
      }}
      aria-label="Main navigation"
    >
      <ul className="mx-auto grid h-16 max-w-md grid-cols-4">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <li key={tab.id}>
              <button
                type="button"
                onClick={() => onTabChange(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className="relative flex h-full w-full flex-col items-center justify-center gap-0.5 transition-transform active:scale-95"
                style={{
                  background: isActive
                    ? 'linear-gradient(180deg, rgba(0,249,255,0.1) 0%, transparent 100%)'
                    : 'transparent',
                }}
              >
                {isActive && (
                  <span
                    className="absolute top-0 h-0.5 w-12 rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #00f9ff, #ff00aa)',
                      boxShadow: '0 0 10px rgba(0, 249, 255, 0.7)',
                    }}
                  />
                )}

                <span
                  className="font-jp text-lg font-light"
                  style={{
                    color: isActive ? '#00f9ff' : 'rgba(255,255,255,0.4)',
                    textShadow: isActive ? '0 0 14px rgba(0,249,255,0.8)' : 'none',
                  }}
                >
                  {tab.kanji}
                </span>

                <span
                  className="font-display text-[7px] tracking-[0.32em] uppercase"
                  style={{ color: isActive ? '#ffffff' : 'rgba(138,138,154,0.7)' }}
                >
                  {tab.label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
