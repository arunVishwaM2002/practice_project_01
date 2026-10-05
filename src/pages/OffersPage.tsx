import { Film, Popcorn, Tag } from 'lucide-react'
import { getOffers } from '@/services/catalog'
import { OfferCard } from '@/components/offers/OfferCard'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

const STEPS = [
  { icon: Film, title: 'Pick a show', text: 'Choose your movie, cinema and the perfect seats.' },
  { icon: Tag, title: 'Apply the code', text: 'Enter the offer code at checkout before you pay.' },
  { icon: Popcorn, title: 'Enjoy the savings', text: 'Discounts apply instantly. Cashback lands within 48 hours.' },
]

export function OffersPage() {
  useDocumentTitle('Offers | CineBook')
  const offers = getOffers()

  return (
    <div className="page-container pb-20 pt-28 sm:pt-32">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">Offers</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
          Movie nights are better with offers.
        </h1>
        <p className="mt-3 text-zinc-400">
          Handpicked deals on tickets, snacks and weekend plans. Copy a code and apply it at checkout.
        </p>
      </header>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {offers.map((offer) => (
          <li key={offer.id}>
            <OfferCard offer={offer} />
          </li>
        ))}
      </ul>

      <section aria-labelledby="redeem-title" className="mt-16 rounded-3xl bg-ink-900 p-6 ring-1 ring-inset ring-white/[0.06] sm:p-10">
        <h2 id="redeem-title" className="font-display text-xl font-semibold text-white sm:text-2xl">
          How to redeem
        </h2>
        <ol className="mt-6 grid gap-6 sm:grid-cols-3 sm:gap-8">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="flex gap-4">
              <span className="relative grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-600/15 text-brand-300 ring-1 ring-inset ring-brand-500/30">
                <Icon className="size-5" aria-hidden />
                <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-ink-950 text-[10px] font-semibold text-white ring-1 ring-white/15">
                  {i + 1}
                </span>
              </span>
              <div>
                <p className="font-medium text-white">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-400">{text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-8 border-t border-white/[0.06] pt-6 text-xs text-zinc-500">
          Offers can't be combined. One code per booking. Offers may change or be withdrawn at any time.
        </p>
      </section>
    </div>
  )
}
