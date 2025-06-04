import React from "react";

export default function LoadingAnimation() {
  return (
    <div className="h-screen w-screen bg-white flex flex-col items-center justify-center">
      <div className="spinner mb-6" />
      <h2 className="text-gray-700 text-2xl font-medium animate-fadeInOut">
        Loading, please wait...
      </h2>

      <style jsx>{`
        .spinner {
          width: 64px;
          height: 64px;
          border: 8px solid rgba(107, 114, 128, 0.2); /* gray-500 20% */
          border-top-color: #4f46e5; /* Indigo-600 */
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes fadeInOut {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-fadeInOut {
          animation: fadeInOut 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
