import { createContext, useContext } from 'react'
import type { TutorialTarget } from '../features/tutorial/tutorialSteps'

export interface TutorialContextValue {
  active: boolean
  stepIndex: number
  totalSteps: number
  highlightTarget: TutorialTarget
  nextStep: () => void
  skipTutorial: () => void
}

export const TutorialContext = createContext<TutorialContextValue | null>(null)

export function useTutorial() {
  return useContext(TutorialContext)
}
