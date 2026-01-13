import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import newRequest from "../utils/newRequest";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";

const Gig = () => {
    const { id } = useParams();
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [gig, setGig] = useState(null);
    const [bids, setBids] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Bid Form State
    const [bidPrice, setBidPrice] = useState("");
    const [bidMsg, setBidMsg] = useState("");
    const [bidError, setBidError] = useState(null);
    const [myBid, setMyBid] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: null,
        isDangerous: false,
        confirmText: "Confirm"
    });

    // Gig Editing State
    const [isGigEditing, setIsGigEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});

    useEffect(() => {
        if (gig) {
            setEditFormData({
                title: gig.title,
                description: gig.description,
                budget: gig.budget,
                vacancies: gig.vacancies || 1
            });
        }
    }, [gig]);

    // Listen for realtime updates from Layout
    useEffect(() => {
        const handleRealtimeUpdate = () => {
            setRefreshTrigger(prev => prev + 1);
        };
        window.addEventListener("gigJobUpdate", handleRealtimeUpdate);
        return () => window.removeEventListener("gigJobUpdate", handleRealtimeUpdate);
    }, []);

    const handleDeleteGig = () => {
        setConfirmModal({
            isOpen: true,
            title: "Withdraw Job",
            message: "Are you sure you want to withdraw this job post? It will be permanently removed.",
            confirmText: "Withdraw Job",
            isDangerous: true,
            onConfirm: async () => {
                try {
                    await newRequest.delete(`/gigs/${id}`);
                    toast.success("Job withdrawn successfully!");
                    navigate("/");
                } catch (err) {
                    toast.error("Failed to delete job");
                }
            }
        });
    };

    const handleUpdateGig = async (e) => {
        e.preventDefault();
        try {
            const res = await newRequest.put(`/gigs/${id}`, editFormData);
            setGig(res.data);
            setIsGigEditing(false);
            toast.success("Job updated successfully!");
        } catch (err) {
            toast.error("Failed to update job");
        }
    };

    useEffect(() => {
        const fetchGigAndBid = async () => {
            try {
                // Parallel fetch for speed
                const gigRes = await newRequest.get(`/gigs/${id}`);
                setGig(gigRes.data);

                if (currentUser) {
                    if (gigRes.data.ownerId._id === currentUser._id) {
                        const bidsRes = await newRequest.get(`/bids/${id}`);
                        setBids(bidsRes.data);
                    } else {
                        // Fetch my bid if I'm not the owner
                        try {
                            const myBidRes = await newRequest.get(`/bids/gig/${id}/my`);
                            if (myBidRes.data) {
                                setMyBid(myBidRes.data);
                                setBidPrice(myBidRes.data.price);
                                setBidMsg(myBidRes.data.message);
                            }
                        } catch (err) {
                            // Ignored
                        }
                    }
                }
            } catch (err) {
                setError("Failed to load details");
            } finally {
                setIsLoading(false);
            }
        };
        fetchGigAndBid();
    }, [id, currentUser, refreshTrigger]);

    const handleBidSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) return navigate("/login");
        setBidError(null);

        try {
            if (isEditing) {
                const res = await newRequest.put(`/bids/${myBid._id}`, {
                    price: bidPrice,
                    message: bidMsg
                });
                setMyBid(res.data);
                setIsEditing(false);
                toast.success("Bid updated successfully!");
            } else {
                const res = await newRequest.post("/bids", {
                    gigId: id,
                    price: bidPrice,
                    message: bidMsg
                });
                setMyBid(res.data);
                toast.success("Bid placed successfully!");
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Failed to submit bid";
            setBidError(errorMsg);
            toast.error(errorMsg);
        }
    };

    const handleDeleteBid = () => {
        setConfirmModal({
            isOpen: true,
            title: "Withdraw Proposal",
            message: "Are you sure you want to withdraw your proposal? This action cannot be undone.",
            confirmText: "Withdraw",
            isDangerous: true,
            onConfirm: async () => {
                try {
                    await newRequest.delete(`/bids/${myBid._id}`);
                    setMyBid(null);
                    setBidPrice("");
                    setBidMsg("");
                    setIsEditing(false);
                    toast.success("Bid withdrawn successfully!");
                } catch (err) {
                    toast.error("Failed to delete bid");
                }
            }
        });
    };

    const handleHire = (bidId) => {
        setConfirmModal({
            isOpen: true,
            title: "Hire Freelancer",
            message: "Are you sure you want to hire this freelancer? This will reject all other bids.",
            confirmText: "Hire Now",
            isDangerous: false,
            onConfirm: async () => {
                try {
                    await newRequest.patch(`/bids/${bidId}/hire`);
                    toast.success("Freelancer hired successfully!");
                    setTimeout(() => window.location.reload(), 1500);
                } catch (err) {
                    toast.error(err.response?.data?.message || "Hiring failed");
                }
            }
        });
    };

    // ... inside render return ...


    if (isLoading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    const isOwner = currentUser && gig.ownerId._id === currentUser._id;
    const isAssigned = gig.status === 'assigned';

    return (
        <div className="flex flex-col gap-8">
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                title={confirmModal.title}
                message={confirmModal.message}
                onConfirm={confirmModal.onConfirm}
                confirmText={confirmModal.confirmText}
                isDangerous={confirmModal.isDangerous}
            />
            {/* Gig Header */}
            <div className="bg-white p-8 rounded-lg shadow-sm border">
                {isGigEditing ? (
                    <form onSubmit={handleUpdateGig} className="flex flex-col gap-4">
                        <input
                            type="text"
                            className="text-3xl font-bold text-gray-800 border-b p-2"
                            value={editFormData.title}
                            onChange={e => setEditFormData({ ...editFormData, title: e.target.value })}
                        />
                        <div className="flex gap-4">
                            <input
                                type="number"
                                className="border p-2 rounded"
                                placeholder="Budget"
                                value={editFormData.budget}
                                onChange={e => setEditFormData({ ...editFormData, budget: e.target.value })}
                            />
                            <input
                                type="number"
                                className="border p-2 rounded"
                                placeholder="Vacancies"
                                value={editFormData.vacancies}
                                onChange={e => setEditFormData({ ...editFormData, vacancies: e.target.value })}
                            />
                        </div>
                        <textarea
                            className="text-gray-600 mb-6 border p-2 w-full h-32"
                            value={editFormData.description}
                            onChange={e => setEditFormData({ ...editFormData, description: e.target.value })}
                        />
                        <div className="flex gap-4">
                            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">Save</button>
                            <button type="button" onClick={() => setIsGigEditing(false)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded">Cancel</button>
                        </div>
                    </form>
                ) : (
                    <>
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-3xl font-bold text-gray-800">{gig.title}</h1>
                            <div className="flex items-center gap-2">
                                <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase ${isAssigned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                    {gig.status}
                                </span>
                                {isOwner && (
                                    <>
                                        <button onClick={() => setIsGigEditing(true)} className="text-gray-500 hover:text-blue-600">✏️</button>
                                        <button onClick={handleDeleteGig} className="text-gray-500 hover:text-red-600">🗑️</button>
                                    </>
                                )}
                            </div>
                        </div>
                        <p className="text-gray-600 mb-6">{gig.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Budget: <b className="text-black text-lg">${gig.budget}</b></span>
                            <span>•</span>
                            <span>Vacancies: <b className="text-black text-lg">{gig.vacancies || 1}</b></span>
                            <span>•</span>
                            <span>Posted by: {gig.ownerId.name}</span>
                            <span>•</span>
                            <span>{new Date(gig.createdAt).toDateString()}</span>
                        </div>
                    </>
                )}
            </div>

            {/* Owner View: Bids Management */}
            {isOwner && (
                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold">Received Bids ({bids.length})</h2>
                    {bids.length === 0 && <p className="text-gray-500">No bids yet.</p>}
                    <div className="grid gap-4">
                        {bids.map(bid => (
                            <div key={bid._id} className={`p-6 rounded-lg border flex flex-col md:flex-row justify-between items-center gap-4 ${bid.status === 'hired' ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-lg">{bid.freelancerId.name}</span>
                                        {bid.status === 'hired' && <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">HIRED</span>}
                                        {bid.status === 'rejected' && <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded">REJECTED</span>}
                                    </div>
                                    <p className="text-gray-600 mb-2">"{bid.message}"</p>
                                    <span className="font-medium text-blue-600">Bid Amount: ${bid.price}</span>
                                </div>

                                {/* Action Buttons */}
                                {!isAssigned && bid.status === 'pending' && (
                                    <button
                                        onClick={() => handleHire(bid._id)}
                                        className="bg-black text-white px-6 py-2 rounded font-bold hover:bg-gray-800 transition"
                                    >
                                        Hire
                                    </button>
                                )}
                                {/* Show Hired Status if assigned to this one */}
                                {isAssigned && bid.status === 'hired' && (
                                    <span className="text-green-600 font-bold border border-green-600 px-4 py-2 rounded">Selected</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Freelancer View: Place Bid or View My Bid */}
            {!isOwner && (!isAssigned || (myBid && myBid.status === 'hired')) && (
                <div className="bg-white p-8 rounded-lg shadow-sm border max-w-2xl">
                    <h2 className="text-2xl font-bold mb-6">
                        {myBid && !isEditing ? "Your Proposal" : (isEditing ? "Edit Proposal" : "Place a Bid")}
                    </h2>

                    {myBid && !isEditing ? (
                        <div className="flex flex-col gap-4">
                            <div className={`p-4 rounded-lg border ${myBid.status === 'hired' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-100'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-xs font-bold uppercase tracking-wide ${myBid.status === 'hired' ? 'text-green-700' : 'text-blue-600'}`}>
                                        Status: {myBid.status}
                                    </span>
                                    <span className="text-sm text-gray-500">{new Date(myBid.createdAt).toLocaleDateString()}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">${myBid.price}</h3>
                                <p className="text-gray-700 italic">"{myBid.message}"</p>

                                {myBid.status === 'hired' && (
                                    <div className="mt-4 pt-4 border-t border-green-200">
                                        <p className="font-bold text-green-800 text-lg mb-1">🎉 Congratulations, you're hired!</p>
                                        <p className="text-green-700">
                                            Please contact the client to start working: <br />
                                            <a href={`mailto:${gig.ownerId.email}`} className="font-bold underline cursor-pointer hover:text-green-900">
                                                {gig.ownerId.email}
                                            </a>
                                        </p>
                                    </div>
                                )}
                            </div>

                            {myBid.status !== 'hired' && (
                                <div className="flex gap-4 mt-2">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded hover:bg-gray-200 transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={handleDeleteBid}
                                        className="px-6 py-2 bg-red-50 text-red-600 font-bold rounded hover:bg-red-100 transition"
                                    >
                                        Withdraw
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <form onSubmit={handleBidSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="font-medium">Your Price ($)</label>
                                <input
                                    type="number"
                                    className="border p-3 rounded"
                                    placeholder="Expected price"
                                    value={bidPrice}
                                    onChange={e => setBidPrice(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-medium">Message</label>
                                <textarea
                                    className="border p-3 rounded h-24"
                                    placeholder="Why are you a good fit?"
                                    value={bidMsg}
                                    onChange={e => setBidMsg(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            {bidError && <span className="text-red-500">{bidError}</span>}
                            <div className="flex gap-4">
                                <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition">
                                    {isEditing ? "Update Proposal" : "Submit Proposal"}
                                </button>
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded hover:bg-gray-300 transition"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            )}

            {!isOwner && isAssigned && (!myBid || myBid.status !== 'hired') && (
                <div className="bg-gray-100 p-8 rounded text-center text-gray-500 font-bold">
                    This job has been closed.
                </div>
            )}

        </div>
    );
};

export default Gig;
