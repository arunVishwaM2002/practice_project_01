import { useState } from 'react'
import { BadgePercent, Check, Copy, Gift, Popcorn, Wallet, type LucideIcon } from 'lucide-react'
import type { Offer, OfferKind } from '@/types'
import { cn } from '@/lib/cn'

const KIND_STYLES: Record<OfferKind, { icon: LucideIcon; glow: string; badge: string }> = {
  flat: { icon: Gift, glow: 'bg-brand-600/30', badge: 'bg-brand-600/15 text-brand-300 ring-brand-500/30' },
  percent: { icon: BadgePercent, glow: 'bg-amber-500/20', badge: 'bg-amber-500/10 text-amber-300 ring-amber-400/25' },
  cashback: { icon: Wallet, glow: 'bg-violet-500/20', badge: 'bg-violet-500/10 text-violet-300 ring-violet-400/25' },
  combo: { icon: Popcorn, glow: 'bg-sky-500/20', badge: 'bg-sky-500/10 text-sky-300 ring-sky-400/25' },
}

export function OfferCard({ offer }: { offer: Offer }) {
  const [copied, setCopied] = useState(false)
  const { icon: Icon, glow, badge } = KIND_STYLES[offer.kind]

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(offer.code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard access can be denied; the code stays visible to copy by hand
    }
  }

  return (
    <article className="relative isolate flex h-full flex-col overflow-hidden rounded-3xl bg-ink-900 ring-1 ring-inset ring-white/[0.07] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgb(0_0_0/0.9)]">
      <div aria-hidden className={cn('absolute -right-20 -top-20 -z-10 size-56 rounded-full blur-3xl', glow)} />

      <div className="flex-1 p-6 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <span className={cn('grid size-11 place-items-center rounded-2xl ring-1 ring-inset', badge)}>
            <Icon className="size-5" aria-hidden />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">{offer.tag}</span>
        </div>
        <h3 className="mt-6">
          <span className="block font-display text-3xl font-semibold tracking-tight text-white">{offer.headline}</span>
          <span className="mt-1 block text-base text-zinc-300">{offer.subtitle}</span>
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">{offer.description}</p>
      </div>

      {/* Ticket perforation */}
      <div aria-hidden className="relative mx-6 border-t border-dashed border-white/15 sm:mx-7">
        <span className="absolute -left-9 -top-3 size-6 rounded-full bg-ink-950 sm:-left-10" />
        <span className="absolute -right-9 -top-3 size-6 rounded-full bg-ink-950 sm:-right-10" />
      </div>

      <div className="flex items-center justify-between gap-3 px-6 pb-6 pt-5 sm:px-7">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wider text-zinc-500">Use code</p>
          <p className="font-mono text-sm font-semibold tracking-wider text-white">{offer.code}</p>
          <p className="mt-1 text-xs text-zinc-500">{offer.validity}</p>
        </div>
        <button
          type="button"
          onClick={copyCode}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-white/[0.06] px-3.5 text-xs font-medium text-zinc-200 ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/10 hover:text-white"
        >
          {copied ? <Check className="size-3.5 text-emerald-400" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
          <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
          <span className="sr-only"> code {offer.code}</span>
        </button>
      </div>
    </article>
  )
}
