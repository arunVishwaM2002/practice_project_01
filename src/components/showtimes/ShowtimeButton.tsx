import { Link } from 'react-router'
import type { Show, ShowAvailability } from '@/types'
import { cn } from '@/lib/cn'
import { formatCurrency, formatTime } from '@/lib/format'

const AVAILABILITY: Record<ShowAvailability, { label: string; tone: string; dot: string }> = {
  available: {
    label: 'Available',
    tone: 'text-emerald-300 ring-emerald-400/30 hover:bg-emerald-400/10 hover:ring-emerald-400/70',
    dot: 'bg-emerald-400',
  },
  filling_fast: {
    label: 'Filling fast',
    tone: 'text-amber-300 ring-amber-400/30 hover:bg-amber-400/10 hover:ring-amber-400/70',
    dot: 'bg-amber-400',
  },
  almost_full: {
    label: 'Almost full',
    tone: 'text-rose-300 ring-rose-400/30 hover:bg-rose-400/10 hover:ring-rose-400/70',
    dot: 'bg-rose-400',
  },
}

interface ShowtimeButtonProps {
  show: Show
  /** Marks the show currently being booked */
  current?: boolean
  /** Replace the history entry instead of pushing (switching shows in place) */
  replace?: boolean
  size?: 'md' | 'sm'
}

export function ShowtimeButton({ show, current, replace, size = 'md' }: ShowtimeButtonProps) {
  const { label, tone } = AVAILABILITY[show.availability]
  const detail = `${show.format} · ${show.language}`

  return (
    <Link
      to={`/seat-selection?show=${encodeURIComponent(show.id)}`}
      replace={replace}
      aria-current={current ? 'true' : undefined}
      aria-label={`${formatTime(show.time)}, ${detail}, ${label}, ${formatCurrency(show.price)}`}
      title={`${formatCurrency(show.price)} · ${label}`}
      className={cn(
        'inline-flex flex-col items-center justify-center rounded-xl ring-1 ring-inset transition-colors duration-200',
        size === 'md' ? 'min-w-[112px] px-3.5 py-2' : 'min-w-[88px] px-3 py-1.5',
        current ? 'bg-brand-600 text-white ring-brand-500' : tone,
      )}
    >
      <span className="text-sm font-semibold">{formatTime(show.time)}</span>
      {size === 'md' && (
        <span className={cn('mt-0.5 text-[11px]', current ? 'text-white/80' : 'text-zinc-400')}>{detail}</span>
      )}
    </Link>
  )
}

export function AvailabilityLegend({ className }: { className?: string }) {
  return (
    <ul className={cn('flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-400', className)}>
      {Object.values(AVAILABILITY).map(({ label, dot }) => (
        <li key={label} className="inline-flex items-center gap-1.5">
          <span aria-hidden className={cn('size-2 rounded-full', dot)} />
          {label}
        </li>
      ))}
    </ul>
  )
}
