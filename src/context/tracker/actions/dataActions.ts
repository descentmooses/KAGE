import { exportAllData, importAllData } from '../../../lib/db'
import { dismissTutorialPrompts, graduateFromDemo, seedDemoData, startRealArchive } from '../../../lib/demoSeed'
import { todayKey } from '../../../lib/dates'
import type { CelebrationHandler, RefreshHandler } from './types'

export interface DataActionDeps {
  refresh: RefreshHandler
  onCelebrate: CelebrationHandler
}

export function createDataActions(deps: DataActionDeps) {
  const exportData = async () => {
    const data = await exportAllData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kage-export-${todayKey()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = async (file: File) => {
    const text = await file.text()
    const payload = JSON.parse(text) as Awaited<ReturnType<typeof exportAllData>>
    if (!payload?.dailyLogs || !Array.isArray(payload.dailyLogs)) {
      throw new Error('Invalid KAGE backup file')
    }
    await importAllData(payload)
    await deps.refresh()
  }

  const resetDemoData = async () => {
    await seedDemoData()
    await deps.refresh()
    deps.onCelebrate('Demo reset — Elara will guide you through again.', 'info')
  }

  const resetArchive = async () => {
    await startRealArchive()
    await deps.refresh()
    deps.onCelebrate('Archive reset — your pillars start at zero.', 'success')
  }

  const completeTutorial = async (tutorialStep: number) => {
    await dismissTutorialPrompts(tutorialStep)
    await deps.refresh()
    await graduateFromDemo(tutorialStep)
    await deps.refresh()
  }

  return { exportData, importData, resetDemoData, resetArchive, completeTutorial }
}
