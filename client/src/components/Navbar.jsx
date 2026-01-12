import { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import newRequest from "../utils/newRequest";

const Navbar = () => {
    const { currentUser, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = async () => {
        try {
            await newRequest.post("/auth/logout");
            dispatch({ type: "LOGOUT" });
            navigate("/login");
        } catch (err) {
            // error logging out
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="flex justify-between items-center p-4 bg-gray-900/95 backdrop-blur-sm text-white sticky top-0 z-50 shadow-lg transition-all duration-300">
            <Link to="/" className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:from-blue-300 hover:to-purple-400 transition">
                GigFlow
            </Link>

            <div className="flex items-center gap-8">
                <nav className="flex gap-6 text-gray-300 font-medium">
                    <Link to="/" className="hover:text-white transition duration-200">Home</Link>
                    <Link to="/gigs" className="hover:text-white transition duration-200">Find Work</Link>
                </nav>

                <div className="flex items-center gap-4">
                    {/* Post a Job Button */}
                    <Link to="/add" className="px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-white font-bold shadow-md hover:from-green-600 hover:to-emerald-700 transition transform hover:-translate-y-0.5">
                        Post a Job
                    </Link>

                    {currentUser ? (
                        <div className="relative" ref={dropdownRef}>
                            <div
                                className="flex items-center gap-3 cursor-pointer hover:bg-gray-800/50 p-2 rounded-lg transition"
                                onClick={() => setOpen(!open)}
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold uppercase">
                                    {currentUser.name.charAt(0)}
                                </div>
                                <div className="text-left hidden md:block">
                                    <span className="block text-sm font-semibold text-white leading-tight">{currentUser.name}</span>
                                </div>
                                <span className="text-gray-400">▼</span>
                            </div>

                            {open && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden text-gray-700 font-medium animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                    <div className="p-4 border-b bg-gray-50">
                                        <p className="text-sm text-gray-500">Signed in as</p>
                                        <p className="text-sm font-bold text-gray-900 truncate">{currentUser.email}</p>
                                    </div>
                                    <div className="py-2">
                                        <Link to="/profile" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition" onClick={() => setOpen(false)}>Update Profile</Link>
                                        <Link to="/my-gigs" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition" onClick={() => setOpen(false)}>My Jobs</Link>
                                        <Link to="/my-bids" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition" onClick={() => setOpen(false)}>My Applications</Link>
                                    </div>
                                    <div className="border-t py-2">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition font-bold"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex gap-4">
                            <Link to="/login" className="px-4 py-2 hover:text-white text-gray-300 transition font-medium">Sign In</Link>
                            <Link to="/register" className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-md font-medium text-white">Join</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
