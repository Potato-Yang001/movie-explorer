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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {results.map((results) => (
                        <div key={results.id} className="p-2 border rounded">
                            <h3 className="font-semibold">{results.title}</h3>
                            {results.poster_path ? (
                                <img
                                    src={`https://image.tmdb.org/t/p/w200${results.poster_path}`}
                                    alt={results.title}
                                    className="mt-2 rounded"
                                />
                            ) : (
                                <p className="mt-2 text-gray-500">No image</p>
                            )}
                        </div>
                    ))}
                </div>
            </form>
        </div>
    );
}