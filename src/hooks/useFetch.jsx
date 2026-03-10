import { useEffect, useState } from "react";

const API_ENDPOINT = `http://www.omdbapi.com/?apikey=4f9d4699`;

export const useFetch = (params) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [data, setData] = useState(null);

    const fetchMovies = (url) => {
        setIsLoading(true); // ⚡ corregido
        fetch(url)
            .then((respuesta) => respuesta.json())
            .then((respuestaJson) => {
                if (respuestaJson.Response === "True") {
                    setData(respuestaJson.Search || respuestaJson);
                    setError(false);
                } else {
                    setError(true);
                }
                setIsLoading(false); // ⚡ corregido
                console.log("data: ", respuestaJson);
            })
            .catch((err) => {
                console.log(err);
                setError(true);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchMovies(`${API_ENDPOINT}${params}`);
    }, [params]);

    return { isLoading, error, data };
};