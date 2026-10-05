import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router'
import { Building2, MapPin, Search, TrendingUp, X } from 'lucide-react'
import { useCity } from '@/context/city'
import { getCity, getNowShowing, searchCatalog } from '@/services/catalog'
import { SmartImage } from '@/components/ui/SmartImage'
import { cn } from '@/lib/cn'
import { formatGenres } from '@/lib/format'
import { tmdbImage } from '@/lib/images'

interface SearchItem {
  key: string
  group: 'Movies' | 'Theatres' | 'Cities'
  label: string
  meta: string
  to: string
  cityId?: string
  poster?: string
  badge?: string
}

interface SearchBarProps {
  size?: 'md' | 'lg'
  /** `dropdown` floats results under the field; `inline` renders them below it */
  mode?: 'dropdown' | 'inline'
  autoFocus?: boolean
  /** Called after the user picks a result or submits */
  onDone?: () => void
  className?: string
}

export function SearchBar({ size = 'md', mode = 'dropdown', autoFocus, onDone, className }: SearchBarProps) {
  const navigate = useNavigate()
  const { setCityId } = useCity()
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()
  const listId = useId()

  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)

  const items = useMemo<SearchItem[]>(() => {
    const { movies, theatres, cities } = searchCatalog(query)
    return [
      ...movies.map<SearchItem>((m) => ({
        key: `movie-${m.id}`,
        group: 'Movies',
        label: m.title,
        meta: `${formatGenres(m.genres, 2)} · ${m.languages[0]}`,
        to: `/movie/${m.id}`,
        poster: m.poster,
        badge: m.status === 'coming_soon' ? 'Coming soon' : undefined,
      })),
      ...theatres.map<SearchItem>((t) => ({
        key: `theatre-${t.id}`,
        group: 'Theatres',
        label: t.name,
        meta: `${t.area} · ${getCity(t.cityId)?.name ?? ''}`,
        to: `/theatres#${t.id}`,
        cityId: t.cityId,
      })),
      ...cities.map<SearchItem>((c) => ({
        key: `city-${c.id}`,
        group: 'Cities',
        label: c.name,
        meta: c.state,
        to: '/theatres',
        cityId: c.id,
      })),
    ]
  }, [query])

  const hasQuery = query.trim().length > 0
  const expanded = hasQuery && (mode === 'inline' || open)

  // Close the floating panel when clicking elsewhere
  useEffect(() => {
    if (mode !== 'dropdown' || !open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [mode, open])

  const finish = () => {
    setQuery('')
    setActive(-1)
    setOpen(false)
    inputRef.current?.blur()
    onDone?.()
  }

  const select = (item: SearchItem) => {
    if (item.cityId) setCityId(item.cityId)
    navigate(item.to)
    finish()
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (active >= 0 && items[active]) return select(items[active])
    const q = query.trim()
    if (!q) return
    navigate(`/movies?q=${encodeURIComponent(q)}`)
    finish()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setActive((i) => Math.min(i + 1, items.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((i) => Math.max(i - 1, -1))
    } else if (event.key === 'Escape' && mode === 'dropdown' && open) {
      event.stopPropagation()
      setOpen(false)
    }
  }

  const groups = (['Movies', 'Theatres', 'Cities'] as const)
    .map((group) => ({ group, entries: items.map((item, index) => ({ item, index })).filter((e) => e.item.group === group) }))
    .filter((g) => g.entries.length > 0)

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <form
        role="search"
        onSubmit={onSubmit}
        className={cn(
          'flex items-center gap-3 rounded-full bg-white/[0.07] ring-1 ring-inset ring-white/15 backdrop-blur-xl transition duration-200 focus-within:bg-white/10 focus-within:ring-brand-500/60',
          size === 'lg' ? 'h-14 pl-5 pr-1.5 sm:h-16 sm:pl-6 sm:pr-2' : 'h-12 pl-4 pr-1.5',
        )}
      >
        <Search className="size-5 shrink-0 text-zinc-400" aria-hidden />
        <label htmlFor={inputId} className="sr-only">
          Search for movies, theatres or cities
        </label>
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={expanded}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={expanded && active >= 0 ? `${listId}-${active}` : undefined}
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
          data-autofocus={autoFocus || undefined}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActive(-1)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search for movies, theatres or cities..."
          className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-white outline-none placeholder:text-zinc-400"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}
            className="grid size-9 shrink-0 place-items-center rounded-full text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="size-4" />
          </button>
        )}
        {size === 'lg' && (
          <button
            type="submit"
            className="hidden h-11 shrink-0 items-center rounded-full bg-brand-600 px-6 text-sm font-medium text-white transition-colors hover:bg-brand-500 sm:inline-flex sm:h-12"
          >
            Search
          </button>
        )}
      </form>

      <div
        id={listId}
        role="listbox"
        aria-label="Search results"
        hidden={!expanded}
        className={cn(
          mode === 'dropdown'
            ? 'absolute inset-x-0 top-full z-30 mt-2 max-h-[min(60vh,440px)] overflow-y-auto rounded-2xl bg-ink-900 p-2 shadow-[0_24px_60px_-12px_rgb(0_0_0/0.9)] ring-1 ring-white/10 animate-scale-in'
            : 'mt-4',
        )}
      >
        {expanded && groups.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-sm font-medium text-white">No results for “{query.trim()}”</p>
            <p className="mt-1 text-sm text-zinc-500">Try a movie title, actor, genre or city.</p>
          </div>
        )}
        {expanded &&
          groups.map(({ group, entries }) => (
            <div key={group} role="group" aria-labelledby={`${listId}-${group}`} className="py-1">
              <div
                id={`${listId}-${group}`}
                role="presentation"
                className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
              >
                {group}
              </div>
              {entries.map(({ item, index }) => (
                <div
                  key={item.key}
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={index === active}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => select(item)}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors',
                    index === active ? 'bg-white/[0.08]' : 'hover:bg-white/[0.05]',
                  )}
                >
                  <ResultIcon item={item} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{item.label}</p>
                    <p className="truncate text-xs text-zinc-500">{item.meta}</p>
                  </div>
                  {item.badge && (
                    <span className="shrink-0 rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-zinc-400">
                      {item.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
      </div>

      {mode === 'inline' && !hasQuery && (
        <TrendingSuggestions
          onPick={(movieId) => {
            navigate(`/movie/${movieId}`)
            finish()
          }}
        />
      )}
    </div>
  )
}

function ResultIcon({ item }: { item: SearchItem }) {
  if (item.poster) {
    return (
      <SmartImage
        src={tmdbImage(item.poster, 'w185')}
        alt=""
        className="h-12 w-8 shrink-0 rounded-md object-cover ring-1 ring-white/10"
      />
    )
  }
  const Icon = item.group === 'Theatres' ? Building2 : MapPin
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/[0.06] text-zinc-400">
      <Icon className="size-4" aria-hidden />
    </span>
  )
}

function TrendingSuggestions({ onPick }: { onPick: (movieId: string) => void }) {
  const trending = getNowShowing().slice(0, 6)
  return (
    <div className="mt-6">
      <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
        <TrendingUp className="size-3.5" aria-hidden />
        Trending searches
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {trending.map((movie) => (
          <li key={movie.id}>
            <button
              type="button"
              onClick={() => onPick(movie.id)}
              className="rounded-full bg-white/[0.05] px-3.5 py-2 text-sm text-zinc-300 ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/10 hover:text-white"
            >
              {movie.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
