import { useContext, useEffect, useState } from "react";
import { getPopularMoviesTMDB } from "../services/movieAPI"
import axios from "axios";
import { AuthContext } from "./AuthProvider";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const [movies, setMovies] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate()

    const API_BASE_URL = "https://e7d191c2-4c98-4d39-96df-4fc6e39d522f-00-3d6sd3diyggd0.pike.replit.dev"

    useEffect(() => {
        const fetchPopularMovies = async () => {
            try {
                const data = await getPopularMoviesTMDB();
                setMovies(data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching movies:", err);
            }
        }
        fetchPopularMovies()
    }, []);

    const handleAddFavorite = async (movie) => {
        try {
            const newFavorite = {
                username: currentUser?.displayName || currentUser?.email || "Guest",
                movieId: movie.id,
                title: movie.title,
                posterPath: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                watch_time: new Date().toISOString()
            };
            const res = await axios.post(`${API_BASE_URL}/favorites`, newFavorite);
            setFavorites([...favorites, res.data]);
            alert(`${movie.title} added to favorites!`)
        } catch (err) {
            console.error("Error adding favorite:", err);
            alert("Failed to add to favorites!")
        }
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100 bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted fs-5">Loading popular movies...</p>
                </div>
            </div>
        )
    }

    let greeting
    if (currentUser) {
        greeting = currentUser.displayName || currentUser.email ? currentUser.email.split('@')[0] : "Guest";
    }

    return (
        <div className="min-vh-100 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="container py-5">
                {/*Header*/}
                <div className="text-center mb-5">
                    <div className="mb-4">
                        <h1 className="display-3 fw-bold mb-3">
                            <span className="text-transparent bg-clip-text" style={{
                                backgroundImage: 'linear-gradient(to right, rgb(14 165 233), rgb(5 150 105))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                {greeting ? `Welcome ${greeting}` : "Welcome"}
                            </span>
                            <span className="ms-2">🎬</span>
                        </h1>
                        <h2 className="h3 text-secondary mb-2">to BingeBuddy</h2>
                    </div>
                    <p className="lead text-muted col-lg-8 mx-auto">
                        At Movie Explorer, we take the guesswork out of movie night—because choosing what to watch shouldn't feel like filing taxes.
                    </p>
                </div>

                {/*Movie card section*/}
                <div className="mb-4">
                    <h2 className="h3 fw-semibold text-dark mb-4 d-flex align-items-center">
                        <span className="badge bg-primary me-2">🔥</span>
                        Popular Movies
                    </h2>
                </div>

                {/*Movie list*/}
                <div className="row g-4">
                    {movies.map((movie) => (
                        <div key={movie.id} className="col-12">
                            <div className="card border-0 shadow-sm hover:shadow-lg transition-all overflow-hidden" style={{ transition: 'all 0.3s ease' }}>
                                <div className="row g-0">
                                    <div className="col-md-3 col-lg-2">
                                        {movie.poster_path ? (
                                            <img
                                                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                                                alt={movie.title}
                                                className="img-fluid h-100 object-cover"
                                                style={{ objectFit: 'cover', minHeight: '250px' }}
                                            />
                                        ) : (
                                            <div className="bg-secondary bg-opacity-10 h-100 d-flex align-items-center justify-content-center" style={{ minHeight: '250px' }}>
                                                <span className="text-muted">No Image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-9 col-lg-10">
                                        <div className="card-body d-flex flex-column h-100 p-4">
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <h3 className="card-title h4 fw-bold mb-0">{movie.title}</h3>
                                                <button
                                                    className="btn btn-link p-0 ms-3"
                                                    onClick={() => handleAddFavorite(movie)}
                                                    title="Add to Favorites"
                                                    style={{ fontSize: '1.5rem' }}
                                                >
                                                    <i className={`bi ${favorites.includes(movie.id)
                                                        ? "bi-heart-fill text-danger"
                                                        : "bi-heart text-secondary"
                                                        }`}></i>
                                                </button>
                                            </div>

                                            <p className="text-muted mb-3 flex-grow-1" style={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {movie.overview || "No description available."}
                                            </p>

                                            <div className="d-flex justify-content-between align-items-center mt-auto">
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="d-flex align-items-center bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-2 rounded-pill shadow-sm">
                                                        <span className="text-white fw-bold me-1">⭐</span>
                                                        <span className="text-white fw-bold">{movie.vote_average?.toFixed(1)}</span>
                                                        <span className="text-white ms-1" style={{ fontSize: '0.75rem' }}>/ 10</span>
                                                    </div>
                                                </div>
                                                <button
                                                    className="btn btn-primary position-relative overflow-hidden"
                                                    onClick={() => navigate(`/detail/${movie.id}`)}
                                                    style={{
                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                        border: 'none',
                                                        transition: 'all 0.3s ease',
                                                        fontWeight: '600',
                                                        letterSpacing: '0.5px'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                        e.currentTarget.style.boxShadow = 'none';
                                                    }}
                                                >
                                                    <i className="bi bi-play-circle me-2"></i>
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}