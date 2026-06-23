import { useTracker } from '../context/trackerContext'

/** Daily shadow log state, trends, and write actions (quick + full log). */
export function useShadowLogs() {
  const {
    todayLog,
    ratings,
    core,
    allLogs,
    trend,
    period,
    setPeriod,
    insights,
    logRating,
    quickBump,
    saveTodayShadow,
  } = useTracker()

  return {
    todayLog,
    ratings,
    core,
    allLogs,
    trend,
    period,
    setPeriod,
    insights,
    logRating,
    quickBump,
    saveTodayShadow,
  }
}
