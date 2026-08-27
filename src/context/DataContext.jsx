import { createContext, useState } from "react";
import { useFetch } from "../hooks/useFetch";

// eslint-disable-next-line react-refresh/only-export-components
export const DataContext = createContext();

const POPULAR_QUERIES = [
  "Super Mario",
  "Anime",
  "Spider-Man",
  "Avengers",
  "One Piece",
  "The Last of Us",
  "Barbie",
  "Oppenheimer",
  "Frozen",
  "Black Panther",
  "Cyberpunk",
  "Matrix",
  "Blade Runner",
  "Batman"
];

// Elegir palabra al azar al cargar de forma pura
const getRandomQuery = () =>
  POPULAR_QUERIES[Math.floor(Math.random() * POPULAR_QUERIES.length)];

export const DataProvider = ({ children }) => {
  // Inicializamos query una única vez (sin renders ni peticiones dobles)
  const [query, setQuery] = useState(getRandomQuery);

  // Hook para llamar a la API cada vez que cambie el término de búsqueda
  const { isLoading, error, errorMessage, data } = useFetch(
    query ? `&s=${encodeURIComponent(query)}` : ""
  );

  return (
    <DataContext.Provider
      value={{
        query,
        setQuery,
        isLoading,
        error,
        errorMessage,
        data,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};