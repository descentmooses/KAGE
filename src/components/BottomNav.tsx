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
      aria-label="Main navigation"
      style={{
        flexShrink: 0,
        backgroundColor: 'rgba(10,10,10,0.97)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.5)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', height: 64, maxWidth: 480, margin: '0 auto' }}>
        {TABS.map((tab) => {
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              aria-current={active ? 'page' : undefined}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                border: 'none',
                background: active
                  ? 'linear-gradient(180deg, rgba(0,249,255,0.12), transparent)'
                  : 'transparent',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              {active && (
                <span
                  style={{
                    position: 'absolute',
                    top: 0,
                    width: 48,
                    height: 2,
                    background: 'linear-gradient(90deg, #00f9ff, #ff00aa)',
                    boxShadow: '0 0 8px #00f9ff',
                  }}
                />
              )}
              <span
                style={{
                  fontFamily: '"Noto Sans JP", sans-serif',
                  fontSize: 18,
                  color: active ? '#00f9ff' : 'rgba(255,255,255,0.45)',
                  textShadow: active ? '0 0 12px rgba(0,249,255,0.9)' : 'none',
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
                  color: active ? '#fff' : '#8a8a9a',
                }}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
