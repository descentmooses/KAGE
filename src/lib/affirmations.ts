export interface AffirmationContext {
  elara: boolean
  mind: number
  body: number
  spirit: number
  core: number
  streak: number
}

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night'

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
  streak: [
    'Elara sees the streak. Keep the flame low and steady.',
    'Consistency compounds — your future family feels every rep.',
    '{streak} days of shadow discipline. The kage deepens.',
  ],
  highCore: [
    'Core burning bright tonight. Channel it — don\'t waste the edge.',
    'You are operating at peak shadow. Protect this state.',
  ],
  lowPillar: [
    'One pillar wavers — a single focused block restores balance.',
    'The weakest link shows where tomorrow\'s victory lives.',
  ],
  general: [
    'Planet Fitness or patent work — both are votes for freedom.',
    'Tesla miles, life miles — track what matters, release the rest.',
    'Your LLC is a seed. Water it with focused mornings.',
  ],
} as const

const GENERAL_AFFIRMATIONS = {
  morning: [
    'Morning ritual, sovereign day.',
    'First log of the day — own the arc.',
  ],
  afternoon: [
    'Midday check-in keeps the shadow honest.',
    'Small rituals, sovereign outcomes.',
  ],
  evening: [
    'Evening reflection closes the loop.',
    'Log it. Own it. Level up.',
  ],
  night: [
    'Rest completes the discipline cycle.',
    'Stillness is a weapon. Use it between dashes.',
  ],
  streak: [
    '{streak}-day streak — the kage deepens.',
    'Shadow mastery is built in seconds, not speeches.',
  ],
  highCore: [
    'Core above 85 — elite shadow state.',
    'Peak discipline. Protect it.',
  ],
  lowPillar: [
    'One weak pillar — one honest adjustment.',
    'Balance the three. The core follows.',
  ],
  general: [
    'The kage deepens with every honest entry.',
    'Consistency is the rank-up path.',
  ],
} as const

function getTimeOfDay(): TimeOfDay {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return 'morning'
  if (h >= 12 && h < 17) return 'afternoon'
  if (h >= 17 && h < 22) return 'evening'
  return 'night'
}

function lowestPillar(ctx: AffirmationContext): 'mind' | 'body' | 'spirit' {
  const scores = { mind: ctx.mind, body: ctx.body, spirit: ctx.spirit }
  return (Object.entries(scores).sort((a, b) => a[1] - b[1])[0][0]) as
    | 'mind'
    | 'body'
    | 'spirit'
}

function pickFromPool(pool: readonly string[], seed: number): string {
  return pool[seed % pool.length]
}

function interpolate(text: string, streak: number): string {
  return text.replace('{streak}', String(streak))
}

export function pickAffirmation(ctx: AffirmationContext): string {
  const pools = ctx.elara ? ELARA_WHISPERS : GENERAL_AFFIRMATIONS
  const time = getTimeOfDay()
  const daySeed = new Date().getDate() + new Date().getMonth() * 31

  if (ctx.streak >= 7 && ctx.streak % 7 === 0) {
    const msg = pickFromPool(pools.streak, daySeed)
    return interpolate(msg, ctx.streak)
  }

  if (ctx.core >= 85) {
    return pickFromPool(pools.highCore, daySeed + ctx.core)
  }

  const min = Math.min(ctx.mind, ctx.body, ctx.spirit)
  if (min <= 4) {
    const pillar = lowestPillar(ctx)
    const base = pickFromPool(pools.lowPillar, daySeed + min)
    return `${pillar.charAt(0).toUpperCase() + pillar.slice(1)} at ${min}/10 — ${base}`
  }

  if (ctx.streak >= 3) {
    const roll = (daySeed + ctx.streak) % 3
    if (roll === 0) {
      const msg = pickFromPool(pools.streak, ctx.streak)
      return interpolate(msg, ctx.streak)
    }
  }

  const timePool = pools[time]
  const generalPool = pools.general
  const combined = [...timePool, ...generalPool]
  return pickFromPool(combined, daySeed + new Date().getHours())
}

export function pickInsightAffirmation(area: string, delta: number): string {
  if (delta >= 10) {
    return `${area} up ${Math.round(delta)}% this week — strong work. The shadow approves.`
  }
  if (delta <= -10) {
    return `${area} dipped this week. One recovery block changes the arc.`
  }
  return `${area} holding steady. Consistency is the rank-up path.`
}

export function isStreakMilestone(streak: number): boolean {
  return streak > 0 && (streak === 7 || streak === 14 || streak === 30 || streak === 100 || streak % 50 === 0)
}
