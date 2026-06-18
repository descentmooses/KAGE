import { useTheme } from '../theme/useTheme'

interface NeonDividerProps {
  color?: 'crimson' | 'ember'
  className?: string
  delay?: number
}

export function NeonDivider({
  color = 'crimson',
  className = '',
  delay = 0,
}: NeonDividerProps) {
  const { tokens } = useTheme()
  const accent = color === 'ember' ? tokens.ember : tokens.crimson

  return (
    <div
      className={`h-px w-full origin-center opacity-0 ${className}`}
      style={{
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        animation: `line-expand 1.2s ease-out ${delay}ms forwards`,
        boxShadow: `0 0 8px ${tokens.accentGlow}`,
      }}
    />
  )
}
