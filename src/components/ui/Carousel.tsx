import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'

interface CarouselProps {
  label: string
  children: ReactNode
  className?: string
}

/** Scroll-snap row. Swipe on touch; arrow buttons appear on large screens. */
export function Carousel({ label, children, className }: CarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null)
  const [edges, setEdges] = useState({ atStart: true, atEnd: false })

  const updateEdges = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setEdges({
      atStart: el.scrollLeft <= 4,
      atEnd: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    })
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    updateEdges()
    const observer = new ResizeObserver(updateEdges)
    observer.observe(el)
    return () => observer.disconnect()
  }, [updateEdges])

  const scrollByPage = (direction: 1 | -1) => {
    const el = trackRef.current
    el?.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: 'smooth' })
  }

  return (
    <div className={cn('group/carousel relative', className)}>
      <ul
        ref={trackRef}
        aria-label={label}
        onScroll={updateEdges}
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 scrollbar-none sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:gap-5 lg:px-0"
      >
        {children}
      </ul>
      <CarouselArrow direction={-1} hidden={edges.atStart} onClick={() => scrollByPage(-1)} />
      <CarouselArrow direction={1} hidden={edges.atEnd} onClick={() => scrollByPage(1)} />
    </div>
  )
}

export function CarouselItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <li
      className={cn(
        'w-[44%] shrink-0 snap-start sm:w-[30%] md:w-[23%] lg:w-[calc((100%-4*1.25rem)/5)]',
        className,
      )}
    >
      {children}
    </li>
  )
}

function CarouselArrow({ direction, hidden, onClick }: { direction: 1 | -1; hidden: boolean; onClick: () => void }) {
  const Icon = direction === 1 ? ChevronRight : ChevronLeft
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 1 ? 'Scroll right' : 'Scroll left'}
      tabIndex={hidden ? -1 : 0}
      className={cn(
        'absolute top-[36%] z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink-900/90 text-white shadow-xl ring-1 ring-white/15 backdrop-blur transition-all duration-200 hover:bg-ink-700 lg:flex',
        direction === 1 ? '-right-5' : '-left-5',
        hidden ? 'pointer-events-none opacity-0' : 'opacity-0 group-hover/carousel:opacity-100 focus-visible:opacity-100',
      )}
    >
      <Icon className="size-5" />
    </button>
  )
}
