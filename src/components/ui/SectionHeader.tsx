import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ChevronRight } from 'lucide-react'

interface SectionHeaderProps {
  id?: string
  eyebrow?: string
  title: string
  subtitle?: string
  action?: ReactNode
}

export function SectionHeader({ id, eyebrow, title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">{eyebrow}</p>
        )}
        <h2 id={id} className="font-display text-2xl font-semibold tracking-tight text-white text-balance sm:text-3xl">
          {title}
        </h2>
        {subtitle && <p className="mt-2 text-sm text-zinc-400 sm:text-base">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export function SeeAllLink({ to, children = 'See all' }: { to: string; children?: ReactNode }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-1 rounded-full py-1 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
    >
      {children}
      <ChevronRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
    </Link>
  )
}
