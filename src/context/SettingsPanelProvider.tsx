import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { SettingsPanelContext } from './settingsPanelContext'

export function SettingsPanelProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  const openSettings = useCallback(() => setOpen(true), [])
  const closeSettings = useCallback(() => setOpen(false), [])

  const value = useMemo(
    () => ({ open, openSettings, closeSettings }),
    [open, openSettings, closeSettings],
  )

  return (
    <SettingsPanelContext.Provider value={value}>{children}</SettingsPanelContext.Provider>
  )
}
