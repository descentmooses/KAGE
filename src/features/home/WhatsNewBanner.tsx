import { useTheme } from '../../theme/useTheme'
import { useTracker } from '../../context/trackerContext'
import { APP_VERSION, WHATS_NEW } from '../../lib/version'

export function WhatsNewBanner() {
  const { tokens } = useTheme()
  const { settings, updateSettings } = useTracker()

  if (settings.whatsNewSeen === APP_VERSION) return null
  if (settings.demoMode && !settings.tutorialComplete) return null

  return (
    <div
      className="animate-fade-in"
      style={{
        padding: '16px 18px',
        borderRadius: 12,
        border: `1px solid ${tokens.borderAccent}`,
        background: `linear-gradient(135deg, ${tokens.bannerBg} 0%, transparent 100%)`,
        marginBottom: 16,
        boxShadow: tokens.cardShadowAlt,
      }}
    >
      <p
        style={{
          margin: '0 0 4px',
          fontFamily: '"Orbitron", sans-serif',
          fontSize: 9,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: tokens.gold,
        }}
      >
        What&apos;s new · v{APP_VERSION}
      </p>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: tokens.textMuted, lineHeight: 1.5 }}>
        Elara lives. Goals grow. The kage deepens.
      </p>
      <ul
        style={{
          margin: '0 0 14px',
          paddingLeft: 18,
          fontSize: 12,
          lineHeight: 1.55,
          color: tokens.text,
        }}
      >
        {WHATS_NEW.map((item) => (
          <li key={item} style={{ marginBottom: 4 }}>
            {item}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => void updateSettings({ whatsNewSeen: APP_VERSION })}
        className="kage-touch-target"
        style={{
          minHeight: 44,
          padding: '0 16px',
          borderRadius: 8,
          border: `1px solid ${tokens.crimson}`,
          background: 'transparent',
          color: tokens.crimson,
          fontSize: 11,
          letterSpacing: '0.1em',
          cursor: 'pointer',
        }}
      >
        Acknowledge
      </button>
    </div>
  )
}
