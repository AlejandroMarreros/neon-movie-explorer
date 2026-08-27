import { useContext, useState } from "react";
import { FavoritesContext } from "../context/FavoritesContext";

const MovieActions = ({ movie }) => {
  const { isFavorite, toggleFavorite, getMovieRating, setMovieRating } =
    useContext(FavoritesContext);

  const [liked, setLiked] = useState(() => {
    try {
      return localStorage.getItem(`liked_${movie?.imdbID}`) === "true";
    } catch {
      return false;
    }
  });

  const [showRatingSelector, setShowRatingSelector] = useState(false);

  if (!movie || !movie.imdbID) return null;

  const isFav = isFavorite(movie.imdbID);
  const currentRating = getMovieRating(movie.imdbID);

  const handleFavoriteToggle = () => {
    toggleFavorite(movie);
  };

  const handleLike = () => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    try {
      localStorage.setItem(`liked_${movie.imdbID}`, String(nextLiked));
    } catch (e) {
      console.error("Error saving like:", e);
    }
  };

  const handleRate = (stars) => {
    setMovieRating(movie, stars);
    setShowRatingSelector(false);
  };

  return (
    <div className="movie-actions-container" aria-label="Acciones de la película">
      {/* Botón Favorito */}
      <button
        type="button"
        className={`btn-action ${isFav ? "btn-action-destructive" : "btn-action-primary"}`}
        onClick={handleFavoriteToggle}
        aria-pressed={isFav}
      >
        {isFav ? "❌ Quitar de Favoritos" : "❤️ Añadir a Favoritos"}
      </button>

      {/* Botón Like */}
      <button
        type="button"
        className={`btn-action ${liked ? "btn-action-active" : "btn-action-secondary"}`}
        onClick={handleLike}
        aria-pressed={liked}
      >
        {liked ? "👍 Te gusta" : "👍 Me gusta"}
      </button>

      {/* Selector de Calificación */}
      <div className="rating-action-wrapper">
        <button
          type="button"
          className="btn-action btn-action-secondary"
          onClick={() => setShowRatingSelector(!showRatingSelector)}
          aria-expanded={showRatingSelector}
        >
          ⭐ {currentRating > 0 ? `Calificación: ${currentRating}/5` : "Calificar"}
        </button>

        {showRatingSelector && (
          <div className="rating-dropdown-box" role="dialog" aria-label="Seleccionar estrellas">
            <p className="rating-dropdown-title">Tu valoración:</p>
            <div className="rating-stars-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-dropdown-btn ${star <= currentRating ? "active" : ""}`}
                  onClick={() => handleRate(star)}
                  aria-label={`Calificar con ${star} estrellas`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieActions;