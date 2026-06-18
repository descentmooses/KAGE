import { describe, expect, it } from 'vitest'
import { computeCore } from '../types/pillars'
import { cardSurface, monoCaps, orbitronCaps } from '../theme/componentStyles'
import { darkTokens } from '../theme/tokens'

describe('componentStyles', () => {
  it('builds card surface from theme tokens', () => {
    const style = cardSurface(darkTokens, { marginBottom: 24 })
    expect(style.borderRadius).toBe(12)
    expect(style.background).toBe(darkTokens.cardBg)
    expect(style.marginBottom).toBe(24)
  })

  it('builds orbitron and mono label styles', () => {
    expect(orbitronCaps(darkTokens).fontFamily).toContain('Orbitron')
    expect(monoCaps(darkTokens).textTransform).toBe('uppercase')
  })
})

describe('computeCore', () => {
  it('averages pillars into 0–100 core score', () => {
    expect(computeCore(7, 7, 7)).toBe(70)
    expect(computeCore(10, 10, 10)).toBe(100)
  })
})
