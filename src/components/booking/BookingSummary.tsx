import { ArrowRight, CalendarDays, MapPin, ShieldCheck } from 'lucide-react'
import type { Movie, Show, Theatre } from '@/types'
import { Button } from '@/components/ui/Button'
import { CertificationBadge } from '@/components/ui/Badge'
import { SmartImage } from '@/components/ui/SmartImage'
import { cn } from '@/lib/cn'
import { formatCurrency, formatRelativeDay, formatTime, pluralize } from '@/lib/format'
import { tmdbImage } from '@/lib/images'
import type { PriceBreakdown } from '@/lib/pricing'

interface BookingSummaryProps {
  movie: Movie
  theatre: Theatre
  show: Show
  seats: string[]
  pricing: PriceBreakdown
  onContinue: () => void
  className?: string
}

export function BookingSummary({ movie, theatre, show, seats, pricing, onContinue, className }: BookingSummaryProps) {
  const hasSeats = seats.length > 0

  return (
    <aside
      aria-labelledby="booking-summary-title"
      className={cn('rounded-3xl bg-ink-900 p-5 ring-1 ring-inset ring-white/[0.07] sm:p-6', className)}
    >
      <h2 id="booking-summary-title" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Booking summary
      </h2>

      <div className="mt-4 flex gap-4">
        <SmartImage
          src={tmdbImage(movie.poster, 'w185')}
          alt=""
          fallbackLabel={movie.title}
          className="h-[96px] w-16 shrink-0 rounded-lg object-cover ring-1 ring-white/10"
        />
        <div className="min-w-0">
          <p className="font-display font-semibold leading-snug text-white">{movie.title}</p>
          <p className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
            {movie.certification && <CertificationBadge value={movie.certification} />}
            {show.language} · {show.format}
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-zinc-400">
            <MapPin className="size-3.5 shrink-0 text-zinc-500" aria-hidden />
            <span className="truncate">
              {theatre.name} • {show.screen}
            </span>
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-400">
            <CalendarDays className="size-3.5 shrink-0 text-zinc-500" aria-hidden />
            {formatRelativeDay(show.date)} • {formatTime(show.time)}
          </p>
        </div>
      </div>

      <div aria-hidden className="my-5 border-t border-dashed border-white/10" />

      <dl className="space-y-4 text-sm">
        <div>
          <dt className="text-zinc-400">Selected Seats</dt>
          <dd className="mt-2 flex min-h-7 flex-wrap gap-1.5" aria-live="polite">
            {hasSeats ? (
              seats.map((seat) => (
                <span
                  key={seat}
                  className="animate-scale-in rounded-md bg-brand-600/15 px-2 py-1 text-xs font-semibold text-brand-300 ring-1 ring-inset ring-brand-500/30"
                >
                  {seat}
                </span>
              ))
            ) : (
              <span className="text-zinc-500">No seats selected yet</span>
            )}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-zinc-400">Ticket Price</dt>
          <dd className="text-zinc-200">
            {formatCurrency(pricing.ticketPrice)}
            {hasSeats ? ` × ${pricing.quantity}` : ' per seat'}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-zinc-400">Convenience Fee</dt>
          <dd className="text-zinc-200">{formatCurrency(pricing.convenienceFee)}</dd>
        </div>
      </dl>

      <div aria-hidden className="my-5 border-t border-white/10" />

      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm text-zinc-300">
          Total
          {hasSeats && <span className="ml-1.5 text-xs text-zinc-500">({pluralize(pricing.quantity, 'ticket')})</span>}
        </span>
        <span className="font-display text-2xl font-semibold text-white">{formatCurrency(pricing.total)}</span>
      </div>

      {/* On small screens the sticky bottom bar carries this action */}
      <div className="mt-5 hidden lg:block">
        <Button size="lg" fullWidth disabled={!hasSeats} onClick={onContinue}>
          Continue to Payment
          <ArrowRight aria-hidden />
        </Button>
      </div>

      {theatre.cancellationAvailable && (
        <p className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
          <ShieldCheck className="size-4 shrink-0 text-emerald-400" aria-hidden />
          Free cancellation up to 2 hours before showtime
        </p>
      )}
    </aside>
  )
}

interface MobileBookingBarProps {
  seats: string[]
  total: number
  onContinue: () => void
}

/** Sticks to the bottom of the viewport on phones and tablets */
export function MobileBookingBar({ seats, total, onContinue }: MobileBookingBarProps) {
  const hasSeats = seats.length > 0
  return (
    <div className="sticky bottom-0 z-30 -mx-4 mt-8 border-t border-white/10 bg-ink-950/90 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:hidden">
      <div className="flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-zinc-400">
            {hasSeats ? `${pluralize(seats.length, 'ticket')} · ${seats.join(', ')}` : 'Select your seats'}
          </p>
          <p className="font-display text-lg font-semibold text-white">{formatCurrency(total)}</p>
        </div>
        <Button size="lg" disabled={!hasSeats} onClick={onContinue}>
          Continue to Payment
        </Button>
      </div>
    </div>
  )
}
