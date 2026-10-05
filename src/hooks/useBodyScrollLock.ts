import { useEffect } from 'react'

// Counted so stacked overlays (e.g. a modal opened from the mobile menu)
// only release the lock once the last one closes.
let activeLocks = 0
let previousOverflow = ''

export function useBodyScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return
    if (activeLocks++ === 0) {
      previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }
    return () => {
      if (--activeLocks === 0) document.body.style.overflow = previousOverflow
    }
  }, [active])
}
