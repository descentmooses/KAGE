import { useId, useState, type ReactNode } from 'react'
import { useTheme } from '../../theme/useTheme'

interface CollapsibleSectionProps {
  title: string
  subtitle?: string
  defaultOpen?: boolean
  children: ReactNode
}

export function CollapsibleSection({
  title,
  subtitle,
  defaultOpen = false,
  children,
}: CollapsibleSectionProps) {
  const { tokens } = useTheme()
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useId()

  return (
    <section style={{ marginBottom: 16 }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="kage-touch-target"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          minHeight: 52,
          padding: '14px 16px',
          borderRadius: 10,
          border: `1px solid ${open ? tokens.borderAccent : tokens.border}`,
          background: open ? tokens.bannerBg : tokens.cardBg,
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'border-color 0.2s ease, background 0.2s ease',
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontFamily: '"Orbitron", sans-serif',
              fontSize: 9,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: tokens.crimson,
            }}
          >
            {title}
          </p>
          {subtitle && (
            <p style={{ margin: '4px 0 0', fontSize: 11, color: tokens.textMuted }}>{subtitle}</p>
          )}
        </div>
        <span
          aria-hidden
          style={{
            fontSize: 14,
            color: tokens.textMuted,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        >
          ▾
        </span>
      </button>
      {open && (
        <div id={panelId} style={{ marginTop: 14 }}>
          {children}
        </div>
      )}
    </section>
  )
}
