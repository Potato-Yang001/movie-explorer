import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import MovieSideBar from "../components/MovieSideBar";


export default function AuthPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isLogin, setIsLogin] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.search.includes("signup")) setIsLogin(false);
        else setIsLogin(true);
    }, [location]);

    const provider = new GoogleAuthProvider();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            await signInWithPopup(auth, provider);
            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="position-relative">
            <MovieSideBar />
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#01497C] via-[#0A9396] to-[#001F3F] animate-gradient-x">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md p-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
                        {isLogin ? "Welcome Back 🌊" : "Join Us 🌅"}
                    </h2>
                    <p className="text-center text-gray-500 mb-6">
                        {isLogin ? "Login to your account" : "Create your account"}
                    </p>

                    {error && <p className="text-red-500 text-center mb-3">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                         focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                         focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#0A9396] hover:bg-[#0B7E8C] text-white py-2.5 rounded-lg font-medium 
                       transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            {loading
                                ? isLogin
                                    ? "Signing In..."
                                    : "Creating Account..."
                                : isLogin
                                    ? "Sign In"
                                    : "Sign Up"}
                        </button>
                    </form>

                    <div className="flex items-center justify-center my-5">
                        <div className="h-px bg-gray-300 w-1/3"></div>
                        <span className="mx-3 text-gray-500 text-sm">or</span>
                        <div className="h-px bg-gray-300 w-1/3"></div>
                    </div>

                    <button
                        onClick={handleGoogleSignIn}
                        type="button"
                        className="w-full bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg 
                     font-medium flex items-center justify-center hover:bg-gray-50 
                     transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="Google logo"
                            className="w-5 h-5 mr-2"
                        />
                        Continue with Google
                    </button>

                    <p className="text-center text-sm text-gray-600 mt-6">
                        {isLogin ? (
                            <>
                                Don’t have an account?{" "}
                                <span
                                    onClick={() => setIsLogin(false)}
                                    className="text-[#0A9396] font-medium hover:underline cursor-pointer"
                                >
                                    Sign up
                                </span>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <span
                                    onClick={() => setIsLogin(true)}
                                    className="text-[#0A9396] font-medium hover:underline cursor-pointer"
                                >
                                    Sign in
                                </span>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
