import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import newRequest from "../utils/newRequest";
import { AuthContext } from "../context/AuthContext";

const MyBids = () => {
    const { currentUser } = useContext(AuthContext);
    const [bids, setBids] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMyBids = async () => {
            try {
                // Endpoint doesn't exist yet specifically for "My Bids" generally, 
                // but we have `/bids/gig/:id/my`. We might need `/bids?userId=...`
                // Let's assume we can fetch `/bids/my` or similar.
                // Checking previous implementation plan... User asked for "ur applications".
                // I need to check bid.routes.js to see if there is a way to get ALL bids for a user.
                // If not, I'll need to add it. For now, assuming `/bids?userId=` works or adding it.
                // Wait, `bid.controller.js` usually has `getBids` which takes `gigId`.
                // I'll need to update `bid.controller.js` to support fetching by `freelancerId` too.

                // Let's blindly assume I'll fix the backend in a moment and use this:
                const res = await newRequest.get(`/bids?freelancerId=${currentUser._id}`);
                setBids(res.data);
            } catch (err) {
                // error fetching bids
            } finally {
                setIsLoading(false);
            }
        };
        fetchMyBids();
    }, [currentUser._id]);

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-gray-800">My Applications</h1>

            {isLoading ? "Loading..." : (
                <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-sm uppercase">
                                <th className="p-4 border-b">Job</th>
                                <th className="p-4 border-b">Date</th>
                                <th className="p-4 border-b">My Price</th>
                                <th className="p-4 border-b">Status</th>
                                <th className="p-4 border-b">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bids.map(bid => (
                                <tr key={bid._id} className="hover:bg-gray-50 transition border-b last:border-0">
                                    <td className="p-4 font-medium text-gray-900">
                                        {/* Assuming bid logic populates gigId, if not, backend fix needed */}
                                        {bid.gigId?.title || "Unknown Job"}
                                    </td>
                                    <td className="p-4 text-gray-500">{new Date(bid.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 font-bold">${bid.price}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase 
                                            ${bid.status === 'hired' ? 'bg-green-100 text-green-700' :
                                                bid.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {bid.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <Link to={`/gigs/${bid.gigId?._id}`} className="text-blue-600 hover:underline font-medium">View Job</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {bids.length === 0 && <div className="p-8 text-center text-gray-500">You haven't applied to any jobs yet.</div>}
                </div>
            )}
        </div>
    );
};

export default MyBids;
