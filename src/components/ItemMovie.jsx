import { useContext } from "react";
import { Link } from "react-router-dom";
import { FavoritesContext } from "../context/FavoritesContext";

// Fallback visual para póster ausente
const DEFAULT_IMAGE = "./img/NoImage.png.jpg";

const ItemMovie = ({ id, title, type, year, poster }) => {
  const { isFavorite, getMovieRating, setMovieRating, toggleFavorite } =
    useContext(FavoritesContext);

  const isFav = isFavorite(id);
  const currentRating = getMovieRating(id);

  // Asegurar póster válido o fallback
  const validPoster = !poster || poster === "N/A" ? DEFAULT_IMAGE : poster;

  const ratingMessage =
    currentRating === 0
      ? "¡Sin calificar aún!"
      : `Tu nota: ${currentRating} ★`;

  const handleStarClick = (e, star) => {
    e.preventDefault();
    e.stopPropagation();
    setMovieRating(
      { imdbID: id, Title: title, Year: year, Type: type, Poster: poster },
      star
    );
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite({ imdbID: id, Title: title, Year: year, Type: type, Poster: poster });
  };

  return (
    <article className={`item-movie-card ${isFav ? "is-favorite" : ""}`}>
      {/* Botón rápido de favorito en la esquina de la tarjeta */}
      <button
        type="button"
        className={`btn-fav-badge ${isFav ? "active" : ""}`}
        onClick={handleFavoriteClick}
        aria-label={isFav ? `Quitar ${title} de favoritos` : `Añadir ${title} a favoritos`}
        title={isFav ? "En tus favoritos" : "Añadir a favoritos"}
      >
        {isFav ? "❤️" : "🤍"}
      </button>

      <Link
        to={`/movies/${id}`}
        className="movie-card-link"
        aria-label={`Ver detalles completos de ${title}`}
      >
        <div className="poster-wrapper">
          <img
            src={validPoster}
            alt={`Póster de ${title}`}
            className="movie-poster"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_IMAGE;
            }}
          />
          <div className="poster-overlay">
            <span className="btn-details-hint">Ver detalles →</span>
          </div>
        </div>

        <div className="movie-info">
          <h2 className="movie-title" title={title}>
            {title}
          </h2>
          <div className="movie-metadata">
            <span className="badge-type">{type?.toUpperCase() || "MOVIE"}</span>
            <span className="badge-year">{year}</span>
          </div>
        </div>
      </Link>

      {/* Contenedor de calificación con estrellas */}
      <div className="rating-container" aria-label="Calificación de película">
        <span className="rating-status-text">{ratingMessage}</span>
        <div className="star-rating" role="group" aria-label="Seleccionar estrellas">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`star-btn ${star <= currentRating ? "active" : ""}`}
              onClick={(e) => handleStarClick(e, star)}
              aria-label={`Calificar con ${star} estrella${star > 1 ? "s" : ""}`}
              title={`${star} estrella${star > 1 ? "s" : ""}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
    </article>
  );
};

export default ItemMovie;