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
      className="relative z-40 shrink-0 border-t border-white/[0.05] bg-void/95 backdrop-blur-lg"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxShadow: '0 -1px 24px rgba(0,249,255,0.04)',
      }}
      aria-label="Main navigation"
    >
      <ul className="mx-auto flex max-w-lg items-stretch">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <li key={tab.id} className="flex-1">
              <button
                type="button"
                onClick={() => onTabChange(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className="group relative flex w-full flex-col items-center gap-1 px-2 py-3.5 transition-colors duration-300"
              >
                {isActive && (
                  <span
                    className="absolute inset-x-5 top-0 h-px"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, #00f9ff, #ff00aa, transparent)',
                      boxShadow: '0 0 10px #00f9ff55',
                    }}
                  />
                )}

                <span
                  className={`font-jp text-lg font-light transition-all duration-300 ${
                    isActive
                      ? 'text-cyan drop-shadow-[0_0_12px_#00f9ff88]'
                      : 'text-white/12 group-hover:text-white/35'
                  }`}
                >
                  {tab.kanji}
                </span>

                <span
                  className={`font-display text-[8px] tracking-[0.28em] uppercase transition-colors duration-300 ${
                    isActive ? 'text-white/85' : 'text-mist/45 group-hover:text-ghost/70'
                  }`}
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
