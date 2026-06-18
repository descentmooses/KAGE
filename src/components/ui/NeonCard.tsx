import type { CSSProperties, ReactNode } from 'react'
import { useTheme } from '../../theme/useTheme'
import { cardSurface } from '../../theme/componentStyles'

interface NeonCardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

/** Theme-aware elevated card container. */
export function NeonCard({ children, className, style }: NeonCardProps) {
  const { tokens } = useTheme()
  return (
    <div className={className} style={cardSurface(tokens, style)}>
      {children}
    </div>
  )
}
