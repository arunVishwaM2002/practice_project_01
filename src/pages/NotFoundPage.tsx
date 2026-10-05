import { ButtonLink } from '@/components/ui/Button'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

interface NotFoundPageProps {
  title?: string
  message?: string
}

export function NotFoundPage({
  title = "This scene didn't make the final cut",
  message = "The page you're looking for doesn't exist or has moved.",
}: NotFoundPageProps) {
  useDocumentTitle('Page not found | CineBook')

  return (
    <div className="page-container flex min-h-[80vh] flex-col items-center justify-center pb-16 pt-28 text-center">
      <p className="bg-linear-to-b from-white to-white/10 bg-clip-text font-display text-8xl font-semibold tracking-tight text-transparent sm:text-9xl">
        404
      </p>
      <h1 className="mt-6 font-display text-2xl font-semibold text-white sm:text-3xl">{title}</h1>
      <p className="mt-3 max-w-md text-zinc-400">{message}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink to="/">Back to Home</ButtonLink>
        <ButtonLink to="/movies" variant="secondary">
          Browse movies
        </ButtonLink>
      </div>
    </div>
  )
}
