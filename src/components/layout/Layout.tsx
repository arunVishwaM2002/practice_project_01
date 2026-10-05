import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import { Footer } from './Footer'
import { Navbar } from './Navbar'

export function Layout() {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink-950"
      >
        Skip to content
      </a>
      <Navbar />
      {/* Keyed by path so each page plays a short entrance transition */}
      <main id="main" key={pathname} className="flex-1 animate-page-in">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  )
}
