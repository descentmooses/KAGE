const ELARA_WHISPERS = [
  'Consistency compounds — your future family feels every rep.',
  'The shadow grows where discipline meets rest. Sleep is wealth.',
  'One clean dash, one honest log. Mastery in the margins.',
  'Planet Fitness or patent work — both are votes for freedom.',
  'Elara sees the streak. Keep the flame low and steady.',
  'Tesla miles, life miles — track what matters, release the rest.',
  'Gratitude is armor. Call home when the shift ends.',
  'High intensity today, high optionality tomorrow.',
  'Your LLC is a seed. Water it with focused mornings.',
  'The gig is temporary. The operator you are becoming is not.',
]

const GENERAL_AFFIRMATIONS = [
  'Shadow mastery is built in seconds, not speeches.',
  'Log it. Own it. Level up.',
  'Small rituals, sovereign outcomes.',
  'The kage deepens with every honest entry.',
  'Stillness is a weapon. Use it between dashes.',
]

export function pickAffirmation(elara: boolean): string {
  const pool = elara ? ELARA_WHISPERS : GENERAL_AFFIRMATIONS
  const dayIndex = new Date().getDate() % pool.length
  return pool[dayIndex]
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
