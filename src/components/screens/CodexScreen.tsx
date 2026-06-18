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
      'Act when resistance peaks. The neural path of least resistance is rarely the one worth logging.',
  },
  {
    kanji: '仁',
    title: 'Jin — Compassion',
    description:
      'Strength without mercy is noise. Sharpen the self, but do not sever the thread that binds you to others.',
  },
  {
    kanji: '礼',
    title: 'Rei — Respect',
    description:
      'Every interaction leaves a trace. Move through systems and relationships as if the archive is always watching.',
  },
  {
    kanji: '誠',
    title: 'Makoto — Honesty',
    description:
      'The shadow knows when you lie to yourself. Rate truthfully. Reflect without performance. Log what is real.',
  },
] as const

export function CodexScreen() {
  return (
    <TabScreen
      kanji="典"
      title="Bushido Protocols"
      subtitle="典籍 — fragments for the shadow operative"
    >
      <ul className="space-y-4 pb-4">
        {PROTOCOLS.map((protocol, i) => (
          <li
            key={protocol.title}
            className="border border-white/[0.06] bg-white/[0.02] px-4 py-4"
            style={{
              boxShadow: i % 2 === 0 ? '0 0 20px #00f9ff08' : '0 0 20px #ff00aa08',
            }}
          >
            <div className="mb-2 flex items-center gap-3">
              <span
                className="font-jp text-2xl font-extralight"
                style={{
                  color: i % 2 === 0 ? '#00f9ff' : '#ff00aa',
                  textShadow: `0 0 16px ${i % 2 === 0 ? '#00f9ff44' : '#ff00aa44'}`,
                }}
              >
                {protocol.kanji}
              </span>
              <h3 className="font-display text-[9px] tracking-[0.35em] text-white/75 uppercase">
                {protocol.title}
              </h3>
            </div>
            <p className="font-jp text-xs leading-relaxed text-ghost/90">
              {protocol.description}
            </p>
          </li>
        ))}
      </ul>
    </TabScreen>
  )
}
