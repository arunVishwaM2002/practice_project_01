import { useEffect, useState } from 'react'
import { NavLink } from 'react-router'
import { ChevronDown, ChevronRight, MapPin, Menu, Search, X } from 'lucide-react'
import { useCity } from '@/context/city'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'
import { useScrolled } from '@/hooks/useScrolled'
import { ButtonLink, IconButton } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { Modal } from '@/components/ui/Modal'
import { CityPickerModal } from '@/components/location/CityPickerModal'
import { SearchBar } from '@/components/search/SearchBar'
import { cn } from '@/lib/cn'

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/movies', label: 'Movies', end: false },
  { to: '/theatres', label: 'Theatres', end: false },
  { to: '/offers', label: 'Offers', end: false },
]

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
  )
}

export function Navbar() {
  const { city } = useCity()
  const scrolled = useScrolled(12)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)

  useBodyScrollLock(menuOpen)

  // "/" opens search from anywhere, as on most media sites
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === '/' && !event.metaKey && !event.ctrlKey && !isTypingTarget(event.target)) {
        event.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  const closeMenu = () => setMenuOpen(false)
  const solid = scrolled || menuOpen

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300 print:hidden',
        solid
          ? 'border-white/[0.06] bg-ink-950/80 backdrop-blur-xl'
          : 'border-transparent bg-linear-to-b from-black/60 to-transparent',
      )}
    >
      <nav aria-label="Primary" className="page-container flex h-16 items-center gap-2 lg:h-[72px]">
        <Logo onClick={closeMenu} />

        <ul className="ml-10 hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    'relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200',
                    isActive ? 'text-white' : 'text-zinc-400 hover:text-white',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span
                      aria-hidden
                      className={cn(
                        'absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-brand-500 transition-opacity duration-200',
                        isActive ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Visual order differs by breakpoint: location before search on phones, after it on desktop */}
        <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
          <button
            type="button"
            onClick={() => setCityOpen(true)}
            aria-label={`Change city. Current city: ${city.name}`}
            className="order-1 inline-flex h-10 items-center gap-1.5 rounded-full px-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/10 sm:px-3 lg:order-2"
          >
            <MapPin className="size-4 text-brand-400" aria-hidden />
            <span className="hidden max-w-[5.5rem] truncate min-[375px]:inline sm:max-w-[7rem]">{city.name}</span>
            <ChevronDown className="hidden size-3.5 text-zinc-500 sm:block" aria-hidden />
          </button>

          <IconButton label="Search (press /)" onClick={() => setSearchOpen(true)} className="order-2 lg:order-1">
            <Search />
          </IconButton>

          <div className="order-3 ml-1 hidden lg:block">
            <ButtonLink to="/login" size="sm" className="px-5">
              Login
            </ButtonLink>
          </div>

          <IconButton
            label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="order-4 lg:hidden"
          >
            {menuOpen ? <X /> : <Menu />}
          </IconButton>
        </div>
      </nav>

      {menuOpen && <MobileMenu onClose={closeMenu} />}

      <Modal open={searchOpen} onClose={() => setSearchOpen(false)} title="Search CineBook" variant="search" size="lg">
        <SearchBar mode="inline" autoFocus onDone={() => setSearchOpen(false)} />
      </Modal>
      <CityPickerModal open={cityOpen} onClose={() => setCityOpen(false)} />
    </header>
  )
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div
      id="mobile-menu"
      className="absolute inset-x-0 top-full h-[calc(100dvh-4rem)] animate-fade-in overflow-y-auto border-t border-white/[0.06] bg-ink-950 px-4 pb-10 pt-4 sm:px-6 lg:hidden"
    >
      <ul className="space-y-1">
        {NAV_LINKS.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between rounded-2xl px-4 py-4 font-display text-xl font-semibold transition-colors',
                  isActive ? 'bg-white/[0.06] text-white' : 'text-zinc-300 hover:bg-white/[0.04] hover:text-white',
                )
              }
            >
              {link.label}
              <ChevronRight className="size-5 text-zinc-600" aria-hidden />
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <ButtonLink to="/login" variant="outline" size="lg" onClick={onClose}>
          Login
        </ButtonLink>
        <ButtonLink to="/signup" size="lg" onClick={onClose}>
          Sign up
        </ButtonLink>
      </div>
      <p className="mt-10 text-center font-display text-sm text-zinc-500">Your movie night starts here.</p>
    </div>
  )
}
