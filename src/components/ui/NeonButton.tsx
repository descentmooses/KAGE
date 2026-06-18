import type { ReactNode } from 'react'
import { useTheme } from '../../theme/useTheme'

interface NeonButtonProps {
  children: ReactNode
  onClick: () => void
  disabled?: boolean
}

export function NeonButton({ children, onClick, disabled }: NeonButtonProps) {
  const { tokens } = useTheme()

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '14px 0',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: '"Orbitron", sans-serif',
        fontSize: 9,
        letterSpacing: '0.5em',
        textTransform: 'uppercase',
        color: tokens.btnText,
        fontWeight: 600,
        background: tokens.btnGradient,
        boxShadow: tokens.btnShadow,
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.filter = 'brightness(1.08)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.filter = 'none'
      }}
      onMouseDown={(e) => {
        if (!disabled) e.currentTarget.style.transform = 'scale(0.97)'
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      {children}
    </button>
  )
}
