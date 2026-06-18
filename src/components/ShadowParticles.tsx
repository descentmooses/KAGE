import { useTheme } from '../theme/useTheme'

export function ShadowParticles() {
  const { mode } = useTheme()
  if (mode === 'light') return null

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 2,
        overflow: 'hidden',
      }}
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className="animate-shadow-particle"
          style={{
            position: 'absolute',
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: 'rgba(196,30,58,0.5)',
            left: `${8 + i * 8}%`,
            top: `${20 + (i % 5) * 14}%`,
            animationDelay: `${i * 0.35}s`,
          }}
        />
      ))}
    </div>
  )
}
