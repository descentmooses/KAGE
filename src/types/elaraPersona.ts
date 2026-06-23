import type { AreaId } from './pillars'

export type ElaraEvolutionStage = 'new' | 'learning' | 'attuned' | 'intimate'

/** Evolving portrait Elara builds from a user's logs and rituals. */
export interface ElaraPersona {
  relationshipDepth: number
  stage: ElaraEvolutionStage
  themes: string[]
  anchorPillar: AreaId | null
  tenderPillar: AreaId | null
  /** Short excerpts from the user's own words — recent and meaningful. */
  recurringWords: string[]
  morningCount: number
  reflectionCount: number
  logDays: number
  lastEvolvedAt: string
}
