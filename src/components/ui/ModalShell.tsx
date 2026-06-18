import { useEffect, type ReactNode } from 'react'
import { useTheme } from '../../theme/useTheme'

interface ModalShellProps {
  /** When false, nothing is rendered. */
  open: boolean
  onClose: () => void
  children: ReactNode
  /** Optional element id for aria-labelledby */
  labelledBy?: string
  /** Optional element id for aria-describedby */
  describedBy?: string
  maxWidth?: number
}

/**
 * Full-screen modal backdrop + centered panel. Handles Escape to close.
 * Visual styling matches existing KAGE modals (Rating, Goal).
 */
export function ModalShell({
  open,
  onClose,
  children,
  labelledBy,
  describedBy,
  maxWidth = 380,
}: ModalShellProps) {
  const { tokens } = useTheme()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      className="animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        style={{
          position: 'absolute',
          inset: 0,
          border: 'none',
          background: tokens.modalBackdrop,
          cursor: 'pointer',
          transition: 'background 0.35s ease',
        }}
      />
      <div
        className="animate-modal-in"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth,
        }}
      >
        {children}
      </div>
    </div>
  )
}
