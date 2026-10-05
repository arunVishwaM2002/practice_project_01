// The single data-access seam for the UI. Phase 1 reads local mock data;
// Phase 2 swaps these bodies for FastAPI calls without touching components.

import type { City, GenreCategory, Movie, Offer, SeatLayout, Show, ShowDate, Theatre } from '@/types'
import { cities } from '@/data/cities'
import { genreCategories } from '@/data/genres'
import { movies } from '@/data/movies'
import { offers } from '@/data/offers'
import { generateSeatLayout } from '@/data/seats'
import { BOOKING_WINDOW_DAYS, DEFAULT_SHOW, buildShowId, generateShows, parseShowId } from '@/data/shows'
import { theatres } from '@/data/theatres'
import { addDays, toISODate } from '@/lib/dates'
import { formatDateShort, formatWeekday } from '@/lib/format'

const nowShowing = movies.filter((m) => m.status === 'now_showing')
const comingSoon = movies
  .filter((m) => m.status === 'coming_soon')
  .sort((a, b) => a.releaseDate.localeCompare(b.releaseDate))

// ── Movies ─────────────────────────────────────────────────────

export function getNowShowing(): Movie[] {
  return nowShowing
}

export function getComingSoon(): Movie[] {
  return comingSoon
}

export function getMovie(id: string): Movie | undefined {
  return movies.find((m) => m.id === id)
}

export function getGenreCategories(): (GenreCategory & { movieCount: number })[] {
  return genreCategories.map((g) => ({
    ...g,
    movieCount: nowShowing.filter((m) => m.genres.includes(g.name)).length,
  }))
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export function movieMatchesQuery(movie: Movie, query: string): boolean {
  const q = normalize(query)
  if (!q) return true
  const fields = [movie.title, movie.director, ...movie.genres, ...movie.languages, ...movie.cast.map((c) => c.name)]
  return fields.some((field) => normalize(field).includes(q))
}

// ── Places ─────────────────────────────────────────────────────

export function getCities(): City[] {
  return cities
}

export function getCity(id: string): City | undefined {
  return cities.find((c) => c.id === id)
}

export function getTheatres(cityId: string): Theatre[] {
  return theatres.filter((t) => t.cityId === cityId).sort((a, b) => a.distanceKm - b.distanceKm)
}

export function getTheatre(id: string): Theatre | undefined {
  return theatres.find((t) => t.id === id)
}

// ── Offers ─────────────────────────────────────────────────────

export function getOffers(limit?: number): Offer[] {
  return limit ? offers.slice(0, limit) : offers
}

// ── Shows & seats ──────────────────────────────────────────────

export function getShowDates(today = new Date()): ShowDate[] {
  return Array.from({ length: BOOKING_WINDOW_DAYS }, (_, i) => {
    const date = toISODate(addDays(today, i))
    const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : formatDateShort(date)
    return { date, weekday: formatWeekday(date), label }
  })
}

function showsFor(movie: Movie, theatre: Theatre, date: string): Show[] {
  return generateShows(movie, theatre, date, nowShowing.indexOf(movie), theatres.indexOf(theatre))
}

export function getShowtimesForMovie(
  movieId: string,
  cityId: string,
  date: string,
): { theatre: Theatre; shows: Show[] }[] {
  const movie = nowShowing.find((m) => m.id === movieId)
  if (!movie) return []
  return getTheatres(cityId).map((theatre) => ({ theatre, shows: showsFor(movie, theatre, date) }))
}

export function getShowsAtTheatre(movieId: string, theatreId: string, date: string): Show[] {
  const movie = nowShowing.find((m) => m.id === movieId)
  const theatre = getTheatre(theatreId)
  return movie && theatre ? showsFor(movie, theatre, date) : []
}

export function getShow(id: string): Show | undefined {
  const parts = parseShowId(id)
  if (!parts) return undefined
  return getShowsAtTheatre(parts.movieId, parts.theatreId, parts.date).find((s) => s.time === parts.time)
}

export function getDefaultShow(today = new Date()): Show {
  const id = buildShowId(DEFAULT_SHOW.movieId, DEFAULT_SHOW.theatreId, toISODate(today), DEFAULT_SHOW.time)
  const show = getShow(id)
  if (!show) throw new Error('Default show is missing from mock data')
  return show
}

export function getSeatLayout(show: Show): SeatLayout {
  return generateSeatLayout(show)
}

// ── Search ─────────────────────────────────────────────────────

export interface SearchResults {
  movies: Movie[]
  theatres: Theatre[]
  cities: City[]
}

export function searchCatalog(query: string): SearchResults {
  const q = normalize(query)
  if (!q) return { movies: [], theatres: [], cities: [] }
  const has = (text: string) => normalize(text).includes(q)

  const movieHits = movies
    .filter((m) => movieMatchesQuery(m, q))
    .sort((a, b) => {
      const rank = (m: Movie) => (normalize(m.title).startsWith(q) ? 0 : 1) + (m.status === 'now_showing' ? 0 : 2)
      return rank(a) - rank(b)
    })

  return {
    movies: movieHits.slice(0, 5),
    theatres: theatres.filter((t) => has(t.name) || has(t.area)).slice(0, 4),
    cities: cities.filter((c) => has(c.name) || has(c.state)).slice(0, 3),
  }
}
