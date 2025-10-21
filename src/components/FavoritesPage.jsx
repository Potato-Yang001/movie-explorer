import { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import axios from "axios";

export default function FavoritesPage() {

    const API_BASE_URL = "https://e7d191c2-4c98-4d39-96df-4fc6e39d522f-00-3d6sd3diyggd0.pike.replit.dev"

    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true)
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchFavorites() {
            try {
                const res = await axios.get(`${API_BASE_URL}/favorites`)
                setFavorites(res.data)
            } catch (err) {
                console.error("Error fetching favorites:", err)
            } finally {
                setLoading(false)
            }
        }
    }, [])

    const handleRemoveFavorites = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/favorites/${id}`)
            setFavorites
        } catch (err) {
            console.error("Error removing favorite:", err)
        }
    }

}
