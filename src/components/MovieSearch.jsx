import { useState } from "react";
import { searchMoviesTMDB } from "../services/movieAPI"; // import the searchMoviesTMDB function

export function MovieSearch() {

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);


    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) {
            alert("Please enter a movie title to search.");
            return;
        }

        const data = await searchMoviesTMDB(query); // call the searchMoviesTMDB function with the query
        setResults(data?.results || []); // set the results state with the search results
    }

    return (
        <div>
            <form onSubmit={handleSearch}>
                <label
                    htmlFor="search"
                    className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                >
                    Search Movies
                </label>

                <div
                    className="flex items-center w-full max-w-2xl mx-auto border rounded-full bg-gray-50 mb-6 overflow-hidden shadow-sm"
                    style={{ marginTop: "50px" }}
                >
                    {/* Search Icon */}
                    <div className="px-4">
                        <svg
                            className="w-5 h-5 text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 20"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                            />
                        </svg>
                    </div>

                    {/* Input */}
                    <input
                        type="search"
                        id="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-grow bg-transparent p-3 text-sm text-gray-900 focus:outline-none"
                        placeholder="Search"
                        required
                    />

                    {/* Button */}
                    <button
                        type="submit"
                        className="btn btn-primary rounded-pill me-2 px-4 py-2"
                        style={{ borderTopLeftRadius: "0", borderBottomLeftRadius: "0" }}
                    >
                        Search
                    </button>
                </div>


                {/* Results Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                    {results.length === 0 ? (
                        <p className="text-center col-span-full text-gray-500">
                            No movies found. Try searching something!
                        </p>
                    ) : (
                        results.map((movie) => (
                            <div
                                key={movie.id}
                                className="bg-white shadow-lg rounded-lg overflow-hidden border"
                            >
                                {movie.poster_path ? (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                                        alt={movie.title}
                                        className="w-full h-64 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-64 bg-gray-300 flex items-center justify-center">
                                        <span className="text-gray-600">No Image</span>
                                    </div>
                                )}

                                <div className="p-4">
                                    <h3 className="text-lg font-semibold truncate">{movie.title}</h3>
                                    <button
                                        className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </form>
        </div>
    );
}