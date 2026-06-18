import type { AreaConfig } from '../types'

const CYAN = '#00f9ff'
const MAGENTA = '#ff00aa'

interface NeonBarProps {
  area: AreaConfig
  value: number
  onTap: () => void
}

export function NeonBar({ area, value, onTap }: NeonBarProps) {
  const fillPercent = (value / 10) * 100

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
          <span style={{ fontSize: 24, color: 'rgba(255,255,255,0.5)' }}>{area.kanji}</span>
          <span
            style={{
              fontFamily: '"Orbitron", sans-serif',
              fontSize: 8,
              letterSpacing: '0.4em',
              color: '#8a8a9a',
              textTransform: 'uppercase',
            }}
          >
            {area.label}
          </span>
        </div>
        <span
          style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: 11,
            color: CYAN,
            textShadow: `0 0 10px ${CYAN}`,
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
          background: 'rgba(255,255,255,0.06)',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5)',
          overflow: 'hidden',
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
            background: `linear-gradient(90deg, rgba(0,249,255,0.5), ${CYAN} 70%, ${MAGENTA})`,
            boxShadow: `0 0 14px ${CYAN}, 0 0 28px rgba(0,249,255,0.35)`,
            transition: 'width 0.4s ease',
          }}
        />
      </div>
    </button>
  )
}
