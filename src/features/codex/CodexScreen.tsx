import { useMemo, useRef } from 'react'
import { TabScreen } from '../../components/TabScreen'
import { useTheme } from '../../theme/useTheme'
import { useTracker } from '../../context/trackerContext'
import { useToast } from '../../hooks/useToast'
import { RANKS } from '../../lib/gamification'
import { filterLogsByPeriod } from '../../lib/insights'
import { pickWeeklySummary } from '../../lib/affirmations'

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
  const { gamification, settings, updateSettings, importData, allLogs } = useTracker()
  const { showToast } = useToast()
  const fileRef = useRef<HTMLInputElement>(null)

  const weeklySummary = useMemo(() => {
    const week = filterLogsByPeriod(allLogs, 'weekly')
    return pickWeeklySummary(week)
  }, [allLogs])

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
      {weeklySummary && (
        <section
          style={{
            marginBottom: 28,
            padding: '16px 18px',
            borderRadius: 10,
            border: `1px solid ${tokens.borderAccent}`,
            background: tokens.bannerBg,
          }}
        >
          <p
            style={{
              margin: '0 0 8px',
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: 9,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: tokens.crimson,
            }}
          >
            This week in the shadow
          </p>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: tokens.text }}>
            {weeklySummary}
          </p>
        </section>
      )}

      <section style={{ marginBottom: 32 }}>
        <p
          style={{
            fontFamily: '"Orbitron", sans-serif',
            fontSize: 9,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: tokens.textMuted,
            margin: '0 0 14px',
          }}
        >
          Shadow mastery ranks
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {RANKS.map((r) => {
            const active = gamification.rank === r.rank
            return (
              <li
                key={r.rank}
                style={{
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: `1px solid ${active ? tokens.crimson : tokens.border}`,
                  background: active ? tokens.bannerBg : tokens.cardBg,
                  fontSize: 13,
                  color: tokens.text,
                  boxShadow: active ? tokens.cardShadowAlt : 'none',
                  transition: 'all 0.25s ease',
                }}
              >
                <strong style={{ color: active ? tokens.crimson : tokens.ember }}>{r.rank}</strong>
                <span style={{ color: tokens.textMuted }}> — Level {r.minLevel}+</span>
              </li>
            )
          })}
        </ul>
      </section>

      <section style={{ marginBottom: 32 }}>
        <p
          style={{
            fontFamily: '"Orbitron", sans-serif',
            fontSize: 9,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: tokens.textMuted,
            margin: '0 0 14px',
          }}
        >
          Settings
        </p>
        <div
          style={{
            padding: '16px 18px',
            borderRadius: 10,
            border: `1px solid ${tokens.border}`,
            background: tokens.cardBg,
            marginBottom: 20,
          }}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 12,
              fontSize: 14,
              minHeight: 48,
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={settings.affirmationsEnabled}
              onChange={(e) => void updateSettings({ affirmationsEnabled: e.target.checked })}
              style={{ width: 22, height: 22, accentColor: tokens.crimson }}
            />
            Show affirmations
          </label>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 12,
              fontSize: 14,
              minHeight: 48,
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={settings.elaraWhispers}
              onChange={(e) => void updateSettings({ elaraWhispers: e.target.checked })}
              style={{ width: 22, height: 22, accentColor: tokens.crimson }}
            />
            Elara whispers
          </label>
        </div>
        <div>
          <p
            style={{
              margin: '0 0 10px',
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
            className="kage-touch-target"
            style={{
              minHeight: 52,
              width: '100%',
              borderRadius: 10,
              border: `1px solid ${tokens.border}`,
              background: tokens.surfaceElevated,
              color: tokens.text,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'border-color 0.2s ease, background 0.2s ease',
            }}
          >
            Choose JSON backup file
          </button>
        </div>
      </section>

      <p
        style={{
          fontFamily: '"Orbitron", sans-serif',
          fontSize: 9,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: tokens.textMuted,
          margin: '0 0 14px',
        }}
      >
        The five virtues
      </p>
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
              padding: 20,
              borderRadius: 10,
              border: `1px solid ${tokens.cardBorder}`,
              background: tokens.cardBg,
              boxShadow: i % 2 === 0 ? tokens.cardShadow : tokens.cardShadowAlt,
              transition: 'all 0.35s ease',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  fontSize: 26,
                  color: i % 2 === 0 ? tokens.crimson : tokens.ember,
                  fontFamily: '"Noto Sans JP", sans-serif',
                }}
              >
                {p.kanji}
              </span>
              <h3
                style={{
                  fontFamily: '"Orbitron", sans-serif',
                  fontSize: 9,
                  letterSpacing: '0.3em',
                  color: tokens.text,
                  textTransform: 'uppercase',
                  margin: 0,
                }}
              >
                {p.title}
              </h3>
            </div>
            <p
              style={{
                fontSize: 13,
                lineHeight: 1.7,
                color: tokens.textMuted,
                margin: 0,
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
