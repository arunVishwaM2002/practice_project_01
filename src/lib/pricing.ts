export const CONVENIENCE_FEE_PER_TICKET = 20

export interface PriceBreakdown {
  quantity: number
  ticketPrice: number
  subtotal: number
  convenienceFee: number
  total: number
}

export function getPriceBreakdown(ticketPrice: number, quantity: number): PriceBreakdown {
  const subtotal = ticketPrice * quantity
  const convenienceFee = CONVENIENCE_FEE_PER_TICKET * quantity
  return { quantity, ticketPrice, subtotal, convenienceFee, total: subtotal + convenienceFee }
}

const ID_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

/** e.g. "CBX8F92K" — ambiguous characters (0/O, 1/I) are left out */
export function generateBookingId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6))
  return 'CB' + Array.from(bytes, (b) => ID_ALPHABET[b % ID_ALPHABET.length]).join('')
}
