interface NeonInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  multiline?: boolean
}

export function NeonInput({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
}: NeonInputProps) {
  const fieldStyle = {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.1)',
    color: '#e8e8f0',
  }

  return (
    <label className="block">
      <span
        className="mb-2 block font-mono text-[8px] tracking-[0.35em] uppercase"
        style={{ color: 'rgba(138,138,154,0.95)' }}
      >
        {label}
      </span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full resize-none rounded-sm border px-3 py-2.5 font-jp text-sm outline-none focus:border-cyan/50 focus:shadow-[0_0_16px_rgba(0,249,255,0.12)]"
          style={fieldStyle}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-sm border px-3 py-2.5 font-jp text-sm outline-none focus:border-cyan/50 focus:shadow-[0_0_16px_rgba(0,249,255,0.12)]"
          style={fieldStyle}
        />
      )}
    </label>
  )
}
