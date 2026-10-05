import { useEffect, useRef, useState, type ImgHTMLAttributes } from 'react'
import { Film } from 'lucide-react'
import { cn } from '@/lib/cn'

interface SmartImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  src: string
  alt: string
  /** Text shown on the fallback tile if the image fails to load */
  fallbackLabel?: string
}

/**
 * Lazy image that fades in once decoded and degrades to a branded tile if
 * the remote image is unavailable. Callers shouldn't pass `transition-*`
 * classes — opacity and transform transitions are already set here.
 */
export function SmartImage({
  src,
  alt,
  fallbackLabel,
  className,
  loading = 'lazy',
  onLoad,
  onError,
  ...rest
}: SmartImageProps) {
  const ref = useRef<HTMLImageElement>(null)
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null)
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  // Cached images can finish loading before React attaches onLoad
  useEffect(() => {
    const img = ref.current
    if (img?.complete && img.naturalWidth > 0) setLoadedSrc(src)
  }, [src])

  if (failedSrc === src) {
    return (
      <div
        role={alt ? 'img' : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        className={cn(
          'flex items-center justify-center bg-linear-to-br from-ink-600 via-ink-800 to-brand-900/60 text-center',
          className,
        )}
      >
        <div className="px-3">
          <Film className="mx-auto size-6 text-zinc-500" aria-hidden />
          {fallbackLabel && (
            <p className="mt-2 line-clamp-2 font-display text-xs font-semibold text-zinc-300">{fallbackLabel}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      onLoad={(event) => {
        setLoadedSrc(src)
        onLoad?.(event)
      }}
      onError={(event) => {
        setFailedSrc(src)
        onError?.(event)
      }}
      className={cn(
        'transition-[opacity,transform] duration-700 ease-out',
        loadedSrc === src ? 'opacity-100' : 'opacity-0',
        className,
      )}
      {...rest}
    />
  )
}
