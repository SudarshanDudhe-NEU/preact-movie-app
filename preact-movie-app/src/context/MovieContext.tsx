import { createContext, type ComponentChildren } from "preact";
import { useContext, useState, useEffect } from "preact/hooks";
import type { Movie } from "../types/types";


interface MovieContextType {
  favorites: Movie[];
  addFavorite: (movie: Movie) => void;
  removeFavorite: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export function MovieProvider({children}:{children: ComponentChildren}) {
    const [favorites, setFavorites] = useState<Movie[]>([])

    useEffect(() => {
        const storedFavorites = localStorage.getItem("favorites");
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }
    }, []);
    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    const addFavorite = (movie: Movie) =>{
        setFavorites(prev => [...prev, movie])
    }
    const removeFavorite = (movieId: number) => {
        setFavorites(prev => prev.filter(movie => movie.id !== movieId))
        localStorage.setItem("favorites", JSON.stringify(favorites))    
    }
    const isFavorite = (movieId: number) => {
        return favorites.some(movie => movie.id === movieId)
    }

    return (
        <MovieContext.Provider value={{favorites, addFavorite, removeFavorite, isFavorite}}>
            {children}
        </MovieContext.Provider>
    )
}

export function useMovieContext() {
    const context = useContext(MovieContext);
    if (!context) {
        throw new Error("useMovieContext must be used within a MovieProvider");
    }
    return context;
}
