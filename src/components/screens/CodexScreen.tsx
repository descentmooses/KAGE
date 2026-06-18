import { useRef } from 'react'
import { TabScreen } from '../TabScreen'
import { useTheme } from '../../theme/useTheme'
import { useTracker } from '../../context/trackerContext'
import { useToast } from '../../hooks/useToast'
import { RANKS } from '../../lib/gamification'

const PROTOCOLS = [
  {
    kanji: '義',
    title: 'Gi — Rectitude',
    description:
      'Honor your word in the digital void. What you commit to before dawn becomes the code you run at dusk.',
  },
  {
    kanji: '勇',
    title: 'Yu — Courage',
    description:
      'Act when resistance peaks. The path of least resistance is rarely the one worth logging.',
  },
  {
    kanji: '仁',
    title: 'Jin — Compassion',
    description:
      'Strength without mercy is noise. Sharpen yourself without severing the thread to others.',
  },
  {
    kanji: '礼',
    title: 'Rei — Respect',
    description:
      'Every interaction leaves a trace. Move through systems as if the archive is always watching.',
  },
  {
    kanji: '誠',
    title: 'Makoto — Honesty',
    description:
      'The shadow knows when you lie to yourself. Rate truthfully. Reflect without performance.',
  },
] as const

export function CodexScreen() {
  const { tokens } = useTheme()
  const { gamification, settings, updateSettings, importData } = useTracker()
  const { showToast } = useToast()
  const fileRef = useRef<HTMLInputElement>(null)

  const handleImport = async (file: File) => {
    try {
      await importData(file)
      showToast('Backup imported successfully.', 'success')
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Import failed. Check the file format.',
        'error',
      )
    }
  }

  return (
    <TabScreen
      kanji="典"
      title="Bushido Protocols"
      subtitle="典籍 — shadow ranks, protocols, and settings"
    >
      <section style={{ marginBottom: 28 }}>
        <p
          style={{
            fontFamily: '"Orbitron", sans-serif',
            fontSize: 9,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: tokens.textMuted,
            margin: '0 0 12px',
          }}
        >
          Shadow mastery ranks
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {RANKS.map((r) => (
            <li
              key={r.rank}
              style={{
                padding: '10px 14px',
                borderRadius: 6,
                border: `1px solid ${gamification.rank === r.rank ? tokens.crimson : tokens.border}`,
                background: gamification.rank === r.rank ? tokens.bannerBg : tokens.cardBg,
                fontSize: 12,
                color: tokens.text,
              }}
            >
              <strong style={{ color: tokens.crimson }}>{r.rank}</strong>
              <span style={{ color: tokens.textMuted }}> — Level {r.minLevel}+</span>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: 28 }}>
        <p
          style={{
            fontFamily: '"Orbitron", sans-serif',
            fontSize: 9,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: tokens.textMuted,
            margin: '0 0 12px',
          }}
        >
          Settings
        </p>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 10,
            fontSize: 13,
            minHeight: 44,
          }}
        >
          <input
            type="checkbox"
            checked={settings.affirmationsEnabled}
            onChange={(e) => void updateSettings({ affirmationsEnabled: e.target.checked })}
            style={{ width: 20, height: 20 }}
          />
          Show affirmations
        </label>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 10,
            fontSize: 13,
            minHeight: 44,
          }}
        >
          <input
            type="checkbox"
            checked={settings.elaraWhispers}
            onChange={(e) => void updateSettings({ elaraWhispers: e.target.checked })}
            style={{ width: 20, height: 20 }}
          />
          Elara whispers
        </label>
        <p
          style={{
            margin: '0 0 10px',
            fontSize: 11,
            lineHeight: 1.5,
            color: tokens.textMuted,
          }}
        >
          Voice input appears in the header when enabled. Use only when safely parked — never
          while driving or on Autopilot.
        </p>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 10,
            fontSize: 13,
            minHeight: 44,
          }}
        >
          <input
            type="checkbox"
            checked={settings.voiceEnabled}
            onChange={(e) => void updateSettings({ voiceEnabled: e.target.checked })}
            style={{ width: 20, height: 20 }}
          />
          Enable voice input (parked only)
        </label>
        <div style={{ marginTop: 16 }}>
          <p
            style={{
              margin: '0 0 8px',
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            Import backup
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void handleImport(file)
              e.target.value = ''
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            style={{
              minHeight: 48,
              width: '100%',
              borderRadius: 8,
              border: `1px solid ${tokens.border}`,
              background: tokens.surfaceElevated,
              color: tokens.text,
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            Choose JSON backup file
          </button>
        </div>
      </section>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {PROTOCOLS.map((p, i) => (
          <li
            key={p.title}
            style={{
              padding: 18,
              border: `1px solid ${tokens.cardBorder}`,
              background: tokens.cardBg,
              boxShadow: i % 2 === 0 ? tokens.cardShadowCyan : tokens.cardShadowMagenta,
              transition: 'all 0.35s ease',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  fontSize: 22,
                  color: i % 2 === 0 ? tokens.crimson : tokens.ember,
                  fontFamily: '"Noto Sans JP", sans-serif',
                  textShadow: 'none',
                  transition: 'color 0.35s ease',
                }}
              >
                {p.kanji}
              </span>
              <h3
                style={{
                  fontFamily: '"Orbitron", sans-serif',
                  fontSize: 8,
                  letterSpacing: '0.3em',
                  color: tokens.text,
                  textTransform: 'uppercase',
                  margin: 0,
                  transition: 'color 0.35s ease',
                }}
              >
                {p.title}
              </h3>
            </div>
            <p
              style={{
                fontSize: 12,
                lineHeight: 1.65,
                color: tokens.textMuted,
                margin: 0,
                transition: 'color 0.35s ease',
              }}
            >
              {p.description}
            </p>
          </li>
        ))}
      </ul>
    </TabScreen>
  )
}
