import { daysBetween, parseISODate, toISODate } from './dates'

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTHS_LONG = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

/** 740 → "₹740" */
export function formatCurrency(amount: number): string {
  return inr.format(amount)
}

/** 169 → "2h 49m" */
export function formatDuration(minutes: number | null): string {
  if (minutes == null) return 'Runtime TBA'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (!h) return `${m}m`
  return m ? `${h}h ${m}m` : `${h}h`
}

/** "19:30" → "7:30 PM" */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${suffix}`
}

/** "2026-10-07" → "7 Oct" */
export function formatDateShort(iso: string): string {
  const d = parseISODate(iso)
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`
}

/** "2026-12-18" → "18 Dec 2026" */
export function formatDateMedium(iso: string): string {
  const d = parseISODate(iso)
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`
}

/** "2026-10-05" → "5 October 2026" */
export function formatDateLong(iso: string): string {
  const d = parseISODate(iso)
  return `${d.getDate()} ${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`
}

/** "2026-10-05" → "Mon" */
export function formatWeekday(iso: string): string {
  return WEEKDAYS_SHORT[parseISODate(iso).getDay()]
}

/** "Today", "Tomorrow" or "Wed, 7 Oct" */
export function formatRelativeDay(iso: string, today = new Date()): string {
  const diff = daysBetween(toISODate(today), iso)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  return `${formatWeekday(iso)}, ${formatDateShort(iso)}`
}

export function formatGenres(genres: readonly string[], limit = genres.length): string {
  return genres.slice(0, limit).join(' • ')
}

/** ["English", "Hindi"] → "English, Hindi"; longer lists → "Telugu +4" */
export function formatLanguages(languages: readonly string[]): string {
  if (languages.length <= 2) return languages.join(', ')
  return `${languages[0]} +${languages.length - 1}`
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`
}
