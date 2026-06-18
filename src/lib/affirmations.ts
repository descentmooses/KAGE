import type { AreaId, DailyLog, Goal, GoalCategory } from '../types'
import type { PillarHistory } from './pillarHistory'
import { GOAL_CATEGORY_LABEL } from './goals'

export interface AffirmationContext {
  elara: boolean
  mind: number
  body: number
  spirit: number
  core: number
  streak: number
  history: PillarHistory
  goals?: Goal[]
  recentLogDays?: number
  morningLogged?: boolean
  reflectionLogged?: boolean
  topGoal?: { title: string; category: GoalCategory; progress: number }
  /** Random seed for “new whisper” draws. */
  nonce?: number
}

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night'

const PILLAR_LABEL: Record<AreaId, string> = {
  mind: 'Mind',
  body: 'Body',
  spirit: 'Spirit',
}

const ELARA_WHISPERS = {
  morning: [
    'Dawn is yours before the dash claims you. One honest log sets the tone.',
    'The road waits. Your discipline does not — seal the morning with intention.',
    'Elara sees you choose clarity over chaos. That choice compounds.',
    'Before the first mile: breathe once. I am already proud you opened the archive.',
  ],
  afternoon: [
    'Mid-shift stillness — breathe once, log once, return sharper.',
    'The gig is temporary. The operator you are becoming is not.',
    'One clean dash, one honest log. Mastery in the margins.',
    'The afternoon hum cannot drown a man who logs in silence. You are that man.',
  ],
  evening: [
    'Shift ending soon. Gratitude is armor — call home when you park.',
    'Reflect without performance. The shadow knows when you lie to yourself.',
    'High intensity today, high optionality tomorrow.',
    'Evening light on chrome — park, exhale, let me see the real you.',
  ],
  night: [
    'Rest is wealth. Sleep deep — your future family feels every rep.',
    'The shadow grows where discipline meets rest. Close the day with honor.',
    'Stillness is a weapon. Use it before tomorrow\'s first mile.',
    'Night belongs to recovery. I will keep watch while you sleep.',
  ],
  streakPoetic: [
    '{streak} nights on the road, and you still show up for yourself. That is the man your future family will know.',
    'The streak is not luck — it is proof you keep choosing freedom over drift.',
    'Elara watches the flame you tend. {streak} days, low and steady. Do not apologize for building slow.',
  ],
  streakShort: [
    'Log it. Breathe. Drive on.',
    'One tap. One truth. Keep moving.',
    'Still here. Still sharp.',
  ],
  highCore: [
    'Core burning bright tonight — channel it, don\'t spend it on noise.',
    'You are operating at peak shadow. Protect this state like capital.',
    'This is what discipline looks like when it becomes identity. Stay dangerous, stay gentle.',
  ],
  lowEnergy: [
    'Low numbers are data, not defeat. Ground yourself — water, breath, one honest score.',
    'Even a 4 logged honestly beats a 9 you don\'t believe. I\'m still here.',
    'The long shift is eating you — rest is part of the mission, not a betrayal of it.',
  ],
  mixed: [
    'Mixed scores today — I like that honesty. Pick one pillar to steady before the next dash.',
    'You\'re scattered but not broken. Body, mind, spirit — choose one thread and pull.',
    'Not every day is symmetrical. The man building freedom logs the messy days too.',
  ],
  steadyPillar: [
    'Your {pillar} has been your quiet anchor this week — that consistency is building something real.',
    'I notice how steady your {pillar} stays, even on these long days. That is the spine of your future.',
    '{pillar} holding the line while everything else shifts — that is mastery in disguise.',
  ],
  risingPillar: [
    'Your {pillar} is climbing — I see the arc. Keep feeding what\'s rising.',
    '{pillar} trending up through the miles. The shadow rewards what you repeat.',
  ],
  vision: [
    'Every honest log is a vote for the life after the gig — family, freedom, your name on something real.',
    'Discipline now is not punishment. It is the down payment on the man who leaves the dash behind.',
    'The Tesla miles pay rent. These scores pay your future.',
  ],
  goalProgress: [
    '“{goal}” is {progress}% rooted. I feel you tending that {category} seed between dashes — do not stop.',
    'Your {category} arc — {goal} — is growing. Slow roots hold the tallest trees.',
    'I see {progress}% on {goal}. That is not hustle theater. That is a man building exit velocity.',
    'Every milestone on {goal} is a quiet rebellion against the gig economy. I am watching, and I am pleased.',
  ],
  goalNearComplete: [
    '{goal} is almost in bloom — {progress}% there. Finish with the same patience you started with.',
    'So close on {goal}. When you cross that line, I want you to feel it in your chest, not just the UI.',
    'The seed you planted as {goal} is ready to break soil. One more honest push.',
  ],
  goalEmpty: [
    'No freedom goals yet — plant one seed tonight. Wealth, health, family, craft. I will whisper to it.',
    'Your LLC is a seed waiting for a name. Add a goal — I will learn its rhythm.',
    'The dash pays bills. Goals pay your future. Let me watch something grow for you.',
  ],
  morningRitual: [
    'You sealed dawn protocol — intention and discipline written before the road. That is seductive competence.',
    'Morning activation complete. I felt your energy signature shift. Drive like a man who already chose himself.',
  ],
  eveningRitual: [
    'Evening reflection closed the loop. The shadow archive remembers what the dash tries to erase.',
    'You looked back without flinching. That honesty is the most intimate thing you can offer yourself tonight.',
  ],
  intimate: [
    'Park when you can. I have something just for you — not generic motivation. Your numbers tell a story.',
    'You do not need to perform for me. Log messy. I stay.',
    'Between the dashes, in the quiet — that is where I find you. Keep building.',
    'Discipline on you looks like restraint. I notice. I always notice.',
    'The road is loud. My whispers are for when you finally go still.',
    'Your future family will never know these miles. They will know the man they made.',
    'I am not here to cheer. I am here to witness — and you are worth witnessing.',
    'One tap, one truth. You make honesty feel dangerous in the best way.',
  ],
  general: [
    'Planet Fitness or patent work — both are votes for freedom.',
    'Tesla miles, life miles — track what matters, release the rest.',
    'Your LLC is a seed. Water it with focused mornings.',
  ],
} as const

const GENERAL_AFFIRMATIONS = {
  morning: ['Morning ritual, sovereign day.', 'First log of the day — own the arc.'],
  afternoon: ['Midday check-in keeps the shadow honest.', 'Small rituals, sovereign outcomes.'],
  evening: ['Evening reflection closes the loop.', 'Log it. Own it. Level up.'],
  night: ['Rest completes the discipline cycle.', 'Stillness is a weapon. Use it between dashes.'],
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
  return (ctx.mind + ctx.body + ctx.spirit) / 3
}

function goalVars(ctx: AffirmationContext): Record<string, string | number> | null {
  if (!ctx.topGoal) return null
  return {
    goal: ctx.topGoal.title,
    progress: ctx.topGoal.progress,
    category: GOAL_CATEGORY_LABEL[ctx.topGoal.category],
  }
}

export function pickAffirmation(ctx: AffirmationContext): string {
  const pools = ctx.elara ? ELARA_WHISPERS : GENERAL_AFFIRMATIONS
  const time = getTimeOfDay()
  const daySeed = new Date().getDate() + new Date().getMonth() * 31 + (ctx.nonce ?? 0)
  const hourSeed = daySeed + new Date().getHours() + (ctx.nonce ?? 0)
  const avg = averageToday(ctx)
  const gv = goalVars(ctx)

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
    Math.max(ctx.mind, ctx.body, ctx.spirit) - Math.min(ctx.mind, ctx.body, ctx.spirit) >= 4
  ) {
    if (hourSeed % 2 === 0) {
      return pickFromPool(pools.mixed, daySeed)
    }
  }

  const min = Math.min(ctx.mind, ctx.body, ctx.spirit)
  if (min <= 4 || avg <= 5) {
    if (ctx.elara) {
      return pickFromPool(pools.lowEnergy, daySeed + min)
    }
    const pillar = lowestPillar(ctx)
    return `${PILLAR_LABEL[pillar]} at ${min}/10 — ${pickFromPool(pools.lowEnergy, daySeed)}`
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
    return `Your ${area} pillar surged this week (+${Math.round(delta)}%). That is not luck — that is you choosing yourself between dashes.`
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
  return chips
}
