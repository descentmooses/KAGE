import { useState } from 'react'
import { useTheme } from '../../theme/useTheme'
import { usePendingVoiceNote } from '../../hooks/usePendingVoiceNote'

export function VoiceConfirmBanner() {
  const { tokens } = useTheme()
  const { pendingVoiceNote, setPendingVoiceNote } = usePendingVoiceNote()
  const [confirmedNote, setConfirmedNote] = useState<string | null>(null)

  const acknowledged =
    !!pendingVoiceNote && confirmedNote === pendingVoiceNote

  if (!pendingVoiceNote || acknowledged) return null

  return (
    <div
      className="animate-fade-in"
      style={{
        padding: '14px 16px',
        borderRadius: 12,
        border: `1px solid ${tokens.borderAccent}`,
        background: tokens.bannerBg,
        marginBottom: 16,
        boxShadow: `0 0 16px ${tokens.accentGlow}`,
      }}
    >
      <p
        style={{
          margin: '0 0 6px',
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: 9,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: tokens.crimson,
        }}
      >
        Voice captured
      </p>
      <p
        style={{
          margin: '0 0 12px',
          fontSize: 14,
          lineHeight: 1.55,
          color: tokens.text,
          fontStyle: 'italic',
        }}
      >
        “{pendingVoiceNote}”
      </p>
      <p style={{ margin: '0 0 12px', fontSize: 11, color: tokens.textMuted }}>
        Confirm to add this to your shadow note, or discard.
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          onClick={() => setPendingVoiceNote(null)}
          className="kage-touch-target"
          style={{
            flex: 1,
            minHeight: 48,
            borderRadius: 8,
            border: `1px solid ${tokens.border}`,
            background: 'transparent',
            color: tokens.textMuted,
            fontSize: 11,
            cursor: 'pointer',
          }}
        >
          Discard
        </button>
        <button
          type="button"
          onClick={() => setConfirmedNote(pendingVoiceNote)}
          className="kage-touch-target"
          style={{
            flex: 1,
            minHeight: 48,
            borderRadius: 8,
            border: 'none',
            background: tokens.btnGradient,
            color: tokens.btnText,
            fontSize: 11,
            cursor: 'pointer',
          }}
        >
          Use in shadow log
        </button>
      </div>
    </div>
  )
}
