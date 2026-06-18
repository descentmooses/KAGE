import { createContext, useContext } from 'react'

export interface ElaraContextValue {
  open: boolean
  openElara: () => void
  closeElara: () => void
}

export const ElaraContext = createContext<ElaraContextValue | null>(null)

export function useElara() {
  const ctx = useContext(ElaraContext)
  if (!ctx) throw new Error('useElara must be used within ElaraProvider')
  return ctx
}
