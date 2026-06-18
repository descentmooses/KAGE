import { createContext } from 'react'
import type { ToastType } from './toastTypes'

export interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
