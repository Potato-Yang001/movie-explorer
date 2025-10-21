import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import { AuthProvider } from "./components/AuthProvider";
import { MovieSearch } from "./components/MovieSearch";
import MovieSideBar from "./components/MovieSideBar";
import HomePage from "./components/HomePage";
import DetailPage from "./components/DetailPage";
import FavoritesPage from "./components/FavoritesPage";


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
              <Route path="/" element={<HomePage />} />
              <Route path="/detail/:id" element={<DetailPage />} />
              <Route path="/search" element={<MovieSearch />} />
              <Route path="/favourite" element={<FavoritesPage />} />
              <Route path="/auth" element={<AuthPage />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}