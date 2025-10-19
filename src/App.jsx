import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import { AuthProvider } from "./components/AuthProvider";
import { MovieSearch } from "./components/MovieSearch";
import MovieSideBar from "./components/MovieSideBar";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex min-h-screen bg-gray-50">
          {/* Sidebar */}
          <div className="w-64 hidden md:block">
            <MovieSideBar />
          </div>

          {/* Main content */}
          <div className="flex-1 p-4">
            <Routes>
              <Route
                path="/"
                element={
                  <div className="mt-10 text-center">
                    <h1 className="text-3xl font-bold text-blue-700">
                      Welcome to BingeBuddy 🎬
                    </h1>
                    <p className="text-gray-600 mt-2">
                      Use the sidebar to explore or search for movies!
                    </p>
                  </div>
                }
              />
              <Route path="/search" element={<MovieSearch />} />
              <Route path="/auth" element={<AuthPage />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}