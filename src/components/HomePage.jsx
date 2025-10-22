import { useContext, useEffect, useState } from "react";
import { getPopularMoviesTMDB } from "../services/movieAPI"
import axios from "axios";
import { AuthContext } from "./AuthProvider";
import { useNavigate } from "react-router-dom";
import MovieSideBar from "./MovieSideBar";
import Swal from "sweetalert2";


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
                movie_id: movie.id, // ✅ match Neon column
                title: movie.title,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`, // ✅ match Neon column
                watch_time: new Date().toISOString()
            };
            const res = await axios.post(`${API_BASE_URL}/favorites`, newFavorite);
            setFavorites([...favorites, res.data]);
            Swal.fire({
                icon: "success",
                title: "Added to Favorites!",
                text: `${movie.title} has been successfully added.`,
                confirmButtonColor: "#3085d6",
            });
            navigate("/favourite")
        } catch (err) {
            console.error("Error adding favorite:", err);
            Swal.fire({
                icon: "error",
                title: "Oops!",
                text: "Failed to add to favorites. Please try again later.",
                confirmButtonColor: "#d33",
            });
        }
    }

    // Sidebar is now handled by MovieSideBar component

    if (loading) {
        return (
            <div
                className="d-flex justify-content-center align-items-center vh-100"
                style={{
                    background: "linear-gradient(135deg, #0f172a 0%, #164e63 100%)",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Sci-fi ambient glow overlay */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                            "radial-gradient(circle at 30% 40%, rgba(20,184,166,0.15) 0%, transparent 60%), radial-gradient(circle at 80% 70%, rgba(94,234,212,0.15) 0%, transparent 60%)",
                        pointerEvents: "none",
                    }}
                ></div>

                <div className="text-center px-3 position-relative">
                    <div
                        className="spinner-border mb-3"
                        role="status"
                        style={{
                            width: "3rem",
                            height: "3rem",
                            color: "#14b8a6",
                            filter: "drop-shadow(0 0 12px rgba(20,184,166,0.6))",
                        }}
                    >
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p
                        className="fs-5 fw-semibold"
                        style={{
                            color: "#e0f2fe",
                            textShadow: "0 0 10px rgba(94,234,212,0.5)",
                            letterSpacing: "0.03rem",
                        }}
                    >
                        Loading popular movies...
                    </p>
                </div>
            </div>
        );
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
                    background: "linear-gradient(135deg, #0f172a 0%, #164e63 100%)",
                    color: "white",
                    marginLeft: "0",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Subtle animated overlay */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                            "radial-gradient(circle at 30% 40%, rgba(34,211,238,0.1) 0%, transparent 60%), radial-gradient(circle at 80% 70%, rgba(56,189,248,0.1) 0%, transparent 60%)",
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
                                    color: "#5eead4",
                                    textShadow: "0 4px 25px rgba(94,234,212,0.4)",
                                    letterSpacing: "0.05rem",
                                }}
                            >
                                {greeting ? `Welcome ${greeting}` : "Welcome"} 🎬
                            </h1>
                            <h2
                                className="h4 h3-md fw-semibold"
                                style={{
                                    color: "#e0f2fe",
                                    textShadow: "0 2px 15px rgba(56,189,248,0.4)",
                                }}
                            >
                                to BingeBuddy
                            </h2>
                        </div>
                        <p
                            className="lead text-white-50 col-lg-8 mx-auto mb-0 px-2"
                            style={{
                                fontSize: "clamp(0.9rem, 2vw, 1.125rem)",
                                textShadow: "0 2px 10px rgba(0,0,0,0.4)",
                            }}
                        >
                            Explore worlds, one movie at a time — powered by next-gen movie discovery.
                        </p>
                    </div>

                    {/* Section Title */}
                    <div className="mb-3 mb-md-4 px-3 px-md-0">
                        <div
                            className="d-inline-flex align-items-center rounded-pill px-3 px-md-4 py-2 shadow-lg"
                            style={{
                                background: "linear-gradient(135deg, #0891b2 0%, #0f172a 100%)",
                            }}
                        >
                            <span className="fs-4 me-2">🚀</span>
                            <h2 className="h5 h4-md fw-bold mb-0 text-white">
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
                                        background: "rgba(15,23,42,0.8)",
                                        color: "white",
                                        backdropFilter: "blur(12px)",
                                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translateY(-4px)";
                                        e.currentTarget.style.boxShadow =
                                            "0 10px 30px rgba(20,184,166,0.4)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "none";
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
                                                <div className="bg-dark bg-opacity-25 h-100 d-flex align-items-center justify-content-center">
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
                                                            color: "#e0f2fe",
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
                                                            color: favorites.includes(movie.id)
                                                                ? "#14b8a6"
                                                                : "#e0f2fe",
                                                        }}
                                                    >
                                                        <i
                                                            className={`bi ${favorites.includes(movie.id)
                                                                ? "bi-heart-fill"
                                                                : "bi-heart"
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
                                                                "linear-gradient(135deg, #14b8a6 0%, #0f172a 100%)",
                                                        }}
                                                    >
                                                        <span className="me-1">⭐</span>
                                                        <span className="fw-bold text-white">
                                                            {movie.vote_average?.toFixed(1)}
                                                        </span>
                                                    </div>

                                                    {currentUser && (
                                                        <button
                                                            className="btn flex-grow-1 flex-sm-grow-0"
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
                                                                color: "white",
                                                                background:
                                                                    "linear-gradient(135deg, #14b8a6 0%, #0f172a 100%)",
                                                                borderRadius: "8px",
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.transform =
                                                                    "translateY(-2px)";
                                                                e.currentTarget.style.boxShadow =
                                                                    "0 8px 20px rgba(20,184,166,0.5)";
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.transform =
                                                                    "translateY(0)";
                                                                e.currentTarget.style.boxShadow = "none";
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