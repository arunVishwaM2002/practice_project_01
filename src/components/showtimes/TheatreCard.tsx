import type { ReactNode } from 'react'
import { MapPin, ShieldCheck } from 'lucide-react'
import type { Theatre } from '@/types'
import { cn } from '@/lib/cn'
import { hashString } from '@/lib/random'
import { AMENITY_ICONS } from './amenities'

const MONOGRAM_TONES = [
  'from-brand-500/30 to-brand-800/30 text-brand-200',
  'from-sky-500/25 to-indigo-700/25 text-sky-200',
  'from-amber-400/25 to-orange-700/25 text-amber-200',
  'from-emerald-400/20 to-teal-700/25 text-emerald-200',
]

function Monogram({ brand }: { brand: string }) {
  const label = brand.length <= 4 ? brand.toUpperCase() : brand.slice(0, 2).toUpperCase()
  const tone = MONOGRAM_TONES[hashString(brand) % MONOGRAM_TONES.length]
  return (
    <span
      aria-hidden
      className={cn(
        'grid size-12 shrink-0 place-items-center rounded-xl bg-linear-to-br text-[11px] font-bold tracking-wider ring-1 ring-inset ring-white/10',
        tone,
      )}
    >
      {label}
    </span>
  )
}

interface TheatreCardProps {
  theatre: Theatre
  variant?: 'full' | 'compact'
  /** Rendered in the right-hand slot of `full` cards (e.g. showtimes) */
  children?: ReactNode
  id?: string
  /** Draws attention to the card, e.g. when linked to from search */
  highlighted?: boolean
}

export function TheatreCard({ theatre, variant = 'full', children, id, highlighted }: TheatreCardProps) {
  if (variant === 'compact') {
    return (
      <div className="flex h-full items-center gap-4 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-inset ring-white/[0.06]">
        <Monogram brand={theatre.brand} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{theatre.name}</p>
          <p className="mt-0.5 truncate text-xs text-zinc-400">
            {theatre.area} · {theatre.distanceKm.toFixed(1)} km
          </p>
          <AmenityIcons theatre={theatre} limit={4} className="mt-2" />
        </div>
      </div>
    )
  }

  return (
    <article
      id={id}
      className={cn(
        'scroll-mt-28 rounded-3xl bg-ink-900 p-5 ring-inset transition-shadow duration-300 sm:p-6',
        highlighted
          ? 'shadow-[0_20px_50px_-24px_rgb(224_18_58/0.6)] ring-2 ring-brand-500/70'
          : 'ring-1 ring-white/[0.07]',
      )}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-8">
        <div className="flex min-w-0 gap-4 lg:w-[38%] lg:shrink-0">
          <Monogram brand={theatre.brand} />
          <div className="min-w-0">
            <h3 className="font-display text-base font-semibold text-white sm:text-lg">{theatre.name}</h3>
            <p className="mt-1 flex items-start gap-1.5 text-sm text-zinc-400">
              <MapPin className="mt-0.5 size-3.5 shrink-0 text-zinc-500" aria-hidden />
              <span>
                {theatre.address} · <span className="whitespace-nowrap">{theatre.distanceKm.toFixed(1)} km away</span>
              </span>
            </p>
            <AmenityIcons theatre={theatre} withLabels className="mt-3" />
            {theatre.cancellationAvailable && (
              <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                <ShieldCheck className="size-3.5" aria-hidden />
                Cancellation available
              </p>
            )}
          </div>
        </div>
        {children && <div className="min-w-0 flex-1">{children}</div>}
      </div>
    </article>
  )
}

interface AmenityIconsProps {
  theatre: Theatre
  withLabels?: boolean
  limit?: number
  className?: string
}

function AmenityIcons({ theatre, withLabels, limit, className }: AmenityIconsProps) {
  const amenities = limit ? theatre.amenities.slice(0, limit) : theatre.amenities
  return (
    <ul aria-label="Amenities" className={cn('flex flex-wrap gap-1.5', className)}>
      {amenities.map((amenity) => {
        const Icon = AMENITY_ICONS[amenity]
        return withLabels ? (
          <li
            key={amenity}
            className="inline-flex items-center gap-1 rounded-md bg-white/[0.04] px-2 py-1 text-[11px] text-zinc-400 ring-1 ring-inset ring-white/[0.06]"
          >
            <Icon className="size-3.5" aria-hidden />
            {amenity}
          </li>
        ) : (
          <li key={amenity} title={amenity} className="text-zinc-500">
            <Icon className="size-3.5" aria-hidden />
            <span className="sr-only">{amenity}</span>
          </li>
        )
      })}
    </ul>
  )
}
