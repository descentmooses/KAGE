import type { CSSProperties, ReactNode } from 'react'

/** Neon gradient fill + glow without background-clip/filter on the same layer (avoids light-mode square bug). */
export const NEON_CORE_GRADIENT =
  'linear-gradient(155deg, #00f9ff 0%, #eef0f8 40%, #ff00aa 100%)'

export const NEON_CORE_GLOW =
  'drop-shadow(0 0 30px rgba(0,249,255,0.7)) drop-shadow(0 0 60px rgba(255,0,170,0.35))'

interface NeonGlowTextProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  as?: 'span' | 'p' | 'h1' | 'div'
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
        aria-hidden
        style={{
          ...textLayer,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          color: '#00f9ff',
          filter: NEON_CORE_GLOW,
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {children}
      </span>
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
