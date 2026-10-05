import { useLocation } from 'react-router'
import { Check, Download, House } from 'lucide-react'
import type { Booking } from '@/types'
import { sampleBooking } from '@/data/bookings'
import { getMovie, getTheatre } from '@/services/catalog'
import { Button, ButtonLink } from '@/components/ui/Button'
import { SmartImage } from '@/components/ui/SmartImage'
import { Ticket } from '@/components/booking/Ticket'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { backdropSrcSet, tmdbImage } from '@/lib/images'
import { NotFoundPage } from './NotFoundPage'

export function BookingConfirmationPage() {
  useDocumentTitle('Booking confirmed | CineBook')
  const location = useLocation()
  const passed = (location.state as { booking?: Booking } | null)?.booking
  const booking = passed ?? sampleBooking
  const movie = getMovie(booking.movieId)
  const theatre = getTheatre(booking.theatreId)

  if (!movie || !theatre) return <NotFoundPage />

  return (
    <div className="relative isolate">
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[340px] overflow-hidden print:hidden">
        <SmartImage
          src={tmdbImage(movie.backdrop, 'w1280')}
          srcSet={backdropSrcSet(movie.backdrop)}
          sizes="100vw"
          alt=""
          loading="eager"
          className="size-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-linear-to-b from-ink-950/30 via-ink-950/85 to-ink-950" />
      </div>

      <div className="page-container flex flex-col items-center pb-20 pt-28 sm:pt-32">
        <div className="flex animate-scale-in flex-col items-center text-center">
          <span className="relative grid size-16 place-items-center rounded-full bg-emerald-500/15 ring-1 ring-inset ring-emerald-400/40">
            <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-emerald-400/20 [animation-iteration-count:2]" />
            <Check className="size-8 text-emerald-400" strokeWidth={2.5} aria-hidden />
          </span>
          <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl print:text-black">
            Booking Confirmed
          </h1>
          <p className="mt-2 max-w-md text-zinc-400">
            Your seats are locked in. Show the QR code at the cinema entrance and enjoy the show.
          </p>
        </div>

        <Ticket booking={booking} movie={movie} theatre={theatre} className="mt-10 w-full max-w-3xl" />

        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row print:hidden">
          {/* Opens the print dialog, where the ticket can be saved as a PDF */}
          <Button size="lg" onClick={() => window.print()}>
            <Download aria-hidden />
            Download Ticket
          </Button>
          <ButtonLink to="/" variant="secondary" size="lg">
            <House aria-hidden />
            Back to Home
          </ButtonLink>
        </div>

        {!passed && (
          <p className="mt-6 text-center text-xs text-zinc-500 print:hidden">
            This is a sample ticket. Book any show to see your own booking here.
          </p>
        )}
      </div>
    </div>
  )
}
