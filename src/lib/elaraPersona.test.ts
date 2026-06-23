import { describe, expect, it } from 'vitest'
import { buildElaraPersona, mergeElaraPersona, personaStageLabel } from './elaraPersona'
import type { DailyLog, MorningLogEntry, ReflectionEntry } from '../types'

function dailyLog(notes?: string): DailyLog {
  return {
    date: '2026-06-18',
    mind: 7,
    body: 6,
    spirit: 8,
    core: 70,
    notes,
    source: 'quick',
    loggedAt: '2026-06-18T12:00:00.000Z',
  }
}

describe('buildElaraPersona', () => {
  it('starts in the new stage with little history', () => {
    const persona = buildElaraPersona({
      allLogs: [],
      morningLogs: [],
      reflectionLogs: [],
      goals: [],
      streak: 0,
    })
    expect(persona.stage).toBe('new')
    expect(persona.relationshipDepth).toBe(0)
  })

  it('detects themes and recurring words from rituals', () => {
    const morning: MorningLogEntry = {
      id: 'm1',
      date: '2026-06-18',
      energy: 7,
      intention: 'Stay present with my family tonight',
      discipline: 'No phone during dinner with the kids',
      loggedAt: '2026-06-18T08:00:00.000Z',
    }
    const reflection: ReflectionEntry = {
      id: 'r1',
      date: '2026-06-17',
      mind: 6,
      body: 5,
      spirit: 7,
      journal: 'Grateful for a hard day that still ended with connection.',
      loggedAt: '2026-06-17T22:00:00.000Z',
    }

    const persona = buildElaraPersona({
      allLogs: [dailyLog('Gym and meditation before work'), dailyLog(), dailyLog()],
      morningLogs: [morning],
      reflectionLogs: [reflection],
      goals: [],
      streak: 4,
    })

    expect(persona.themes).toContain('family')
    expect(persona.recurringWords.length).toBeGreaterThan(0)
    expect(persona.stage).not.toBe('new')
  })

  it('deepens with consistent logging and favorites', () => {
    const logs = Array.from({ length: 12 }, (_, i) => ({
      ...dailyLog('Focus and discipline today'),
      date: `2026-06-${String(i + 1).padStart(2, '0')}`,
    }))

    const shallow = buildElaraPersona({
      allLogs: logs.slice(0, 3),
      morningLogs: [],
      reflectionLogs: [],
      goals: [],
      streak: 3,
    })
    const deep = buildElaraPersona({
      allLogs: logs,
      morningLogs: Array.from({ length: 6 }, (_, i) => ({
        id: `m${i}`,
        date: `2026-06-${String(i + 1).padStart(2, '0')}`,
        energy: 7,
        intention: 'Build with focus',
        discipline: 'Morning ritual',
        loggedAt: `2026-06-${String(i + 1).padStart(2, '0')}T08:00:00.000Z`,
      })),
      reflectionLogs: [],
      goals: [],
      streak: 12,
      favoriteWhispers: ['One honest log', 'Keep going'],
    })

    expect(deep.relationshipDepth).toBeGreaterThan(shallow.relationshipDepth)
    expect(['learning', 'attuned', 'intimate']).toContain(deep.stage)
  })
})

describe('mergeElaraPersona', () => {
  it('keeps the deeper relationship and merged themes', () => {
    const merged = mergeElaraPersona(
      {
        relationshipDepth: 40,
        stage: 'learning',
        themes: ['family'],
        anchorPillar: 'spirit',
        tenderPillar: 'body',
        recurringWords: ['Stay close to home'],
        morningCount: 3,
        reflectionCount: 2,
        logDays: 8,
        lastEvolvedAt: '2026-06-17T00:00:00.000Z',
      },
      {
        relationshipDepth: 55,
        stage: 'attuned',
        themes: ['focus'],
        anchorPillar: 'mind',
        tenderPillar: null,
        recurringWords: ['Build with focus'],
        morningCount: 5,
        reflectionCount: 1,
        logDays: 10,
        lastEvolvedAt: '2026-06-18T00:00:00.000Z',
      },
    )

    expect(merged?.relationshipDepth).toBe(55)
    expect(merged?.stage).toBe('attuned')
    expect(merged?.themes).toEqual(expect.arrayContaining(['focus', 'family']))
    expect(merged?.recurringWords.length).toBe(2)
  })
})

describe('personaStageLabel', () => {
  it('maps stages to readable labels', () => {
    expect(personaStageLabel('new')).toMatch(/getting to know/i)
    expect(personaStageLabel('intimate')).toMatch(/knows your patterns/i)
  })
})
