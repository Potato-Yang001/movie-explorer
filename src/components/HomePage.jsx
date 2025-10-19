import { useEffect, useState } from "react";
import { getPopularMoviesTMDB } from "../services/movieAPI";

export default function HomePage() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchPopular() {
            try {
                const data = await getPopularMoviesTMDB();
                setMovies(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load popular movies.");
            } finally {
                setLoading(false);
            }
        }
        fetchPopular();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
                Loading popular movies...
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500 mt-10">{error}</div>;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen md:ms-64">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
                Welcome to <span className="text-blue-600">BingeBuddy 🎬</span>
            </h1>
            <p className="text-gray-600 mb-8">
                Use the sidebar to explore or search for movies!
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Popular Movies
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {movies.map((movie) => (
                    <div
                        key={movie.id}
                        className="bg-white rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1"
                    >
                        <img
                            src={
                                movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                    : "https://via.placeholder.com/500x750?text=No+Image"
                            }
                            alt={movie.title}
                            className="w-full h-80 object-cover rounded-t-lg"
                        />
                        <div className="p-3">
                            <h2 className="text-md font-semibold text-gray-800 truncate">
                                {movie.title}
                            </h2>
                            <p className="text-sm text-gray-500">
                                ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
