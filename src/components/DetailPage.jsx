import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";
import { useNavigate, useParams } from "react-router-dom";
import { getMovieDetailsOMDB, getMovieTrailerYouTube } from "../services/movieAPI"
import axios from "axios";
import { Modal } from "react-bootstrap";

export default function DetailPage() {
    const [movies, setMovies] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [omdbDetails, setOmdbDetails] = useState(null)
    // const [movieDetail, setMovieDetail] = useState(null)
    const [trailerUrl, setTrailerUrl] = useState(null);

    const { currentUser } = useContext(AuthContext)
    const { id } = useParams()
    const navigate = useNavigate()

    const API_BASE_URL = "https://e7d191c2-4c98-4d39-96df-4fc6e39d522f-00-3d6sd3diyggd0.pike.replit.dev"

    useEffect(() => {
        const fetchDetailMovie = async () => {
            try {
                const tmdnRes = await axios.get(`https://api.themoviedb.org/3/movie/${id}`,
                    {
                        params: {
                            api_key: import.meta.env.VITE_TMDB_API_KEY
                        },
                    }
                )
                setMovies(tmdnRes.data);

                if (tmdnRes.data.imdb_id) {
                    const omdbData = await getMovieDetailsOMDB(tmdnRes.data.imdb_id)
                    setOmdbDetails(omdbData)
                }

                const tralier = await getMovieTrailerYouTube(tmdnRes.movies.title)
                setTrailerUrl(tralier)
                setLoading(false)
            } catch (error) {
                console.error("Error fetching movie details:", error)
            }
        }
        fetchDetailMovie()
    }, [id])

    const handleAddFavorite = async (movie) => {
        const newFavorite = {
            username: currentUser?.displayName || currentUser?.email || "Guest",
            movieId: movie.id,
            title: movie.title,
            posterPath: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            watch_time: new Date().toISOString()
        };
        try {
            await axios.post(`${API_BASE_URL}/favorites`, newFavorite);
            alert(`${movie.title} added to favorites!`)
            navigate("/favorites")
        } catch (err) {
            console.error("Error adding favorite:", err);
            alert("Failed to add to favorites!")
        }
    }

    const handleShowTrailer = () => setShowModal(true)
    const handleCloseTrailer = () => setShowModal(false)

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100 bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted fs-5">Loading movies detail...</p>
                </div>
            </div>
        )
    }

    if (!movies) {
        return (
            <div class="flex items-start bg-red-100 text-red-800 p-4 rounded-lg relative" role="alert">
                <div class="flex lg:items-center max-lg:flex-col gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0 fill-red-500 inline" viewBox="0 0 32 32">
                        <path
                            d="M16 1a15 15 0 1 0 15 15A15 15 0 0 0 16 1zm6.36 20L21 22.36l-5-4.95-4.95 4.95L9.64 21l4.95-5-4.95-4.95 1.41-1.41L16 14.59l5-4.95 1.41 1.41-5 4.95z"
                            data-original="#ea2d3f" />
                    </svg>
                    <span class="font-semibold text-[15px] inline-block mr-2">Error!</span>
                    <span class="block text-sm font-medium sm:inline">Sorry, movie not found</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg"
                    class="w-7 h-7 hover:bg-red-200 rounded-lg transition-all p-2 cursor-pointer ml-auto shrink-0 fill-red-500" viewBox="0 0 320.591 320.591">
                    <path
                        d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                        data-original="#000000" />
                    <path
                        d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                        data-original="#000000" />
                </svg>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Poster */}
                <img
                    src={
                        movies.poster_path
                            ? `https://image.tmdb.org/t/p/w500${movies.poster_path}`
                            : "https://via.placeholder.com/400x600?text=No+Image"
                    }
                    alt={movies.title}
                    className="rounded-lg shadow-md w-full md:w-80 object-cover"
                />

                {/* Movie Info */}
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-4xl font-bold mb-3">{movies.title}</h1>
                    <p className="text-gray-500 italic mb-4">
                        {movies.tagline || "No tagline available"}
                    </p>

                    <p className="text-gray-700 mb-4">{movies.overview}</p>

                    <ul className="text-gray-600 mb-6">
                        <li>
                            <strong>Release Date:</strong> {movies.release_date || "N/A"}
                        </li>
                        <li>
                            <strong>Rating:</strong> ⭐ {movies.vote_average?.toFixed(1)} / 10
                        </li>
                        <li>
                            <strong>Runtime:</strong> {movies.runtime} minutes
                        </li>
                        {omdbDetails && (
                            <>
                                <li>
                                    <strong>Director:</strong> {omdbDetails.Director}
                                </li>
                                <li>
                                    <strong>Actors:</strong> {omdbDetails.Actors}
                                </li>
                                <li>
                                    <strong>Genre:</strong> {omdbDetails.Genre}
                                </li>
                            </>
                        )}
                    </ul>

                    {/* Buttons */}
                    <div className="flex gap-3 justify-center md:justify-start">
                        {trailerUrl && (
                            <button
                                className="btn btn-danger flex items-center"
                                onClick={handleShowTrailer}
                            >
                                <i className="bi bi-play-circle me-1"></i> Watch Trailer
                            </button>
                        )}
                        <button
                            className="btn btn-success flex items-center"
                            onClick={() => handleAddFavorite(movies)}
                        >
                            <i className="bi bi-heart-fill me-1"></i> Add to Favorites
                        </button>
                    </div>
                </div>
            </div>

            {/* 🎥 Trailer Modal */}
            <Modal
                show={showModal}
                onHide={handleCloseTrailer}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>{movies.title} - Official Trailer</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0">
                    {trailerUrl ? (
                        <iframe
                            width="100%"
                            height="400"
                            src={trailerUrl.replace("watch?v=", "embed/")}
                            title="YouTube trailer"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <p className="text-center text-gray-600 py-4">
                            No trailer available 😢
                        </p>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    )
}