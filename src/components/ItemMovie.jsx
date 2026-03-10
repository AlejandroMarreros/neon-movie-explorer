import { useState, useContext } from "react";
import DefaultImage from "/NoImage.png";
import { Link } from "react-router-dom";
import { FavoritesContext } from "../context/FavoritesContext";

const ItemMovie = ({ id, title, type, year, poster }) => {
  const [image, setImage] = useState(poster === "N/A" ? DefaultImage : poster);
  const { favorites, addFavorite } = useContext(FavoritesContext);

  // Detecta si ya está guardada
  const favMovie = favorites.find(f => f.imdbID === id);
  const currentRating = favMovie?.rating || 0;

  // Maneja rating al hacer click
  const handleRating = (value) => {
    addFavorite({ imdbID: id, Title: title, Year: year, Type: type, Poster: poster }, value);
  };

  return (
    <div className={`item-movie-container ${favMovie ? "favorited" : ""}`}>
      <Link to={`/movies/${id}`}>
        <div
          className="item-movie"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <img
            src={image}
            alt={title}
            style={{ display: "none" }}
            onError={() => setImage(DefaultImage)}
          />
          <div className="info">
            <h4>{title}</h4>
            <p className="row-info">
              <span>{type}</span>
              <span>{year}</span>
            </p>
          </div>
        </div>
      </Link>

      {/* Contenedor de estrellas con fondo y bordes */}
      <div className="stars-container">
        <div className="stars">
          {[1, 2, 3, 4, 5].map(star => (
            <span
              key={star}
              className={`${star <= currentRating ? "filled" : ""} ${currentRating === 5 ? "five" : ""}`}
              onClick={() => handleRating(star)}
            >
              ★
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemMovie;