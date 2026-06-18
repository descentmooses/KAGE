export function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

export function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

export function lastNDays(n: number): string[] {
  return Array.from({ length: n }, (_, i) => daysAgo(n - 1 - i))
}

export function formatShortDate(dateKey: string): string {
  const d = new Date(dateKey + 'T12:00:00')
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}

export function isSameWeek(a: string, b: string): boolean {
  const da = new Date(a + 'T12:00:00')
  const db = new Date(b + 'T12:00:00')
  const startA = new Date(da)
  startA.setDate(da.getDate() - da.getDay())
  const startB = new Date(db)
  startB.setDate(db.getDate() - db.getDay())
  return startA.toISOString().slice(0, 10) === startB.toISOString().slice(0, 10)
}

export function isSameMonth(a: string, b: string): boolean {
  return a.slice(0, 7) === b.slice(0, 7)
}
