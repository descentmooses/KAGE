import type { AreaId, DailyLog } from '../types'
import type { PillarHistory } from './pillarHistory'

export interface AffirmationContext {
  elara: boolean
  mind: number
  body: number
  spirit: number
  core: number
  streak: number
  history: PillarHistory
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
  ],
  afternoon: [
    'Mid-shift stillness — breathe once, log once, return sharper.',
    'The gig is temporary. The operator you are becoming is not.',
    'One clean dash, one honest log. Mastery in the margins.',
  ],
  evening: [
    'Shift ending soon. Gratitude is armor — call home when you park.',
    'Reflect without performance. The shadow knows when you lie to yourself.',
    'High intensity today, high optionality tomorrow.',
  ],
  night: [
    'Rest is wealth. Sleep deep — your future family feels every rep.',
    'The shadow grows where discipline meets rest. Close the day with honor.',
    'Stillness is a weapon. Use it before tomorrow\'s first mile.',
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
    (msg, [key, value]) => msg.replace(`{${key}}`, String(value)),
    text,
  )
}

function averageToday(ctx: AffirmationContext): number {
  return (ctx.mind + ctx.body + ctx.spirit) / 3
}

export function pickAffirmation(ctx: AffirmationContext): string {
  const pools = ctx.elara ? ELARA_WHISPERS : GENERAL_AFFIRMATIONS
  const time = getTimeOfDay()
  const daySeed = new Date().getDate() + new Date().getMonth() * 31
  const hourSeed = daySeed + new Date().getHours()
  const avg = averageToday(ctx)

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

  if (ctx.history.mixedScores || (Math.max(ctx.mind, ctx.body, ctx.spirit) - Math.min(ctx.mind, ctx.body, ctx.spirit) >= 4)) {
    if (hourSeed % 2 === 0) {
      return pickFromPool(pools.mixed, daySeed)
    }
  }

  const min = Math.min(ctx.mind, ctx.body, ctx.spirit)
  if (min <= 4 || avg <= 5) {
    if (ctx.elara) {
      const base = pickFromPool(pools.lowEnergy, daySeed + min)
      return base
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

  const timePool = pools[time]
  const generalPool = pools.general
  const combined = [...timePool, ...generalPool]
  return pickFromPool(combined, hourSeed)
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
