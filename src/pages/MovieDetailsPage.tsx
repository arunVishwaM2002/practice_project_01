import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import {
  Bell,
  BellRing,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Clock,
  Clapperboard,
  Film,
  Languages,
  Play,
  Ticket,
} from 'lucide-react'
import type { Movie } from '@/types'
import { useCity } from '@/context/city'
import { getMovie, getShowDates, getShowtimesForMovie } from '@/services/catalog'
import { Button, ButtonLink } from '@/components/ui/Button'
import { CertificationBadge, Chip, Rating } from '@/components/ui/Badge'
import { SmartImage } from '@/components/ui/SmartImage'
import { CityPickerModal } from '@/components/location/CityPickerModal'
import { TrailerModal } from '@/components/movie/TrailerModal'
import { DateSelector } from '@/components/showtimes/DateSelector'
import { AvailabilityLegend, ShowtimeButton } from '@/components/showtimes/ShowtimeButton'
import { TheatreCard } from '@/components/showtimes/TheatreCard'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { cn } from '@/lib/cn'
import { formatDateLong, formatDateMedium, formatDuration, formatGenres, pluralize } from '@/lib/format'
import { backdropSrcSet, posterSrcSet, tmdbImage } from '@/lib/images'
import { hashString } from '@/lib/random'
import { scrollToId } from '@/lib/scroll'
import { NotFoundPage } from './NotFoundPage'

export function MovieDetailsPage() {
  const { id = '' } = useParams()
  const movie = getMovie(id)

  if (!movie) {
    return (
      <NotFoundPage
        title="We couldn't find that movie"
        message="It may have left cinemas, or the link might be incorrect."
      />
    )
  }
  return <MovieDetails movie={movie} />
}

function MovieDetails({ movie }: { movie: Movie }) {
  useDocumentTitle(`${movie.title} — Book tickets | CineBook`)

  const { city } = useCity()
  const dates = useMemo(() => getShowDates(), [])
  const [date, setDate] = useState(dates[0].date)
  const [trailerOpen, setTrailerOpen] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)
  const [notified, setNotified] = useState(false)

  const isNowShowing = movie.status === 'now_showing'
  const listings = isNowShowing ? getShowtimesForMovie(movie.id, city.id, date) : []

  const facts = [
    { label: 'Duration', value: formatDuration(movie.durationMinutes), icon: Clock },
    { label: 'Genre', value: formatGenres(movie.genres), icon: Film },
    { label: 'Language', value: movie.languages.join(', '), icon: Languages },
    { label: 'Release date', value: formatDateMedium(movie.releaseDate), icon: CalendarDays },
  ]

  const people = [
    ...movie.cast.map((c) => ({ name: c.name, role: c.role ?? 'Cast' })),
    { name: movie.director, role: 'Director' },
  ]

  return (
    <>
      <section aria-labelledby="movie-title" className="relative isolate">
        <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
          <SmartImage
            src={tmdbImage(movie.backdrop, 'w1280')}
            srcSet={backdropSrcSet(movie.backdrop)}
            sizes="100vw"
            alt=""
            loading="eager"
            fetchPriority="high"
            className="size-full object-cover object-[center_25%]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-ink-950 via-ink-950/85 to-ink-950/35" />
          <div className="absolute inset-0 bg-linear-to-r from-ink-950/95 via-ink-950/55 to-ink-950/0" />
        </div>

        <div className="page-container pb-12 pt-24 sm:pt-28 lg:pb-16 lg:pt-36">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm text-zinc-400">
              <li>
                <Link to="/movies" className="transition-colors hover:text-white">
                  Movies
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="size-3.5" />
              </li>
              <li aria-current="page" className="truncate text-zinc-200">
                {movie.title}
              </li>
            </ol>
          </nav>

          <div className="mt-6 flex flex-col gap-8 sm:flex-row sm:items-end lg:gap-12">
            <div className="w-40 shrink-0 sm:w-52 lg:w-64">
              <div className="overflow-hidden rounded-2xl bg-ink-800 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.9)] ring-1 ring-white/15">
                <SmartImage
                  src={tmdbImage(movie.poster, 'w500')}
                  srcSet={posterSrcSet(movie.poster)}
                  sizes="(min-width: 1024px) 256px, 208px"
                  alt={`${movie.title} poster`}
                  fallbackLabel={movie.title}
                  loading="eager"
                  className="aspect-[2/3] w-full object-cover"
                />
              </div>
            </div>

            <div className="min-w-0 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                {movie.certification && <CertificationBadge value={movie.certification} />}
                {movie.formats.map((format) => (
                  <Chip key={format}>{format}</Chip>
                ))}
                {!isNowShowing && (
                  <span className="inline-flex items-center rounded-full bg-brand-600/15 px-2.5 py-1 text-xs font-medium text-brand-300 ring-1 ring-inset ring-brand-500/30">
                    Coming soon
                  </span>
                )}
              </div>

              <h1
                id="movie-title"
                className="mt-4 font-display text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl"
              >
                {movie.title}
              </h1>
              {movie.tagline && <p className="mt-2 text-zinc-400 italic">{movie.tagline}</p>}

              {movie.rating != null && (
                <div className="mt-5 inline-flex items-center gap-3 rounded-2xl bg-white/[0.06] px-4 py-2.5 ring-1 ring-inset ring-white/10 backdrop-blur-md">
                  <Rating value={movie.rating} className="text-lg" suffix={<span className="text-sm text-zinc-400">/10</span>} />
                  {movie.votes && <span className="border-l border-white/10 pl-3 text-sm text-zinc-400">{movie.votes} votes</span>}
                </div>
              )}

              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-4">
                {facts.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="min-w-0">
                    <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-zinc-500">
                      <Icon className="size-3.5" aria-hidden />
                      {label}
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-zinc-100">{value}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-6 max-w-2xl leading-relaxed text-zinc-300">{movie.description}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                {isNowShowing ? (
                  <Button size="lg" onClick={() => scrollToId('shows')}>
                    <Ticket aria-hidden />
                    Book Tickets
                  </Button>
                ) : (
                  <Button size="lg" aria-pressed={notified} onClick={() => setNotified((v) => !v)}>
                    {notified ? <BellRing aria-hidden /> : <Bell aria-hidden />}
                    {notified ? "We'll notify you" : 'Notify Me'}
                  </Button>
                )}
                <Button variant="secondary" size="lg" onClick={() => setTrailerOpen(true)}>
                  <Play aria-hidden className="fill-current" />
                  Watch Trailer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="cast-title" className="page-container py-10">
        <h2 id="cast-title" className="font-display text-xl font-semibold text-white">
          Cast &amp; crew
        </h2>
        <ul className="-mx-4 mt-5 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:flex-wrap sm:px-0">
          {people.map((person) => (
            <li
              key={`${person.role}-${person.name}`}
              className="flex w-48 shrink-0 items-center gap-3 rounded-2xl bg-white/[0.03] p-3 ring-1 ring-inset ring-white/[0.06] sm:w-auto sm:max-w-xs sm:pr-5"
            >
              <Avatar name={person.name} />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{person.name}</p>
                <p className="truncate text-xs text-zinc-500">{person.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {isNowShowing ? (
        <section id="shows" aria-labelledby="shows-title" className="page-container scroll-mt-20 pb-20 sm:pb-28">
          <div className="flex flex-col gap-4 border-t border-white/[0.06] pt-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="shows-title" className="font-display text-2xl font-semibold text-white sm:text-3xl">
                Available Shows
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                {pluralize(listings.length, 'cinema')} in{' '}
                <button
                  type="button"
                  onClick={() => setCityOpen(true)}
                  className="inline-flex items-center gap-1 font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-brand-400"
                >
                  {city.name}
                  <ChevronDown className="size-3.5" aria-hidden />
                  <span className="sr-only">(change city)</span>
                </button>
              </p>
            </div>
            <AvailabilityLegend />
          </div>

          <DateSelector className="mt-6" dates={dates} value={date} onChange={setDate} />

          <ul className="mt-6 space-y-4">
            {listings.map(({ theatre, shows }) => (
              <li key={theatre.id}>
                <TheatreCard theatre={theatre}>
                  <ul aria-label={`Showtimes at ${theatre.name}`} className="flex flex-wrap gap-2.5">
                    {shows.map((show) => (
                      <li key={show.id}>
                        <ShowtimeButton show={show} />
                      </li>
                    ))}
                  </ul>
                </TheatreCard>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section aria-label="Release information" className="page-container pb-20 sm:pb-28">
          <div className="flex flex-col items-start gap-5 rounded-3xl bg-ink-900 p-6 ring-1 ring-inset ring-white/[0.07] sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex items-center gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-600/15 text-brand-300 ring-1 ring-inset ring-brand-500/30">
                <Clapperboard className="size-5" aria-hidden />
              </span>
              <div>
                <p className="font-display text-lg font-semibold text-white">
                  In cinemas {formatDateLong(movie.releaseDate)}
                </p>
                <p className="mt-0.5 text-sm text-zinc-400">
                  Bookings open closer to release. Tap “Notify Me” and we'll let you know.
                </p>
              </div>
            </div>
            <ButtonLink to="/movies" variant="outline">
              Browse now showing
            </ButtonLink>
          </div>
        </section>
      )}

      <TrailerModal movie={movie} open={trailerOpen} onClose={() => setTrailerOpen(false)} />
      <CityPickerModal open={cityOpen} onClose={() => setCityOpen(false)} />
    </>
  )
}

const AVATAR_TONES = [
  'from-brand-500/40 to-brand-900/40',
  'from-sky-500/35 to-indigo-900/40',
  'from-amber-400/35 to-orange-900/40',
  'from-emerald-400/30 to-teal-900/40',
  'from-violet-400/35 to-purple-900/40',
]

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .filter((w) => /^[A-Za-zÀ-ÿ]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
  return (
    <span
      aria-hidden
      className={cn(
        'grid size-11 shrink-0 place-items-center rounded-full bg-linear-to-br text-sm font-semibold text-white ring-1 ring-inset ring-white/15',
        AVATAR_TONES[hashString(name) % AVATAR_TONES.length],
      )}
    >
      {initials}
    </span>
  )
}
