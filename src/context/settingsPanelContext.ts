import { createContext, useContext } from 'react'

export interface SettingsPanelContextValue {
  open: boolean
  openSettings: () => void
  closeSettings: () => void
}

export const SettingsPanelContext = createContext<SettingsPanelContextValue | null>(null)

export function useSettingsPanel(): SettingsPanelContextValue {
  const ctx = useContext(SettingsPanelContext)
  if (!ctx) {
    throw new Error('useSettingsPanel must be used within SettingsPanelProvider')
  }
  return ctx
}
