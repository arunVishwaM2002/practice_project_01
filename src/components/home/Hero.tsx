import { Link } from 'react-router'
import { ArrowRight, ChevronRight, Ticket } from 'lucide-react'
import type { Movie } from '@/types'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Rating } from '@/components/ui/Badge'
import { SmartImage } from '@/components/ui/SmartImage'
import { SearchBar } from '@/components/search/SearchBar'
import { formatGenres } from '@/lib/format'
import { backdropSrcSet, tmdbImage } from '@/lib/images'
import { scrollToId } from '@/lib/scroll'

interface HeroProps {
  movie: Movie
  eyebrow: string
  title: string
  subtitle: string
}

const delay = (ms: number) => ({ animationDelay: `${ms}ms` })

export function Hero({ movie, eyebrow, title, subtitle }: HeroProps) {
  const imax = movie.formats.find((f) => f.startsWith('IMAX'))

  return (
    // z-10 keeps the search dropdown above the sections that follow
    <section
      aria-labelledby="hero-title"
      className="relative isolate z-10 flex min-h-[620px] items-end pb-14 pt-28 sm:min-h-[680px] sm:items-center sm:pb-10 lg:h-[78vh] lg:max-h-[900px]"
    >
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <SmartImage
          src={tmdbImage(movie.backdrop, 'w1280')}
          srcSet={backdropSrcSet(movie.backdrop)}
          sizes="100vw"
          alt=""
          loading="eager"
          fetchPriority="high"
          className="size-full animate-ken-burns object-cover object-[72%_center]"
        />
        <div className="absolute inset-0 bg-linear-to-r from-ink-950 via-ink-950/75 to-ink-950/5" />
        <div className="absolute -left-48 top-1/4 size-[36rem] rounded-full bg-brand-700/20 blur-[120px]" />
        <div className="absolute inset-0 bg-linear-to-t from-ink-950 via-ink-950/10 to-ink-950/50" />
      </div>

      <div className="page-container relative">
        <div className="max-w-2xl">
          <p
            className="inline-flex animate-fade-up items-center gap-2 rounded-full bg-white/[0.07] px-3 py-1.5 text-xs font-medium text-zinc-200 ring-1 ring-inset ring-white/15 backdrop-blur-md"
            style={delay(0)}
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-500 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-brand-500" />
            </span>
            {eyebrow}
          </p>

          <h1
            id="hero-title"
            className="mt-6 animate-fade-up font-display text-[2.75rem] leading-[1.04] font-semibold tracking-tight text-balance text-white sm:text-6xl xl:text-7xl"
            style={delay(80)}
          >
            {title}
          </h1>

          <p className="mt-5 max-w-xl animate-fade-up text-base leading-relaxed text-zinc-300 sm:text-lg" style={delay(160)}>
            {subtitle}
          </p>

          <div className="mt-8 flex animate-fade-up flex-wrap gap-3" style={delay(240)}>
            <Button size="lg" onClick={() => scrollToId('now-showing')}>
              <Ticket aria-hidden />
              Book Tickets
            </Button>
            <ButtonLink to="/movies" variant="secondary" size="lg">
              Explore Movies
              <ArrowRight aria-hidden />
            </ButtonLink>
          </div>

          <div className="mt-8 max-w-xl animate-fade-up" style={delay(320)}>
            <SearchBar size="lg" />
          </div>
        </div>

        {/* Credit for the backdrop, doubling as a shortcut to book it */}
        <Link
          to={`/movie/${movie.id}`}
          className="group absolute bottom-0 right-6 hidden w-[300px] animate-fade-up items-center gap-4 rounded-2xl bg-ink-950/50 p-3 pr-4 ring-1 ring-inset ring-white/10 backdrop-blur-xl transition-colors hover:bg-ink-950/70 lg:right-8 lg:flex"
          style={delay(420)}
        >
          <SmartImage
            src={tmdbImage(movie.poster, 'w185')}
            alt=""
            className="h-[72px] w-12 shrink-0 rounded-lg object-cover ring-1 ring-white/10"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-400">
              Now in cinemas{imax ? ` · ${imax.replace(' 2D', '')}` : ''}
            </p>
            <p className="mt-0.5 truncate font-display text-sm font-semibold text-white">{movie.title}</p>
            <p className="mt-0.5 flex items-center gap-2 truncate text-xs text-zinc-400">
              {movie.rating != null && <Rating value={movie.rating} />}
              {formatGenres(movie.genres, 2)}
            </p>
          </div>
          <ChevronRight
            className="size-4 shrink-0 text-zinc-500 transition-transform group-hover:translate-x-0.5 group-hover:text-white"
            aria-hidden
          />
        </Link>
      </div>
    </section>
  )
}
