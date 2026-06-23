import { useTracker } from '../context/trackerContext'

/** Pending voice note awaiting confirmation in the shadow log. */
export function usePendingVoiceNote() {
  const { settings, pendingVoiceNote, setPendingVoiceNote } = useTracker()

  return {
    voiceEnabled: settings.voiceEnabled,
    pendingVoiceNote,
    setPendingVoiceNote,
  }
}
