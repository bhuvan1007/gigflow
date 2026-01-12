import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import newRequest from "../utils/newRequest";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        dispatch({ type: "LOGIN_START" });
        try {
            const res = await newRequest.post("/auth/login", { email, password });
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong!");
            dispatch({ type: "LOGIN_FAILURE", payload: err.response?.data });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96 flex flex-col gap-4">
                <h1 className="text-2xl font-bold text-gray-700 mb-4">Sign In</h1>

                <label className="text-gray-600 text-sm">Email</label>
                <input
                    type="email"
                    className="p-3 border rounded focus:outline-blue-500"
                    placeholder="johndoe@gmail.com"
                    onChange={e => setEmail(e.target.value)}
                />

                <label className="text-gray-600 text-sm">Password</label>
                <input
                    type="password"
                    className="p-3 border rounded focus:outline-blue-500"
                    placeholder="********"
                    onChange={e => setPassword(e.target.value)}
                />

                <button
                    className="bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 transition disabled:opacity-50"
                    type="submit"
                >
                    Login
                </button>
                {error && <span className="text-red-500 text-sm text-center">{error}</span>}
                <div className="text-center text-sm text-gray-500 mt-2">
                    Don't have an account? <Link to="/register" className="text-blue-500">Register</Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
