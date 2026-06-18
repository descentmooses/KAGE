import type { CSSProperties, ReactNode } from 'react'
import { useTheme } from '../theme/useTheme'

/** Neon gradient fill + glow without background-clip/filter on the same layer (avoids light-mode square bug). */
export const NEON_CORE_GRADIENT =
  'linear-gradient(155deg, #00f9ff 0%, #eef0f8 40%, #ff00aa 100%)'

export const NEON_CORE_GLOW =
  'drop-shadow(0 0 30px rgba(0,249,255,0.7)) drop-shadow(0 0 60px rgba(255,0,170,0.35))'

export const NEON_HERO_GLOW_DARK =
  'drop-shadow(0 6px 28px rgba(0,0,0,0.55)) drop-shadow(0 14px 48px rgba(0,0,0,0.35)) drop-shadow(0 0 36px rgba(0,249,255,0.95)) drop-shadow(0 0 72px rgba(0,249,255,0.55)) drop-shadow(0 0 110px rgba(255,0,170,0.45))'

export const NEON_HERO_GLOW_LIGHT =
  'drop-shadow(0 6px 24px rgba(0,0,0,0.5)) drop-shadow(0 12px 40px rgba(0,0,0,0.35)) drop-shadow(0 20px 56px rgba(0,0,0,0.2))'

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
  variant = 'default',
}: NeonGlowTextProps) {
  const { mode } = useTheme()
  const isLight = mode === 'light'
  const isHero = variant === 'hero'

  const glowFilter = isHero
    ? isLight
      ? NEON_HERO_GLOW_LIGHT
      : NEON_HERO_GLOW_DARK
    : NEON_CORE_GLOW

  const textLayer: CSSProperties = {
    fontFamily: style?.fontFamily,
    fontSize: style?.fontSize,
    fontWeight: style?.fontWeight,
    letterSpacing: style?.letterSpacing,
    lineHeight: style?.lineHeight ?? 1,
    margin: 0,
  }

  const layerBase: CSSProperties = {
    ...textLayer,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    pointerEvents: 'none',
    userSelect: 'none',
    whiteSpace: 'nowrap',
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
      {isHero && (
        <span
          aria-hidden
          style={{
            ...layerBase,
            color: isLight ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 249, 255, 0.35)',
            transform: 'translateY(0.08em) scale(1.03)',
            filter: 'blur(10px)',
          }}
        >
          {children}
        </span>
      )}

      {isHero && (
        <span
          aria-hidden
          style={{
            ...layerBase,
            color: 'transparent',
            WebkitTextStroke: isLight ? '0.06em #000000' : '0.04em #000000',
            paintOrder: 'stroke fill',
          }}
        >
          {children}
        </span>
      )}

      <span
        aria-hidden
        style={{
          ...layerBase,
          ...(isLight && isHero
            ? {
                color: 'transparent',
                textShadow:
                  '0 6px 24px rgba(0,0,0,0.5), 0 12px 40px rgba(0,0,0,0.35), 0 20px 56px rgba(0,0,0,0.2)',
              }
            : {
                color: '#00f9ff',
                filter: glowFilter,
              }),
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
