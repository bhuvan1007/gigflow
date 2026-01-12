import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import newRequest from "../utils/newRequest";

const Register = () => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setUser((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await newRequest.post("/auth/register", user);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong!");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96 flex flex-col gap-4">
                <h1 className="text-2xl font-bold text-gray-700 mb-4">Create an Account</h1>

                <label className="text-gray-600 text-sm">Name</label>
                <input
                    name="name"
                    type="text"
                    className="p-3 border rounded focus:outline-blue-500"
                    placeholder="John Doe"
                    onChange={handleChange}
                />

                <label className="text-gray-600 text-sm">Email</label>
                <input
                    name="email"
                    type="email"
                    className="p-3 border rounded focus:outline-blue-500"
                    placeholder="johndoe@gmail.com"
                    onChange={handleChange}
                />

                <label className="text-gray-600 text-sm">Password</label>
                <input
                    name="password"
                    type="password"
                    className="p-3 border rounded focus:outline-blue-500"
                    placeholder="********"
                    onChange={handleChange}
                />

                <button
                    className="bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 transition"
                    type="submit"
                >
                    Register
                </button>
                {error && <span className="text-red-500 text-sm text-center">{error}</span>}
                <div className="text-center text-sm text-gray-500 mt-2">
                    Already have an account? <Link to="/login" className="text-blue-500">Sign in</Link>
                </div>
            </form>
        </div>
    );
};

export default Register;
