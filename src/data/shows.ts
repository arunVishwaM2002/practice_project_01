import type { Movie, MovieFormat, Show, ShowAvailability, Theatre } from '@/types'
import { isWeekend } from '@/lib/dates'
import { hashString, seededRandom } from '@/lib/random'

/** Daily show slots, 24h */
export const SHOWTIMES = ['10:00', '13:30', '16:45', '19:30', '22:15'] as const

/** How many days ahead tickets can be booked, including today */
export const BOOKING_WINDOW_DAYS = 5

/** Used when /seat-selection is opened without a show */
export const DEFAULT_SHOW = {
  movieId: 'interstellar',
  theatreId: 'pvr-orion-mall',
  time: '19:30',
} as const

const FORMAT_SURCHARGE: Record<MovieFormat, number> = {
  '2D': 0,
  '3D': 60,
  'IMAX 2D': 200,
  'IMAX 3D': 250,
  '4DX': 300,
}

const MATINEE_DISCOUNT = 50

export function buildShowId(movieId: string, theatreId: string, date: string, time: string): string {
  return [movieId, theatreId, date, time.replace(':', '')].join('~')
}

export function parseShowId(id: string) {
  const [movieId, theatreId, date, hhmm] = id.split('~')
  if (!movieId || !theatreId || !/^\d{4}-\d{2}-\d{2}$/.test(date ?? '') || !/^\d{4}$/.test(hhmm ?? '')) {
    return null
  }
  return { movieId, theatreId, date, time: `${hhmm.slice(0, 2)}:${hhmm.slice(2)}` }
}

function pickFormat(movie: Movie, theatre: Theatre, slot: number): MovieFormat {
  const isEvening = slot >= 2
  if (isEvening && theatre.amenities.includes('IMAX')) {
    const imax = movie.formats.find((f) => f.startsWith('IMAX'))
    if (imax) return imax
  }
  if (slot === 2 && theatre.amenities.includes('4DX') && movie.formats.includes('4DX')) return '4DX'
  return movie.formats[0]
}

function pickAvailability(showId: string, date: string, slot: number): ShowAvailability {
  const roll = seededRandom(hashString(showId))()
  const demand = roll + (slot >= 3 ? 0.25 : 0) + (isWeekend(date) ? 0.15 : 0)
  if (demand > 1.05) return 'almost_full'
  if (demand > 0.72) return 'filling_fast'
  return 'available'
}

/**
 * Mock schedule for one movie at one theatre on one day. Each pairing runs
 * on a fixed screen and occasionally skips a daytime slot, so listings vary
 * the way real cinemas do.
 */
export function generateShows(
  movie: Movie,
  theatre: Theatre,
  date: string,
  movieIndex: number,
  theatreIndex: number,
): Show[] {
  const seed = hashString(`${movie.id}|${theatre.id}`)
  const skippedSlot = seed % 3 === 0 ? [0, 1, 4][(seed >>> 4) % 3] : -1
  const screen = `Screen ${((movieIndex + theatreIndex * 3 + 2) % theatre.screens) + 1}`

  return SHOWTIMES.flatMap((time, slot) => {
    if (slot === skippedSlot) return []
    const id = buildShowId(movie.id, theatre.id, date, time)
    const format = pickFormat(movie, theatre, slot)
    const language = slot === 1 && movie.languages.length > 1 ? movie.languages[1] : movie.languages[0]
    const price = theatre.basePrice + FORMAT_SURCHARGE[format] - (slot < 2 ? MATINEE_DISCOUNT : 0)
    return [
      {
        id,
        movieId: movie.id,
        theatreId: theatre.id,
        date,
        time,
        screen,
        format,
        language,
        price,
        availability: pickAvailability(id, date, slot),
      },
    ]
  })
}
