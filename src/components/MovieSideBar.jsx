import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
//import { AuthContext } from "./AuthProvider";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function MovieSideBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);
    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const navigate = useNavigate();
    // const { currentUser, logout } = useContext(AuthContext);
    const { currentUser } = auth
    const closeSidebar = () => {
        setIsOpen(false);
    }

    // Preserve explicit handler names requested: handleSignup, handleLogin, handleLogout
    const handleSignup = () => {
        navigate('/auth?mode=signup');
        closeSidebar();
    };

    const handleLogin = () => {
        navigate('/auth');
        closeSidebar();
    };

    const handleLogout = async () => {
        // If AuthProvider exposes a logout function, call it. Otherwise just navigate.
        signOut(auth)
    };

    return (
        <div className="position-relative">
            {/* Sidebar for md+ screens and toggled on mobile */}
            <div
                className={`position-fixed top-0 start-0 h-100 shadow-lg d-md-block`}
                style={{
                    width: "250px",
                    zIndex: 1050,
                    transition: "transform 0.3s ease-in-out",
                    transform: isDesktop || isOpen ? "translateX(0)" : "translateX(-100%)",
                    background: "linear-gradient(180deg, #99f6e4 0%, #5eead4 100%)",
                }}
            >
                <div
                    className="p-4 border-bottom"
                    style={{
                        background: "linear-gradient(135deg, #0d9488 0%, #134e4a 100%)",
                    }}
                >
                    <h2 className="h4 fw-bold mb-0 text-white">🎬 BingeBuddy</h2>
                </div>

                <ul className="list-unstyled p-4">
                    <li className="mb-3">
                        <Link
                            to="/"
                            className="d-flex align-items-center text-decoration-none text-dark p-2 rounded"
                            onClick={closeSidebar}
                            style={{ transition: "background 0.2s" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#ccfbf1")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                            <i
                                className="bi bi-house-door me-3 fs-5"
                                style={{ color: "#0d9488" }}
                            ></i>
                            <span className="fw-semibold">Home</span>
                        </Link>
                    </li>

                    <li className="mb-3">
                        <Link
                            to="/search"
                            className="d-flex align-items-center text-decoration-none text-dark p-2 rounded"
                            onClick={closeSidebar}
                            style={{ transition: "background 0.2s" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#ccfbf1")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                            <i
                                className="bi bi-search me-3 fs-5"
                                style={{ color: "#0d9488" }}
                            ></i>
                            <span className="fw-semibold">Search</span>
                        </Link>
                    </li>

                    {currentUser && (
                        <li className="mb-3">
                            <Link
                                to="/favourite"
                                className="d-flex align-items-center text-decoration-none text-dark p-2 rounded"
                                onClick={closeSidebar}
                                style={{ transition: "background 0.2s" }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "#ccfbf1")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            >
                                <i
                                    className="bi bi-heart me-3 fs-5"
                                    style={{ color: "#0d9488" }}
                                ></i>
                                <span className="fw-semibold">Favourite</span>
                            </Link>
                        </li>
                    )}

                    {!currentUser && (
                        <>
                            <li className="mb-3">
                                <button
                                    onClick={handleLogin}
                                    className="d-flex align-items-center text-decoration-none text-dark p-2 rounded border-0 bg-transparent w-100 text-start"
                                    style={{ transition: "background 0.2s" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "#ccfbf1")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                >
                                    <i
                                        className="bi bi-box-arrow-in-right me-3 fs-5"
                                        style={{ color: "#0d9488" }}
                                    ></i>
                                    <span className="fw-semibold">Sign In</span>
                                </button>
                            </li>

                            <li className="mb-3">
                                <button
                                    onClick={handleSignup}
                                    className="d-flex align-items-center text-decoration-none text-dark p-2 rounded border-0 bg-transparent w-100 text-start"
                                    style={{ transition: "background 0.2s" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "#ccfbf1")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                >
                                    <i
                                        className="bi bi-person-plus me-3 fs-5"
                                        style={{ color: "#0d9488" }}
                                    ></i>
                                    <span className="fw-semibold">Sign Up</span>
                                </button>
                            </li>
                        </>
                    )}

                    {currentUser && (
                        <li className="mb-3">
                            <button
                                onClick={handleLogout}
                                className="d-flex align-items-center text-decoration-none text-dark p-2 rounded border-0 bg-transparent w-100 text-start"
                                style={{ transition: "background 0.2s" }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "#ccfbf1")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            >
                                <i
                                    className="bi bi-box-arrow-right me-3 fs-5"
                                    style={{ color: "#0d9488" }}
                                ></i>
                                <span className="fw-semibold">Sign Out</span>
                            </button>
                        </li>
                    )}
                </ul>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-md-none"
                    style={{
                        background: "rgba(0, 0, 0, 0.5)",
                        zIndex: 1040,
                    }}
                    onClick={closeSidebar}
                ></div>
            )}

            {/* Hamburger Toggle Button - Mobile Only */}
            <button
                className="btn position-fixed top-0 start-0 m-3 d-md-none shadow-sm"
                style={{
                    zIndex: 1060,
                    width: "45px",
                    height: "45px",
                    borderRadius: "8px",
                    border: "none",
                    background: "rgba(13, 148, 136, 0.95)",
                    color: "white",
                    backdropFilter: "blur(10px)",
                }}
                onClick={() => setIsOpen(!isOpen)}
            >
                <i className="bi bi-list fs-4"></i>
            </button>

            {/* Spacer for layout when sidebar present on desktop */}
            <div style={{ minHeight: "1px" }} className="d-none d-md-block" />
        </div>
    );
}
