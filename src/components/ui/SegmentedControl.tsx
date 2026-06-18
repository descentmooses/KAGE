import { useTheme } from '../../theme/useTheme'

interface SegmentedControlProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  label?: string
}

export function SegmentedControl({
  value,
  onChange,
  min = 1,
  max = 10,
  label,
}: SegmentedControlProps) {
  const { tokens } = useTheme()
  const options = Array.from({ length: max - min + 1 }, (_, i) => i + min)

  return (
    <div>
      {label && (
        <p
          style={{
            marginBottom: 8,
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: 8,
            letterSpacing: '0.35em',
            color: tokens.textMuted,
            textTransform: 'uppercase',
            transition: 'color 0.35s ease',
          }}
        >
          {label}
        </p>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
        {options.map((n) => {
          const selected = value === n
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              style={{
                padding: '10px 0',
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: 11,
                cursor: 'pointer',
                color: selected ? tokens.segmentTextSelected : tokens.segmentText,
                background: selected ? tokens.segmentSelected : tokens.segmentUnselected,
                border: `1px solid ${selected ? 'transparent' : tokens.segmentBorder}`,
                boxShadow: selected ? `0 0 12px ${tokens.accentGlow}` : 'none',
                transition: 'all 0.15s ease',
                transform: selected ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              {n}
            </button>
          )
        })}
      </div>
    </div>
  )
}
