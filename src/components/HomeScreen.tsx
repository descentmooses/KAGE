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

  const handleSave = (value: number) => {
    if (!activeArea) return
    onLogRating(activeArea.id, value)
    setActiveArea(null)
  }

  return (
    <>
      <main className="relative flex h-full w-full items-center justify-center overflow-y-auto px-5 py-4 sm:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute top-[38%] left-1/2 h-[min(520px,70vw)] w-[min(520px,70vw)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.07]"
            style={{
              background: 'radial-gradient(circle, #00f9ff 0%, transparent 68%)',
            }}
          />
          <div
            className="absolute right-0 bottom-0 h-64 w-64 rounded-full opacity-[0.035]"
            style={{
              background: 'radial-gradient(circle, #ff00aa 0%, transparent 72%)',
            }}
          />
        </div>

        <div className="relative z-10 flex w-full max-w-[20rem] flex-col items-center sm:max-w-xs">
          <CoreDisplay value={core} />

          <section
            className="mt-8 w-full space-y-1 sm:mt-10"
            aria-label="Mind, Body, Spirit"
          >
            {AREAS.map((area) => (
              <StatBar
                key={area.id}
                area={area}
                value={stats[area.id]}
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
        onSave={handleSave}
      />
    </>
  )
}
