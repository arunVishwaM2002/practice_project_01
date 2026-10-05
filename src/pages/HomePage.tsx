import { ArrowRight } from 'lucide-react'
import { featured, hero, NOW_SHOWING_HOME_COUNT } from '@/data/home'
import { getComingSoon, getGenreCategories, getMovie, getNowShowing, getOffers } from '@/services/catalog'
import { ButtonLink } from '@/components/ui/Button'
import { Carousel, CarouselItem } from '@/components/ui/Carousel'
import { SectionHeader, SeeAllLink } from '@/components/ui/SectionHeader'
import { CitySpotlight } from '@/components/home/CitySpotlight'
import { GenreCard } from '@/components/home/GenreCard'
import { Hero } from '@/components/home/Hero'
import { ComingSoonCard } from '@/components/movie/ComingSoonCard'
import { FeaturedMovie } from '@/components/movie/FeaturedMovie'
import { MovieGrid } from '@/components/movie/MovieGrid'
import { OfferCard } from '@/components/offers/OfferCard'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export function HomePage() {
  useDocumentTitle('CineBook — Your movie night starts here.')

  const heroMovie = getMovie(hero.movieId)
  const featuredMovie = getMovie(featured.movieId)
  const nowShowing = getNowShowing().slice(0, NOW_SHOWING_HOME_COUNT)
  const comingSoon = getComingSoon()
  const genres = getGenreCategories()
  const offers = getOffers(3)

  return (
    <>
      {heroMovie && <Hero movie={heroMovie} eyebrow={hero.eyebrow} title={hero.title} subtitle={hero.subtitle} />}

      <section id="now-showing" aria-labelledby="now-showing-title" className="page-container scroll-mt-24 pt-14 sm:pt-20">
        <SectionHeader
          id="now-showing-title"
          title="Now Showing"
          subtitle="Catch the biggest movies playing near you."
          action={<SeeAllLink to="/movies" />}
        />
        <MovieGrid movies={nowShowing} layout="home" priorityCount={3} />
      </section>

      {featuredMovie && (
        <FeaturedMovie movie={featuredMovie} eyebrow={featured.eyebrow} blurb={featured.blurb} ratingLabel="IMDb" />
      )}

      <section aria-labelledby="coming-soon-title" className="page-container">
        <SectionHeader
          id="coming-soon-title"
          title="Coming Soon"
          subtitle="Get notified the moment bookings open."
          action={<SeeAllLink to="/movies?tab=coming-soon" />}
        />
        <Carousel label="Upcoming movies">
          {comingSoon.map((movie) => (
            <CarouselItem key={movie.id}>
              <ComingSoonCard movie={movie} />
            </CarouselItem>
          ))}
        </Carousel>
      </section>

      <section aria-labelledby="genres-title" className="page-container pt-16 sm:pt-24">
        <SectionHeader
          id="genres-title"
          title="Browse by Genre"
          subtitle="From edge-of-your-seat thrillers to feel-good animation."
        />
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {genres.map(({ movieCount, ...genre }) => (
            <li key={genre.id}>
              <GenreCard genre={genre} movieCount={movieCount} />
            </li>
          ))}
        </ul>
      </section>

      <CitySpotlight />

      <section aria-labelledby="offers-title" className="page-container pb-20 sm:pb-28">
        <SectionHeader
          id="offers-title"
          eyebrow="Offers"
          title="Movie nights are better with offers."
          subtitle="Save on tickets, snacks and weekend plans."
          action={
            <div className="hidden sm:block">
              <ButtonLink to="/offers" variant="outline" size="sm">
                View All Offers
                <ArrowRight aria-hidden />
              </ButtonLink>
            </div>
          }
        />
        <ul className="grid gap-4 md:grid-cols-3 lg:gap-5">
          {offers.map((offer) => (
            <li key={offer.id}>
              <OfferCard offer={offer} />
            </li>
          ))}
        </ul>
        <div className="mt-6 sm:hidden">
          <ButtonLink to="/offers" variant="outline" size="lg" fullWidth>
            View All Offers
            <ArrowRight aria-hidden />
          </ButtonLink>
        </div>
      </section>
    </>
  )
}
