// All dates are handled as local calendar days in ISO form (yyyy-mm-dd).
// toISOString() is avoided on purpose: it converts to UTC and shifts the
// day for users east of Greenwich (IST is UTC+5:30).

export function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function daysBetween(fromISO: string, toISO: string): number {
  const ms = parseISODate(toISO).getTime() - parseISODate(fromISO).getTime()
  return Math.round(ms / 86_400_000)
}

/** Cinema weekends run Friday to Sunday */
export function isWeekend(iso: string): boolean {
  const day = parseISODate(iso).getDay()
  return day === 0 || day === 5 || day === 6
}
