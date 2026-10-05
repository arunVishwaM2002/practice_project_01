import { useState } from 'react'
import { Clock, Play, Sparkles, Ticket } from 'lucide-react'
import type { Movie } from '@/types'
import { Button, ButtonLink } from '@/components/ui/Button'
import { CertificationBadge, Chip, Rating } from '@/components/ui/Badge'
import { SmartImage } from '@/components/ui/SmartImage'
import { formatDuration, formatGenres } from '@/lib/format'
import { backdropSrcSet, tmdbImage } from '@/lib/images'
import { TrailerModal } from './TrailerModal'

interface FeaturedMovieProps {
  movie: Movie
  eyebrow: string
  blurb: string
  ratingLabel?: string
}

export function FeaturedMovie({ movie, eyebrow, blurb, ratingLabel = '/10' }: FeaturedMovieProps) {
  const [trailerOpen, setTrailerOpen] = useState(false)

  return (
    <section aria-labelledby="featured-title" className="page-container py-16 sm:py-24">
      <div className="relative isolate overflow-hidden rounded-[28px] bg-ink-900 ring-1 ring-white/[0.08]">
        <SmartImage
          src={tmdbImage(movie.backdrop, 'w1280')}
          srcSet={backdropSrcSet(movie.backdrop)}
          sizes="(min-width: 1280px) 1216px, 100vw"
          alt=""
          className="absolute inset-0 -z-20 size-full object-cover object-[65%_center]"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-ink-950 via-ink-950/80 to-ink-950/10 lg:bg-linear-to-r lg:from-ink-950 lg:via-ink-950/75 lg:to-transparent" />

        <div className="flex min-h-[560px] flex-col justify-end p-6 sm:p-10 lg:min-h-[600px] lg:max-w-[620px] lg:justify-center lg:p-14">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
            <Sparkles className="size-4" aria-hidden />
            {eyebrow}
          </p>
          <h2 id="featured-title" className="mt-4 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {movie.title}
          </h2>

          <ul className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-sm text-zinc-300">
            {movie.rating != null && (
              <li>
                <Rating value={movie.rating} suffix={<span className="text-zinc-400">{ratingLabel}</span>} />
              </li>
            )}
            <li className="inline-flex items-center gap-1.5">
              <Clock className="size-4 text-zinc-500" aria-hidden />
              {formatDuration(movie.durationMinutes)}
            </li>
            <li>{formatGenres(movie.genres)}</li>
            {movie.certification && (
              <li>
                <CertificationBadge value={movie.certification} />
              </li>
            )}
          </ul>

          <p className="mt-5 text-base leading-relaxed text-zinc-300 sm:text-lg">{blurb}</p>
          <p className="mt-3 text-sm text-zinc-500">
            Directed by <span className="text-zinc-300">{movie.director}</span>
            {movie.cast.length > 0 && <> · {movie.cast.slice(0, 2).map((c) => c.name).join(', ')}</>}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {movie.formats.map((format) => (
              <Chip key={format}>{format}</Chip>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to={`/movie/${movie.id}#shows`} size="lg">
              <Ticket aria-hidden />
              Book Tickets
            </ButtonLink>
            <Button variant="secondary" size="lg" onClick={() => setTrailerOpen(true)}>
              <Play aria-hidden className="fill-current" />
              Watch Trailer
            </Button>
          </div>
        </div>
      </div>
      <TrailerModal movie={movie} open={trailerOpen} onClose={() => setTrailerOpen(false)} />
    </section>
  )
}
