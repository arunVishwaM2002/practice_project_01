import { useId } from 'react'
import type { SeatLayout } from '@/types'
import { formatCurrency } from '@/lib/format'
import { Seat } from './Seat'

interface SeatMapProps {
  layout: SeatLayout
  selected: string[]
  onToggle: (seatId: string) => void
}

export function SeatMap({ layout, selected, onToggle }: SeatMapProps) {
  const selectedSet = new Set(selected)

  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:px-0">
      <div className="mx-auto w-max">
        <CinemaScreen />

        <p className="mb-5 mt-8 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
          {layout.tier} · {formatCurrency(layout.price)}
        </p>

        <div role="group" aria-label="Seat map" className="space-y-2 sm:space-y-2.5 xl:space-y-3">
          {layout.rows.map((row) => (
            <div key={row.row} role="group" aria-label={`Row ${row.row}`} className="flex items-center gap-2 sm:gap-3">
              <span aria-hidden className="w-4 text-center text-xs font-medium text-zinc-500">
                {row.row}
              </span>
              <div className="flex items-center gap-1 sm:gap-1.5 xl:gap-2">
                {row.seats.map((seat, i) =>
                  seat ? (
                    <Seat key={seat.id} seat={seat} selected={selectedSet.has(seat.id)} onToggle={onToggle} />
                  ) : (
                    <span key={`aisle-${i}`} aria-hidden className="w-3 sm:w-5 xl:w-8" />
                  ),
                )}
              </div>
              <span aria-hidden className="hidden w-4 text-center text-xs font-medium text-zinc-500 sm:block">
                {row.row}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CinemaScreen() {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  return (
    <div aria-hidden className="mx-auto w-full px-4">
      <svg viewBox="0 0 400 56" className="w-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`${uid}-line`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#f43357" stopOpacity="0" />
            <stop offset="0.5" stopColor="#ff8fa3" />
            <stop offset="1" stopColor="#f43357" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${uid}-spill`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#f43357" stopOpacity="0.16" />
            <stop offset="1" stopColor="#f43357" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Light spilling from the screen toward the audience */}
        <path d="M6 22 Q200 -6 394 22 L360 56 Q200 34 40 56 Z" fill={`url(#${uid}-spill)`} />
        <path
          d="M6 22 Q200 -6 394 22"
          fill="none"
          stroke={`url(#${uid}-line)`}
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <p className="-mt-4 text-center text-[11px] font-semibold tracking-[0.5em] text-zinc-400">SCREEN</p>
    </div>
  )
}
