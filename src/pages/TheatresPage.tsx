import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Building2, MapPin } from 'lucide-react'
import type { Amenity, Movie, Theatre } from '@/types'
import { useCity } from '@/context/city'
import { getNowShowing, getTheatres } from '@/services/catalog'
import { Button } from '@/components/ui/Button'
import { FilterChip } from '@/components/ui/FilterChip'
import { SmartImage } from '@/components/ui/SmartImage'
import { CityPickerModal } from '@/components/location/CityPickerModal'
import { AMENITY_ICONS } from '@/components/showtimes/amenities'
import { TheatreCard } from '@/components/showtimes/TheatreCard'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { pluralize } from '@/lib/format'
import { tmdbImage } from '@/lib/images'
import { hashString } from '@/lib/random'

const AMENITY_FILTERS: Amenity[] = ['IMAX', '4DX', 'Dolby Atmos', 'Recliners', 'Wheelchair Access']
const NOW_PLAYING_COUNT = 6

export function TheatresPage() {
  const { city } = useCity()
  const { hash } = useLocation()
  const targetId = decodeURIComponent(hash.slice(1))
  useDocumentTitle(`Cinemas in ${city.name} | CineBook`)
  const [amenity, setAmenity] = useState<Amenity | null>(null)
  const [cityOpen, setCityOpen] = useState(false)

  const theatres = getTheatres(city.id)
  const visible = amenity ? theatres.filter((t) => t.amenities.includes(amenity)) : theatres
  const nowShowing = getNowShowing()

  return (
    <div className="page-container pb-20 pt-28 sm:pt-32">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">Theatres</p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Cinemas in {city.name}
          </h1>
          <p className="mt-3 text-zinc-400">{pluralize(theatres.length, 'cinema')} near you, nearest first.</p>
        </div>
        <div>
          <Button variant="outline" onClick={() => setCityOpen(true)}>
            <MapPin aria-hidden />
            Change city
          </Button>
        </div>
      </header>

      <div
        role="group"
        aria-label="Filter by amenity"
        className="-mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:px-0"
      >
        <FilterChip selected={!amenity} onClick={() => setAmenity(null)}>
          All cinemas
        </FilterChip>
        {AMENITY_FILTERS.map((a) => {
          const Icon = AMENITY_ICONS[a]
          return (
            <FilterChip key={a} selected={amenity === a} onClick={() => setAmenity(amenity === a ? null : a)}>
              <Icon aria-hidden />
              {a}
            </FilterChip>
          )
        })}
      </div>

      {visible.length > 0 ? (
        <ul className="mt-8 space-y-4">
          {visible.map((theatre) => (
            <li key={theatre.id}>
              <TheatreCard id={theatre.id} theatre={theatre} highlighted={theatre.id === targetId}>
                <NowPlaying theatre={theatre} movies={nowShowing} />
              </TheatreCard>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 flex flex-col items-center rounded-3xl bg-ink-900 px-6 py-16 text-center ring-1 ring-inset ring-white/[0.06]">
          <Building2 className="size-10 text-zinc-600" aria-hidden />
          <p className="mt-4 font-display text-lg font-semibold text-white">
            No {amenity} cinemas in {city.name} yet
          </p>
          <p className="mt-1 text-sm text-zinc-400">Try another amenity or switch to a nearby city.</p>
          <Button className="mt-6" variant="secondary" onClick={() => setAmenity(null)}>
            Show all cinemas
          </Button>
        </div>
      )}

      <CityPickerModal open={cityOpen} onClose={() => setCityOpen(false)} />
    </div>
  )
}

function NowPlaying({ theatre, movies }: { theatre: Theatre; movies: Movie[] }) {
  // A stable, theatre-specific selection so each card highlights different films
  const picks = useMemo(() => {
    const seed = theatre.id
    return [...movies]
      .sort((a, b) => hashString(a.id + seed) - hashString(b.id + seed))
      .slice(0, NOW_PLAYING_COUNT)
  }, [theatre.id, movies])
  const remaining = movies.length - picks.length

  return (
    <div>
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Now playing</p>
      <ul className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1 scrollbar-none">
        {picks.map((movie) => (
          <li key={movie.id} className="w-[72px] shrink-0">
            <Link to={`/movie/${movie.id}`} className="group block rounded-lg">
              <div className="overflow-hidden rounded-lg ring-1 ring-white/10">
                <SmartImage
                  src={tmdbImage(movie.poster, 'w185')}
                  alt=""
                  fallbackLabel={movie.title}
                  className="aspect-[2/3] w-full object-cover group-hover:scale-105"
                />
              </div>
              <span className="mt-1.5 block truncate text-[11px] text-zinc-400 transition-colors group-hover:text-white">
                {movie.title}
              </span>
            </Link>
          </li>
        ))}
        {remaining > 0 && (
          <li className="w-[72px] shrink-0">
            <Link
              to="/movies"
              className="grid aspect-[2/3] w-full place-items-center rounded-lg bg-white/[0.04] text-center text-xs font-medium text-zinc-400 ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              +{remaining}
              <br />
              more
            </Link>
          </li>
        )}
      </ul>
    </div>
  )
}
