import { useTheme } from '../theme/useTheme'
import type { AreaConfig } from '../types'

interface NeonBarProps {
  area: AreaConfig
  value: number
  onTap: () => void
}

export function NeonBar({ area, value, onTap }: NeonBarProps) {
  const { tokens, mode } = useTheme()
  const fillPercent = (value / 10) * 100
  const accentColor = area.color === 'magenta' ? tokens.magenta : tokens.cyan
  const fillGlow =
    mode === 'dark'
      ? 'none'
      : `0 0 14px ${tokens.cyan}, 0 0 28px ${tokens.cyanGlow}`
  const capGlow =
    mode === 'dark'
      ? '0 0 6px #fff'
      : `0 0 6px #fff, 0 0 14px ${tokens.cyan}, 0 0 22px ${tokens.magenta}`
  const valueGlow = mode === 'dark' ? 'none' : `0 0 10px ${accentColor}`

  return (
    <button
      type="button"
      onClick={onTap}
      style={{
        display: 'block',
        width: '100%',
        padding: '14px 6px',
        margin: 0,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'inherit',
        borderRadius: 4,
        transition: 'background 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background =
          mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(28,28,36,0.03)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
      }}
      aria-label={`${area.label} ${value} of 10. Tap to adjust.`}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span
            style={{
              fontSize: 24,
              color: tokens.textSubtle,
              transition: 'color 0.35s ease',
            }}
          >
            {area.kanji}
          </span>
          <span
            style={{
              fontFamily: '"Orbitron", sans-serif',
              fontSize: 8,
              letterSpacing: '0.4em',
              color: tokens.textMuted,
              textTransform: 'uppercase',
              transition: 'color 0.35s ease',
            }}
          >
            {area.label}
          </span>
        </div>
        <span
          style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: 11,
            color: accentColor,
            textShadow: valueGlow,
            transition: 'color 0.35s ease',
          }}
        >
          {String(value).padStart(2, '0')}
        </span>
      </div>

      <div
        style={{
          position: 'relative',
          height: 12,
          width: '100%',
          borderRadius: 999,
          background: tokens.neonTrack,
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          transition: 'background 0.35s ease',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: `${fillPercent}%`,
            borderRadius: 999,
            background: tokens.neonFill,
            boxShadow: fillGlow,
            transition: 'width 0.4s ease, background 0.35s ease',
          }}
        />
        {fillPercent > 2 && (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: '50%',
              left: `calc(${fillPercent}% - 5px)`,
              transform: 'translateY(-50%)',
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: tokens.neonCap,
              boxShadow: capGlow,
              transition: 'left 0.4s ease',
            }}
          />
        )}
      </div>
    </button>
  )
}
