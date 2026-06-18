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
  const options = Array.from({ length: max - min + 1 }, (_, i) => i + min)

  return (
    <div>
      {label && (
        <p className="mb-2 font-mono text-[8px] tracking-[0.35em] text-mist uppercase">
          {label}
        </p>
      )}
      <div className="grid grid-cols-5 gap-1.5">
        {options.map((n) => {
          const selected = value === n
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className="py-2.5 font-mono text-[11px] transition-all duration-100 active:scale-90"
              style={{
                color: selected ? '#0a0a0a' : 'rgba(138,138,154,0.55)',
                background: selected
                  ? 'linear-gradient(145deg, #00f9ff, #ff00aa)'
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${selected ? 'transparent' : 'rgba(255,255,255,0.07)'}`,
                boxShadow: selected ? '0 0 14px #00f9ff44' : 'none',
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
