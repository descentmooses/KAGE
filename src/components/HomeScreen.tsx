import { useMemo, useState } from 'react'
import { CoreDisplay } from './CoreDisplay'
import { NeonBar } from './NeonBar'
import { RatingModal } from './RatingModal'
import type { AreaConfig, AreaId, Ratings } from '../types'

const AREAS: AreaConfig[] = [
  { id: 'mind', label: 'Mind', kanji: '心', color: 'cyan' },
  { id: 'body', label: 'Body', kanji: '体', color: 'magenta' },
  { id: 'spirit', label: 'Spirit', kanji: '魂', color: 'cyan' },
]

const DEFAULTS = { mind: 9, body: 8, spirit: 9 } as const

export function HomeScreen({
  ratings,
  onLogRating,
}: {
  ratings: Ratings
  onLogRating: (area: AreaId, value: number) => void
}) {
  const [activeArea, setActiveArea] = useState<AreaConfig | null>(null)

  const stats = useMemo(
    () => ({
      mind: ratings.mind ?? DEFAULTS.mind,
      body: ratings.body ?? DEFAULTS.body,
      spirit: ratings.spirit ?? DEFAULTS.spirit,
    }),
    [ratings],
  )

  const core = Math.round(
    ((stats.mind + stats.body + stats.spirit) / 3) * 10,
  )

  const handleSave = (value: number) => {
    if (!activeArea) return
    onLogRating(activeArea.id, value)
    setActiveArea(null)
  }

  return (
    <>
      <main
        style={{
          height: '100%',
          overflowY: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px 20px',
        }}
      >
        <div style={{ width: '100%', maxWidth: 340 }}>
          <CoreDisplay value={core} />
          <div style={{ marginTop: 32 }}>
            {AREAS.map((area) => (
              <NeonBar
                key={area.id}
                area={area}
                value={stats[area.id]}
                onTap={() => setActiveArea(area)}
              />
            ))}
          </div>
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
