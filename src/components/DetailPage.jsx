import { useContext, useEffect, useState, useRef, useCallback } from "react";
import { AuthContext } from "./AuthProvider";
import { useNavigate, useParams } from "react-router-dom";
import { getMovieDetailsOMDB, getMovieTrailerYouTube } from "../services/movieAPI"
import axios from "axios";
// import { Modal } from "react-bootstrap";
import MovieSideBar from "./MovieSideBar";
import { db, storage } from "../firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import Swal from "sweetalert2";

export default function DetailPage() {
    const [movies, setMovies] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [omdbDetails, setOmdbDetails] = useState(null)
    const [reviews, setReviews] = useState([])
    const [reviewText, setReviewText] = useState("")
    const [reviewImage, setReviewImage] = useState(null)
    const reviewFileRef = useRef(null)
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

                const tralier = await getMovieTrailerYouTube(tmdnRes.data.title)
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
            movie_id: movie.id,                  // ✅ match DB column
            title: movie.title,
            poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,  // ✅ match DB column
            watch_time: new Date().toISOString(),
        };
        try {
            await axios.post(`${API_BASE_URL}/favorites`, newFavorite);
            alert(`${movie.title} added to favorites!`)
            navigate("/favourite")
        } catch (err) {
            console.error("Error adding favorite:", err);
            alert("Failed to add to favorites!")
        }
    }

    const handleShowTrailer = () => setShowModal(true)
    const handleCloseTrailer = () => setShowModal(false)

    const handleUploadReview = async () => {
        console.log('Submitting review, reviewText:', JSON.stringify(reviewText))
        if (!reviewText || !reviewText.trim()) {
            Swal.fire("Empty Review", "Please enter a review before submitting.", "info")
            return
        }

        try {
            let imageUrl = '';

            if (reviewImage) {
                const imageRef = ref(storage, `reviews/${id}_${Date.now()}_${reviewImage.name}`);
                await uploadBytes(imageRef, reviewImage);
                imageUrl = await getDownloadURL(imageRef);
            }

            await addDoc(
                collection(db, "users", currentUser.uid, "reviews"), // 👈 nested under user
                {
                    movieId: id,
                    text: reviewText,
                    imageUrl,
                    createdAt: new Date(),
                }
            );
            console.log("Review added successfully! ✅");
            Swal.fire("Success!", "Your review has been posted.", "success")
            setReviewText("");
            setReviewImage(null);
            // clear native file input so it appears empty to the user
            if (reviewFileRef.current) reviewFileRef.current.value = '';
            fetchReviews()
        } catch (err) {
            Swal.fire("Error", err.message, "error")
        }
    }

    const fetchReviews = useCallback(async () => {
        try {
            const q = query(collection(db, "reviews"), where('movieId', "==", id));
            const querySnapshot = await getDocs(q)
            const reviewData = querySnapshot.docs.map((doc) => doc.data())
            setReviews(reviewData)
        } catch (err) {
            console.error("Error fetching reviews:", err);
        }
    }, [id])

    useEffect(() => {
        fetchReviews()
    }, [fetchReviews])

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
        <div className="min-vh-100 bg-dark text-white position-relative overflow-hidden">
            {/* Sidebar component (moved to MovieSideBar) */}
            <MovieSideBar />
            {/* Backdrop Background */}
            <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                    backgroundImage: movies.backdrop_path
                        ? `url(https://image.tmdb.org/t/p/original${movies.backdrop_path})`
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(20px)',
                    opacity: 0.25,
                    zIndex: 0
                }}
            ></div>

            <div className="container position-relative py-5" style={{ zIndex: 1 }}>
                <div className="row g-4 align-items-start">
                    {/* Movie Poster */}
                    <div className="col-lg-4 col-md-5">
                        <div className="card bg-transparent border-0 shadow-lg">
                            <img
                                src={
                                    movies.poster_path
                                        ? `https://image.tmdb.org/t/p/w500${movies.poster_path}`
                                        : "https://via.placeholder.com/400x600?text=No+Image"
                                }
                                alt={movies.title}
                                className="card-img-top rounded-3"
                                style={{ height: 'auto', objectFit: 'cover' }}
                            />
                        </div>
                    </div>

                    {/* Movie Information */}
                    <div className="col-lg-8 col-md-7">
                        <div className="mb-4">
                            <h1 className="display-4 fw-bold mb-2">{movies.title}</h1>
                            {movies.tagline && (
                                <p className="lead text-warning fst-italic mb-3">
                                    "{movies.tagline}"
                                </p>
                            )}

                            {/* Rating Badge */}
                            <div className="d-flex flex-wrap gap-2 mb-3">
                                <span className="badge bg-danger fs-6 px-3 py-2">
                                    <span className="me-1">⭐</span>
                                    {movies.vote_average?.toFixed(1)} / 10
                                </span>
                                <span className="badge bg-info fs-6 px-3 py-2">
                                    <span className="me-1">⏱️</span>
                                    {movies.runtime} min
                                </span>
                                <span className="badge bg-success fs-6 px-3 py-2">
                                    <span className="me-1">📅</span>
                                    {movies.release_date || "N/A"}
                                </span>
                            </div>
                        </div>

                        {/* Overview */}
                        <div className="card mb-4" style={{ backgroundColor: 'rgba(0,0,0,0.75)', border: '1px solid #6c757d' }}>
                            <div className="card-body">
                                <h5 className="card-title text-danger mb-3">
                                    <span className="me-2">📄</span>
                                    Synopsis
                                </h5>
                                <p className="card-text fs-6 lh-lg" style={{ color: 'rgba(255,255,255,0.7)' }}>
                                    {movies.overview || "No overview available."}
                                </p>
                            </div>
                        </div>

                        {/* Additional Details */}
                        {omdbDetails && (
                            <div className="card mb-4" style={{ backgroundColor: 'rgba(0,0,0,0.75)', border: '1px solid #6c757d' }}>
                                <div className="card-body">
                                    <h5 className="card-title text-danger mb-3">
                                        <span className="me-2">ℹ️</span>
                                        Movie Details
                                    </h5>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <p className="mb-2">
                                                <strong className="text-warning">Director:</strong>
                                                <span className="ms-2" style={{ color: 'rgba(255,255,255,0.7)' }}>{omdbDetails.Director}</span>
                                            </p>
                                        </div>
                                        <div className="col-md-6">
                                            <p className="mb-2">
                                                <strong className="text-warning">Genre:</strong>
                                                <span className="ms-2" style={{ color: 'rgba(255,255,255,0.7)' }}>{omdbDetails.Genre}</span>
                                            </p>
                                        </div>
                                        <div className="col-12">
                                            <p className="mb-0">
                                                <strong className="text-warning">Actors:</strong>
                                                <span className="ms-2" style={{ color: 'rgba(255,255,255,0.7)' }}>{omdbDetails.Actors}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="d-flex flex-wrap gap-3">
                            {trailerUrl && (
                                <button
                                    className="btn btn-danger btn-lg px-4 py-3 d-flex align-items-center shadow-lg"
                                    onClick={handleShowTrailer}
                                >
                                    <span className="fs-4 me-2">▶️</span>
                                    <span className="fw-semibold">Watch Trailer</span>
                                </button>
                            )}
                            <button
                                className="btn btn-outline-light btn-lg px-4 py-3 d-flex align-items-center shadow-lg"
                                onClick={() => handleAddFavorite(movies)}
                            >
                                <span className="fs-4 me-2">❤️</span>
                                <span className="fw-semibold">Add to Favorites</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trailer Modal */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }} onClick={handleCloseTrailer}>
                    <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content bg-dark text-white" style={{ border: '1px solid #6c757d' }}>
                            <div className="modal-header border-secondary">
                                <h5 className="modal-title d-flex align-items-center">
                                    <span className="me-2 text-danger">🎬</span>
                                    {movies.title} - Official Trailer
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={handleCloseTrailer}></button>
                            </div>
                            <div className="modal-body p-0 bg-black">
                                {trailerUrl ? (
                                    <div className="ratio ratio-16x9">
                                        <iframe
                                            src={trailerUrl.replace("watch?v=", "embed/")}
                                            title="YouTube trailer"
                                            allowFullScreen
                                            className="border-0"
                                        ></iframe>
                                    </div>
                                ) : (
                                    <div className="text-center py-5">
                                        <div className="fs-1 text-muted mb-3">📹</div>
                                        <p className="text-muted fs-5">No trailer available</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Review Section */}
            <div className="container mt-5" style={{ zIndex: 1 }}>
                <div
                    className="card text-white border-0 shadow-lg mb-5"
                    style={{
                        background: "linear-gradient(135deg, #0f172a 0%, #0d9488 100%)",
                        borderRadius: "20px",
                    }}
                >
                    <div className="card-body p-4">
                        <h3 className="mb-4 fw-bold text-teal-300">
                            💬 Leave a Review
                        </h3>

                        <textarea
                            className="form-control bg-dark text-white mb-3 border-0 rounded-3 shadow-sm"
                            rows="3"
                            placeholder="Share your thoughts about this movie..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                        />

                        <input
                            id="reviewFile"
                            ref={reviewFileRef}
                            type="file"
                            accept="image/*"
                            className="form-control bg-dark text-white mb-3 border-0 rounded-3 shadow-sm"
                            onChange={(e) => setReviewImage(e.target.files[0])}
                        />

                        <button
                            type="button"
                            className="btn fw-semibold px-4 py-2"
                            style={{
                                backgroundColor: "#14b8a6",
                                color: "white",
                                borderRadius: "10px",
                                transition: "all 0.3s ease",
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0d9488")}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#14b8a6")}
                            onClick={handleUploadReview}
                        >
                            🚀 Submit Review
                        </button>
                    </div>
                </div>

                {/* Display existing reviews */}
                <div>
                    <h4 className="text-light mb-4 fw-bold">User Reviews</h4>
                    {reviews.length === 0 ? (
                        <p className="text-muted">No reviews yet. Be the first to write one!</p>
                    ) : (
                        reviews.map((r, i) => (
                            <div
                                key={i}
                                className="card mb-4 text-white border-0 shadow-lg"
                                style={{
                                    background: "linear-gradient(145deg, #0f172a 0%, #164e63 100%)",
                                    borderRadius: "18px",
                                }}
                            >
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <div
                                            className="rounded-circle d-flex justify-content-center align-items-center me-3"
                                            style={{
                                                width: "45px",
                                                height: "45px",
                                                backgroundColor: "#14b8a6",
                                                color: "#0f172a",
                                                fontWeight: "bold",
                                                fontSize: "18px",
                                            }}
                                        >
                                            {r.user ? r.user.charAt(0).toUpperCase() : "?"}
                                        </div>
                                        <div>
                                            <p className="fw-bold mb-0 text-white">{r.user}</p>
                                            <small className="text-light opacity-75">
                                                {new Date(r.createdAt?.seconds * 1000 || Date.now()).toLocaleString()}
                                            </small>
                                        </div>
                                    </div>

                                    <p className="mt-2 fs-6 text-white-50">{r.text}</p>

                                    {r.imageUrl && (
                                        <img
                                            src={r.imageUrl}
                                            alt="Review"
                                            className="img-fluid rounded mt-3 shadow-sm"
                                            style={{
                                                maxHeight: "300px",
                                                borderRadius: "12px",
                                                border: "2px solid rgba(20,184,166,0.4)",
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}