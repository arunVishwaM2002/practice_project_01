// Domain types. Shaped like the JSON a future FastAPI backend would return,
// so mock data and real responses stay interchangeable.

export type Genre =
  | 'Action'
  | 'Adventure'
  | 'Animation'
  | 'Comedy'
  | 'Crime'
  | 'Drama'
  | 'Family'
  | 'Fantasy'
  | 'History'
  | 'Horror'
  | 'Romance'
  | 'Sci-Fi'
  | 'Thriller'

export type Language = 'English' | 'Hindi' | 'Tamil' | 'Telugu' | 'Kannada' | 'Malayalam'

export type Certification = 'U' | 'UA 7+' | 'UA 13+' | 'UA 16+' | 'A'

export type MovieFormat = '2D' | '3D' | 'IMAX 2D' | 'IMAX 3D' | '4DX'

export type MovieStatus = 'now_showing' | 'coming_soon'

export interface CastMember {
  name: string
  role?: string
}

export interface Movie {
  id: string
  title: string
  tagline?: string
  description: string
  genres: Genre[]
  languages: Language[]
  /** null while an upcoming film's runtime is unannounced */
  durationMinutes: number | null
  /** Audience rating out of 10 */
  rating: number | null
  votes?: string
  certification: Certification | null
  /** ISO date, yyyy-mm-dd */
  releaseDate: string
  /** TMDB image paths, resolved to URLs by lib/images */
  poster: string
  backdrop: string
  trailerYoutubeId?: string
  formats: MovieFormat[]
  status: MovieStatus
  director: string
  cast: CastMember[]
}

export interface City {
  id: string
  name: string
  state: string
}

export type Amenity =
  | 'IMAX'
  | '4DX'
  | 'Dolby Atmos'
  | 'Recliners'
  | 'Food & Beverages'
  | 'Parking'
  | 'Wheelchair Access'
  | 'M-Ticket'

export interface Theatre {
  id: string
  name: string
  brand: string
  cityId: string
  area: string
  address: string
  distanceKm: number
  screens: number
  amenities: Amenity[]
  cancellationAvailable: boolean
  /** Evening ticket price in INR for a standard 2D show */
  basePrice: number
}

export type ShowAvailability = 'available' | 'filling_fast' | 'almost_full'

export interface Show {
  id: string
  movieId: string
  theatreId: string
  /** ISO date, yyyy-mm-dd */
  date: string
  /** 24h time, HH:mm */
  time: string
  screen: string
  format: MovieFormat
  language: Language
  price: number
  availability: ShowAvailability
}

export interface ShowDate {
  /** ISO date, yyyy-mm-dd */
  date: string
  weekday: string
  label: string
}

export type SeatStatus = 'available' | 'occupied'

export interface Seat {
  id: string
  row: string
  number: number
  status: SeatStatus
}

export interface SeatRow {
  row: string
  /** null marks an aisle gap */
  seats: (Seat | null)[]
}

export interface SeatLayout {
  showId: string
  tier: string
  price: number
  rows: SeatRow[]
}

export interface Booking {
  id: string
  showId: string
  movieId: string
  theatreId: string
  screen: string
  date: string
  time: string
  format: MovieFormat
  language: Language
  seats: string[]
  ticketPrice: number
  convenienceFee: number
  total: number
}

export type OfferKind = 'flat' | 'percent' | 'cashback' | 'combo'

export interface Offer {
  id: string
  kind: OfferKind
  tag: string
  headline: string
  subtitle: string
  description: string
  code: string
  validity: string
}

export interface GenreCategory {
  id: string
  name: Genre
  backdrop: string
}
