import type { ReactNode } from 'react'
import type { Booking, Movie, Theatre } from '@/types'
import { CertificationBadge } from '@/components/ui/Badge'
import { SmartImage } from '@/components/ui/SmartImage'
import { cn } from '@/lib/cn'
import { formatCurrency, formatDateLong, formatTime, pluralize } from '@/lib/format'
import { tmdbImage } from '@/lib/images'
import { QrPlaceholder } from './QrPlaceholder'

interface TicketProps {
  booking: Booking
  movie: Movie
  theatre: Theatre
  className?: string
}

export function Ticket({ booking, movie, theatre, className }: TicketProps) {
  return (
    <article
      aria-label={`Ticket for ${movie.title}`}
      className={cn(
        'relative isolate flex flex-col overflow-hidden rounded-3xl bg-ink-900 ring-1 ring-inset ring-white/10 [print-color-adjust:exact] md:flex-row',
        className,
      )}
    >
      <div aria-hidden className="absolute -left-24 -top-24 -z-10 size-72 rounded-full bg-brand-600/20 blur-3xl" />

      <div className="flex-1 p-6 sm:p-8">
        <div className="flex gap-4 sm:gap-5">
          <SmartImage
            src={tmdbImage(movie.poster, 'w185')}
            alt=""
            fallbackLabel={movie.title}
            loading="eager"
            className="h-28 w-[75px] shrink-0 rounded-xl object-cover ring-1 ring-white/10 sm:h-32 sm:w-[85px]"
          />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Movie</p>
            <h2 className="mt-1 font-display text-xl font-semibold leading-tight text-white sm:text-2xl">{movie.title}</h2>
            <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
              {movie.certification && <CertificationBadge value={movie.certification} />}
              {booking.language} · {booking.format}
            </p>
          </div>
        </div>

        <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
          <Detail label="Theatre" className="col-span-2 sm:col-span-1">
            {theatre.name}
            <span className="block text-xs font-normal text-zinc-500">{theatre.area}</span>
          </Detail>
          <Detail label="Screen">{booking.screen}</Detail>
          <Detail label="Seats">
            {booking.seats.join(', ')}
            <span className="block text-xs font-normal text-zinc-500">{pluralize(booking.seats.length, 'ticket')}</span>
          </Detail>
          <Detail label="Date">{formatDateLong(booking.date)}</Detail>
          <Detail label="Time">{formatTime(booking.time)}</Detail>
          <Detail label="Total">
            {formatCurrency(booking.total)}
            <span className="block text-xs font-normal text-zinc-500">
              incl. {formatCurrency(booking.convenienceFee)} fee
            </span>
          </Detail>
        </dl>
      </div>

      {/* Perforation: horizontal on phones, vertical from md up */}
      <div
        aria-hidden
        className="relative mx-6 border-t-2 border-dashed border-white/10 sm:mx-8 md:mx-0 md:my-7 md:border-l-2 md:border-t-0"
      >
        <span className="absolute -left-9 -top-[13px] size-6 rounded-full bg-ink-950 sm:-left-11 md:-left-[13px] md:-top-10" />
        <span className="absolute -right-9 -top-[13px] size-6 rounded-full bg-ink-950 sm:-right-11 md:-bottom-10 md:-left-[13px] md:right-auto md:top-auto" />
      </div>

      <div className="flex flex-col items-center justify-center gap-3 p-6 sm:p-8 md:w-64">
        <QrPlaceholder value={booking.id} className="size-36" />
        <p className="text-xs text-zinc-500">Show this at the cinema entrance</p>
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Booking ID</p>
          <p className="mt-1 font-mono text-lg font-semibold tracking-[0.2em] text-white">{booking.id}</p>
        </div>
      </div>
    </article>
  )
}

function Detail({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-zinc-100 sm:text-[15px]">{children}</dd>
    </div>
  )
}
