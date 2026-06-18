import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { ElaraContext } from './elaraContext'
import { ElaraWhispersModal } from '../components/elara/ElaraWhispersModal'

export function ElaraProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  const openElara = useCallback(() => setOpen(true), [])
  const closeElara = useCallback(() => setOpen(false), [])

  const value = useMemo(
    () => ({ open, openElara, closeElara }),
    [open, openElara, closeElara],
  )

  return (
    <ElaraContext.Provider value={value}>
      {children}
      <ElaraWhispersModal open={open} onClose={closeElara} />
    </ElaraContext.Provider>
  )
}
