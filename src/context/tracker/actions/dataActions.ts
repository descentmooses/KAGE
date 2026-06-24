import { exportAllData, importAllData } from '../../../lib/db'
import {
  graduateFromDemo,
  markTutorialComplete,
  seedDemoData,
} from '../../../lib/demoSeed'
import { todayKey } from '../../../lib/dates'
import type { CelebrationHandler, RefreshHandler } from './types'

export interface DataActionDeps {
  refresh: RefreshHandler
  onCelebrate: CelebrationHandler
  tutorialStep: number
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

  const beginRealArchive = async () => {
    const { resetArchive } = await graduateFromDemo(deps.tutorialStep)
    await deps.refresh()
    if (resetArchive) {
      deps.onCelebrate('Your archive is ready — begin logging for real.', 'success')
    } else {
      deps.onCelebrate('Demo cleared — your GitHub vault archive continues.', 'success')
    }
  }

  const completeTutorial = async (tutorialStep: number) => {
    await markTutorialComplete(tutorialStep)
    await deps.refresh()
    deps.onCelebrate('Tutorial complete — open Settings to start your archive.', 'success')
  }

  return { exportData, importData, resetDemoData, beginRealArchive, completeTutorial }
}
