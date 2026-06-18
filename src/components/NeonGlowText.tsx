import type { CSSProperties, ReactNode } from 'react'

/** Neon gradient fill without glow layers (avoids background-clip/filter on the same element). */
export const NEON_CORE_GRADIENT =
  'linear-gradient(155deg, #c41e3a 0%, #f0e6e8 42%, #8b1a2d 100%)'

interface NeonGlowTextProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  as?: 'span' | 'p' | 'h1' | 'div'
  variant?: 'default' | 'hero'
}

export function NeonGlowText({
  children,
  className,
  style,
  as: Tag = 'span',
}: NeonGlowTextProps) {
  const textLayer: CSSProperties = {
    fontFamily: style?.fontFamily,
    fontSize: style?.fontSize,
    fontWeight: style?.fontWeight,
    letterSpacing: style?.letterSpacing,
    lineHeight: style?.lineHeight ?? 1,
    margin: 0,
  }

  return (
    <Tag
      className={className}
      style={{
        position: 'relative',
        display: 'inline-block',
        lineHeight: 1,
        margin: style?.margin,
        marginLeft: style?.marginLeft,
      }}
    >
      <span
        style={{
          ...textLayer,
          position: 'relative',
          display: 'inline-block',
          background: NEON_CORE_GRADIENT,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
          whiteSpace: 'nowrap',
        }}
      >
        {children}
      </span>
    </Tag>
  )
}
