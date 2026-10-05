import { useState } from 'react'
import { Link } from 'react-router'
import { Bell, BellRing, CalendarDays } from 'lucide-react'
import type { Movie } from '@/types'
import { Button } from '@/components/ui/Button'
import { SmartImage } from '@/components/ui/SmartImage'
import { cn } from '@/lib/cn'
import { formatDateMedium, formatGenres } from '@/lib/format'
import { posterSrcSet, tmdbImage } from '@/lib/images'

export function ComingSoonCard({ movie }: { movie: Movie }) {
  const [notified, setNotified] = useState(false)

  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-ink-800 shadow-[0_12px_30px_-14px_rgb(0_0_0/0.9)] ring-1 ring-white/[0.06] transition-[box-shadow,transform] duration-300 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_26px_50px_-20px_rgb(0_0_0/0.9)] group-hover:ring-white/15">
        <SmartImage
          src={tmdbImage(movie.poster, 'w342')}
          srcSet={posterSrcSet(movie.poster)}
          sizes="(min-width: 1024px) 230px, (min-width: 640px) 30vw, 44vw"
          alt={`${movie.title} poster`}
          fallbackLabel={movie.title}
          className="size-full object-cover group-hover:scale-[1.06]"
        />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/80 to-transparent" />
        <span className="pointer-events-none absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white ring-1 ring-inset ring-white/15 backdrop-blur-md">
          <CalendarDays className="size-3.5 text-brand-400" aria-hidden />
          <span className="sr-only">Releases </span>
          {formatDateMedium(movie.releaseDate)}
        </span>
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <h3 className="font-display text-[15px] leading-snug font-semibold text-white">
          <Link
            to={`/movie/${movie.id}`}
            className="line-clamp-1 rounded-sm outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-brand-500"
          >
            {movie.title}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-1 text-xs text-zinc-400">{formatGenres(movie.genres, 2)}</p>
        <div className="mt-auto pt-3">
          <Button
            size="sm"
            variant={notified ? 'secondary' : 'outline'}
            fullWidth
            aria-pressed={notified}
            aria-label={`Notify me when ${movie.title} releases`}
            onClick={() => setNotified((v) => !v)}
            className={cn('relative z-10', !notified && 'bg-white/[0.04]')}
          >
            {notified ? <BellRing aria-hidden className="text-brand-400" /> : <Bell aria-hidden />}
            {notified ? "We'll notify you" : 'Notify Me'}
          </Button>
        </div>
      </div>
    </article>
  )
}
