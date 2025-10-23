import { useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthProvider";
import axios from "axios";
import { Modal } from "react-bootstrap";
import MovieSideBar from "./MovieSideBar";
import { Link } from "react-router-dom";

export default function FavoritesPage() {
    const API_BASE_URL =
        "https://movieexplorerbackendapi.vercel.app";

    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalShow, setModalShow] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const { currentUser } = useContext(AuthContext);

    // ✅ Fetch favorites
    useEffect(() => {
        async function fetchFavorites() {
            try {
                const res = await axios.get(`${API_BASE_URL}/favorites`);
                setFavorites(res.data);
            } catch (err) {
                console.error("Error fetching favorites:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchFavorites();
    }, []);

    // ✅ Remove favorite
    const handleRemoveFavorites = async () => {
        if (!selectedMovie) return;
        try {
            await axios.delete(`${API_BASE_URL}/favorites/${selectedMovie.id}`);
            setFavorites(favorites.filter((m) => m.id !== selectedMovie.id));
        } catch (err) {
            console.error("Error removing favorite:", err);
        } finally {
            handleCloseDelete();
        }
    };

    const handleShowDelete = (movie) => {
        setSelectedMovie(movie);
        setModalShow(true);
    };

    const handleCloseDelete = () => {
        setModalShow(false);
        setSelectedMovie(null);
    };

    // ✅ Loading screen
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
                <div
                    className="spinner-border mb-3"
                    role="status"
                    style={{
                        width: "3rem",
                        height: "3rem",
                        color: "#14b8a6",
                        filter: "drop-shadow(0 0 12px rgba(20,184,166,0.6))",
                    }}
                ></div>
                <p className="fs-5 fw-semibold text-sky-100 ms-3">Loading favorites...</p>
            </div>
        );
    }

    // ✅ Empty state
    if (!favorites.length)
        return (
            <div className="min-vh-100 flex flex-col justify-center items-center bg-slate-900 text-white">
                <MovieSideBar />
                <p className="text-gray-400 text-center">
                    You have no favorite movies yet.
                </p>
            </div>
        );

    // ✅ Main content
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
                <h2 className="text-2xl md:text-3xl font-semibold text-center py-4">
                    ❤️ Your Favorite Movies
                </h2>

                <div className="container pb-5">
                    <div className="row gy-4">
                        {favorites.map((movie) => (
                            <div
                                key={movie.id}
                                className="col-12 col-md-10 col-lg-8 mx-auto bg-slate-800 bg-opacity-70 rounded-2xl shadow-lg overflow-hidden"
                            >
                                <div className="row g-0 h-100">
                                    {/* Left: Poster */}
                                    <div className="col-4 col-sm-3 col-md-3 col-lg-2">
                                        {movie.poster_url ? (
                                            <img
                                                src={movie.poster_url}
                                                alt={movie.title}
                                                className="img-fluid w-100 h-100"
                                                style={{ objectFit: "cover", minHeight: "200px" }}
                                            />
                                        ) : (
                                            <div className="bg-slate-700 h-100 d-flex align-items-center justify-content-center">
                                                <span className="text-gray-400 small">No Image</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right: Details */}
                                    <div className="col-8 col-sm-9 col-md-9 col-lg-10">
                                        <div className="card-body d-flex flex-column h-100 p-3 p-md-4">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
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
                                                    className="btn btn-link p-0 text-red-500 hover:text-red-400"
                                                    onClick={() => handleShowDelete(movie)}
                                                    title="Remove from Favorites"
                                                >
                                                    <i className="bi bi-trash3-fill fs-5"></i>
                                                </button>
                                            </div>
                                            {/*
                                            <p className="text-gray-300 small mb-2">
                                                {movie.release_date
                                                    ? `Released: ${movie.release_date}`
                                                    : "Release date unavailable"}
                                            </p>

                                            <p className="text-gray-400 small mb-3">
                                                {movie.overview
                                                    ? movie.overview.slice(0, 150) + "..."
                                                    : "No description available."}
                                            </p>
                                            */}
                                            <Link
                                                to={`/detail/${movie.movie_id}`}
                                                className="btn btn-outline-info mt-auto w-fit"
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
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ✅ Delete confirmation modal */}
                <Modal show={modalShow} onHide={handleCloseDelete} centered>
                    <Modal.Header
                        closeButton
                        className="bg-slate-800 text-white border-0"
                    >
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                        <p className="text-gray-700 dark:text-gray-300">
                            {currentUser?.email
                                ? `${currentUser.email}, are you sure you want to remove "${selectedMovie?.title}" from your favorites?`
                                : `Are you sure you want to remove "${selectedMovie?.title}" from your favorites?`}
                        </p>
                        <div className="d-flex justify-content-center gap-3 mt-3">
                            <button
                                className="btn btn-secondary"
                                onClick={handleCloseDelete}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={handleRemoveFavorites}
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
}
