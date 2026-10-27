import './css/app.css'
import {LocationProvider, Router, Route } from 'preact-iso'
import { Home } from './components/Home'
import { MovieProvider } from './context/MovieContext'
import { Favorites } from './components/Favorites'
function NotFound() {
  return (
    <div className="not-found">
      <h1 className="not-found__title">404 - Page Not Found</h1>
      <p className="not-found__message">The page you requested could not be found.</p>
    </div>
  )
}

export function App() {
  return (
    <div className="app">
      <MovieProvider>
        <LocationProvider>
          <div className="app__container">
            <header className="app__header">
              <div className="app__brand">
                <a className="app__brand-link" href="/">
                  Movie Search
                </a>
              </div>
              <nav className="nav" aria-label="Main navigation">
                <div className="nav__links">
                  <a className="nav__link" href="/">Home</a>
                  <a className="nav__link" href="/favorites">Favorites</a>
                </div>
              </nav>
            </header>
            <main className="app__main">
              <div className="app__page">
                <Router>
                  <Route path="/" component={Home} />
                  <Route path="/favorites" component={Favorites} />
                  <Route default component={NotFound} />
                </Router>
              </div>
            </main>
          </div>
        </LocationProvider>
      </MovieProvider>
    </div>
  )
}
