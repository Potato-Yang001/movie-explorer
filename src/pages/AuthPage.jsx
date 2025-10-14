import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { Modal } from "react-bootstrap";
import { auth } from "../firebase";

export default function AuthPage() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [login, setIsLogin] = useState(true);
    const [modalShow, setModalShow] = useState(null)
    const handleShowSignUp = () => setModalShow("SignUp")
    const handleShowLogin = () => setModalShow("Login")
    const navigate = useNavigate()
    // const auth = getAuth();

    const handleSignUp = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await createUserWithEmailAndPassword(auth, username, password)
            console.log(res.user)
            navigate('/')
        } catch (err) {
            setError(err.message)
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await signInWithEmailAndPassword(auth, username, password)
            navigate('/')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const provider = new GoogleAuthProvider()

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, provider)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => setModalShow(null)

    return (
        <>
            <button
                className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                onClick={handleShowLogin}
            >
                Login
            </button>

            <Modal show={modalShow === "Login"} onHide={handleClose} centered>
                <div className="p-6">
                    <h3 className="text-xl font-bold mb-4">Login</h3>

                    {error && <p className="text-red-500 mb-2">{error}</p>}

                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                            <input type="email" id="email" className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                                value={username} onChange={(e) => setUsername(e.target.value)}
                                placeholder="name@flowbite.com"
                                required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                            <input type="password" id="password" className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                required />
                        </div>
                        <div className="flex items-start mb-5">
                            <div className="flex items-center h-5">
                                <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" />
                            </div>
                            <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
                        </div>
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >{loading ? "Login..." : "Login"}</button>
                        <p className="text-center mt-3 text-sm">
                            {login ? (
                                <>
                                    Don't have an account?{" "}
                                    <span
                                        className="text-blue-600 cursor-pointer"
                                        onClick={handleShowSignUp}
                                    >
                                        Create account
                                    </span>
                                </>
                            ) : (
                                <>
                                    Already have an account?{" "}
                                    <span
                                        className="text-blue-600 cursor-pointer"
                                        onClick={() => {
                                            setModalShow("Login");
                                            setIsLogin(true);
                                        }}
                                    >
                                        Back to Login
                                    </span>
                                </>
                            )}
                        </p>
                    </form>
                </div>
            </Modal>

            <Modal show={modalShow === "Sign Up"} onHide={handleClose} centered>
                <div className="p-6">
                    <h3 className="text-xl font-bold mb-4">Sign in</h3>

                    {error && <p className="text-red-500 mb-2">{error}</p>}

                    <form onSubmit={handleSignUp}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                            <input type="email" id="email" className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                                value={username} onChange={(e) => setUsername(e.target.value)}
                                placeholder="name@flowbite.com"
                                required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                            <input type="password" id="password" className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                required />
                        </div>
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >{loading ? "Registering..." : "Register new account"}</button>

                        <div className="inline-flex items-center justify-center w-full">
                            <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
                            <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">or</span>
                        </div>
                        <button onClick={handleGoogleSignIn} type="button" className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2">
                            <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
                                <path fillRule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clipRule="evenodd" />
                            </svg>
                            Sign in with Google
                        </button>
                    </form>
                </div>
            </Modal>
        </>
    )
}
