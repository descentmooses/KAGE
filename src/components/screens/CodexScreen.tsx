import { TabScreen } from '../TabScreen'
import { useTheme } from '../../theme/useTheme'

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

  return (
    <TabScreen
      kanji="典"
      title="Bushido Protocols"
      subtitle="典籍 — five fragments for the shadow operative"
    >
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
                  color: i % 2 === 0 ? tokens.cyan : tokens.magenta,
                  fontFamily: '"Noto Sans JP", sans-serif',
                  textShadow: `0 0 12px ${i % 2 === 0 ? tokens.cyanGlow : tokens.magentaGlow}`,
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
