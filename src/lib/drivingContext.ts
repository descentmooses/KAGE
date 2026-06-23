import type { DailyLog, MorningLogEntry, ReflectionEntry } from '../types'

/** Matches driving / commute themes in free-text logs. */
const DRIVING_PATTERN =
  /\b(driv(e|ing|er)?|dash|gig|road|mile|miles|tesla|autopilot|uber|lyft|commute|truck|delivery|passenger)\b/i

function collectLogTexts(
  logs: DailyLog[],
  morningToday: MorningLogEntry | null,
  reflectionToday: ReflectionEntry | null,
): string[] {
  const texts: string[] = []
  for (const log of logs) {
    if (log.notes?.trim()) texts.push(log.notes)
  }
  if (morningToday?.intention?.trim()) texts.push(morningToday.intention)
  if (morningToday?.discipline?.trim()) texts.push(morningToday.discipline)
  if (reflectionToday?.journal?.trim()) texts.push(reflectionToday.journal)
  return texts
}

/** True when the user has mentioned driving-related themes in their logs. */
export function userMentionsDriving(
  logs: DailyLog[],
  morningToday: MorningLogEntry | null,
  reflectionToday: ReflectionEntry | null,
): boolean {
  return collectLogTexts(logs, morningToday, reflectionToday).some((text) =>
    DRIVING_PATTERN.test(text),
  )
}
