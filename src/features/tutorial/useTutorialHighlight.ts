import { useTutorial } from '../../context/tutorialContext'
import type { TutorialTarget } from '../tutorial/tutorialSteps'

export function useTutorialHighlight(target: TutorialTarget): boolean {
  const tutorial = useTutorial()
  if (!target || !tutorial?.active) return false
  return tutorial.highlightTarget === target
}
