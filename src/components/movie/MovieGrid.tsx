import type { Movie } from '@/types'
import { cn } from '@/lib/cn'
import { MovieCard } from './MovieCard'

interface MovieGridProps {
  movies: Movie[]
  /**
   * `home`: a swipeable row on phones, then 3 → 6 columns.
   * `catalog`: a 2 → 5 column grid at every size.
   */
  layout?: 'home' | 'catalog'
  /** Number of leading cards to load eagerly */
  priorityCount?: number
}

export function MovieGrid({ movies, layout = 'catalog', priorityCount = 0 }: MovieGridProps) {
  const home = layout === 'home'
  return (
    <ul
      className={cn(
        home
          ? '-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-x-5 sm:gap-y-10 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-6'
          : 'grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4 xl:grid-cols-5',
      )}
    >
      {movies.map((movie, i) => (
        <li key={movie.id} className={cn(home && 'w-[46%] shrink-0 snap-start sm:w-auto')}>
          <MovieCard movie={movie} priority={i < priorityCount} />
        </li>
      ))}
    </ul>
  )
}
