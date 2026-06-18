import type { ReactNode } from 'react'

interface NeonButtonProps {
  children: ReactNode
  onClick: () => void
  disabled?: boolean
}

export function NeonButton({ children, onClick, disabled }: NeonButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="log-rating-btn w-full py-3.5 font-display text-[9px] tracking-[0.5em] text-void uppercase transition-all duration-100 hover:brightness-110 active:scale-[0.97] disabled:opacity-50"
    >
      {children}
    </button>
  )
}
