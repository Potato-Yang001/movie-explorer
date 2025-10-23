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
                                    <div key={movie.id} className="col-6 col-sm-4 col-md-3 col-lg-2">
                                        <div
                                            className="card border-0 shadow-lg h-100 overflow-hidden"
                                            style={{
                                                borderRadius: "1rem",
                                                background: "rgba(15,23,42,0.85)",
                                                color: "white",
                                                backdropFilter: "blur(12px)",
                                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                                cursor: "pointer",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = "translateY(-8px)";
                                                e.currentTarget.style.boxShadow =
                                                    "0 10px 30px rgba(20,184,166,0.4)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = "translateY(0)";
                                                e.currentTarget.style.boxShadow = "none";
                                            }}
                                            onClick={() => currentUser && navigate(`/detail/${movie.id}`)}
                                        >
                                            {/* Movie Poster */}
                                            <div style={{ position: "relative" }}>
                                                {movie.poster_path ? (
                                                    <img
                                                        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                                                        alt={movie.title}
                                                        className="img-fluid w-100"
                                                        style={{
                                                            aspectRatio: "2/3",
                                                            objectFit: "cover",
                                                            borderRadius: "1rem 1rem 0 0",
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        className="d-flex flex-column align-items-center justify-content-center"
                                                        style={{
                                                            aspectRatio: "2/3",
                                                            borderRadius: "1rem 1rem 0 0",
                                                            background: "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(22,78,99,0.9))",
                                                        }}
                                                    >
                                                        <i className="bi bi-film" style={{ fontSize: "3rem", color: "rgba(94,234,212,0.3)", marginBottom: "0.5rem" }}></i>
                                                        <span className="text-muted small">No Image</span>
                                                    </div>
                                                )}

                                                {/* Gradient overlay */}
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        bottom: 0,
                                                        left: 0,
                                                        right: 0,
                                                        height: "50%",
                                                        background: "linear-gradient(to top, rgba(15,23,42,0.95), transparent)",
                                                        pointerEvents: "none",
                                                    }}
                                                ></div>
                                            </div>

                                            {/* Movie Info */}
                                            <div className="card-body p-3">
                                                <h5
                                                    className="card-title fw-bold mb-2"
                                                    style={{
                                                        fontSize: "clamp(0.85rem, 2vw, 1rem)",
                                                        color: "#e0f2fe",
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: "vertical",
                                                        overflow: "hidden",
                                                        minHeight: "2.4em",
                                                        lineHeight: "1.2em",
                                                    }}
                                                >
                                                    {movie.title}
                                                </h5>

                                                {movie.release_date && (
                                                    <p
                                                        className="text-white-50 mb-3"
                                                        style={{
                                                            fontSize: "0.8rem",
                                                        }}
                                                    >
                                                        {new Date(movie.release_date).getFullYear()}
                                                    </p>
                                                )}

                                                {currentUser && (
                                                    <button
                                                        className="btn btn-sm w-100"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/detail/${movie.id}`);
                                                        }}
                                                        style={{
                                                            border: "none",
                                                            transition: "all 0.3s ease",
                                                            fontWeight: "600",
                                                            fontSize: "0.8rem",
                                                            padding: "0.5rem",
                                                            color: "white",
                                                            background:
                                                                "linear-gradient(135deg, #14b8a6 0%, #0f172a 100%)",
                                                            borderRadius: "8px",
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.boxShadow =
                                                                "0 4px 12px rgba(20,184,166,0.5)";
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.boxShadow = "none";
                                                        }}
                                                    >
                                                        <i className="bi bi-play-circle me-1"></i>
                                                        Details
                                                    </button>
                                                )}
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