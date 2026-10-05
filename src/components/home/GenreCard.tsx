import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import type { GenreCategory } from '@/types'
import { SmartImage } from '@/components/ui/SmartImage'
import { pluralize } from '@/lib/format'
import { tmdbImage } from '@/lib/images'

export function GenreCard({ genre, movieCount }: { genre: GenreCategory; movieCount: number }) {
  return (
    <Link
      to={`/movies?genre=${encodeURIComponent(genre.name)}`}
      className="group relative isolate block aspect-[16/10] overflow-hidden rounded-2xl bg-ink-800 ring-1 ring-inset ring-white/[0.08] transition-shadow duration-300 hover:shadow-[0_22px_44px_-22px_rgb(224_18_58/0.6)]"
    >
      <SmartImage
        src={tmdbImage(genre.backdrop, 'w780')}
        alt=""
        className="absolute inset-0 -z-20 size-full object-cover group-hover:scale-110"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-t from-black/90 via-black/45 to-black/10 transition-opacity duration-300 group-hover:opacity-75"
      />
      <div className="flex h-full flex-col justify-end p-4 sm:p-5">
        <h3 className="font-display text-lg font-semibold text-white sm:text-xl">{genre.name}</h3>
        <p className="mt-0.5 text-xs text-zinc-300">{pluralize(movieCount, 'movie')} now showing</p>
      </div>
      <span
        aria-hidden
        className="absolute right-3 top-3 grid size-8 -translate-y-1 place-items-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-md transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
      >
        <ArrowUpRight className="size-4" />
      </span>
    </Link>
  )
}
