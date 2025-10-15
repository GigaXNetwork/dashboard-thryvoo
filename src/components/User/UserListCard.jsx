import { Link } from "react-router";
import { User, Mail } from "lucide-react";
import { useState } from "react";

function UserListCard({ name, profile, email, id, status = "active" }) {
    const [imageError, setImageError] = useState(false);
    const isActive = status === "active";

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 bg-white transition-all duration-300 hover:shadow-md hover:border-gray-200 gap-4 sm:gap-6">
            {/* Left Section - User Info */}
            <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                {/* Profile Image */}
                <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-sm opacity-60"></div>
                    {profile && !imageError ? (
                        <img
                            src={profile}
                            alt={`${name}'s profile`}
                            className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 sm:border-4 border-white shadow-md"
                            loading="lazy"
                            draggable={false}
                            onError={handleImageError}
                        />
                    ) : (
                        <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 sm:border-4 border-white shadow-md bg-gray-100 flex items-center justify-center">
                            <User className="w-5 h-5 sm:w-8 sm:h-8 text-gray-400" />
                        </div>
                    )}
                </div>

                {/* User Details */}
                <div className="flex flex-col space-y-1 min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900 capitalize truncate">
                            {name}
                        </h2>
                        <div className={`w-2 h-2 rounded-full ${isActive ? "bg-green-400 animate-pulse" : "bg-gray-400"}`}></div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                        {email && (
                            <div className="flex items-center space-x-2 text-gray-600 min-w-0">
                                <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="text-sm truncate">{email}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Section - Action Button */}
            <div className="flex-shrink-0 w-full sm:w-auto">
                <Link
                    to={`/user/${id}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 py-2 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-lg font-semibold text-sm shadow-sm hover:from-blue-800 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                    aria-label={`Manage ${name}'s profile`}
                >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">Manage Profile</span>
                </Link>
            </div>
        </div>
    );
}

export default UserListCard;