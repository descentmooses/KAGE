import { useTracker } from '../context/trackerContext'

/** Elara whisper settings, history, and favorites. */
export function useElaraWhispers() {
  const { settings, saveWhisper, toggleFavoriteWhisper, updateSettings } = useTracker()

  return {
    elaraEnabled: settings.elaraWhispers,
    affirmationsEnabled: settings.affirmationsEnabled,
    whisperHistory: settings.whisperHistory ?? [],
    favoriteWhispers: settings.favoriteWhispers ?? [],
    saveWhisper,
    toggleFavoriteWhisper,
    updateSettings,
  }
}
