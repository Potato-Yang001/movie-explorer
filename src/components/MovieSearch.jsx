import { useState, useContext } from "react";
import { searchMoviesTMDB } from "../services/movieAPI"; // import the searchMoviesTMDB function
import { useNavigate } from "react-router-dom";
import MovieSideBar from "./MovieSideBar";
import { AuthContext } from "./AuthProvider";

export function MovieSearch() {

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const navigate = useNavigate()
    const { currentUser } = useContext(AuthContext);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) {
            alert("Please enter a movie title to search.");
            return;
        }

        const data = await searchMoviesTMDB(query); // call the searchMoviesTMDB function with the query
        setResults(data || []); // set the results state with the search results
    }

    return (
        <div className="min-vh-100 bg-dark text-white">
            {/* Sidebar component */}
            <MovieSideBar />

            {/* Header Section */}
            <div
                className="py-5 shadow-lg"
                style={{
                    background: "linear-gradient(135deg, #0d9488 0%, #134e4a 100%)",
                }}
            >
                <div className="container">
                    <div className="text-center mb-4">
                        <h1 className="display-4 fw-bold mb-2">
                            <span className="me-3">🎬</span>
                            Movie Search
                        </h1>
                        <p className="lead" style={{ color: "rgba(255,255,255,0.8)" }}>
                            Discover your favorite movies from our extensive database
                        </p>
                    </div>

                    {/* Search Input */}
                    <div className="row justify-content-center">
                        <div className="col-lg-8 col-md-10">
                            <div className="input-group input-group-lg shadow-lg">
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
                                    id="search"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="form-control border-0 ps-2"
                                    placeholder="Search for movies, series, actors..."
                                    style={{ fontSize: "1.1rem" }}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            handleSearch(e);
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    className="btn px-5 fw-semibold text-white"
                                    style={{ backgroundColor: "#0d9488", border: "none" }}
                                    onClick={handleSearch}
                                >
                                    <span className="me-2">🔍</span>
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="container py-5">
                {results.length === 0 ? (
                    <div className="text-center py-5">
                        <div className="mb-4">
                            <svg
                                className="mx-auto text-muted"
                                width="120"
                                height="120"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                            >
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                <path d="M11.315 10.014a.5.5 0 0 1 .548.736A4.498 4.498 0 0 1 7.965 13a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .548-.736h.005l.017.005.067.015.252.055c.215.046.515.108.857.169.693.124 1.522.242 2.152.242.63 0 1.46-.118 2.152-.242a26.58 26.58 0 0 0 1.109-.224l.067-.015.017-.005h.005zM4.756 4.566c.763-1.424 4.02-.12.952 3.434-4.496-1.596-2.35-4.298-.952-3.434zm6.488 0c1.398-.864 3.544 1.838-.952 3.434-3.067-3.554.19-4.858.952-3.434z" />
                            </svg>
                        </div>
                        <h3 className="text-white mb-3">No movies found yet</h3>
                        <p className="fs-5" style={{ color: "rgba(255,255,255,0.6)" }}>
                            Start searching to discover amazing movies!
                        </p>
                    </div>
                ) : (
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="text-white fw-bold mb-0">
                                <span style={{ color: "#14b8a6" }}>{results.length}</span> Results
                                Found
                            </h2>
                        </div>

                        <div className="row g-4">
                            {results.map((movie) => (
                                <div key={movie.id} className="col-lg-3 col-md-4 col-sm-6">
                                    <div className="card bg-dark border-secondary shadow-lg h-100 overflow-hidden position-relative movie-card">
                                        {/* Movie Poster */}
                                        <div
                                            className="position-relative overflow-hidden"
                                            style={{ height: "400px" }}
                                        >
                                            {movie.poster_path ? (
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                                                    alt={movie.title}
                                                    className="card-img-top w-100 h-100"
                                                    style={{
                                                        objectFit: "cover",
                                                        transition: "transform 0.3s ease",
                                                    }}
                                                    onMouseEnter={(e) =>
                                                        (e.currentTarget.style.transform = "scale(1.05)")
                                                    }
                                                    onMouseLeave={(e) =>
                                                        (e.currentTarget.style.transform = "scale(1)")
                                                    }
                                                />
                                            ) : (
                                                <div className="w-100 h-100 bg-secondary d-flex align-items-center justify-content-center">
                                                    <div className="text-center">
                                                        <svg
                                                            width="80"
                                                            height="80"
                                                            fill="currentColor"
                                                            className="text-muted mb-2"
                                                            viewBox="0 0 16 16"
                                                        >
                                                            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                                            <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
                                                        </svg>
                                                        <p className="text-muted mb-0">No Image</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Movie Title & Button */}
                                        {currentUser && (
                                            <div className="card-body bg-dark">
                                                <h5
                                                    className="card-title text-white mb-3 text-truncate"
                                                    title={movie.title}
                                                >
                                                    {movie.title}
                                                </h5>
                                                <button
                                                    className="btn w-100 text-white"
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
                                                    onClick={() => navigate(`/detail/${movie.id}`)}
                                                >
                                                    <span className="me-2">👁️</span>
                                                    View Details
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
            .movie-card {
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            .movie-card:hover {
                transform: translateY(-8px);
                box-shadow: 0 20px 40px rgba(13, 148, 136, 0.3) !important;
            }
        `}</style>
        </div>
    );

}