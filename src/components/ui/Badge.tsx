import type { ReactNode } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/cn'

export function CertificationBadge({ value, className }: { value: string; className?: string }) {
  return (
    <span
      title="CBFC certification"
      className={cn(
        'inline-flex h-5 items-center rounded-[5px] px-1.5 text-[10px] font-semibold tracking-wide text-zinc-100 ring-1 ring-inset ring-white/30',
        className,
      )}
    >
      {value}
    </span>
  )
}

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1 text-xs font-medium text-zinc-300 ring-1 ring-inset ring-white/10',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function Rating({ value, suffix, className }: { value: number; suffix?: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      <Star className="size-[1.05em] fill-gold-400 text-gold-400" aria-hidden />
      <span className="font-semibold text-white">{value.toFixed(1)}</span>
      {suffix}
    </span>
  )
}
