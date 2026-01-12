import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import newRequest from "../utils/newRequest";
import toast from "react-hot-toast";

const Profile = () => {
    const { currentUser, dispatch } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: currentUser.name,
        email: currentUser.email, // Assuming email is not editable or backend prevents it if not handled
        phone: currentUser.phone || "",
        desc: currentUser.desc || "",
        skills: currentUser.skills || "" // Comma separated?
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await newRequest.put(`/users/${currentUser._id}`, formData);
            // Update context
            dispatch({ type: "UPDATE_USER", payload: res.data }); // Need to ensure reducer handles this or just LOGIN again
            // dispatch({ type: "LOGIN_SUCCESS", payload: res.data });  <-- Usually LOGIN_SUCCESS sets the user
            localStorage.setItem("currentUser", JSON.stringify(res.data));
            toast.success("Profile updated successfully!");
        } catch (err) {
            toast.error("Failed to update profile");
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100 mt-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Update Profile</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Full Name</label>
                    <input
                        name="name" type="text"
                        value={formData.name} onChange={handleChange}
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Email</label>
                    <input
                        name="email" type="email"
                        value={formData.email} disabled
                        className="p-3 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Phone</label>
                    <input
                        name="phone" type="text"
                        value={formData.phone} onChange={handleChange}
                        placeholder="+1 234 567 890"
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Skills (comma separated)</label>
                    <input
                        name="skills" type="text"
                        value={formData.skills} onChange={handleChange}
                        placeholder="React, Node.js, Design..."
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Bio / About Me</label>
                    <textarea
                        name="desc"
                        value={formData.desc} onChange={handleChange}
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition h-32"
                        placeholder="Tell us about yourself..."
                    ></textarea>
                </div>

                <button type="submit" className="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-md mt-4">
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default Profile;
