import type { ShowDate } from '@/types'
import { cn } from '@/lib/cn'

interface DateSelectorProps {
  dates: ShowDate[]
  value: string
  onChange: (date: string) => void
  className?: string
}

export function DateSelector({ dates, value, onChange, className }: DateSelectorProps) {
  return (
    <div
      role="group"
      aria-label="Select date"
      className={cn('-mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:px-0', className)}
    >
      {dates.map((d) => {
        const selected = d.date === value
        return (
          <button
            key={d.date}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(d.date)}
            className={cn(
              'flex min-w-[80px] shrink-0 flex-col items-center rounded-2xl px-4 py-2.5 ring-1 ring-inset transition-all duration-200',
              selected
                ? 'bg-brand-600 text-white shadow-[0_10px_24px_-12px_rgb(224_18_58/0.9)] ring-brand-500'
                : 'bg-white/[0.04] text-zinc-300 ring-white/10 hover:bg-white/[0.08] hover:text-white',
            )}
          >
            <span
              className={cn(
                'text-[11px] font-medium uppercase tracking-wider',
                selected ? 'text-white/75' : 'text-zinc-500',
              )}
            >
              {d.weekday}
            </span>
            <span className="mt-0.5 text-sm font-semibold whitespace-nowrap">{d.label}</span>
          </button>
        )
      })}
    </div>
  )
}
