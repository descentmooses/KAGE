import { useState, type CSSProperties } from 'react'
import { useTheme } from '../theme/useTheme'
import { getBuildVersion } from '../lib/cacheBust'
import { ConnectionDot } from './ConnectionDot'
import { SettingsPanel } from './SettingsPanel'
import { ElaraWhisperTrigger } from './elara/ElaraWhisperTrigger'
import { InstallHeaderButton } from './install/InstallHeaderButton'
import { useTracker } from '../context/trackerContext'
import { useVoiceInput } from '../hooks/useVoiceInput'
import { useToast } from '../hooks/useToast'

const VOICE_PARKED_TITLE =
  'Voice input — use only when safely parked. Never while driving or on Autopilot.'

export function AppHeader() {
  const { tokens } = useTheme()
  const { settings, setPendingVoiceNote } = useTracker()
  const { showToast } = useToast()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const build = getBuildVersion()

  const { listening, supported, toggle } = useVoiceInput((text) => {
    setPendingVoiceNote(text)
    showToast('Voice captured — added to shadow note when parked.', 'info')
  })

  const headerBtn: CSSProperties = {
    minWidth: 44,
    minHeight: 44,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: `1px solid ${tokens.border}`,
    borderRadius: 8,
    color: tokens.textMuted,
    cursor: 'pointer',
    padding: '0 10px',
  }

  return (
    <>
      <header
        style={{
          flexShrink: 0,
          minHeight: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 8,
          position: 'relative',
          backgroundColor: tokens.surface,
          borderBottom: `1px solid ${tokens.border}`,
          boxShadow: tokens.headerShadow,
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingRight: 12,
          paddingLeft: 12,
          paddingBottom: 0,
          transition: 'background-color 0.35s ease, border-color 0.35s ease',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <ConnectionDot />
          {build && (
            <div
              style={{
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
        </div>

        {settings.voiceEnabled && supported && (
          <button
            type="button"
            onClick={toggle}
            title={listening ? 'Stop listening' : VOICE_PARKED_TITLE}
            aria-label={VOICE_PARKED_TITLE}
            style={{
              ...headerBtn,
              flexDirection: 'column',
              gap: 2,
              background: listening ? tokens.bannerBg : 'transparent',
              border: `1px solid ${listening ? tokens.crimson : tokens.border}`,
              color: listening ? tokens.crimson : tokens.textMuted,
            }}
          >
            <span style={{ fontSize: 14, lineHeight: 1 }} aria-hidden>
              🎙
            </span>
            <span
              style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: 6,
                letterSpacing: '0.08em',
              }}
            >
              PARKED
            </span>
          </button>
        )}

        <ElaraWhisperTrigger />

        <InstallHeaderButton />

        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          aria-label="Open settings"
          title="Settings"
          style={headerBtn}
        >
          ⚙
        </button>
      </header>

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  )
}
