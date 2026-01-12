import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center pt-24 pb-12 text-center gap-8 max-w-4xl mx-auto">
            <div className="space-y-4 animate-fade-in-up">
                <h1 className="text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
                    Find the perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">freelance</span> services<br /> for your business
                </h1>
                <p className="text-gray-500 text-2xl max-w-2xl mx-auto font-light">
                    GigFlow connects you with top talent. Post a gig or find your next big project today.
                </p>
            </div>

            <div className="flex gap-6 mt-6">
                <Link
                    to="/gigs"
                    className="flex items-center gap-2 px-10 py-4 bg-blue-600 text-white text-lg font-bold rounded-full hover:bg-blue-700 transition transform hover:-translate-y-1 hover:shadow-2xl shadow-blue-500/30 shadow-lg"
                >
                    🔍 Browse Gigs
                </Link>
                <Link
                    to="/add"
                    className="flex items-center gap-2 px-10 py-4 bg-white text-blue-900 border-2 border-blue-100 text-lg font-bold rounded-full hover:border-blue-600 hover:bg-blue-50 transition transform hover:-translate-y-1 hover:shadow-xl shadow-gray-200/50"
                >
                    💼 Post a Job
                </Link>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8 text-left w-full">
                <div className="p-6 bg-white rounded-2xl shadow-xl shadow-gray-100 border border-gray-50">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600 text-2xl">🚀</div>
                    <h3 className="font-bold text-xl mb-2">Fast Work</h3>
                    <p className="text-gray-500">Find the right freelancer to begin working on your project within minutes.</p>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-xl shadow-gray-100 border border-gray-50">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 text-purple-600 text-2xl">💎</div>
                    <h3 className="font-bold text-xl mb-2">Quality Work</h3>
                    <p className="text-gray-500">Get high-quality work done by talented professionals from around the world.</p>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-xl shadow-gray-100 border border-gray-50">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600 text-2xl">🔒</div>
                    <h3 className="font-bold text-xl mb-2">Safe Payment</h3>
                    <p className="text-gray-500">Your payments are secure and you only pay when you are satisfied.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
