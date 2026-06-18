import { useTracker } from '../context/trackerContext'

/** Current Mind-Body-Spirit ratings and composite core score. */
export function useMBSBalance() {
  const { ratings, core } = useTracker()

  return { ratings, core }
}
