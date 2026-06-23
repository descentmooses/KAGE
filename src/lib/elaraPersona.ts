import type {
  DailyLog,
  ElaraEvolutionStage,
  ElaraPersona,
  Goal,
  MorningLogEntry,
  ReflectionEntry,
} from '../types'
import { buildPillarHistory } from './pillarHistory'

export const ELARA_THEME_LABELS: Record<string, string> = {
  family: 'family',
  health: 'health & body',
  focus: 'focus & mind',
  purpose: 'purpose & craft',
  discipline: 'discipline',
  gratitude: 'gratitude',
  resilience: 'resilience',
}

const THEME_KEYWORDS: Record<string, RegExp> = {
  family: /\b(family|home|wife|husband|partner|kids?|children|parent|mom|dad|son|daughter)\b/i,
  health: /\b(gym|workout|sleep|rest|hydrate|walk|run|exercise|recovery|macros)\b/i,
  focus: /\b(focus|learn|study|read|meditat|clarity|concentrat|deep work)\b/i,
  purpose: /\b(freedom|purpose|meaning|build|create|craft|legacy|mission)\b/i,
  discipline: /\b(discipline|routine|ritual|habit|consistent|protocol)\b/i,
  gratitude: /\b(grateful|gratitude|thank|appreciat|blessed)\b/i,
  resilience: /\b(hard|tough|overcome|surviv|persist|heavy|struggle)\b/i,
}

export interface BuildElaraPersonaInput {
  allLogs: DailyLog[]
  morningLogs: MorningLogEntry[]
  reflectionLogs: ReflectionEntry[]
  goals: Goal[]
  streak: number
  favoriteWhispers?: string[]
}

function collectCorpusText(input: BuildElaraPersonaInput): string[] {
  const texts: string[] = []
  for (const log of input.allLogs) {
    if (log.notes?.trim()) texts.push(log.notes)
  }
  for (const entry of input.morningLogs) {
    if (entry.intention?.trim()) texts.push(entry.intention)
    if (entry.discipline?.trim()) texts.push(entry.discipline)
  }
  for (const entry of input.reflectionLogs) {
    if (entry.journal?.trim()) texts.push(entry.journal)
  }
  for (const goal of input.goals) {
    if (!goal.completedAt) texts.push(goal.title)
  }
  return texts
}

function detectThemes(texts: string[]): string[] {
  const scores = new Map<string, number>()
  const corpus = texts.join(' ')
  for (const [theme, pattern] of Object.entries(THEME_KEYWORDS)) {
    const matches = corpus.match(new RegExp(pattern.source, 'gi'))
    if (matches?.length) scores.set(theme, matches.length)
  }
  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([theme]) => theme)
}

function extractPhrases(texts: string[]): string[] {
  const seen = new Set<string>()
  const phrases: string[] = []

  for (const raw of texts) {
    const text = raw.trim()
    if (text.length < 12) continue
    const sentence = text.split(/[.!?\n]/)[0]?.trim() ?? text
    const candidate = sentence.length > 72 ? `${sentence.slice(0, 72).trim()}…` : sentence
    if (candidate.length < 12) continue
    const key = candidate.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    phrases.push(candidate)
  }

  return phrases.slice(0, 5)
}

function stageFromDepth(depth: number, logDays: number): ElaraEvolutionStage {
  if (logDays < 3 || depth < 12) return 'new'
  if (logDays < 10 || depth < 35) return 'learning'
  if (depth < 65) return 'attuned'
  return 'intimate'
}

export function personaStageLabel(stage: ElaraEvolutionStage): string {
  switch (stage) {
    case 'new':
      return 'getting to know you'
    case 'learning':
      return 'learning your rhythm'
    case 'attuned':
      return 'attuned to you'
    case 'intimate':
      return 'knows your patterns'
  }
}

export function buildElaraPersona(input: BuildElaraPersonaInput): ElaraPersona {
  const logged = input.allLogs.filter((l) => l.core > 0)
  const logDays = logged.length
  const history = buildPillarHistory(input.allLogs, 30)
  const texts = collectCorpusText(input)
  const textVolume = texts.reduce((sum, t) => sum + t.length, 0)
  const activeGoals = input.goals.filter((g) => !g.completedAt).length

  const relationshipDepth = Math.min(
    100,
    Math.round(
      logDays * 4 +
        input.morningLogs.length * 3 +
        input.reflectionLogs.length * 4 +
        Math.min(input.streak, 30) * 1.5 +
        (input.favoriteWhispers?.length ?? 0) * 2 +
        Math.min(textVolume / 400, 15) +
        activeGoals * 2,
    ),
  )

  const themes = detectThemes(texts)
  const recurringWords = extractPhrases([
    ...input.morningLogs.flatMap((e) => [e.intention, e.discipline]),
    ...input.reflectionLogs.map((e) => e.journal),
    ...input.allLogs.map((l) => l.notes ?? ''),
  ])

  return {
    relationshipDepth,
    stage: stageFromDepth(relationshipDepth, logDays),
    themes,
    anchorPillar: history.steadyPillar,
    tenderPillar: history.softPillar,
    recurringWords,
    morningCount: input.morningLogs.length,
    reflectionCount: input.reflectionLogs.length,
    logDays,
    lastEvolvedAt: new Date().toISOString(),
  }
}

export function mergeElaraPersona(
  local?: ElaraPersona,
  remote?: ElaraPersona,
): ElaraPersona | undefined {
  if (!local && !remote) return undefined
  if (!local) return remote
  if (!remote) return local

  const primary = local.relationshipDepth >= remote.relationshipDepth ? local : remote
  const secondary = primary === local ? remote : local

  const themes = [...new Set([...primary.themes, ...secondary.themes])].slice(0, 3)
  const recurringWords = [...new Set([...primary.recurringWords, ...secondary.recurringWords])].slice(
    0,
    5,
  )

  return {
    relationshipDepth: Math.max(local.relationshipDepth, remote.relationshipDepth),
    stage: primary.stage,
    themes,
    anchorPillar: primary.anchorPillar ?? secondary.anchorPillar,
    tenderPillar: primary.tenderPillar ?? secondary.tenderPillar,
    recurringWords,
    morningCount: Math.max(local.morningCount, remote.morningCount),
    reflectionCount: Math.max(local.reflectionCount, remote.reflectionCount),
    logDays: Math.max(local.logDays, remote.logDays),
    lastEvolvedAt:
      local.lastEvolvedAt >= remote.lastEvolvedAt ? local.lastEvolvedAt : remote.lastEvolvedAt,
  }
}

export function personaChanged(before: ElaraPersona | undefined, after: ElaraPersona): boolean {
  if (!before) return true
  return (
    before.relationshipDepth !== after.relationshipDepth ||
    before.stage !== after.stage ||
    before.logDays !== after.logDays ||
    before.morningCount !== after.morningCount ||
    before.reflectionCount !== after.reflectionCount ||
    before.themes.join('|') !== after.themes.join('|') ||
    before.recurringWords.join('|') !== after.recurringWords.join('|') ||
    before.anchorPillar !== after.anchorPillar ||
    before.tenderPillar !== after.tenderPillar
  )
}
