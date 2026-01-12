import { useEffect, useState } from "react";
import newRequest from "../utils/newRequest";
import GigCard from "../components/GigCard";

const Gigs = () => {
    const [gigs, setGigs] = useState([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchGigs = async () => {
        setIsLoading(true);
        try {
            const res = await newRequest.get(`/gigs${search ? `?search=${search}` : ""}`);
            setGigs(res.data);
        } catch (err) {
            setError("Failed to load gigs.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGigs();
    }, []);

    const handleSearch = () => {
        fetchGigs();
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Find Your Next Gig</h1>
                    <p className="text-gray-500 mt-1">Explore opportunities and start working today.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search jobs..."
                        className="border border-gray-200 bg-gray-50 p-3 rounded-xl w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition shadow-lg hover:shadow-blue-500/30"
                    >
                        Search
                    </button>
                </div>
            </div>

            {error && <div className="text-red-500 font-medium text-center bg-red-50 p-4 rounded-lg">{error}</div>}

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gigs.map((gig) => (
                        <GigCard key={gig._id} gig={gig} />
                    ))}
                    {gigs.length === 0 && !isLoading && (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-bold text-gray-800">No gigs found</h3>
                            <p className="text-gray-500 mt-2">Try adjusting your search terms or check back later.</p>
                            <button onClick={() => setSearch("")} className="mt-6 text-blue-600 font-bold hover:bg-blue-50 px-4 py-2 rounded-lg transition">Clear Filters</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Gigs;
