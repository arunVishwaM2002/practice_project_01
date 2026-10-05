import { Anchor, Building2, Castle, Check, Landmark, MapPin, Mountain, Sun, TramFront, Trees, type LucideIcon } from 'lucide-react'
import type { City } from '@/types'
import { cn } from '@/lib/cn'

const CITY_ICONS: Record<string, LucideIcon> = {
  bangalore: Trees,
  mumbai: Building2,
  delhi: Landmark,
  hyderabad: Castle,
  chennai: Sun,
  pune: Mountain,
  kochi: Anchor,
  kolkata: TramFront,
}

interface CitySelectorProps {
  cities: City[]
  selectedId: string
  onSelect: (id: string) => void
  /** `row`: 8 across on desktop. `grid`: 4 across, for dialogs. */
  layout?: 'row' | 'grid'
}

export function CitySelector({ cities, selectedId, onSelect, layout = 'row' }: CitySelectorProps) {
  return (
    <ul
      className={cn(
        'grid grid-cols-2 gap-3',
        layout === 'row' ? 'sm:grid-cols-4 lg:grid-cols-8' : 'sm:grid-cols-4',
      )}
    >
      {cities.map((city) => {
        const Icon = CITY_ICONS[city.id] ?? MapPin
        const selected = city.id === selectedId
        return (
          <li key={city.id}>
            <button
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(city.id)}
              className={cn(
                'group relative flex w-full flex-col items-center gap-3 rounded-2xl px-3 py-5 text-center ring-1 ring-inset transition duration-200',
                selected
                  ? 'bg-brand-600/10 shadow-[0_12px_30px_-16px_rgb(224_18_58/0.7)] ring-brand-500/60'
                  : 'bg-white/[0.03] ring-white/[0.08] hover:-translate-y-0.5 hover:bg-white/[0.06] hover:ring-white/20',
              )}
            >
              <span
                className={cn(
                  'grid size-12 place-items-center rounded-full transition-colors duration-200',
                  selected ? 'bg-brand-600 text-white' : 'bg-white/[0.06] text-zinc-300 group-hover:text-white',
                )}
              >
                <Icon className="size-5" strokeWidth={1.75} aria-hidden />
              </span>
              <span>
                <span className="block text-sm font-semibold text-white">{city.name}</span>
                <span className="block text-xs text-zinc-500">{city.state}</span>
              </span>
              {selected && (
                <span aria-hidden className="absolute right-2.5 top-2.5 grid size-5 place-items-center rounded-full bg-brand-600">
                  <Check className="size-3 text-white" strokeWidth={3} />
                </span>
              )}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
