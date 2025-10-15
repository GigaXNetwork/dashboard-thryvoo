// import { Link } from "react-router";
// import { CloudFog, User } from "lucide-react";

// function UserCard({ name, profile, email, id, status = "active" }) {
//   const isActive = status === "active";

//   console.log("profile", profile)

//   return (
//     <div className="flex flex-col justify-between h-[340px] w-full max-w-[320px] p-8 rounded-xl shadow-sm border border-gray-100 text-center bg-white mx-auto transition-all duration-300 hover:shadow-md hover:border-gray-200 hover:scale-[1.02]">
//       {/* Profile Image Section */}
//       <div className="relative">
//         <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-sm opacity-60"></div>
//         {profile ? (
//           <img
//             src={profile}
//             alt={`${name}'s profile`}
//             className="relative w-28 h-28 rounded-full object-cover mx-auto mb-6 border-4 border-white shadow-md"
//             loading="lazy"
//             draggable={false}
//           />
//         ) : (
//           <div className="relative w-28 h-28 rounded-full mx-auto mb-6 border-4 border-white shadow-md bg-gray-100 flex items-center justify-center">
//             <User className="w-12 h-12 text-gray-400" />
//           </div>
//         )}
//       </div>

//       {/* Content Section */}
//       <div className="flex-1 flex flex-col justify-center">
//         <h2 className="text-xl font-semibold mb-2 text-gray-900 truncate px-2 capitalize">
//           {name}
//         </h2>
//         {email && (
//           <p className="text-sm text-gray-600 mb-4 truncate px-2 font-medium">
//             {email}
//           </p>
//         )}
//         <div className="flex justify-center items-center space-x-1 text-gray-400 mb-4">
//           <div 
//             className={`w-2 h-2 rounded-full ${
//               isActive 
//                 ? "bg-green-400 animate-pulse" 
//                 : "bg-gray-400"
//             }`}
//           ></div>
//           <span className={`text-xs font-medium ${
//             isActive ? "text-gray-500" : "text-gray-400"
//           }`}>
//             {isActive ? "Active" : "Inactive"}
//           </span>
//         </div>
//       </div>

//       {/* Action Section */}
//       <div className="mt-auto pt-4 border-t border-gray-100">
//         <Link
//           to={`/user/${id}`}
//           className="w-full py-3 px-6 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-lg font-semibold text-sm shadow-sm hover:from-gray-800 hover:to-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2"
//           aria-label={`Manage ${name}'s profile`}
//         >
//           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//           </svg>
//           <span>Manage Profile</span>
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default UserCard;



import { Link } from "react-router";
import { User, Mail } from "lucide-react";
import { useState } from "react";

function UserCard({ name, profile, email, id, status = "active" }) {
  const [imageError, setImageError] = useState(false);
  const isActive = status === "active";

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="flex flex-col justify-between h-[340px] w-full max-w-[320px] p-8 rounded-xl shadow-sm border border-gray-100 text-center bg-white mx-auto transition-all duration-300 hover:shadow-md hover:border-gray-200 hover:scale-[1.02]">
      {/* Profile Image Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-sm opacity-60"></div>
        {profile && !imageError ? (
          <img
            src={profile}
            alt={`${name}'s profile`}
            className="relative w-24 h-24 rounded-full object-cover mx-auto mb-2 border-4 border-white shadow-md"
            loading="lazy"
            draggable={false}
            onError={handleImageError}
          />
        ) : (
          <div className="relative w-24 h-24 rounded-full mx-auto mb-2 border-4 border-white shadow-md bg-gray-100 flex items-center justify-center">
            <User className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-xl font-semibold mb-1 text-gray-900 truncate px-2 capitalize">
          {name}
        </h2>
        {email && (
          <div className="flex items-center mb-2">
            <Mail size={14} className="text-gray-400"/>
            <p className="text-sm text-gray-600 truncate mb-1 px-2 font-medium">
              {email}
            </p>
          </div>
        )}
        <div className="flex justify-center items-center space-x-1 text-gray-400 mb-2">
          <div
            className={`w-2 h-2 rounded-full ${isActive
                ? "bg-green-400 animate-pulse"
                : "bg-gray-400"
              }`}
          ></div>
          <span className={`text-xs font-medium ${isActive ? "text-gray-500" : "text-gray-400"
            }`}>
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Action Section */}
      <div className="mt-auto pt-4 border-t border-gray-100">
        <Link
          to={`/user/${id}`}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-lg font-semibold text-sm shadow-sm hover:from-blue-800 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2"
          aria-label={`Manage ${name}'s profile`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Manage Profile</span>
        </Link>
      </div>
    </div>
  );
}

export default UserCard;