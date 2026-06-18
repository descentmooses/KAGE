interface NeonDividerProps {
  color?: 'cyan' | 'magenta'
  className?: string
  delay?: number
}

export function NeonDivider({
  color = 'cyan',
  className = '',
  delay = 0,
}: NeonDividerProps) {
  const gradient =
    color === 'cyan'
      ? 'linear-gradient(90deg, transparent, #00f0ff, transparent)'
      : 'linear-gradient(90deg, transparent, #ff00aa, transparent)'

  return (
    <div
      className={`h-px w-full origin-center opacity-0 ${className}`}
      style={{
        background: gradient,
        animation: `line-expand 1.2s ease-out ${delay}ms forwards`,
        boxShadow:
          color === 'cyan'
            ? '0 0 8px #00f0ff44, 0 0 20px #00f0ff22'
            : '0 0 8px #ff00aa44, 0 0 20px #ff00aa22',
      }}
    />
  )
}
