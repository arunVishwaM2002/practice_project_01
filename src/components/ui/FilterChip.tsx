import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface FilterChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected: boolean
}

export function FilterChip({ selected, className, type = 'button', ...props }: FilterChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cn(
        'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 text-[13px] font-medium whitespace-nowrap transition-colors duration-200 [&_svg]:size-4',
        selected
          ? 'bg-white text-ink-950'
          : 'bg-white/[0.05] text-zinc-300 ring-1 ring-inset ring-white/10 hover:bg-white/10 hover:text-white',
        className,
      )}
      {...props}
    />
  )
}
