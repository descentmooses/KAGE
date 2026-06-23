import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useTracker } from './trackerContext'
import type { TabId } from '../types'
import { TUTORIAL_STEPS } from '../features/tutorial/tutorialSteps'
import { ElaraTutorialOverlay } from '../features/tutorial/ElaraTutorialOverlay'
import { TutorialContext } from './tutorialContext'

interface TutorialProviderProps {
  children: ReactNode
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

export function TutorialProvider({
  children,
  activeTab,
  onTabChange,
}: TutorialProviderProps) {
  const { ready, settings, updateSettings } = useTracker()
  const [stepIndex, setStepIndex] = useState<number | null>(null)

  const shouldRun = ready && settings.demoMode && !settings.tutorialComplete

  useEffect(() => {
    if (!shouldRun) return
    if (stepIndex !== null) return
    const resume = settings.tutorialStep ?? 0
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resume tutorial after async settings load
    setStepIndex(Math.min(resume, TUTORIAL_STEPS.length - 1))
  }, [shouldRun, stepIndex, settings.tutorialStep])

  const step = stepIndex !== null ? TUTORIAL_STEPS[stepIndex] : null

  useEffect(() => {
    if (!step) return
    if (activeTab !== step.tab) onTabChange(step.tab)
  }, [step, activeTab, onTabChange])

  useEffect(() => {
    if (!step?.target) return
    const id = `tutorial-${step.target}`
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 200)
    return () => window.clearTimeout(timer)
  }, [step?.id, step?.target])

  const finishTutorial = useCallback(async () => {
    setStepIndex(null)
    await updateSettings({
      tutorialComplete: true,
      hasOnboarded: true,
      tutorialStep: TUTORIAL_STEPS.length,
    })
    onTabChange('home')
  }, [onTabChange, updateSettings])

  const nextStep = useCallback(() => {
    if (stepIndex === null) return
    const next = stepIndex + 1
    if (next >= TUTORIAL_STEPS.length) {
      void finishTutorial()
      return
    }
    setStepIndex(next)
    void updateSettings({ tutorialStep: next })
  }, [finishTutorial, stepIndex, updateSettings])

  const skipTutorial = useCallback(() => {
    void finishTutorial()
  }, [finishTutorial])

  const value = useMemo(
    () => ({
      active: stepIndex !== null,
      stepIndex: stepIndex ?? 0,
      totalSteps: TUTORIAL_STEPS.length,
      highlightTarget: step?.target ?? null,
      nextStep,
      skipTutorial,
    }),
    [nextStep, skipTutorial, step?.target, stepIndex],
  )

  return (
    <TutorialContext.Provider value={value}>
      {children}
      {step && stepIndex !== null && (
        <ElaraTutorialOverlay
          step={step}
          stepIndex={stepIndex}
          totalSteps={TUTORIAL_STEPS.length}
          onNext={nextStep}
          onSkip={skipTutorial}
        />
      )}
    </TutorialContext.Provider>
  )
}
