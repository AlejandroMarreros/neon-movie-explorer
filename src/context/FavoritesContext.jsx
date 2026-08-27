import { createContext, useState, useEffect } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const FavoritesContext = createContext();

const STORAGE_KEY = "neon_movie_favorites";

export const FavoritesProvider = ({ children }) => {
  // Inicialización perezosa (lazy initial state) desde localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error al leer favoritos de localStorage:", e);
      return [];
    }
  });

  // Guardar en localStorage ante cualquier cambio en favoritos
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error("Error al guardar favoritos en localStorage:", e);
    }
  }, [favorites]);

  // Agregar o actualizar una película en favoritos
  const addFavorite = (movie, rating = 0) => {
    if (!movie || !movie.imdbID) return;

    setFavorites((prev) => {
      const existsIndex = prev.findIndex((f) => f.imdbID === movie.imdbID);
      if (existsIndex >= 0) {
        const updated = [...prev];
        const existingRating = updated[existsIndex].rating || 0;
        updated[existsIndex] = {
          ...updated[existsIndex],
          ...movie,
          rating: rating !== undefined && rating > 0 ? rating : existingRating,
        };
        return updated;
      }
      return [
        ...prev,
        {
          imdbID: movie.imdbID,
          Title: movie.Title,
          Year: movie.Year,
          Type: movie.Type,
          Poster: movie.Poster,
          rating: rating || 0,
          savedAt: new Date().toISOString(),
        },
      ];
    });
  };

  // Eliminar de favoritos por ID
  const removeFavorite = (imdbID) => {
    if (!imdbID) return;
    setFavorites((prev) => prev.filter((f) => f.imdbID !== imdbID));
  };

  // Alternar estado de favorito
  const toggleFavorite = (movie, rating = 0) => {
    if (!movie || !movie.imdbID) return;
    const isFav = favorites.some((f) => f.imdbID === movie.imdbID);
    if (isFav) {
      removeFavorite(movie.imdbID);
    } else {
      addFavorite(movie, rating);
    }
  };

  // Actualizar exclusivamente la calificación de una película
  const setMovieRating = (movie, rating) => {
    if (!movie || !movie.imdbID) return;
    addFavorite(movie, rating);
  };

  // Helper para consultar el rating actual de una película
  const getMovieRating = (imdbID) => {
    const found = favorites.find((f) => f.imdbID === imdbID);
    return found?.rating || 0;
  };

  // Helper para saber si una película está en favoritos
  const isFavorite = (imdbID) => {
    return favorites.some((f) => f.imdbID === imdbID);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        setMovieRating,
        getMovieRating,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};