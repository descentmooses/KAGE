import { useTheme } from '../theme/useTheme'

export function ThemeToggle() {
  const { mode, toggleTheme, tokens } = useTheme()
  const isDark = mode === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className="kage-touch-target"
      style={{
        position: 'relative',
        width: 52,
        height: 30,
        borderRadius: 999,
        border: `1px solid ${isDark ? tokens.borderAccent : tokens.border}`,
        background: isDark ? tokens.toggleTrackActive : tokens.toggleTrack,
        cursor: 'pointer',
        padding: 0,
        flexShrink: 0,
        transition: 'background 0.35s ease, border-color 0.35s ease',
      }}
    >
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          left: 8,
          transform: 'translateY(-50%)',
          fontSize: 9,
          opacity: isDark ? 0.9 : 0.35,
          color: tokens.gold,
          transition: 'opacity 0.3s ease',
        }}
      >
        ☾
      </span>
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          right: 8,
          transform: 'translateY(-50%)',
          fontSize: 9,
          opacity: isDark ? 0.35 : 0.9,
          color: tokens.crimson,
          transition: 'opacity 0.3s ease',
        }}
      >
        ☀
      </span>
      <span
        style={{
          position: 'absolute',
          top: 3,
          left: isDark ? 3 : 25,
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: isDark ? tokens.toggleThumb : tokens.toggleThumbLight,
          border: isDark ? 'none' : `1px solid ${tokens.border}`,
          boxShadow: isDark
            ? `0 2px 10px rgba(0,0,0,0.4), 0 0 8px ${tokens.accentGlow}`
            : '0 2px 8px rgba(26,20,22,0.12)',
          transition: 'left 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.35s ease, background 0.35s ease',
        }}
      />
    </button>
  )
}
