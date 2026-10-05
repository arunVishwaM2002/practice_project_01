import type { ComponentType, SVGProps } from 'react'
import { Logo } from '@/components/ui/Logo'
import { FacebookIcon, InstagramIcon, XIcon, YouTubeIcon } from '@/components/icons/BrandIcons'

const COLUMNS = [
  { title: 'Company', links: ['About', 'Careers', 'Contact'] },
  { title: 'Support', links: ['Help Center', 'Terms', 'Privacy Policy', 'Cancellation Policy'] },
]

const SOCIALS: { label: string; icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { label: 'Instagram', icon: InstagramIcon },
  { label: 'Facebook', icon: FacebookIcon },
  { label: 'X', icon: XIcon },
  { label: 'YouTube', icon: YouTubeIcon },
]

// Placeholder destinations until these pages exist
const PLACEHOLDER_HREF = '#'

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-ink-950 print:hidden">
      <div className="page-container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:py-16">
        <div>
          <Logo />
          <p className="mt-5 font-display text-lg font-medium text-white">Your movie night starts here.</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-400">
            Book tickets for the latest releases at cinemas across India — pick your seats in seconds.
          </p>
        </div>

        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{column.title}</h2>
            <ul className="mt-4 space-y-3">
              {column.links.map((label) => (
                <li key={label}>
                  <a href={PLACEHOLDER_HREF} className="text-sm text-zinc-300 transition-colors hover:text-white">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Follow Us</h2>
          <ul className="mt-4 space-y-3">
            {SOCIALS.map(({ label, icon: Icon }) => (
              <li key={label}>
                <a
                  href={PLACEHOLDER_HREF}
                  className="group inline-flex items-center gap-3 text-sm text-zinc-300 transition-colors hover:text-white"
                >
                  <span className="grid size-8 place-items-center rounded-full bg-white/[0.05] ring-1 ring-inset ring-white/10 transition-colors group-hover:bg-brand-600 group-hover:ring-transparent">
                    <Icon className="size-4" />
                  </span>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="page-container flex flex-col gap-2 py-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 CineBook. All rights reserved.</p>
          <p>Made for movie lovers across India.</p>
        </div>
      </div>
    </footer>
  )
}
