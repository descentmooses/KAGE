import { TabScreen } from '../TabScreen'

const PROTOCOLS = [
  { kanji: '義', title: 'Gi — Rectitude', description: 'Honor your word in the digital void. What you commit to before dawn becomes the code you run at dusk.' },
  { kanji: '勇', title: 'Yu — Courage', description: 'Act when resistance peaks. The path of least resistance is rarely the one worth logging.' },
  { kanji: '仁', title: 'Jin — Compassion', description: 'Strength without mercy is noise. Sharpen yourself without severing the thread to others.' },
  { kanji: '礼', title: 'Rei — Respect', description: 'Every interaction leaves a trace. Move through systems as if the archive is always watching.' },
  { kanji: '誠', title: 'Makoto — Honesty', description: 'The shadow knows when you lie to yourself. Rate truthfully. Reflect without performance.' },
] as const

export function CodexScreen() {
  return (
    <TabScreen kanji="典" title="Bushido Protocols" subtitle="典籍 — five fragments for the shadow operative">
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {PROTOCOLS.map((p, i) => (
          <li
            key={p.title}
            style={{
              padding: 16,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.02)',
              boxShadow: i % 2 === 0 ? '0 0 16px rgba(0,249,255,0.06)' : '0 0 16px rgba(255,0,170,0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 22, color: i % 2 === 0 ? '#00f9ff' : '#ff00aa', fontFamily: '"Noto Sans JP", sans-serif' }}>
                {p.kanji}
              </span>
              <h3 style={{ fontFamily: '"Orbitron", sans-serif', fontSize: 8, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', margin: 0 }}>
                {p.title}
              </h3>
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.6, color: '#8a8a9a', margin: 0 }}>{p.description}</p>
          </li>
        ))}
      </ul>
    </TabScreen>
  )
}
