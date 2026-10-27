import { MovieGrid } from "./MovieGrid";
import { useState, useEffect } from "preact/hooks";
import type { Movie } from "../types/types";
import { fetchMovies, searchMovies } from "../services/api";


export function Home() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [searchedQuery, setSearchedQuery] = useState("");

    useEffect(() => {
        async function loadMovies() {
            try {
                const data = await fetchMovies();
                setMovies(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Could not load movies.");
            } finally {
                setLoading(false);
            }
        }
        void loadMovies();
    }, []);

    async function handleSearch() {
        const trimmedQuery = query.trim();
        setLoading(true);
        setError(null);
        setSearchedQuery(trimmedQuery);

        try {
            const results = trimmedQuery
                ? await searchMovies(trimmedQuery)
                : await fetchMovies();
            setMovies(results);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not load movies.");
        } finally {
            setLoading(false);
        }
    }

  return (
    <section className="home-page" aria-label="Home Movie Grid">
      <div className="home-page__heading">
        <p className="home-page__eyebrow">Discover your next favorite</p>
        <h1 className="home-page__title">
          {searchedQuery ? `Results for “${searchedQuery}”` : "Popular Movies"}
        </h1>
      </div>
      <div className="home-page__content">
        <form
          className="movie-search"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSearch();
          }}
        >
          <input
            className="movie-search__input"
            type="search"
            value={query}
            onInput={(event) => setQuery(event.currentTarget.value)}
            placeholder="Search movies..."
            aria-label="Search movies"
          />
          <button className="movie-search__button" type="submit" disabled={loading}>
            Search
          </button>
        </form>
        {loading && <p className="home-page__loading">Loading movies...</p>}
        {error && <p className="home-page__error" role="alert">Error: {error}</p>}
        {!loading && !error && movies.length === 0 && (
          <p className="home-page__no-movies">
            {searchedQuery
              ? `No movies found for “${searchedQuery}”.`
              : "No movies found."}
          </p>
        )}
        {!loading && !error && <MovieGrid movies={movies} />}
      </div>
    </section>
  )
}