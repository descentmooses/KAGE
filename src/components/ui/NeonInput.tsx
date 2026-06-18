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
  const sharedClass =
    'w-full rounded-sm border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 font-jp text-sm text-white/85 placeholder:text-mist/50 outline-none transition-colors focus:border-cyan/40 focus:shadow-[0_0_16px_#00f9ff18]'

  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[8px] tracking-[0.35em] text-mist uppercase">
        {label}
      </span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={`${sharedClass} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={sharedClass}
        />
      )}
    </label>
  )
}
