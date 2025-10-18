import axios from "axios";

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const OMDB_BASE_URL = 'http://www.omdbapi.com/';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;  // means to access environment variable for TMDB API key
const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY; // means to access environment variable for OMDB API key

//  Function to search movie using TMDB API for a given query (query = movie title)
export async function searchMoviesTMDB(query) {
    try {
        const res = await axios.get(`${TMDB_BASE_URL}/search/movie`, { // await the response from axios get request to TMDB search movie endpoint
            params: { // passing parameters as an object
                api_key: TMDB_API_KEY,
                query: query
            }
        });
        return res.data.results;
    } catch (error) {
        console.error("Error searching movies on TMDB:", error);
        throw error;
    }
}

// Function to get movie details from OMDB API using IMDb ID
export async function getMovieDetailsOMDB(imdbID) {
    try {
        const res = await axios.get(OMDB_BASE_URL, { // await the response from axios get request to OMDB endpoint
            params: {
                apikey: OMDB_API_KEY,
                i: imdbID
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching movie details from OMDB:", error);
        throw error;
    }
}

// Function to get popular movies from TMDB API
export async function getPopularMoviesTMDB() {
    try {
        const res = await axios.get(`${TMDB_BASE_URL}/movie/popular`, { // await the response from axios get request to TMDB popular movies endpoint
            params: {
                api_key: TMDB_API_KEY
            }
        });
        return res.data.results;
    } catch (error) {
        console.error("Error fetching popular movies from TMDB:", error);
        throw error;
    }
}

