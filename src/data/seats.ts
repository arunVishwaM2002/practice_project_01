import type { Seat, SeatLayout, SeatRow, Show, ShowAvailability } from '@/types'
import { hashString, seededRandom } from '@/lib/random'

export const SEAT_ROWS = ['A', 'B', 'C', 'D', 'E', 'F'] as const
export const SEATS_PER_ROW = 10
/** An aisle follows each of these seat numbers */
export const AISLES_AFTER = [2, 8]
export const SEAT_TIER = 'Prime'
export const MAX_SEATS_PER_BOOKING = 10

const TARGET_OCCUPANCY: Record<ShowAvailability, number> = {
  available: 0.2,
  filling_fast: 0.45,
  almost_full: 0.75,
}

/**
 * Mock seat map for a show. Centre and rear seats sell first (front rows
 * are the least popular), and occupied seats cluster like group bookings.
 */
export function generateSeatLayout(show: Show): SeatLayout {
  // Salted so seat draws don't mirror the availability roll in shows.ts
  const random = seededRandom(hashString(`seats:${show.id}`))
  const target = TARGET_OCCUPANCY[show.availability]
  const centre = (SEATS_PER_ROW + 1) / 2

  const rows: SeatRow[] = SEAT_ROWS.map((row, rowIndex) => {
    const seats: (Seat | null)[] = []
    let previousTaken = false
    for (let number = 1; number <= SEATS_PER_ROW; number++) {
      const centrality = 1 - Math.abs(number - centre) / centre
      const rearBias = rowIndex / (SEAT_ROWS.length - 1)
      const chance: number = target * (0.25 + 0.6 * centrality + 0.8 * rearBias) + (previousTaken ? 0.12 : 0)
      const taken: boolean = random() < chance
      previousTaken = taken
      seats.push({ id: `${row}${number}`, row, number, status: taken ? 'occupied' : 'available' })
      if (AISLES_AFTER.includes(number)) seats.push(null)
    }
    return { row, seats }
  })

  return { showId: show.id, tier: SEAT_TIER, price: show.price, rows }
}
