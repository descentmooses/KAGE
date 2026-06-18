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
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: 'relative',
        backgroundColor: tokens.surface,
        borderBottom: `1px solid ${tokens.border}`,
        boxShadow: tokens.headerShadow,
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingRight: 16,
        paddingLeft: 16,
        transition: 'background-color 0.35s ease, border-color 0.35s ease',
      }}
    >
      {build && (
        <div
          style={{
            position: 'absolute',
            left: 16,
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

      <ThemeToggle />
    </header>
  )
}
