import { ArrowRight } from 'lucide-react'
import { useCity } from '@/context/city'
import { getCities, getTheatres } from '@/services/catalog'
import { ButtonLink } from '@/components/ui/Button'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { CitySelector } from '@/components/location/CitySelector'
import { TheatreCard } from '@/components/showtimes/TheatreCard'
import { pluralize } from '@/lib/format'

export function CitySpotlight() {
  const { city, setCityId } = useCity()
  const theatres = getTheatres(city.id)

  return (
    <section aria-labelledby="city-title" className="page-container py-16 sm:py-24">
      <SectionHeader
        id="city-title"
        title="Movies in Your City"
        subtitle="Pick your city to see cinemas and showtimes near you."
      />
      <CitySelector cities={getCities()} selectedId={city.id} onSelect={setCityId} />

      <div className="mt-6 rounded-3xl bg-ink-900 p-5 ring-1 ring-inset ring-white/[0.06] sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div aria-live="polite">
            <p className="text-sm text-zinc-400">{pluralize(theatres.length, 'cinema')} in</p>
            <h3 className="font-display text-xl font-semibold text-white">{city.name}</h3>
          </div>
          <ButtonLink to="/theatres" variant="outline" size="sm">
            View all cinemas
            <ArrowRight aria-hidden />
          </ButtonLink>
        </div>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {theatres.slice(0, 3).map((theatre) => (
            <li key={theatre.id}>
              <TheatreCard theatre={theatre} variant="compact" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
