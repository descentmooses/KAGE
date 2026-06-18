import { useMemo, useState } from 'react'
import { KageHeroLogo } from './KageHeroLogo'
import { CoreDisplay } from './CoreDisplay'
import { NeonBar } from './NeonBar'
import { RatingModal } from './RatingModal'
import { useTheme } from '../theme/useTheme'
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
  const { tokens } = useTheme()
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
          WebkitOverflowScrolling: 'touch',
          backgroundColor: tokens.surface,
        }}
      >
        <section
          style={{
            position: 'relative',
            minHeight: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            backgroundColor: tokens.surface,
          }}
        >
          <KageHeroLogo />
        </section>

        <section
          style={{
            padding: '32px 20px 40px',
            maxWidth: 340,
            margin: '0 auto',
            width: '100%',
          }}
        >
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
        </section>
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
