import type { GamificationState } from '../../../types'

export type CelebrationType = 'success' | 'info'

export interface CelebrationHandler {
  (message: string, type?: CelebrationType): void
}

export interface RefreshHandler {
  (): Promise<void>
}

export interface ApplyGamificationXp {
  (g: GamificationState, amount: number, successMessage?: string): Promise<GamificationState>
}

export function createUid(): string {
  return crypto.randomUUID()
}

export function createCelebrationId(): string {
  return crypto.randomUUID()
}
