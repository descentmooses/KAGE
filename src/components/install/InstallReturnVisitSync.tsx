import { useEffect } from 'react'
import { useTracker } from '../../context/trackerContext'
import { useInstallPromptInternal } from '../../context/installPromptContext'

/** Syncs return-visit state into install prompt once tracker data is ready. */
export function InstallReturnVisitSync() {
  const { allLogs, settings } = useTracker()
  const { setReturnVisit } = useInstallPromptInternal()

  useEffect(() => {
    setReturnVisit(allLogs.length > 0 || !!settings.hasOnboarded)
  }, [allLogs.length, settings.hasOnboarded, setReturnVisit])

  return null
}
