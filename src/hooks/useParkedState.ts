import { useTracker } from '../context/trackerContext'

/** Parked-only voice capture state (pending note awaiting confirmation). */
export function useParkedState() {
  const { settings, pendingVoiceNote, setPendingVoiceNote } = useTracker()

  return {
    voiceEnabled: settings.voiceEnabled,
    pendingVoiceNote,
    setPendingVoiceNote,
  }
}
