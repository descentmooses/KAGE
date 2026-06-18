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
      className="relative z-40 shrink-0 border-t border-white/[0.06] bg-void/94 backdrop-blur-2xl"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
      aria-label="Main navigation"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 6%, #00f9ff55 45%, #ff00aa55 55%, transparent 94%)',
        }}
      />

      <ul className="mx-auto flex h-[3.75rem] max-w-md items-stretch">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <li key={tab.id} className="flex flex-1">
              <button
                type="button"
                onClick={() => onTabChange(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className="group relative flex w-full flex-col items-center justify-center gap-0.5 transition-all duration-150 active:scale-95"
              >
                {isActive && (
                  <span
                    className="absolute inset-x-5 top-0 h-px"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, #00f9ff, #ff00aa, transparent)',
                      boxShadow: '0 0 14px #00f9ff77',
                    }}
                  />
                )}

                <span
                  className={`font-jp text-base font-light transition-all duration-150 ${
                    isActive
                      ? 'text-cyan drop-shadow-[0_0_16px_#00f9ffaa]'
                      : 'text-white/12 group-hover:text-white/28'
                  }`}
                >
                  {tab.kanji}
                </span>

                <span
                  className={`font-display text-[6.5px] tracking-[0.34em] uppercase transition-colors duration-150 ${
                    isActive ? 'text-white/88' : 'text-mist/38 group-hover:text-mist/58'
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
