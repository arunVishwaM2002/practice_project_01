import { createBrowserRouter } from 'react-router'
import { Layout } from '@/components/layout/Layout'
import { BookingConfirmationPage } from '@/pages/BookingConfirmationPage'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { MovieDetailsPage } from '@/pages/MovieDetailsPage'
import { MoviesPage } from '@/pages/MoviesPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { OffersPage } from '@/pages/OffersPage'
import { SeatSelectionPage } from '@/pages/SeatSelectionPage'
import { SignupPage } from '@/pages/SignupPage'
import { TheatresPage } from '@/pages/TheatresPage'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'movies', element: <MoviesPage /> },
      { path: 'movie/:id', element: <MovieDetailsPage /> },
      { path: 'theatres', element: <TheatresPage /> },
      { path: 'offers', element: <OffersPage /> },
      { path: 'seat-selection', element: <SeatSelectionPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'booking-confirmation', element: <BookingConfirmationPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
