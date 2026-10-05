import { Clapperboard } from 'lucide-react'
import type { Movie } from '@/types'
import { Modal } from '@/components/ui/Modal'

interface TrailerModalProps {
  movie: Movie
  open: boolean
  onClose: () => void
}

export function TrailerModal({ movie, open, onClose }: TrailerModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={`${movie.title} — Official Trailer`} variant="media" size="xl">
      <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
        {movie.trailerYoutubeId ? (
          <iframe
            className="size-full"
            src={`https://www.youtube-nocookie.com/embed/${movie.trailerYoutubeId}?autoplay=1&rel=0`}
            title={`${movie.title} trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-3 px-6 text-center">
            <Clapperboard className="size-10 text-zinc-600" aria-hidden />
            <p className="font-display text-lg font-semibold text-white">Trailer coming soon</p>
            <p className="max-w-sm text-sm text-zinc-400">
              The studio hasn't released a trailer yet. Check back closer to the release date.
            </p>
          </div>
        )}
      </div>
    </Modal>
  )
}
