import type { ReactNode } from 'react'
import { Armchair, BadgePercent, Info, Smartphone } from 'lucide-react'
import { getNowShowing } from '@/services/catalog'
import { Button } from '@/components/ui/Button'
import { LogoMark } from '@/components/ui/Logo'
import { SmartImage } from '@/components/ui/SmartImage'
import { GoogleIcon } from '@/components/icons/BrandIcons'
import { cn } from '@/lib/cn'
import { tmdbImage } from '@/lib/images'

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}

const PERKS = [
  { icon: Armchair, text: 'Pick the perfect seat, every time' },
  { icon: BadgePercent, text: 'Member-only offers and cashback' },
  { icon: Smartphone, text: 'M-tickets — skip the queue at the counter' },
]

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  const posters = getNowShowing().slice(0, 12)
  const columns = [posters.slice(0, 4), posters.slice(4, 8), posters.slice(8, 12)]

  return (
    <div className="relative isolate overflow-hidden">
      <div aria-hidden className="absolute -right-48 top-24 -z-10 size-[36rem] rounded-full bg-brand-700/15 blur-[140px]" />

      <div className="page-container grid min-h-dvh gap-12 pb-16 pt-24 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-28">
        <div aria-hidden className="relative hidden min-h-[600px] overflow-hidden rounded-[28px] bg-ink-900 ring-1 ring-inset ring-white/[0.08] lg:block">
          <div className="absolute -inset-x-16 -top-24 grid -rotate-6 grid-cols-3 gap-4 opacity-60">
            {columns.map((column, i) => (
              <div key={i} className={cn('flex flex-col gap-4', i === 1 && 'translate-y-20')}>
                {column.map((movie) => (
                  <SmartImage
                    key={movie.id}
                    src={tmdbImage(movie.poster, 'w342')}
                    alt=""
                    className="aspect-[2/3] w-full rounded-2xl object-cover ring-1 ring-white/10"
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-ink-950 via-ink-950/70 to-ink-950/10" />
          <div className="absolute inset-x-0 bottom-0 p-10 xl:p-12">
            <LogoMark className="size-10" />
            <p className="mt-6 font-display text-3xl leading-tight font-semibold text-white xl:text-4xl">
              Your movie night
              <br />
              starts here.
            </p>
            <ul className="mt-6 space-y-3">
              {PERKS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-zinc-300">
                  <span className="grid size-8 place-items-center rounded-full bg-white/[0.08] ring-1 ring-inset ring-white/10">
                    <Icon className="size-4 text-brand-300" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
            <p className="mt-2 text-zinc-400">{subtitle}</p>
            <div className="mt-8">{children}</div>
            {footer && <p className="mt-8 text-center text-sm text-zinc-400">{footer}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export function AuthDivider() {
  return (
    <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-[0.18em] text-zinc-500">
      <span className="h-px flex-1 bg-white/10" />
      or
      <span className="h-px flex-1 bg-white/10" />
    </div>
  )
}

export function GoogleButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="outline" size="lg" fullWidth onClick={onClick}>
      <GoogleIcon />
      Continue with Google
    </Button>
  )
}

/** Shown when a user tries an auth action — accounts arrive in a later phase */
export function AuthNotice() {
  return (
    <p
      role="status"
      className="mt-5 flex animate-fade-in gap-3 rounded-2xl bg-white/[0.04] p-4 text-sm leading-relaxed text-zinc-300 ring-1 ring-inset ring-white/10"
    >
      <Info className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden />
      Sign-in isn't live yet — accounts are coming in the next release. You can still browse and book as a guest.
    </p>
  )
}
