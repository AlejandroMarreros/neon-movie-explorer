import { useParams, Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import MovieActions from "./MovieActions";
import Comments from "./Comments";

const DEFAULT_IMAGE = "./img/NoImage.png.jpg";

const SingleMovie = () => {
  const { id } = useParams();
  const { isLoading, error, errorMessage, data } = useFetch(id ? `&i=${id}&plot=full` : "");

  if (isLoading) {
    return (
      <div className="single-movie-page" aria-busy="true" aria-live="polite">
        <div className="loading-card">
          <div className="neon-spinner" aria-hidden="true"></div>
          <p className="loading-text">Cargando detalles de la película...</p>
        </div>
      </div>
    );
  }

  // Manejo de error seguro evitando crashes de desestructuración
  if (error || !data || data.Response === "False") {
    return (
      <div className="single-movie-page">
        <div className="error-detail-card" role="alert">
          <h2 className="error-detail-title">Película no encontrada</h2>
          <p className="error-detail-desc">
            {errorMessage || "No se pudo recuperar la información de esta película desde la base de datos."}
          </p>
          <Link to="/" className="btn-back-home">
            ← Volver al buscador
          </Link>
        </div>
      </div>
    );
  }

  const {
    Title = "Sin título",
    Poster,
    Plot = "Sin sinopsis disponible.",
    Year = "N/A",
    Country = "N/A",
    Director = "N/A",
    Actors = "N/A",
    Genre = "N/A",
    Released = "N/A",
    Runtime = "N/A",
    imdbRating = "N/A",
    imdbVotes = "N/A",
  } = data;

  const validPoster = !Poster || Poster === "N/A" ? DEFAULT_IMAGE : Poster;

  return (
    <div className="single-movie-page">
      {/* Botón de Retorno */}
      <nav className="single-movie-nav" aria-label="Navegación">
        <Link to="/" className="btn-back-home">
          ← Volver a Explorar
        </Link>
      </nav>

      {/* Tarjeta Principal de Detalle */}
      <article className="single-movie-card">
        <div className="single-movie-poster-col">
          <img
            src={validPoster}
            alt={`Póster oficial de ${Title}`}
            className="single-movie-poster"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_IMAGE;
            }}
          />
        </div>

        <div className="single-movie-info-col">
          <header className="single-movie-header">
            <h1 className="single-movie-title">{Title}</h1>
            <div className="single-movie-tags">
              <span className="badge-tag tag-year">{Year}</span>
              <span className="badge-tag tag-runtime">⏱️ {Runtime}</span>
              <span className="badge-tag tag-rating">⭐ IMDb {imdbRating}</span>
            </div>
          </header>

          <p className="single-movie-plot">{Plot}</p>

          <dl className="single-movie-details-list">
            <div className="detail-item">
              <dt>Director:</dt>
              <dd>{Director}</dd>
            </div>
            <div className="detail-item">
              <dt>Reparto:</dt>
              <dd>{Actors}</dd>
            </div>
            <div className="detail-item">
              <dt>Género:</dt>
              <dd>{Genre}</dd>
            </div>
            <div className="detail-item">
              <dt>País:</dt>
              <dd>{Country}</dd>
            </div>
            <div className="detail-item">
              <dt>Estreno:</dt>
              <dd>{Released}</dd>
            </div>
            <div className="detail-item">
              <dt>Votos IMDb:</dt>
              <dd>{imdbVotes}</dd>
            </div>
          </dl>

          {/* Integración de Acciones (Favoritos, Like, Rating) */}
          <div className="single-movie-actions-wrapper">
            <MovieActions movie={data} />
          </div>
        </div>
      </article>

      {/* Sección de Comentarios Comunitarios Sincronizados con el ID */}
      <div className="comments-box-container">
        <Comments movieId={id} movieTitle={Title} />
      </div>
    </div>
  );
};

export default SingleMovie;