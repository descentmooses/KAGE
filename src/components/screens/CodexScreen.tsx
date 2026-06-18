import { TabScreen } from '../TabScreen'

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
  return (
    <TabScreen
      kanji="典"
      title="Bushido Protocols"
      subtitle="典籍 — five fragments for the shadow operative"
    >
      <ul className="space-y-3 pb-6">
        {PROTOCOLS.map((p, i) => (
          <li
            key={p.title}
            className="border px-4 py-4"
            style={{
              borderColor: 'rgba(255,255,255,0.08)',
              backgroundColor: 'rgba(255,255,255,0.02)',
              boxShadow: i % 2 === 0
                ? '0 0 16px rgba(0,249,255,0.06)'
                : '0 0 16px rgba(255,0,170,0.06)',
            }}
          >
            <div className="mb-2 flex items-center gap-3">
              <span
                className="font-jp text-2xl font-extralight"
                style={{
                  color: i % 2 === 0 ? '#00f9ff' : '#ff00aa',
                  textShadow: `0 0 12px ${i % 2 === 0 ? 'rgba(0,249,255,0.5)' : 'rgba(255,0,170,0.5)'}`,
                }}
              >
                {p.kanji}
              </span>
              <h3
                className="font-display text-[8px] tracking-[0.35em] uppercase"
                style={{ color: 'rgba(255,255,255,0.8)' }}
              >
                {p.title}
              </h3>
            </div>
            <p className="font-jp text-xs leading-relaxed" style={{ color: 'rgba(138,138,154,0.95)' }}>
              {p.description}
            </p>
          </li>
        ))}
      </ul>
    </TabScreen>
  )
}
