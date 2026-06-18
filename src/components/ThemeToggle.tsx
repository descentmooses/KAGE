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
      style={{
        position: 'relative',
        width: 44,
        height: 26,
        borderRadius: 999,
        border: `1px solid ${tokens.border}`,
        background: tokens.toggleTrack,
        cursor: 'pointer',
        padding: 0,
        flexShrink: 0,
        transition: 'background 0.3s ease, border-color 0.3s ease',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: isDark ? 2 : 18,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: tokens.toggleThumb,
          boxShadow: isDark
            ? '0 2px 8px rgba(0,0,0,0.35)'
            : '0 2px 8px rgba(28,28,36,0.15)',
          transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 10,
        }}
      >
        <span
          style={{
            opacity: isDark ? 1 : 0,
            transform: isDark ? 'scale(1)' : 'scale(0.5)',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
            position: 'absolute',
          }}
          aria-hidden
        >
          ☾
        </span>
        <span
          style={{
            opacity: isDark ? 0 : 1,
            transform: isDark ? 'scale(0.5)' : 'scale(1)',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
            position: 'absolute',
          }}
          aria-hidden
        >
          ☀
        </span>
      </span>
    </button>
  )
}
