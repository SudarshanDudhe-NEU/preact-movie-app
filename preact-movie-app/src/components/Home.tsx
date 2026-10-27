import { MovieGrid } from "./MovieGrid";
import { useState, useEffect, useRef, useMemo, useCallback } from "preact/hooks";
import type { Movie } from "../types/types";
import { fetchMovies, searchMovies } from "../services/api";

export function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [searchedQuery, setSearchedQuery] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "title" | "newest">(
    "popular",
  );
  const searchInputRef = useRef<HTMLInputElement>(null);

  const sortedMovies = useMemo(() => {
    const result = [...movies];

    if (sortBy === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "newest") {
      result.sort((a, b) => b.release_date.localeCompare(a.release_date));
    }

    return result;
  }, [movies, sortBy]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const target = event.target;

      const isTyping =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA");

      if (event.key === "/" && !isTyping && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    },
    [searchInputRef],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
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

        <div className="movie-sort">
          <label className="movie-sort__label" for="movie-sort">
            Sort movies
          </label>

          <select
            className="movie-sort__select"
            id="movie-sort"
            value={sortBy}
            onChange={(event) =>
              setSortBy(
                event.currentTarget.value as "popular" | "title" | "newest",
              )
            }
          >
            <option value="popular">Popular order</option>
            <option value="title">Title A–Z</option>
            <option value="newest">Newest first</option>
          </select>
        </div>
        <form
          className="movie-search"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSearch();
          }}
        >
          <input
            ref={searchInputRef}
            className="movie-search__input"
            type="search"
            value={query}
            onInput={(event) => setQuery(event.currentTarget.value)}
            placeholder="Search movies..."
            aria-label="Search movies"
          />
          <button
            className="movie-search__button"
            type="submit"
            disabled={loading}
          >
            Search
          </button>
        </form>

        {loading && <p className="home-page__loading">Loading movies...</p>}
        {error && (
          <p className="home-page__error" role="alert">
            Error: {error}
          </p>
        )}
        {!loading && !error && movies.length === 0 && (
          <p className="home-page__no-movies">
            {searchedQuery
              ? `No movies found for “${searchedQuery}”.`
              : "No movies found."}
          </p>
        )}
        {!loading && !error && <MovieGrid movies={sortedMovies} />}
      </div>
    </section>
  );
}
