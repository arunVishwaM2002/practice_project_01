import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'
import { cn } from '@/lib/cn'
import { IconButton } from './Button'

type ModalVariant = 'dialog' | 'search' | 'media'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  /** Keeps the title for screen readers but hides it visually */
  hideTitle?: boolean
  variant?: ModalVariant
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: ReactNode
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'

const sizes = { sm: 'sm:max-w-md', md: 'sm:max-w-lg', lg: 'sm:max-w-2xl', xl: 'sm:max-w-5xl' }

const layout: Record<ModalVariant, { wrapper: string; panel: string }> = {
  // Bottom sheet on phones, centred card from `sm` up
  dialog: {
    wrapper: 'items-end sm:items-center sm:p-6',
    panel: 'max-h-[88dvh] rounded-t-3xl animate-slide-up sm:rounded-3xl sm:animate-scale-in',
  },
  // Full screen on phones, anchored near the top on larger screens
  search: {
    wrapper: 'items-stretch sm:items-start sm:p-6 sm:pt-[12vh]',
    panel: 'h-dvh sm:h-auto sm:max-h-[76vh] sm:rounded-3xl animate-scale-in',
  },
  media: {
    wrapper: 'items-center p-3 sm:p-8',
    panel: 'rounded-3xl animate-scale-in',
  },
}

export function Modal({
  open,
  onClose,
  title,
  description,
  hideTitle,
  variant = 'dialog',
  size = 'md',
  children,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    onCloseRef.current = onClose
  })

  useBodyScrollLock(open)

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    const previouslyFocused = document.activeElement as HTMLElement | null
    const focusables = () => Array.from(panel?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])

    const autoFocus = panel?.querySelector<HTMLElement>('[data-autofocus]')
    ;(autoFocus ?? focusables()[0] ?? panel)?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') return
      const items = focusables()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus?.()
    }
  }, [open])

  if (!open) return null

  const { wrapper, panel } = layout[variant]

  return createPortal(
    <div className={cn('fixed inset-0 z-[100] flex justify-center', wrapper)}>
      <div aria-hidden className="absolute inset-0 animate-fade-in bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          'relative flex w-full flex-col overflow-hidden shadow-2xl outline-none',
          variant === 'media' ? 'bg-ink-950 ring-1 ring-white/10' : 'bg-ink-900 ring-1 ring-white/10',
          sizes[size],
          panel,
        )}
      >
        <div
          className={cn(
            'flex shrink-0 items-start justify-between gap-4',
            variant === 'media' ? 'px-4 pb-3 pt-3 sm:px-5' : 'px-5 pb-2 pt-5 sm:px-7 sm:pt-6',
          )}
        >
          <div className={cn(hideTitle && 'sr-only')}>
            <h2 id={titleId} className="font-display text-lg font-semibold text-white sm:text-xl">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="mt-1 text-sm text-zinc-400">
                {description}
              </p>
            )}
          </div>
          <IconButton label="Close" onClick={onClose} className="-mr-2 -mt-1 ml-auto">
            <X />
          </IconButton>
        </div>
        <div
          className={cn(
            'min-h-0 flex-1 overflow-y-auto',
            variant === 'media' ? 'px-3 pb-3 sm:px-4 sm:pb-4' : 'px-5 pb-6 pt-3 sm:px-7 sm:pb-7',
          )}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}
