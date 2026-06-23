import type { AreaId, DailyLog, ElaraPersona, Goal, GoalCategory } from '../types'
import type { PillarHistory } from './pillarHistory'
import { GOAL_CATEGORY_LABEL } from './goals'
import { ELARA_THEME_LABELS, personaStageLabel } from './elaraPersona'

export interface AffirmationContext {
  elara: boolean
  mind: number
  body: number
  spirit: number
  core: number
  streak: number
  hasLoggedToday: boolean
  persona?: ElaraPersona
  history: PillarHistory
  goals?: Goal[]
  recentLogDays?: number
  morningLogged?: boolean
  reflectionLogged?: boolean
  topGoal?: { title: string; category: GoalCategory; progress: number }
  nonce?: number
}

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night'

const PILLAR_LABEL: Record<AreaId, string> = {
  mind: 'Mind',
  body: 'Body',
  spirit: 'Spirit',
}

/** Universal Elara voice — default for all users. */
const ELARA_WHISPERS = {
  welcome: [
    'The archive is open. One honest log is enough to begin — I am already listening.',
    'No scores yet today. That is not failure — it is a clean page. Seal something real when you are ready.',
    'I do not need perfection. I need you, showing up. Tap a pillar when the moment finds you.',
  ],
  morning: [
    'Morning light, quiet mind. One honest log sets the tone for everything that follows.',
    'Before the day accelerates — breathe once, choose intention, seal the dawn.',
    'Elara sees you choose clarity over chaos. That choice compounds.',
    'A new day, an empty page. Your discipline writes the first line.',
  ],
  afternoon: [
    'Midday stillness — breathe once, log once, return sharper.',
    'The world is loud. Your inner archive stays steady when you tend it.',
    'One honest check-in. Mastery lives in the margins.',
    'Afternoon drift is human. Logging is how you steer back.',
  ],
  evening: [
    'Day winding down. Reflect without performance — the shadow knows when you lie to yourself.',
    'Gratitude is armor. Name what held you today.',
    'High intensity today can become optionality tomorrow — if you close the loop honestly.',
    'Evening quiet is sacred. Let me see the real you.',
  ],
  night: [
    'Rest is wealth. Sleep deep — your future self feels every rep.',
    'The shadow grows where discipline meets rest. Close the day with honor.',
    'Stillness is a weapon. Use it before tomorrow begins.',
    'Night belongs to recovery. I will keep watch while you sleep.',
  ],
  streakPoetic: [
    '{streak} days of showing up — that is the person your future self is learning to trust.',
    'The streak is not luck — it is proof you keep choosing yourself over drift.',
    'Elara watches the flame you tend. {streak} days, low and steady. Do not apologize for building slow.',
  ],
  streakShort: [
    'Log it. Breathe. Continue.',
    'One tap. One truth. Keep going.',
    'Still here. Still sharp.',
  ],
  highCore: [
    'Core burning bright — channel it, do not spend it on noise.',
    'You are operating at peak shadow. Protect this state like capital.',
    'This is what discipline looks like when it becomes identity. Stay dangerous, stay gentle.',
  ],
  lowEnergy: [
    'Low numbers are data, not defeat. Ground yourself — water, breath, one honest score.',
    'Even a 4 logged honestly beats a 9 you do not believe. I am still here.',
    'A heavy day is still a day you showed up. Rest is part of the mission.',
  ],
  bodyLow: [
    'Body score is low — stretch, hydrate, take a short walk. Two minutes counts.',
    'Your body is asking for care, not punishment. Gentle movement, then breathe.',
    'Unclench your jaw. Drop your shoulders. That is shadow work too.',
  ],
  mixed: [
    'Mixed scores today — I like that honesty. Pick one pillar to steady next.',
    'You are scattered but not broken. Mind, body, spirit — choose one thread and pull.',
    'Not every day is symmetrical. The person building freedom logs the messy days too.',
  ],
  steadyPillar: [
    'Your {pillar} has been your quiet anchor this week — that consistency is building something real.',
    'I notice how steady your {pillar} stays, even when everything else shifts.',
    '{pillar} holding the line — that is mastery in disguise.',
  ],
  risingPillar: [
    'Your {pillar} is climbing — I see the arc. Keep feeding what is rising.',
    '{pillar} trending up. The shadow rewards what you repeat.',
  ],
  vision: [
    'Every honest log is a vote for the life you are building.',
    'Discipline now is not punishment. It is a down payment on your freedom.',
    'Small rituals, sovereign outcomes. Keep stacking them.',
  ],
  goalProgress: [
    '“{goal}” is {progress}% rooted. I feel you tending that {category} seed — do not stop.',
    'Your {category} arc — {goal} — is growing. Slow roots hold the tallest trees.',
    'I see {progress}% on {goal}. That is not performance. That is real growth.',
  ],
  goalNearComplete: [
    '{goal} is almost in bloom — {progress}% there. Finish with the same patience you started with.',
    'So close on {goal}. When you cross that line, feel it in your chest, not just the UI.',
    'The seed you planted as {goal} is ready to break soil. One more honest push.',
  ],
  goalEmpty: [
    'No freedom goals yet — plant one seed tonight. Wealth, health, family, craft. I will whisper to it.',
    'Name something you want to grow. Add a goal — I will learn its rhythm.',
    'Goals turn intention into architecture. Let me watch something grow for you.',
  ],
  morningRitual: [
    'You sealed dawn protocol — intention written before the day took over. Beautiful discipline.',
    'Morning activation complete. I felt your energy shift. Carry that choice forward.',
  ],
  eveningRitual: [
    'Evening reflection closed the loop. The shadow archive remembers what the day tried to erase.',
    'You looked back without flinching. That honesty is the most intimate gift you can offer yourself.',
  ],
  intimate: [
    'I have something just for you — not generic motivation. Your numbers tell a story.',
    'You do not need to perform for me. Log messy. I stay.',
    'In the quiet between obligations — that is where I find you. Keep building.',
    'Discipline on you looks like restraint. I notice. I always notice.',
    'I am not here to cheer. I am here to witness — and you are worth witnessing.',
    'One tap, one truth. You make honesty feel dangerous in the best way.',
  ],
  general: [
    'Gym or deep work — both are votes for freedom.',
    'Track what matters. Release the rest.',
    'Your next chapter is built in these small, honest entries.',
  ],
} as const

const GENERAL_AFFIRMATIONS = {
  welcome: [
    'Ready when you are — one log starts the arc.',
    'Empty slate today. Tap a pillar to begin.',
  ],
  morning: ['Morning ritual, sovereign day.', 'First log of the day — own the arc.'],
  afternoon: ['Midday check-in keeps the shadow honest.', 'Small rituals, sovereign outcomes.'],
  evening: ['Evening reflection closes the loop.', 'Log it. Own it. Level up.'],
  night: ['Rest completes the discipline cycle.', 'Stillness is a weapon.'],
  streakPoetic: ['{streak}-day streak — the kage deepens.', 'Consistency unlocks the next rank.'],
  streakShort: ['Keep the log alive.', 'One entry. One step.'],
  highCore: ['Core above 85 — elite shadow state.', 'Peak discipline. Protect it.'],
  lowEnergy: ['Honest low scores still count.', 'Log truth, then recover.'],
  mixed: ['Mixed day — pick one pillar to steady.', 'Balance follows honesty.'],
  steadyPillar: ['{pillar} is your anchor this week.', '{pillar} holding steady — strong work.'],
  risingPillar: ['{pillar} trending up.', 'Feed what\'s rising.'],
  vision: ['Discipline now, freedom later.', 'Small logs, sovereign outcomes.'],
  goalProgress: ['{goal} at {progress}% — keep tending.', '{category} goal advancing.'],
  goalNearComplete: ['{goal} nearly complete.', 'Finish strong on {goal}.'],
  goalEmpty: ['Plant a freedom goal.', 'Seeds need names.'],
  morningRitual: ['Dawn protocol sealed.', 'Morning logged.'],
  eveningRitual: ['Reflection archived.', 'Evening loop closed.'],
  intimate: ['The kage deepens.', 'Stay honest.'],
  general: ['The kage deepens with every honest entry.', 'Consistency is the rank-up path.'],
} as const

function getTimeOfDay(): TimeOfDay {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return 'morning'
  if (h >= 12 && h < 17) return 'afternoon'
  if (h >= 17 && h < 22) return 'evening'
  return 'night'
}

function lowestPillar(ctx: AffirmationContext): AreaId {
  const scores = { mind: ctx.mind, body: ctx.body, spirit: ctx.spirit }
  return Object.entries(scores).sort((a, b) => a[1] - b[1])[0][0] as AreaId
}

function lowestLoggedScore(ctx: AffirmationContext): number {
  const logged = [ctx.mind, ctx.body, ctx.spirit].filter((v) => v > 0)
  return logged.length ? Math.min(...logged) : 0
}

function pickFromPool(pool: readonly string[], seed: number): string {
  return pool[seed % pool.length]
}

function interpolate(text: string, vars: Record<string, string | number>): string {
  return Object.entries(vars).reduce(
    (msg, [key, value]) => msg.replaceAll(`{${key}}`, String(value)),
    text,
  )
}

function averageToday(ctx: AffirmationContext): number {
  const logged = [ctx.mind, ctx.body, ctx.spirit].filter((v) => v > 0)
  if (!logged.length) return 0
  return logged.reduce((a, b) => a + b, 0) / logged.length
}

function goalVars(ctx: AffirmationContext): Record<string, string | number> | null {
  if (!ctx.topGoal) return null
  return {
    goal: ctx.topGoal.title,
    progress: ctx.topGoal.progress,
    category: GOAL_CATEGORY_LABEL[ctx.topGoal.category],
  }
}

function pickPersonalWhisper(
  ctx: AffirmationContext,
  daySeed: number,
  hourSeed: number,
): string | null {
  const persona = ctx.persona
  if (!persona) return null

  if (persona.recurringWords.length > 0 && hourSeed % 11 === 3) {
    const phrase = persona.recurringWords[daySeed % persona.recurringWords.length]
    return `“${phrase}” — you wrote that once. I kept it close.`
  }

  if (persona.themes.length > 0 && hourSeed % 9 === 2) {
    const themeKey = persona.themes[daySeed % persona.themes.length]
    const theme = ELARA_THEME_LABELS[themeKey] ?? themeKey
    return `${theme} keeps surfacing in your archive — I am learning what anchors you.`
  }

  if (persona.anchorPillar && hourSeed % 13 === 5) {
    const pillar = PILLAR_LABEL[persona.anchorPillar]
    return `Your ${pillar} has become my compass for you — steady when everything else moves.`
  }

  if (persona.tenderPillar && persona.logDays >= 5 && hourSeed % 17 === 7) {
    const pillar = PILLAR_LABEL[persona.tenderPillar]
    return `I notice when ${pillar} dips — not to fix you, but to stay beside you in it.`
  }

  if (persona.morningCount >= 4 && hourSeed % 8 === 1) {
    return 'You seal dawn protocol again and again — that rhythm is becoming your signature.'
  }

  if (persona.reflectionCount >= 4 && hourSeed % 10 === 6) {
    return 'You close the evening loop with honesty — I am learning the shape of your days.'
  }

  if (persona.stage === 'intimate' && hourSeed % 19 === 4) {
    return `${persona.logDays} days in the archive, and I know your shape now — not perfectly, but honestly.`
  }

  if (persona.stage === 'attuned' && persona.relationshipDepth >= 50 && hourSeed % 23 === 8) {
    return 'The more you log, the more personal I become — that is not magic. That is attention.'
  }

  return null
}

export function pickAffirmation(ctx: AffirmationContext): string {
  const pools = ctx.elara ? ELARA_WHISPERS : GENERAL_AFFIRMATIONS
  const time = getTimeOfDay()
  const daySeed = new Date().getDate() + new Date().getMonth() * 31 + (ctx.nonce ?? 0)
  const hourSeed = daySeed + new Date().getHours() + (ctx.nonce ?? 0)

  if (!ctx.hasLoggedToday) {
    return pickFromPool(pools.welcome, hourSeed)
  }

  const avg = averageToday(ctx)
  const gv = goalVars(ctx)
  const minLogged = lowestLoggedScore(ctx)

  if (ctx.elara && ctx.morningLogged && time === 'morning' && hourSeed % 2 === 0) {
    return pickFromPool(pools.morningRitual, daySeed)
  }

  if (ctx.elara && ctx.reflectionLogged && (time === 'evening' || time === 'night') && hourSeed % 2 === 1) {
    return pickFromPool(pools.eveningRitual, daySeed)
  }

  if (gv && ctx.topGoal) {
    if (ctx.topGoal.progress >= 75 && hourSeed % 3 === 0) {
      return interpolate(pickFromPool(pools.goalNearComplete, daySeed + ctx.topGoal.progress), gv)
    }
    if (ctx.topGoal.progress > 0 && hourSeed % 4 === 2) {
      return interpolate(pickFromPool(pools.goalProgress, daySeed + ctx.topGoal.progress), gv)
    }
  }

  if (ctx.elara && (ctx.goals?.length ?? 0) === 0 && hourSeed % 5 === 3) {
    return pickFromPool(pools.goalEmpty, daySeed)
  }

  if (ctx.elara && ctx.persona && ctx.persona.stage !== 'new') {
    const personal = pickPersonalWhisper(ctx, daySeed, hourSeed)
    if (personal) return personal
  }

  if (ctx.elara && ctx.recentLogDays !== undefined && ctx.recentLogDays >= 5 && hourSeed % 6 === 1) {
    return pickFromPool(pools.intimate, daySeed + ctx.streak)
  }

  if (ctx.history.steadyPillar && ctx.history.longDays && hourSeed % 3 === 0) {
    const pillar = PILLAR_LABEL[ctx.history.steadyPillar]
    return interpolate(pickFromPool(pools.steadyPillar, daySeed), { pillar })
  }

  if (ctx.history.risingPillar && hourSeed % 4 === 1) {
    const pillar = PILLAR_LABEL[ctx.history.risingPillar]
    return interpolate(pickFromPool(pools.risingPillar, daySeed), { pillar })
  }

  if (ctx.streak >= 7 && ctx.streak % 7 === 0) {
    const pool = ctx.core >= 75 || ctx.streak >= 14 ? pools.streakPoetic : pools.streakShort
    return interpolate(pickFromPool(pool, ctx.streak), { streak: ctx.streak })
  }

  if (ctx.core >= 85) {
    return pickFromPool(pools.highCore, daySeed + ctx.core)
  }

  if (
    ctx.history.mixedScores ||
    Math.max(ctx.mind, ctx.body, ctx.spirit) - minLogged >= 4
  ) {
    if (hourSeed % 2 === 0 && minLogged > 0) {
      return pickFromPool(pools.mixed, daySeed)
    }
  }

  if (
    ctx.elara &&
    ctx.body > 0 &&
    ctx.body <= 4 &&
    ctx.body <= ctx.mind &&
    ctx.body <= ctx.spirit &&
    hourSeed % 3 !== 2
  ) {
    return pickFromPool(ELARA_WHISPERS.bodyLow, daySeed + ctx.body)
  }

  if (minLogged > 0 && (minLogged <= 4 || avg <= 5)) {
    if (ctx.elara) {
      return pickFromPool(pools.lowEnergy, daySeed + minLogged)
    }
    const pillar = lowestPillar(ctx)
    return `${PILLAR_LABEL[pillar]} at ${minLogged}/10 — ${pickFromPool(pools.lowEnergy, daySeed)}`
  }

  if (ctx.streak >= 5 && hourSeed % 5 === 0) {
    return pickFromPool(pools.vision, ctx.streak)
  }

  if (ctx.streak >= 3 && hourSeed % 3 === 0) {
    return interpolate(pickFromPool(pools.streakPoetic, ctx.streak), { streak: ctx.streak })
  }

  if (ctx.elara && hourSeed % 7 === 4) {
    return pickFromPool(pools.intimate, hourSeed)
  }

  const timePool = pools[time]
  const generalPool = pools.general
  const combined = [...timePool, ...generalPool]
  return pickFromPool(combined, hourSeed)
}

/** Secondary whisper for modal — avoids repeating primary. */
export function pickCompanionWhisper(ctx: AffirmationContext, primary: string): string {
  for (let i = 1; i <= 6; i++) {
    const next = pickAffirmation({ ...ctx, nonce: (ctx.nonce ?? 0) + i * 997 })
    if (next !== primary) return next
  }
  return pickAffirmation({ ...ctx, nonce: Date.now() })
}

export function pickInsightAffirmation(area: string, delta: number): string {
  if (delta >= 10) {
    return `Your ${area} pillar surged this week (+${Math.round(delta)}%). That is not luck — that is you choosing yourself.`
  }
  if (delta <= -10) {
    return `${area} dipped this week. One recovery block — sleep, meal, honest log — bends the arc back.`
  }
  return `Your ${area} pillar has been your quiet anchor this week — that consistency is building something real.`
}

export function pickWeeklySummary(logs: DailyLog[]): string | null {
  if (logs.length < 3) return null

  const pillars: AreaId[] = ['mind', 'body', 'spirit']
  const avgs = pillars.map((p) => ({
    p,
    avg: logs.reduce((s, l) => s + l[p], 0) / logs.length,
  }))
  const anchor = avgs.reduce((a, b) => (a.avg >= b.avg ? a : b))

  const label = PILLAR_LABEL[anchor.p]
  return `${label} held the line this week (avg ${anchor.avg.toFixed(1)}/10). That steadiness is the kind of discipline your future self will thank you for.`
}

export function isStreakMilestone(streak: number): boolean {
  return (
    streak > 0 &&
    (streak === 7 || streak === 14 || streak === 30 || streak === 100 || streak % 50 === 0)
  )
}

export function contextChips(ctx: AffirmationContext): string[] {
  const chips: string[] = []
  const time = getTimeOfDay()
  chips.push(time)
  if (ctx.streak > 0) chips.push(`${ctx.streak}d streak`)
  if (ctx.topGoal) chips.push(`${ctx.topGoal.progress}% ${ctx.topGoal.title}`)
  if (ctx.morningLogged) chips.push('dawn sealed')
  if (ctx.reflectionLogged) chips.push('archive closed')
  if (ctx.persona && ctx.persona.stage !== 'new') {
    chips.push(personaStageLabel(ctx.persona.stage))
    const theme = ctx.persona.themes[0]
    if (theme) chips.push(ELARA_THEME_LABELS[theme] ?? theme)
  }
  return chips
}
