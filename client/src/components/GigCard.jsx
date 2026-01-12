import { Link } from "react-router-dom";

const GigCard = ({ gig }) => {
    return (
        <div className="group relative bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4 overflow-hidden">
            {/* Thread-style connector line (decorative) */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition duration-300"></div>

            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition line-clamp-1">{gig.title}</h2>
                    <span className="text-xs text-gray-400">Posted {new Date(gig.createdAt).toDateString()}</span>
                </div>
                <span className={`text-[10px] px-3 py-1 rounded-full uppercase font-bold tracking-wider shadow-sm ${gig.status === 'open'
                        ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                    {gig.status}
                </span>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                {gig.description}
            </p>

            <div className="flex flex-wrap gap-2 my-2">
                {/* Badge for Vacancies */}
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-semibold">
                    👥 {gig.vacancies} Vacancy
                </span>
                {/* Badge for Budget */}
                <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-xs font-semibold">
                    💰 ${gig.budget} Budget
                </span>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                        {gig.ownerId?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 font-medium">Posted by</span>
                        <span className="text-xs font-bold text-gray-800">{gig.ownerId?.name || "Unknown"}</span>
                    </div>
                </div>

                <Link to={`/gigs/${gig._id}`}>
                    <button className="px-5 py-2 bg-gray-900 text-white rounded-lg font-bold text-xs hover:bg-gray-800 transition shadow-lg transform active:scale-95">
                        View Details
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default GigCard;
