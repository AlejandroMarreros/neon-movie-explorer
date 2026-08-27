import { useState, useContext } from "react";
import { DataContext } from "../context/DataContext";

const FormSearch = () => {
  const [title, setTitle] = useState("");
  const { setQuery, error, errorMessage } = useContext(DataContext);
  const [inputError, setInputError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setInputError("Por favor ingresa el título de una película");
      return;
    }
    setInputError("");
    setQuery(cleanTitle);
  };

  return (
    <header className="form-search-container">
      <div className="logo-container">
        <img
          src="./capibara.png"
          alt="Capibara Codex Logo"
          className="logo"
        />
      </div>

      <h1 className="main-title">
        NEON MOVIE EXPLORER <span className="subtitle-tag"> CAPIBARA-CODEX</span>
      </h1>

      <form onSubmit={handleSubmit} className="search-form" role="search" aria-label="Buscador de películas">
        <div className="search-input-wrapper">
          <input
            type="search"
            placeholder="Buscar película, serie, anime..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (inputError) setInputError("");
            }}
            className="search-input"
            aria-label="Título de la película"
            maxLength={100}
          />
        </div>
        <button
          type="submit"
          className="btn-search"
          aria-label="Buscar películas"
        >
          🔍 Explorar
        </button>
      </form>

      {inputError && (
        <p className="alert-error" role="alert">
          {inputError}
        </p>
      )}

      {error && (
        <p className="alert-error" role="alert">
          {errorMessage || "No se encontraron películas con ese título."}
        </p>
      )}
    </header>
  );
};

export default FormSearch;