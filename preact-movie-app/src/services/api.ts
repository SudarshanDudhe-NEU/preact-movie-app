import type { Movie } from '../types/types'

interface TMDBMovieResponse {
  results: Movie[]
}
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

async function requestMovies(url: URL): Promise<Movie[]> {
  if (!API_KEY) {
    throw new Error(
      'TMDB API key is missing. Set VITE_TMDB_API_KEY in .env.local.',
    )
  }

  url.searchParams.set('api_key', API_KEY)
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(
      `Could not fetch popular movies: ${response.status} ${response.statusText}`,
    )
  }

  const data = (await response.json()) as TMDBMovieResponse

  if (!Array.isArray(data.results)) {
    throw new Error('TMDB returned an unexpected movie response.')
  }

  return data.results
}

export function fetchMovies(): Promise<Movie[]> {
  return requestMovies(new URL(`${BASE_URL}/movie/popular`))
}

export function searchMovies(query: string): Promise<Movie[]> {
  const url = new URL(`${BASE_URL}/search/movie`)
  url.searchParams.set('query', query)
  return requestMovies(url)
}