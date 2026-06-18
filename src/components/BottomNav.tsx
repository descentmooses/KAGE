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
      className="relative z-50 shrink-0 border-t border-white/[0.08] bg-void/96 backdrop-blur-xl"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxShadow: '0 -4px 32px rgba(0,0,0,0.5)',
      }}
      aria-label="Main navigation"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 5%, #00f9ff66 45%, #ff00aa66 55%, transparent 95%)',
        }}
      />

      <ul className="mx-auto flex h-16 max-w-md">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <li key={tab.id} className="flex flex-1">
              <button
                type="button"
                onClick={() => onTabChange(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className="relative flex w-full flex-col items-center justify-center gap-0.5 transition-all duration-150 active:scale-95"
                style={
                  isActive
                    ? { background: 'linear-gradient(180deg, #00f9ff0a 0%, transparent 100%)' }
                    : undefined
                }
              >
                {isActive && (
                  <span
                    className="absolute inset-x-4 top-0 h-0.5 rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #00f9ff, #ff00aa)',
                      boxShadow: '0 0 12px #00f9ff88',
                    }}
                  />
                )}

                <span
                  className={`font-jp text-lg font-light ${
                    isActive
                      ? 'text-cyan drop-shadow-[0_0_12px_#00f9ff]'
                      : 'text-white/35'
                  }`}
                >
                  {tab.kanji}
                </span>

                <span
                  className={`font-display text-[7px] tracking-[0.3em] uppercase ${
                    isActive ? 'text-white' : 'text-mist/60'
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
