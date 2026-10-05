import type { Booking } from '@/types'

/** Shown on /booking-confirmation when it is opened directly, without a booking */
export const sampleBooking: Booking = {
  id: 'CBX8F92K',
  showId: 'interstellar~pvr-orion-mall~2026-10-05~1930',
  movieId: 'interstellar',
  theatreId: 'pvr-orion-mall',
  screen: 'Screen 3',
  date: '2026-10-05',
  time: '19:30',
  format: '2D',
  language: 'English',
  seats: ['A5', 'A6'],
  ticketPrice: 350,
  convenienceFee: 40,
  total: 740,
}
