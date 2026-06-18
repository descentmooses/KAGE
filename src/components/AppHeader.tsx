import { useRef } from 'react'
import { useTheme } from '../theme/useTheme'
import { getBuildVersion } from '../lib/cacheBust'
import { ThemeToggle } from './ThemeToggle'
import { useTracker } from '../context/trackerContext'
import { useVoiceInput } from '../hooks/useVoiceInput'

export function AppHeader() {
  const { tokens } = useTheme()
  const { exportData, settings } = useTracker()
  const build = getBuildVersion()
  const noteRef = useRef('')

  const { listening, supported, toggle } = useVoiceInput((text) => {
    noteRef.current = text
  })

  return (
    <header
      style={{
        flexShrink: 0,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 10,
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

      <button
        type="button"
        onClick={() => void exportData()}
        title="Export data"
        aria-label="Export data"
        style={{
          background: 'transparent',
          border: `1px solid ${tokens.border}`,
          borderRadius: 6,
          color: tokens.textMuted,
          fontSize: 9,
          letterSpacing: '0.15em',
          padding: '6px 8px',
          cursor: 'pointer',
        }}
      >
        EXPORT
      </button>

      {settings.voiceEnabled && supported && (
        <button
          type="button"
          onClick={toggle}
          title={listening ? 'Stop voice' : 'Voice note (parked only)'}
          aria-label="Voice input"
          style={{
            background: listening ? tokens.bannerBg : 'transparent',
            border: `1px solid ${listening ? tokens.crimson : tokens.border}`,
            borderRadius: 6,
            color: listening ? tokens.crimson : tokens.textMuted,
            fontSize: 14,
            padding: '4px 8px',
            cursor: 'pointer',
          }}
        >
          🎙
        </button>
      )}

      <ThemeToggle />
    </header>
  )
}
