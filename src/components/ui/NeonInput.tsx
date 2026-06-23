import type { CSSProperties, FocusEvent as ReactFocusEvent } from 'react'
import { useTheme } from '../../theme/useTheme'

interface NeonInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  multiline?: boolean
  type?: 'text' | 'password'
  autoComplete?: string
}

export function NeonInput({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  type = 'text',
  autoComplete,
}: NeonInputProps) {
  const { tokens } = useTheme()

  const fieldStyle: CSSProperties = {
    width: '100%',
    backgroundColor: tokens.inputBg,
    border: `1px solid ${tokens.inputBorder}`,
    color: tokens.text,
    borderRadius: 2,
    padding: '10px 12px',
    fontFamily: '"Noto Sans JP", sans-serif',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background 0.35s ease',
  }

  const handleFocus = (e: ReactFocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = tokens.inputFocusBorder
    e.currentTarget.style.boxShadow = tokens.inputFocusShadow
  }

  const handleBlur = (e: ReactFocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = tokens.inputBorder
    e.currentTarget.style.boxShadow = 'none'
  }

  return (
    <label style={{ display: 'block' }}>
      <span
        style={{
          display: 'block',
          marginBottom: 8,
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: 8,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: tokens.textMuted,
          transition: 'color 0.35s ease',
        }}
      >
        {label}
      </span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          style={{ ...fieldStyle, resize: 'none' }}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          style={fieldStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      )}
    </label>
  )
}
