import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import newRequest from "../utils/newRequest";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const AddGig = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        budget: "",
        vacancies: 1,
    });
    const [error, setError] = useState(null);
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) return navigate("/login");

        try {
            await newRequest.post("/gigs", formData);
            toast.success("Gig posted successfully!");
            navigate("/gigs");
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Failed to post gig";
            setError(errorMsg);
            toast.error(errorMsg);
        }
    };

    return (
        <div className="flex justify-center pt-10">
            <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Post a New Gig</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700 font-medium">Gig Title</label>
                        <input
                            name="title"
                            type="text"
                            className="p-3 border rounded focus:outline-blue-500"
                            placeholder="e.g. Build a Responsive React Website"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700 font-medium">Budget ($)</label>
                        <input
                            name="budget"
                            type="number"
                            className="p-3 border rounded focus:outline-blue-500 w-full"
                            placeholder="Min 10"
                            min="1"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700 font-medium">Vacancies</label>
                        <input
                            name="vacancies"
                            type="number"
                            className="p-3 border rounded focus:outline-blue-500 w-full"
                            placeholder="Number of people needed (default: 1)"
                            min="1"
                            defaultValue="1"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700 font-medium">Description</label>
                        <textarea
                            name="description"
                            className="p-3 border rounded focus:outline-blue-500 h-32"
                            placeholder="Describe what you need done..."
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>

                    {error && <span className="text-red-500">{error}</span>}

                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition"
                    >
                        Post Gig
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddGig;
