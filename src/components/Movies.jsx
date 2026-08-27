import { useContext } from "react";
import { DataContext } from "../context/DataContext";
import ItemMovie from "./ItemMovie";

const Movies = () => {
  const { isLoading, data, query, error, errorMessage } = useContext(DataContext);

  if (isLoading) {
    return (
      <section className="movies-loading-section" aria-live="polite" aria-busy="true">
        <div className="neon-spinner" aria-hidden="true"></div>
        <p className="loading-text">Explorando la base de datos cinematográfica...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="movies-empty-section" role="alert">
        <div className="empty-icon">🎬</div>
        <h2 className="empty-title">Sin resultados para "{query}"</h2>
        <p className="empty-description">
          {errorMessage || "Prueba con otra palabra clave o título de película."}
        </p>
      </section>
    );
  }

  const moviesList = Array.isArray(data) ? data : [];

  if (moviesList.length === 0) {
    return (
      <section className="movies-empty-section">
        <div className="empty-icon">🎞️</div>
        <h2 className="empty-title">No hay películas para mostrar</h2>
        <p className="empty-description">Escribe un término en el buscador para comenzar a explorar.</p>
      </section>
    );
  }

  return (
    <main className="movies-content" aria-label="Resultados de películas">
      {moviesList.map((item) => (
        <ItemMovie
          key={item.imdbID}
          id={item.imdbID}
          title={item.Title}
          type={item.Type}
          year={item.Year}
          poster={item.Poster}
        />
      ))}
    </main>
  );
};

export default Movies;