import type { Movie } from "../types/types";
import { useMovieContext } from "../context/MovieContext";

type MovieCardProps = {
  movie: Movie;
};

export function MovieCard({ movie }: MovieCardProps) {
  const year = movie.release_date? movie.release_date.split('-')[0] : '';
  const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '';
  const { isFavorite, addFavorite, removeFavorite } = useMovieContext()
  const favorite = isFavorite(movie.id);
  return (
    <article className="movie-card">
      <div className="movie-card__poster-wrap">
        {posterUrl ? (
          <img className="movie-card__poster" src={posterUrl} alt={`${movie.title} poster`} loading="lazy" decoding="async" />
        ) : (
          <div className="movie-card__no-poster" aria-label="No poster available" role="img">
            No Poster Available
          </div>
        )}
      </div>
      <div className="movie-card__content">
        <div className="movie-card__details">
          <h2 className="movie-card__title">{movie.title}</h2>
          <p className="movie-card__overview">{movie.overview}</p>
          <p className="movie-card__year">{year || 'Year unknown'}</p>
        </div>
        <div className="movie-card__actions">
          <button
            className={`movie-card__favorite-button${favorite ? ' movie-card__favorite-button--active' : ''}`}
            type="button"
            aria-pressed={favorite}
            onClick={() => favorite ? removeFavorite(movie.id) : addFavorite(movie)}
          >
            {favorite ? "Remove from Favorites" : "Add to Favorites"}
          </button>
        </div>
      </div>
    </article>
  )
}