import { createContext, useState, useEffect, useContext } from "react";
import { auth } from "../firebase"; // Import your Firebase auth instance


export const AuthContext = createContext();

export function AuthProvider({ children }) { // children  are a prop that represents the child components that will be wrapped by this provider
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        return auth.onAuthStateChanged((user) => { // onAuthStateChanged is a callback function from your Firebase auth instance
            setCurrentUser(user); // Set the current user
            setLoading(false);
        })
    }, []); // Add your authentication logic here

    const value = {
        currentUser,
    };

    return (
        <AuthContext.Provider value={value}>  {/*Provide the auth context to children components*/}
            {!loading && children} {/* Render children only when not loading */}
        </AuthContext.Provider>
    )
}

export function useAuth() { // useAuth is a custom hook to access the AuthContext
    return useContext(AuthContext);
}