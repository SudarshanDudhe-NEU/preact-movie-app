import { useMovieContext } from '../context/MovieContext'
import { MovieGrid } from './MovieGrid'

export function Favorites() {
  const { favorites } = useMovieContext()

  return (
    <section className="favorites-page">
      <div className="favorites-page__heading">
        <p className="favorites-page__eyebrow">Your personal collection</p>
        <h1 className="favorites-page__title">Favorites</h1>
      </div>
      <div className="favorites-page__content">
        {favorites.length > 0 ? (
          <MovieGrid movies={favorites} />
        ) : (
          <div className="favorites-page__empty">
            <p className="favorites-page__empty-title">No favorites yet</p>
            <p className="favorites-page__empty-message">
              Add movies from the Home page and they will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}