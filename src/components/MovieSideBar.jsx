import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function MovieSideBar({ handleLogout }) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleSignup = () => {
        navigate("/auth");
        setIsOpen(false)
    }

    return (
        <div className="flex">
            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-blue-700 text-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
            >
                <div className="p-4 text-2xl font-bold border-b border-blue-500">
                    BingeBuddy
                </div>
                <ul className="p-4 space-y-4 text-lg">
                    <li>
                        <Link to="/" className="flex items-center hover:text-yellow-300 text-white">
                            <i className="bi bi-house-door me-2"></i> Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/search" className="flex items-center hover:text-yellow-300 text-white">
                            <i className="bi bi-search me-2"></i> Search
                        </Link>
                    </li>
                    <li>
                        <Link to="/favourite" className="flex items-center hover:text-yellow-300 text-white">
                            <i className="bi bi-heart me-2"></i> Favourite
                        </Link>
                    </li>
                    <li>
                        <button onClick={handleSignup} className="flex items-center gap-2 w-full text-start">
                            <i className="bi bi-box-arrow-in-right me-2"></i>
                            Sign In
                        </button>
                    </li>
                    <li>
                        <a href="/auth?mode=signup">
                            <span className="icon-[tabler--user-plus] size-5 text-white"></span>
                            Sign Up
                        </a>
                    </li>
                    <li>
                        <button
                            className="flex items-center hover:text-yellow-300"
                            onClick={handleLogout}
                        >
                            <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                        </button>
                    </li>
                </ul>
            </div>

            {/* Main content area */}
            <div className="flex-1 min-h-screen bg-gray-50 md:ms-64">
                {/* Toggle button (visible on mobile) */}
                <button
                    className="btn btn-primary m-3 md:hidden"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <i className="bi bi-list"></i>
                </button>
            </div>
        </div>
    );
}
