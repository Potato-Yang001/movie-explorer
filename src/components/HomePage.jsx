import { useContext, useEffect, useState } from "react";
import { getPopularMoviesTMDB } from "../services/movieAPI"
import axios from "axios";
import { AuthContext } from "./AuthProvider";
import { useNavigate } from "react-router-dom";
import MovieSideBar from "./MovieSideBar";

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

    // Sidebar is now handled by MovieSideBar component

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                <div className="text-center px-3">
                    <div className="spinner-border text-white mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-white fs-5 fw-semibold">Loading popular movies...</p>
                </div>
            </div>
        )
    }

    let greeting
    if (currentUser) {
        greeting = currentUser.displayName || (currentUser.email ? currentUser.email.split('@')[0] : "Guest");
    }

    return (
        <div className="position-relative">
            <MovieSideBar />

            <div
                className="min-vh-100"
                style={{
                    background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
                    color: "white",
                    marginLeft: "0",
                }}
            >
                {/* Background overlay for texture */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                            "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                        pointerEvents: "none",
                    }}
                ></div>

                <div className="container py-4 py-md-5 position-relative">
                    {/* Header */}
                    <div className="text-center mb-4 mb-md-5 px-3 px-md-0">
                        <div className="mb-3 mb-md-4">
                            <h1
                                className="display-4 display-md-3 fw-bold mb-2 mb-md-3"
                                style={{
                                    color: "white",
                                    textShadow: "0 4px 20px rgba(0,0,0,0.4)",
                                }}
                            >
                                {greeting ? `Welcome ${greeting}` : "Welcome"} 🎬
                            </h1>
                            <h2
                                className="h4 h3-md fw-semibold text-light"
                                style={{
                                    textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                                }}
                            >
                                to BingeBuddy
                            </h2>
                        </div>
                        <p
                            className="lead text-white-50 col-lg-8 mx-auto mb-0 px-2"
                            style={{
                                fontSize: "clamp(0.9rem, 2vw, 1.125rem)",
                                textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                            }}
                        >
                            At Movie Explorer, we take the guesswork out of movie night—because choosing
                            what to watch shouldn't feel like filing taxes.
                        </p>
                    </div>

                    {/* Section Title */}
                    <div className="mb-3 mb-md-4 px-3 px-md-0">
                        <div className="d-inline-flex align-items-center bg-white rounded-pill px-3 px-md-4 py-2 shadow-lg">
                            <span className="fs-4 me-2">🔥</span>
                            <h2 className="h5 h4-md fw-bold text-dark mb-0">
                                Popular Movies
                            </h2>
                        </div>
                    </div>

                    {/* Movie Cards */}
                    <div className="row g-3 g-md-4 px-2 px-md-0">
                        {movies.map((movie) => (
                            <div key={movie.id} className="col-12">
                                <div
                                    className="card border-0 shadow-lg h-100 overflow-hidden"
                                    style={{
                                        borderRadius: "1rem",
                                        transition: "all 0.3s ease",
                                        background: "rgba(0,0,0,0.7)",
                                        color: "white",
                                        backdropFilter: "blur(10px)",
                                    }}
                                >
                                    <div className="row g-0 h-100">
                                        <div className="col-4 col-sm-3 col-md-3 col-lg-2">
                                            {movie.poster_path ? (
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                                                    alt={movie.title}
                                                    className="img-fluid w-100 h-100"
                                                    style={{
                                                        objectFit: "cover",
                                                        minHeight: "200px",
                                                    }}
                                                />
                                            ) : (
                                                <div className="bg-secondary bg-opacity-10 h-100 d-flex align-items-center justify-content-center">
                                                    <span className="text-muted small">No Image</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="col-8 col-sm-9 col-md-9 col-lg-10">
                                            <div className="card-body d-flex flex-column h-100 p-3 p-md-4">
                                                <div className="d-flex justify-content-between align-items-start mb-2 mb-md-3">
                                                    <h3
                                                        className="card-title fw-bold mb-0 me-2"
                                                        style={{
                                                            fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
                                                        }}
                                                    >
                                                        {movie.title}
                                                    </h3>
                                                    <button
                                                        className="btn btn-link p-0 flex-shrink-0"
                                                        onClick={() => handleAddFavorite(movie)}
                                                        title="Add to Favorites"
                                                        style={{
                                                            fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
                                                        }}
                                                    >
                                                        <i
                                                            className={`bi ${favorites.includes(movie.id)
                                                                ? "bi-heart-fill text-danger"
                                                                : "bi-heart text-light"
                                                                }`}
                                                        ></i>
                                                    </button>
                                                </div>

                                                <p
                                                    className="text-white-50 mb-2 mb-md-3 flex-grow-1"
                                                    style={{
                                                        display: "-webkit-box",
                                                        WebkitLineClamp:
                                                            window.innerWidth < 576 ? 3 : 2,
                                                        WebkitBoxOrient: "vertical",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    {movie.overview || "No description available."}
                                                </p>

                                                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-stretch align-items-sm-center gap-2 mt-auto">
                                                    <div
                                                        className="d-flex align-items-center justify-content-center px-2 py-1 rounded-pill shadow-sm flex-shrink-0"
                                                        style={{
                                                            background:
                                                                "linear-gradient(135deg, #ffd89b 0%, #b91c1c 100%)",
                                                        }}
                                                    >
                                                        <span className="me-1">⭐</span>
                                                        <span className="text-white fw-bold">
                                                            {movie.vote_average?.toFixed(1)}
                                                        </span>
                                                    </div>

                                                    {currentUser && (
                                                        <button
                                                            className="btn btn-danger flex-grow-1 flex-sm-grow-0"
                                                            onClick={() =>
                                                                navigate(`/detail/${movie.id}`)
                                                            }
                                                            style={{
                                                                border: "none",
                                                                transition: "all 0.3s ease",
                                                                fontWeight: "600",
                                                                fontSize: "0.9rem",
                                                                padding: "0.5rem 1.25rem",
                                                                whiteSpace: "nowrap",
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.transform =
                                                                    "translateY(-2px)";
                                                                e.currentTarget.style.boxShadow =
                                                                    "0 8px 20px rgba(220, 38, 38, 0.4)";
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.transform =
                                                                    "translateY(0)";
                                                                e.currentTarget.style.boxShadow =
                                                                    "none";
                                                            }}
                                                        >
                                                            <i className="bi bi-play-circle me-2"></i>
                                                            View Details
                                                        </button>
                                                    )}
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
        </div>
    );
}