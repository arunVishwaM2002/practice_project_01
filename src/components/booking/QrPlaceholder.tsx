import { hashString, seededRandom } from '@/lib/random'
import { cn } from '@/lib/cn'

const SIZE = 25
const FINDER = 7

function inFinderZone(x: number, y: number) {
  const near = (v: number, origin: number) => v >= origin && v < origin + FINDER + 1
  return (
    (near(x, 0) && near(y, 0)) ||
    (near(x, SIZE - FINDER - 1) && near(y, 0)) ||
    (near(x, 0) && near(y, SIZE - FINDER - 1))
  )
}

function finder(ox: number, oy: number) {
  // Outer ring, then the solid 3×3 centre
  return `M${ox} ${oy}h7v7h-7z M${ox + 1} ${oy + 1}v5h5v-5z M${ox + 2} ${oy + 2}h3v3h-3z`
}

/** Decorative QR-style pattern seeded by the booking ID. Not scannable. */
export function QrPlaceholder({ value, className }: { value: string; className?: string }) {
  const random = seededRandom(hashString(value))
  let modules = ''
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (!inFinderZone(x, y) && random() < 0.48) modules += `M${x} ${y}h1v1h-1z`
    }
  }
  const finders = finder(0, 0) + finder(SIZE - FINDER, 0) + finder(0, SIZE - FINDER)

  return (
    <div
      role="img"
      aria-label={`QR code placeholder for booking ${value}`}
      className={cn('rounded-2xl bg-white p-3 shadow-[0_10px_40px_-12px_rgb(255_255_255/0.25)]', className)}
    >
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="size-full" shapeRendering="crispEdges" aria-hidden>
        <path d={finders} fill="#0b0b0f" fillRule="evenodd" />
        <path d={modules} fill="#0b0b0f" />
      </svg>
    </div>
  )
}
