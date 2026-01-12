import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import newRequest from "../utils/newRequest";
import { AuthContext } from "../context/AuthContext";

const MyGigs = () => {
    const { currentUser } = useContext(AuthContext);
    const [gigs, setGigs] = useState([]);

    useEffect(() => {
        const fetchMyGigs = async () => {
            try {
                const res = await newRequest.get(`/gigs?userId=${currentUser._id}`);
                setGigs(res.data);
            } catch (err) {
                // error fetching gigs
            }
        };
        if (currentUser) fetchMyGigs();
    }, [currentUser]);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">My Posted Gigs</h1>
                <Link to="/add">
                    <button className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700 transition">
                        Post New Gig
                    </button>
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-lg shadow-sm">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="p-4 text-left font-semibold text-gray-600">Title</th>
                            <th className="p-4 text-left font-semibold text-gray-600">Price</th>
                            <th className="p-4 text-left font-semibold text-gray-600">Date</th>
                            <th className="p-4 text-left font-semibold text-gray-600">Status</th>
                            <th className="p-4 text-left font-semibold text-gray-600">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gigs.map(gig => (
                            <tr key={gig._id} className="border-b hover:bg-gray-50 transition">
                                <td className="p-4 font-medium text-gray-800">{gig.title}</td>
                                <td className="p-4 text-gray-600">${gig.budget}</td>
                                <td className="p-4 text-gray-600">{new Date(gig.createdAt).toLocaleDateString()}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${gig.status === 'assigned' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                        {gig.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <Link to={`/gigs/${gig._id}`}>
                                        <button className="text-blue-600 hover:text-blue-800 font-bold text-sm">Manage</button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {gigs.length === 0 && <div className="p-8 text-center text-gray-500">You haven't posted any gigs yet.</div>}
            </div>
        </div>
    );
};

export default MyGigs;
