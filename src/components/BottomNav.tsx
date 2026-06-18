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
      className="relative z-40 shrink-0 border-t border-white/[0.04] bg-void/90 backdrop-blur-md"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
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
                className="group relative flex w-full flex-col items-center gap-1 px-2 py-3 transition-colors duration-300"
              >
                {isActive && (
                  <span
                    className="absolute inset-x-4 top-0 h-px"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, #00f0ff, #ff00aa, transparent)',
                      boxShadow: '0 0 8px #00f0ff44',
                    }}
                  />
                )}

                <span
                  className={`font-jp text-lg font-light transition-all duration-300 ${
                    isActive
                      ? 'text-cyan drop-shadow-[0_0_10px_#00f0ff66]'
                      : 'text-white/15 group-hover:text-white/40'
                  }`}
                >
                  {tab.kanji}
                </span>

                <span
                  className={`font-display text-[8px] tracking-[0.25em] uppercase transition-colors duration-300 ${
                    isActive ? 'text-white/80' : 'text-mist/50 group-hover:text-ghost'
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
