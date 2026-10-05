import { useCallback, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import type { Booking, Movie, Show, Theatre } from '@/types'
import { MAX_SEATS_PER_BOOKING } from '@/data/seats'
import { getDefaultShow, getMovie, getSeatLayout, getShow, getShowsAtTheatre, getTheatre } from '@/services/catalog'
import { CertificationBadge } from '@/components/ui/Badge'
import { SmartImage } from '@/components/ui/SmartImage'
import { BookingSummary, MobileBookingBar } from '@/components/booking/BookingSummary'
import { SeatLegend } from '@/components/booking/Seat'
import { SeatMap } from '@/components/booking/SeatMap'
import { ShowtimeButton } from '@/components/showtimes/ShowtimeButton'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { formatRelativeDay, formatTime } from '@/lib/format'
import { tmdbImage } from '@/lib/images'
import { generateBookingId, getPriceBreakdown } from '@/lib/pricing'
import { NotFoundPage } from './NotFoundPage'

function sortSeatIds(ids: string[]): string[] {
  return [...ids].sort((a, b) => a[0].localeCompare(b[0]) || Number(a.slice(1)) - Number(b.slice(1)))
}

export function SeatSelectionPage() {
  const [params] = useSearchParams()
  const requested = params.get('show')
  const show = (requested && getShow(requested)) || getDefaultShow()
  const movie = getMovie(show.movieId)
  const theatre = getTheatre(show.theatreId)

  if (!movie || !theatre) return <NotFoundPage />
  // Keyed so switching showtime resets the selection
  return <SeatSelection key={show.id} show={show} movie={movie} theatre={theatre} />
}

interface SeatSelectionProps {
  show: Show
  movie: Movie
  theatre: Theatre
}

function SeatSelection({ show, movie, theatre }: SeatSelectionProps) {
  useDocumentTitle(`Select seats · ${movie.title} | CineBook`)
  const navigate = useNavigate()
  const layout = useMemo(() => getSeatLayout(show), [show])
  const otherShows = getShowsAtTheatre(movie.id, theatre.id, show.date)
  const [selected, setSelected] = useState<string[]>([])
  const pricing = getPriceBreakdown(show.price, selected.length)
  const atLimit = selected.length >= MAX_SEATS_PER_BOOKING

  const toggleSeat = useCallback((seatId: string) => {
    setSelected((prev) => {
      if (prev.includes(seatId)) return prev.filter((id) => id !== seatId)
      if (prev.length >= MAX_SEATS_PER_BOOKING) return prev
      return sortSeatIds([...prev, seatId])
    })
  }, [])

  const continueToPayment = () => {
    if (selected.length === 0) return
    // Payment is out of scope for Phase 1 — go straight to a confirmed booking
    const booking: Booking = {
      id: generateBookingId(),
      showId: show.id,
      movieId: movie.id,
      theatreId: theatre.id,
      screen: show.screen,
      date: show.date,
      time: show.time,
      format: show.format,
      language: show.language,
      seats: selected,
      ticketPrice: show.price,
      convenienceFee: pricing.convenienceFee,
      total: pricing.total,
    }
    navigate('/booking-confirmation', { state: { booking } })
  }

  return (
    <div className="page-container pb-0 pt-24 sm:pt-28 lg:pb-20">
      <Link
        to={`/movie/${movie.id}#shows`}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to showtimes
      </Link>

      <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-start gap-4">
          <SmartImage
            src={tmdbImage(movie.poster, 'w185')}
            alt=""
            loading="eager"
            className="hidden h-24 w-16 shrink-0 rounded-xl object-cover ring-1 ring-white/10 sm:block"
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">{movie.title}</h1>
              {movie.certification && <CertificationBadge value={movie.certification} />}
            </div>
            <p className="mt-1.5 text-sm font-medium text-zinc-200">
              {theatre.name} • {show.screen}
            </p>
            <p className="mt-0.5 text-sm text-zinc-400">
              {formatRelativeDay(show.date)} • {formatTime(show.time)}
              <span className="text-zinc-600"> · </span>
              {show.language} · {show.format}
            </p>
          </div>
        </div>

        {otherShows.length > 1 && (
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Change showtime</p>
            <ul aria-label="Other showtimes" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:px-0">
              {otherShows.map((s) => (
                <li key={s.id} className="shrink-0">
                  <ShowtimeButton show={s} current={s.id === show.id} replace size="sm" />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-8">
        <section
          aria-labelledby="seat-map-title"
          className="py-4 sm:rounded-3xl sm:bg-ink-900/60 sm:px-8 sm:py-10 sm:ring-1 sm:ring-inset sm:ring-white/[0.06]"
        >
          <h2 id="seat-map-title" className="sr-only">
            Choose your seats
          </h2>
          <SeatMap layout={layout} selected={selected} onToggle={toggleSeat} />
          <SeatLegend className="mt-8" />
          <p aria-live="polite" className="mt-4 min-h-5 text-center text-xs text-zinc-500">
            {atLimit
              ? `You can book up to ${MAX_SEATS_PER_BOOKING} seats at a time.`
              : selected.length === 0
                ? 'Tap a seat to select it. Tap again to deselect.'
                : ''}
          </p>
        </section>

        <BookingSummary
          className="lg:sticky lg:top-24"
          movie={movie}
          theatre={theatre}
          show={show}
          seats={selected}
          pricing={pricing}
          onContinue={continueToPayment}
        />
      </div>

      <MobileBookingBar seats={selected} total={pricing.total} onContinue={continueToPayment} />
    </div>
  )
}
