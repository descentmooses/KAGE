import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useTracker } from './trackerContext'
import { reloadAppHome } from '../lib/cacheBust'
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
  const { ready, settings, updateSettings, completeTutorial } = useTracker()
  const [stepIndex, setStepIndex] = useState<number | null>(null)
  const [finishing, setFinishing] = useState(false)
  const finishingRef = useRef(false)
  const prevShouldRun = useRef(false)

  const shouldRun = ready && !!settings.demoMode && !settings.tutorialComplete

  useEffect(() => {
    const opening = shouldRun && !prevShouldRun.current
    prevShouldRun.current = shouldRun

    if (opening) {
      setFinishing(false)
    }
    if (!shouldRun || finishing) return
    if (stepIndex !== null) return

    const resume = settings.tutorialStep ?? 0
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resume after IndexedDB settings load
    setStepIndex(Math.min(resume, TUTORIAL_STEPS.length - 1))
  }, [shouldRun, finishing, stepIndex, settings.tutorialStep])

  const step = shouldRun && stepIndex !== null ? TUTORIAL_STEPS[stepIndex] : null

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
    if (finishingRef.current) return
    finishingRef.current = true
    setFinishing(true)

    try {
      await completeTutorial(TUTORIAL_STEPS.length)
      setStepIndex(null)
      reloadAppHome()
    } catch {
      finishingRef.current = false
      setFinishing(false)
    }
  }, [completeTutorial])

  const nextStep = useCallback(() => {
    if (stepIndex === null || finishingRef.current) return
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

  const overlayBusy = finishing

  const tutorialActive = step !== null && stepIndex !== null

  const value = useMemo(
    () => ({
      active: tutorialActive,
      stepIndex: stepIndex ?? 0,
      totalSteps: TUTORIAL_STEPS.length,
      highlightTarget: tutorialActive ? (step?.target ?? null) : null,
      nextStep,
      skipTutorial,
    }),
    [nextStep, skipTutorial, step?.target, stepIndex, tutorialActive],
  )

  return (
    <TutorialContext.Provider value={value}>
      {children}
      {tutorialActive && step && (
        <ElaraTutorialOverlay
          step={step}
          stepIndex={stepIndex}
          totalSteps={TUTORIAL_STEPS.length}
          busy={overlayBusy}
          onNext={nextStep}
          onSkip={skipTutorial}
        />
      )}
    </TutorialContext.Provider>
  )
}
