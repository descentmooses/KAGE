import { useTheme } from '../theme/useTheme'
import { getBuildVersion } from '../lib/cacheBust'
import { ThemeToggle } from './ThemeToggle'

export function AppHeader() {
  const { tokens } = useTheme()
  const build = getBuildVersion()

  return (
    <header
      style={{
        flexShrink: 0,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        backgroundColor: tokens.surface,
        borderBottom: `1px solid ${tokens.border}`,
        boxShadow: tokens.headerShadow,
        paddingTop: 'env(safe-area-inset-top, 0px)',
        transition: 'background-color 0.35s ease, border-color 0.35s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          style={{
            fontFamily: '"Orbitron", sans-serif',
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '0.5em',
            color: tokens.text,
            textShadow: `0 0 16px ${tokens.cyanGlow}`,
            transition: 'color 0.35s ease',
          }}
        >
          KAGE
        </span>
        <span
          style={{
            width: 1,
            height: 16,
            background: tokens.border,
            transition: 'background 0.35s ease',
          }}
        />
        <span
          style={{
            fontFamily: '"Noto Sans JP", sans-serif',
            fontSize: 20,
            color: tokens.textSubtle,
            textShadow: `0 0 12px ${tokens.cyanGlow}`,
            transition: 'color 0.35s ease',
          }}
        >
          影
        </span>
      </div>

      {build && (
        <div
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: 7,
            letterSpacing: '0.1em',
            color: tokens.textMuted,
            opacity: 0.7,
          }}
          title={`Build ${build}`}
        >
          v{build.slice(-6)}
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          right: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
      >
        <ThemeToggle />
      </div>
    </header>
  )
}
