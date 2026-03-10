import { createContext, useEffect, useState } from "react";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Cargar favoritos de localStorage
  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  // Guardar favoritos en localStorage
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Agregar o actualizar favorito con rating
  const addFavorite = (movie, rating = 0) => {
    const exists = favorites.find(f => f.imdbID === movie.imdbID);
    if (exists) {
      // Actualizar rating si ya existe
      setFavorites(favorites.map(f =>
        f.imdbID === movie.imdbID ? { ...f, rating } : f
      ));
    } else {
      setFavorites([...favorites, { ...movie, rating }]);
    }
  };

  const removeFavorite = (id) => {
    setFavorites(favorites.filter(f => f.imdbID !== id));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};