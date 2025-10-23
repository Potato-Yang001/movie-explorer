import { useState, useContext } from "react";
import { searchMoviesTMDB } from "../services/movieAPI";
import { useNavigate } from "react-router-dom";
import MovieSideBar from "./MovieSideBar";
import { AuthContext } from "./AuthProvider";

export function MovieSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) {
            alert("Please enter a movie title to search.");
            return;
        }
        const data = await searchMoviesTMDB(query);
        setResults(data || []);
    };

    return (
        <div className="min-vh-100 bg-dark text-white">
            <MovieSideBar />

            {/* Header Section */}
            <div
                className="py-5 shadow-lg"
                style={{
                    background: "linear-gradient(135deg, #0d9488 0%, #134e4a 100%)",
                }}
            >
                <div className="container px-3 px-md-5">
                    <div className="text-center mb-4">
                        <h1 className="display-5 fw-bold mb-2">
                            <span className="me-2">🎬</span>Movie Search
                        </h1>
                        <p className="lead" style={{ color: "rgba(255,255,255,0.8)" }}>
                            Discover your favorite movies from our extensive database
                        </p>
                    </div>

                    {/* Search Input */}
                    <form
                        className="d-flex flex-column flex-md-row justify-content-center align-items-stretch gap-3"
                        onSubmit={handleSearch}
                    >
                        <div className="input-group input-group-lg flex-grow-1 shadow-lg">
                            <span className="input-group-text bg-white border-0 ps-4">
                                <svg
                                    className="text-muted"
                                    width="20"
                                    height="20"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                    />
                                </svg>
                            </span>
                            <input
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="form-control border-0 ps-2"
                                placeholder="Search for movies, series, actors..."
                                style={{ fontSize: "1rem" }}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn px-4 py-3 fw-semibold text-white shadow-sm"
                            style={{
                                backgroundColor: "#0d9488",
                                border: "none",
                                borderRadius: "0.5rem",
                            }}
                        >
                            <span className="me-2">🔍</span>Search
                        </button>
                    </form>
                </div>
            </div>

            {/* Results Section */}
            <div
                className="min-vh-100"
                style={{
                    background: "linear-gradient(135deg, #0f172a 0%, #164e63 100%)",
                    color: "white",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Subtle glowing overlay */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                            "radial-gradient(circle at 20% 40%, rgba(20,184,166,0.1) 0%, transparent 60%), radial-gradient(circle at 80% 70%, rgba(56,189,248,0.1) 0%, transparent 60%)",
                        pointerEvents: "none",
                    }}
                ></div>

                <div className="container py-4 py-md-5 position-relative">
                    {results.length === 0 ? (
                        <div className="text-center py-5">
                            <h3 className="text-white mb-3">No movies found yet</h3>
                            <p className="fs-5" style={{ color: "rgba(255,255,255,0.6)" }}>
                                Start searching to discover amazing movies!
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-4">
                                <h2
                                    className="fw-bold"
                                    style={{
                                        color: "#5eead4",
                                        textShadow: "0 2px 20px rgba(94,234,212,0.4)",
                                    }}
                                >
                                    Found {results.length} Movies
                                </h2>
                            </div>

                            <div className="row g-3 g-md-4 px-2 px-md-0">
                                {results.map((movie) => (
                                    <div key={movie.id} className="col-12">
                                        <div
                                            className="card border-0 shadow-lg h-100 overflow-hidden"
                                            style={{
                                                borderRadius: "1rem",
                                                background: "rgba(15,23,42,0.85)",
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
                                            <div className="row g-0 h-100 align-items-center">
                                                <div className="col-4 col-sm-3 col-md-2">
                                                    {movie.poster_path ? (
                                                        <img
                                                            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                                                            alt={movie.title}
                                                            className="img-fluid w-100 h-100"
                                                            style={{
                                                                objectFit: "cover",
                                                                minHeight: "180px",
                                                                borderRadius: "1rem 0 0 1rem",
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="bg-dark bg-opacity-25 h-100 d-flex align-items-center justify-content-center">
                                                            <span className="text-muted small">No Image</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="col-8 col-sm-9 col-md-10">
                                                    <div className="card-body d-flex flex-column h-100 p-3 p-md-4">
                                                        <h3
                                                            className="card-title fw-bold mb-2"
                                                            style={{
                                                                fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
                                                                color: "#e0f2fe",
                                                            }}
                                                        >
                                                            {movie.title}
                                                        </h3>

                                                        <p
                                                            className="text-white-50 mb-3 flex-grow-1"
                                                            style={{
                                                                display: "-webkit-box",
                                                                WebkitLineClamp:
                                                                    window.innerWidth < 576 ? 3 : 2,
                                                                WebkitBoxOrient: "vertical",
                                                                overflow: "hidden",
                                                                fontSize: "clamp(0.85rem, 2vw, 1rem)",
                                                            }}
                                                        >
                                                            {movie.overview || "No description available."}
                                                        </p>

                                                        {currentUser && (
                                                            <div className="mt-auto d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2">

                                                                <button
                                                                    className="btn flex-grow-1 flex-sm-grow-0"
                                                                    onClick={() => navigate(`/detail/${movie.id}`)}
                                                                    style={{
                                                                        border: "none",
                                                                        transition: "all 0.3s ease",
                                                                        fontWeight: "600",
                                                                        fontSize: "0.9rem",
                                                                        padding: "0.5rem 1.25rem",
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
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

        </div>
    );
}
