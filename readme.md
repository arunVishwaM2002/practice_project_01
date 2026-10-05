Starting my first personal project

# CineBook

**Your movie night starts here.** A static, frontend-only MVP of an Indian movie-ticket booking platform (Phase 1). Every movie, theatre, showtime and seat comes from local mock data. There is no backend, authentication or payment yet.

## Stack

React 19 · Vite 8 · TypeScript · Tailwind CSS v4 · React Router · Lucide icons

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
npm run lint     # oxlint
```

## Routes

| Route | Page |
| --- | --- |
| `/` | Landing page: hero, now showing, featured, coming soon, genres, cities, offers |
| `/movies` | Catalogue with Now Showing / Coming Soon tabs and genre, language and search filters (`?tab=`, `?genre=`, `?lang=`, `?q=`) |
| `/movie/:id` | Movie details, cast, trailer, and showtimes by date and theatre |
| `/theatres` | Cinemas in the selected city, with amenity filters |
| `/offers` | All offers |
| `/seat-selection?show=<showId>` | Seat map and booking summary (defaults to Interstellar · PVR Orion Mall · today 7:30 PM) |
| `/booking-confirmation` | Ticket for the booking just made (shows a sample ticket if opened directly) |
| `/login`, `/signup` | Auth UI only |

## Project structure

```
src/
  types/        Domain types, shaped like future API responses
  data/         Mock data: movies, theatres, cities, genres, offers, shows, seats
  services/     catalog.ts — the only module the UI reads data from
  context/      Selected-city state, persisted to localStorage
  components/
    ui/         Button, Modal, SmartImage, Carousel, TextField, Badge…
    layout/     Navbar, Footer, Layout
    home/       Hero, GenreCard, CitySpotlight
    movie/      MovieCard, MovieGrid, ComingSoonCard, FeaturedMovie, TrailerModal
    showtimes/  TheatreCard, ShowtimeButton, DateSelector
    booking/    Seat, SeatMap, BookingSummary, Ticket
    location/   CitySelector, CityPickerModal
    search/     SearchBar
    offers/     OfferCard
  pages/        One component per route
  lib/          Formatting, dates, pricing, images, seeded randomness
```

## How the mock data works

- **Showtimes** are generated deterministically for each movie × theatre × day. The booking window is today plus the next four days. Prices follow the theatre's base price, with format surcharges and a matinee discount.
- **Seat maps** are seeded by show ID, so occupancy stays the same across reloads and roughly matches each show's "Available / Filling fast / Almost full" label.
- **Bookings** are passed to the confirmation page through router state. The ticket price is ₹ × seats plus a ₹20-per-ticket convenience fee.

## Phase 2: connecting the backend

Components never import from `src/data/`. They call the functions in `src/services/catalog.ts`. To move to FastAPI + PostgreSQL, replace those function bodies with API calls (a data-fetching library such as TanStack Query is the natural next step). The types in `src/types/` describe the payloads the API should return.

## Credits

Movie posters, backdrops and trailer links come from [TMDB](https://www.themoviedb.org/) and YouTube. They're used only as placeholder imagery for this non-commercial demo. CineBook is not endorsed or certified by TMDB. Theatre names refer to real cinema chains purely as realistic sample data.
