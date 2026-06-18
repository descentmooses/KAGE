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
      className="relative z-30 shrink-0 border-t border-white/[0.06] bg-void/90 backdrop-blur-xl"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxShadow: '0 -4px 32px rgba(0,249,255,0.05), inset 0 1px 0 rgba(255,255,255,0.03)',
      }}
      aria-label="Main navigation"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 8%, #00f9ff44 40%, #ff00aa44 60%, transparent 92%)',
        }}
      />

      <ul className="mx-auto flex max-w-lg items-stretch">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <li key={tab.id} className="flex-1">
              <button
                type="button"
                onClick={() => onTabChange(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className="group relative flex w-full flex-col items-center gap-1 px-2 py-3.5 transition-all duration-200 active:scale-95"
              >
                {isActive && (
                  <span
                    className="absolute inset-x-6 top-0 h-px"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, #00f9ff, #ff00aa, transparent)',
                      boxShadow: '0 0 12px #00f9ff66',
                    }}
                  />
                )}

                <span
                  className={`font-jp text-lg font-light transition-all duration-200 ${
                    isActive
                      ? 'text-cyan drop-shadow-[0_0_14px_#00f9ff99]'
                      : 'text-white/10 group-hover:text-white/30'
                  }`}
                >
                  {tab.kanji}
                </span>

                <span
                  className={`font-display text-[7px] tracking-[0.32em] uppercase transition-colors duration-200 ${
                    isActive ? 'text-white/90' : 'text-mist/40 group-hover:text-mist/65'
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
