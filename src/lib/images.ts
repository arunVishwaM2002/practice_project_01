const TMDB_BASE = 'https://image.tmdb.org/t/p'

type PosterSize = 'w185' | 'w342' | 'w500' | 'w780'
type BackdropSize = 'w300' | 'w780' | 'w1280' | 'original'

export function tmdbImage(path: string, size: PosterSize | BackdropSize): string {
  return `${TMDB_BASE}/${size}${path}`
}

export function posterSrcSet(path: string): string {
  return (['w185', 'w342', 'w500', 'w780'] as const)
    .map((size) => `${tmdbImage(path, size)} ${size.slice(1)}w`)
    .join(', ')
}

export function backdropSrcSet(path: string): string {
  return [
    `${tmdbImage(path, 'w780')} 780w`,
    `${tmdbImage(path, 'w1280')} 1280w`,
    `${tmdbImage(path, 'original')} 1920w`,
  ].join(', ')
}
