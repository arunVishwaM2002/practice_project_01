import { useMemo, type ReactNode } from 'react'
import { useSearchParams } from 'react-router'
import { Clapperboard, X } from 'lucide-react'
import type { Genre, Language, Movie } from '@/types'
import { useCity } from '@/context/city'
import { getComingSoon, getNowShowing, movieMatchesQuery } from '@/services/catalog'
import { Button } from '@/components/ui/Button'
import { FilterChip } from '@/components/ui/FilterChip'
import { ComingSoonCard } from '@/components/movie/ComingSoonCard'
import { MovieGrid } from '@/components/movie/MovieGrid'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { cn } from '@/lib/cn'
import { pluralize } from '@/lib/format'

type Tab = 'now-showing' | 'coming-soon'

function uniqueValues<T extends string>(movies: Movie[], pick: (m: Movie) => T[]): T[] {
  return [...new Set(movies.flatMap(pick))].sort()
}

export function MoviesPage() {
  const { city } = useCity()
  const [params, setParams] = useSearchParams()
  const tab: Tab = params.get('tab') === 'coming-soon' ? 'coming-soon' : 'now-showing'
  const genre = params.get('genre') as Genre | null
  const language = params.get('lang') as Language | null
  const query = params.get('q')?.trim() ?? ''

  useDocumentTitle(`Movies in ${city.name} | CineBook`)

  const nowShowing = getNowShowing()
  const comingSoon = getComingSoon()
  const source = tab === 'now-showing' ? nowShowing : comingSoon
  const genres = useMemo(() => uniqueValues(source, (m) => m.genres), [source])
  const languages = useMemo(() => uniqueValues(source, (m) => m.languages), [source])

  const movies = source.filter(
    (m) =>
      (!genre || m.genres.includes(genre)) &&
      (!language || m.languages.includes(language)) &&
      movieMatchesQuery(m, query),
  )

  const update = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(params)
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value)
      else next.delete(key)
    }
    setParams(next, { replace: true, preventScrollReset: true })
  }

  const hasFilters = Boolean(genre || language || query)
  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'now-showing', label: 'Now Showing', count: nowShowing.length },
    { id: 'coming-soon', label: 'Coming Soon', count: comingSoon.length },
  ]

  return (
    <div className="page-container pb-20 pt-28 sm:pt-32">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">Movies in {city.name}</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Find your next movie night
        </h1>
        <p className="mt-3 text-zinc-400">
          Browse what's playing across {city.name}, or get ahead of the biggest upcoming releases.
        </p>
      </header>

      <div className="mt-8 inline-flex rounded-full bg-white/[0.05] p-1 ring-1 ring-inset ring-white/10" role="group" aria-label="Release status">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={tab === t.id}
            onClick={() => update({ tab: t.id === 'coming-soon' ? 'coming-soon' : null, genre: null, lang: null })}
            className={cn(
              'inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors duration-200 sm:px-5',
              tab === t.id ? 'bg-brand-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white',
            )}
          >
            {t.label}
            <span className={cn('text-xs', tab === t.id ? 'text-white/70' : 'text-zinc-600')}>{t.count}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        <FilterRow label="Genre">
          <FilterChip selected={!genre} onClick={() => update({ genre: null })}>
            All genres
          </FilterChip>
          {genres.map((g) => (
            <FilterChip key={g} selected={genre === g} onClick={() => update({ genre: genre === g ? null : g })}>
              {g}
            </FilterChip>
          ))}
        </FilterRow>
        <FilterRow label="Language">
          <FilterChip selected={!language} onClick={() => update({ lang: null })}>
            All languages
          </FilterChip>
          {languages.map((l) => (
            <FilterChip key={l} selected={language === l} onClick={() => update({ lang: language === l ? null : l })}>
              {l}
            </FilterChip>
          ))}
        </FilterRow>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-6">
        <p className="text-sm text-zinc-400" aria-live="polite">
          {query ? (
            <>
              {pluralize(movies.length, 'result')} for <span className="text-white">“{query}”</span>
            </>
          ) : (
            pluralize(movies.length, 'movie')
          )}
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={() => update({ genre: null, lang: null, q: null })}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
          >
            <X className="size-4" aria-hidden />
            Clear filters
          </button>
        )}
      </div>

      <div className="mt-6">
        {movies.length === 0 ? (
          <div className="flex flex-col items-center rounded-3xl bg-ink-900 px-6 py-16 text-center ring-1 ring-inset ring-white/[0.06]">
            <Clapperboard className="size-10 text-zinc-600" aria-hidden />
            <p className="mt-4 font-display text-lg font-semibold text-white">No movies match these filters</p>
            <p className="mt-1 max-w-sm text-sm text-zinc-400">Try a different genre or language, or clear your search.</p>
            <Button className="mt-6" variant="secondary" onClick={() => update({ genre: null, lang: null, q: null })}>
              Clear filters
            </Button>
          </div>
        ) : tab === 'now-showing' ? (
          <MovieGrid movies={movies} priorityCount={5} />
        ) : (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4 xl:grid-cols-5">
            {movies.map((movie) => (
              <li key={movie.id}>
                <ComingSoonCard movie={movie} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function FilterRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={label} className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:px-0">
      {children}
    </div>
  )
}
