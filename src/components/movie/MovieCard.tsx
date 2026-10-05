import { Link } from 'react-router'
import type { Movie } from '@/types'
import { ButtonLink } from '@/components/ui/Button'
import { CertificationBadge, Rating } from '@/components/ui/Badge'
import { SmartImage } from '@/components/ui/SmartImage'
import { formatDuration, formatGenres, formatLanguages } from '@/lib/format'
import { posterSrcSet, tmdbImage } from '@/lib/images'

interface MovieCardProps {
  movie: Movie
  /** Load eagerly — for cards visible on first paint */
  priority?: boolean
}

export function MovieCard({ movie, priority }: MovieCardProps) {
  const href = `/movie/${movie.id}`
  const imax = movie.formats.find((f) => f.startsWith('IMAX'))

  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-ink-800 shadow-[0_12px_30px_-14px_rgb(0_0_0/0.9)] ring-1 ring-white/[0.06] transition-[box-shadow,transform] duration-300 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_26px_50px_-20px_rgb(224_18_58/0.5)] group-hover:ring-white/15">
        <SmartImage
          src={tmdbImage(movie.poster, 'w500')}
          srcSet={posterSrcSet(movie.poster)}
          sizes="(min-width: 1280px) 200px, (min-width: 1024px) 300px, (min-width: 640px) 30vw, 46vw"
          alt={`${movie.title} poster`}
          fallbackLabel={movie.title}
          loading={priority ? 'eager' : 'lazy'}
          className="size-full object-cover group-hover:scale-[1.06]"
        />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-black/85 via-black/30 to-transparent" />
        <div className="pointer-events-none absolute inset-x-2.5 top-2.5 flex items-start justify-between gap-2">
          {movie.certification ? (
            <CertificationBadge value={movie.certification} className="bg-black/50 backdrop-blur-sm" />
          ) : (
            <span />
          )}
          {imax && (
            <span className="rounded-md bg-white/90 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-ink-950">
              IMAX
            </span>
          )}
        </div>
        {movie.rating != null && (
          <div className="pointer-events-none absolute bottom-2.5 left-2.5 text-[13px]">
            <Rating
              value={movie.rating}
              suffix={movie.votes && <span className="text-[11px] text-zinc-400">· {movie.votes}</span>}
            />
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <h3 className="font-display text-[15px] leading-snug font-semibold text-white">
          <Link
            to={href}
            className="line-clamp-1 rounded-sm outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-brand-500"
          >
            {movie.title}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-1 text-xs text-zinc-400">{formatGenres(movie.genres, 2)}</p>
        <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">
          {formatLanguages(movie.languages)} · {formatDuration(movie.durationMinutes)}
        </p>
        <div className="mt-auto pt-3">
          <ButtonLink
            to={`${href}#shows`}
            size="sm"
            variant="card"
            fullWidth
            aria-label={`Book tickets for ${movie.title}`}
            className="relative z-10"
          >
            Book Tickets
          </ButtonLink>
        </div>
      </div>
    </article>
  )
}
