import { memo } from 'react'
import type { Seat as SeatData } from '@/types'
import { cn } from '@/lib/cn'

type SeatState = 'available' | 'selected' | 'occupied'

// Shared with the legend so both always match
const SEAT_STATE_STYLES: Record<SeatState, string> = {
  available: 'bg-white/[0.03] text-zinc-400 ring-1 ring-inset ring-zinc-500/70',
  selected: 'bg-brand-600 text-white ring-1 ring-inset ring-brand-400 shadow-[0_0_18px_-3px_rgb(224_18_58/0.85)]',
  occupied: 'bg-ink-600/80 text-transparent',
}

const SEAT_SHAPE = 'rounded-t-[7px] rounded-b-[4px]'

interface SeatProps {
  seat: SeatData
  selected: boolean
  onToggle: (seatId: string) => void
}

export const Seat = memo(function Seat({ seat, selected, onToggle }: SeatProps) {
  const occupied = seat.status === 'occupied'
  const state: SeatState = occupied ? 'occupied' : selected ? 'selected' : 'available'

  return (
    <button
      type="button"
      disabled={occupied}
      aria-pressed={occupied ? undefined : selected}
      aria-label={`Seat ${seat.id}${occupied ? ', occupied' : ''}`}
      onClick={() => onToggle(seat.id)}
      className={cn(
        'relative grid size-6 place-items-center text-[9px] font-semibold transition-[background-color,box-shadow,color,transform] duration-150 ease-out sm:size-8 sm:text-[10px] xl:size-10 xl:text-xs',
        SEAT_SHAPE,
        SEAT_STATE_STYLES[state],
        state === 'available' && 'hover:-translate-y-0.5 hover:bg-brand-500/15 hover:text-white hover:ring-brand-400',
        state === 'selected' && '-translate-y-0.5',
        occupied && 'cursor-not-allowed',
      )}
    >
      {seat.number}
      <span
        aria-hidden
        className={cn(
          'absolute inset-x-1 -bottom-[3px] h-[2px] rounded-full',
          state === 'selected' ? 'bg-brand-400' : state === 'occupied' ? 'bg-ink-500' : 'bg-zinc-600',
        )}
      />
    </button>
  )
})

export function SeatLegend({ className }: { className?: string }) {
  const items: { state: SeatState; label: string }[] = [
    { state: 'available', label: 'Available' },
    { state: 'selected', label: 'Selected' },
    { state: 'occupied', label: 'Occupied' },
  ]
  return (
    <ul className={cn('flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-400', className)}>
      {items.map(({ state, label }) => (
        <li key={state} className="inline-flex items-center gap-2">
          <span aria-hidden className={cn('size-4', SEAT_SHAPE, SEAT_STATE_STYLES[state])} />
          {label}
        </li>
      ))}
    </ul>
  )
}
