import { useMemo, useState } from 'react'
import { CoreDisplay } from './CoreDisplay'
import { StatBar } from './StatBar'
import { RatingModal } from './RatingModal'
import type { AreaConfig, AreaId, Ratings } from '../types'

const AREAS: AreaConfig[] = [
  { id: 'mind', label: 'Mind', kanji: '心', color: 'cyan' },
  { id: 'body', label: 'Body', kanji: '体', color: 'magenta' },
  { id: 'spirit', label: 'Spirit', kanji: '魂', color: 'cyan' },
]

const DEFAULTS = { mind: 9, body: 8, spirit: 9 } as const

function resolveValue(rating: number | null, fallback: number): number {
  return rating ?? fallback
}

function computeCore(values: number[]): number {
  const avg = values.reduce((sum, v) => sum + v, 0) / values.length
  return Math.round(avg * 10)
}

interface HomeScreenProps {
  ratings: Ratings
  onLogRating: (area: AreaId, value: number) => void
}

export function HomeScreen({ ratings, onLogRating }: HomeScreenProps) {
  const [activeArea, setActiveArea] = useState<AreaConfig | null>(null)

  const stats = useMemo(
    () => ({
      mind: resolveValue(ratings.mind, DEFAULTS.mind),
      body: resolveValue(ratings.body, DEFAULTS.body),
      spirit: resolveValue(ratings.spirit, DEFAULTS.spirit),
    }),
    [ratings],
  )

  const core = useMemo(
    () => computeCore([stats.mind, stats.body, stats.spirit]),
    [stats],
  )

  const handleLog = (value: number) => {
    if (!activeArea) return
    onLogRating(activeArea.id, value)
    setActiveArea(null)
  }

  return (
    <>
      <main className="relative flex h-full w-full items-center justify-center px-8 sm:px-12">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.06]"
            style={{
              background:
                'radial-gradient(circle, #00f9ff 0%, transparent 65%)',
            }}
          />
          <div
            className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full opacity-[0.04]"
            style={{
              background:
                'radial-gradient(circle, #ff00aa 0%, transparent 70%)',
            }}
          />
        </div>

        <div className="relative z-10 flex w-full max-w-sm flex-col items-center sm:max-w-md">
          <CoreDisplay value={core} />

          <section
            className="mt-16 w-full"
            aria-label="Mind, Body, Spirit"
          >
            {AREAS.map((area, i) => (
              <StatBar
                key={area.id}
                area={area}
                value={stats[area.id]}
                delay={600 + i * 120}
                onTap={() => setActiveArea(area)}
              />
            ))}
          </section>
        </div>
      </main>

      <RatingModal
        area={activeArea}
        initialValue={activeArea ? ratings[activeArea.id] ?? stats[activeArea.id] : null}
        onClose={() => setActiveArea(null)}
        onLog={handleLog}
      />
    </>
  )
}
