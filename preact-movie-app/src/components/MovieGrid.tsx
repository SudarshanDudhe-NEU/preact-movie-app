import type { Movie } from "../types/types";
import { MovieCard } from "./MovieCard";

type MovieGridProps = {
  movies: Movie[];
};

export function MovieGrid({ movies }: MovieGridProps) {
  return (
    <div className="movie-grid" role="list" aria-label="Movies">
      {movies.map(movie => (
        <div className="movie-grid__item" role="listitem" key={movie.id}>
          <MovieCard movie={movie} />
        </div>
      ))}
    </div>
  )
}