import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function MovieSideBar({ handleLogout }) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleSignup = () => {
        navigate("/auth");
    }

    const closeSidebar = () => {
        setIsOpen(false);
    }

    return (
        <div className="flex">
            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-lime-100 text-black shadow-lg transform transition-transform duration-300 ease-in-out
  ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
            >
                <div className="p-4 text-2xl font-bold border-b border-lime-800">
                    BingeBuddy
                </div>

                <ul className="p-4 space-y-4 text-lg">
                    <Link
                        to="/"
                        className="flex items-center text-black hover:text-yellow-300 transition-colors"
                        style={{ textDecoration: "none" }}
                    >
                        <i className="bi bi-house-door me-2"></i> Home
                    </Link>

                    <Link
                        to="/search"
                        className="flex items-center text-black hover:text-yellow-300 transition-colors"
                        style={{ textDecoration: "none" }}
                    >
                        <i className="bi bi-search me-2"></i> Search
                    </Link>
                    <li>
                        <Link
                            to="/favourite"
                            className="flex items-center text-black no-underline hover:text-yellow-300 transition-colors"
                            style={{ textDecoration: "none" }}
                        >
                            <i className="bi bi-heart me-2"></i> Favourite
                        </Link>
                    </li>

                    <li>
                        <button
                            onClick={handleSignup}
                            className="flex items-center gap-2 text-black no-underline hover:text-yellow-300 transition-colors"
                        >
                            <i className="bi bi-box-arrow-in-right me-2"></i>Sign In
                        </button>
                    </li>

                    <li>
                        <button
                            onClick={() => navigate('/auth?mode=signup')}
                            className="flex items-center gap-2 text-black no-underline hover:text-yellow-300 transition-colors"
                        >
                            <i className="bi bi-person-plus me-2"></i>Sign Up
                        </button>
                    </li>

                    <li>
                        <button
                            className="flex items-center text-black no-underline hover:text-yellow-300 transition-colors"
                            onClick={handleLogout}
                        >
                            <i className="bi bi-box-arrow-right me-2"></i>Sign Out
                        </button>
                    </li>
                </ul>
            </div>

            {/* ✅ Overlay (mobile only) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
                    style={{ zIndex: 1040 }}
                    onClick={closeSidebar}
                ></div>
            )}

            {/* ✅ Toggle Button (always on top, mobile only) */}
            <button
                type="button"
                className="btn btn-primary position-fixed top-0 start-0 m-3 d-md-none"
                style={{ zIndex: 1100 }}
                onClick={() => setIsOpen(!isOpen)}
            >
                ☰
            </button>

            {/* ✅ Main content area */}
            <div className="flex-1 min-h-screen bg-gray-50 md:ms-64"></div>
        </div>
    );
}
