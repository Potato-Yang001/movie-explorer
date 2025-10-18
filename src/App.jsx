import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import { AuthProvider } from "./components/AuthProvider";
import { MovieSearch } from "./components/MovieSearch";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/search" element={<MovieSearch />} />
          <Route path="/*" element={<AuthPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}