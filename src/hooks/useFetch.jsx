import { useEffect, useState } from "react";

// Clave OMDb configurada desde variables de entorno con fallback
const API_KEY = import.meta.env.VITE_OMDB_API_KEY || "4f9d4699";
const BASE_URL = "https://www.omdbapi.com/";

export const useFetch = (params) => {
  const [isLoading, setIsLoading] = useState(Boolean(params));
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!params) {
      return;
    }

    const controller = new AbortController();
    let isMounted = true;

    // Iniciar petición asíncrona
    const executeFetch = async () => {
      setIsLoading(true);
      setError(false);
      setErrorMessage("");

      const url = `${BASE_URL}?apikey=${API_KEY}${params}`;

      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`Error en la petición: ${res.status} ${res.statusText}`);
        }
        const respuestaJson = await res.json();

        if (!isMounted) return;

        if (respuestaJson.Response === "True") {
          setData(respuestaJson.Search || respuestaJson);
          setError(false);
          setErrorMessage("");
        } else {
          setData(null);
          setError(true);
          setErrorMessage(respuestaJson.Error || "Película no encontrada");
        }
      } catch (err) {
        if (err.name === "AbortError" || !isMounted) return;

        setError(true);
        setErrorMessage(err.message || "Error al conectar con el servidor");
        setData(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    executeFetch();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [params]);

  return { isLoading, error, errorMessage, data };
};