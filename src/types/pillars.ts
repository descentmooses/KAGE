/** Mind-Body-Spirit pillar identifiers. */
export type AreaId = 'mind' | 'body' | 'spirit'

export interface Ratings {
  mind: number | null
  body: number | null
  spirit: number | null
}

export interface AreaConfig {
  id: AreaId
  label: string
  kanji: string
  color: 'crimson' | 'ember'
  hint: string
}

export const AREA_CONFIGS: AreaConfig[] = [
  {
    id: 'mind',
    label: 'Mind',
    kanji: '心',
    color: 'crimson',
    hint: 'Meditation, focus, learning',
  },
  {
    id: 'body',
    label: 'Body',
    kanji: '体',
    color: 'ember',
    hint: 'Gym, macros, sleep recovery',
  },
  {
    id: 'spirit',
    label: 'Spirit',
    kanji: '魂',
    color: 'crimson',
    hint: 'Gratitude, family, purpose',
  },
]

export const DEFAULT_RATINGS = { mind: 7, body: 7, spirit: 7 } as const

/** Composite shadow score (0–100) from three pillar ratings (1–10). */
export function computeCore(mind: number, body: number, spirit: number): number {
  return Math.round(((mind + body + spirit) / 3) * 10)
}
