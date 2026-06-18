import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { ToastContext } from './toastContext'
import type { Toast, ToastType } from './toastTypes'

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, type }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        style={{
          position: 'fixed',
          top: 'max(12px, env(safe-area-inset-top))',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 200,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          width: 'min(92vw, 360px)',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast }: { toast: Toast }) {
  const colors = {
    success: { border: '#2d6a4f', bg: 'rgba(45,106,79,0.92)', text: '#d8f3dc' },
    error: { border: '#c41e3a', bg: 'rgba(60,12,20,0.94)', text: '#f8d7da' },
    info: { border: '#4a4a58', bg: 'rgba(20,20,24,0.94)', text: '#e8e8f0' },
  }[toast.type]

  return (
    <div
      className="animate-fade-in"
      style={{
        padding: '12px 14px',
        borderRadius: 8,
        border: `1px solid ${colors.border}`,
        background: colors.bg,
        color: colors.text,
        fontSize: 13,
        lineHeight: 1.45,
        boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
      }}
    >
      {toast.message}
    </div>
  )
}
