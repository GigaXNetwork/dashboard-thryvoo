import React, { useState, useEffect } from "react";
import logoThryvoo from "../../assets/logo/logoThryvoo.png";

export default function LoadingAnimation({ loading }) {
  const [progress, setProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (loading) {
      setProgress(0);
      setShowLoader(true);
      
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            return 95;
          }
          // Use smaller, more controlled increments
          const increment = Math.random() * 8 + 4;
          return Math.min(prev + increment, 95); 
        });
      }, 200);
      
      return () => clearInterval(interval);
    } else {
      // When loading is done, set to 100% directly
      setProgress(100);
      
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Don't render if loader should be hidden
  if (!showLoader) {
    return null;
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-5">
          {/* Outer rotating ring */}
          <div className="w-32 h-32 rounded-full border-4 border-indigo-100 border-t-blue-600 animate-spin"></div>
          {/* Middle counter-rotating ring */}
          <div className="absolute top-2 left-2 w-28 h-28 rounded-full border-4 border-purple-100 border-b-purple-500 animate-spin-reverse"></div>
          
          {/* Logo in the center */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <img
              src={logoThryvoo}
              alt="Thryvoo"
              className="w-20 h-10 object-contain animate-zoom-pulse"
            />
          </div>
        </div>

        {/* Loading text with animated dots */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-gray-600 font-medium animate-pulse">
            Please wait...`
          </span>
        </div>

        {/* Progress indicator */}
        <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${Math.min(progress, 100)}%`
            }}
          />
        </div>

        {/* Progress percentage */}
        <div className="mt-2 text-xs text-gray-500 font-medium animate-pulse">
          {Math.min(Math.round(progress), 100)}%
        </div>
      </div>

      <style>{`
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes zoom-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        @keyframes bounce-dot {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-spin-reverse { animation: spin-reverse 1.5s linear infinite; }
        .animate-zoom-pulse { animation: zoom-pulse 2s ease-in-out infinite; }
        .animate-bounce-dot { animation: bounce-dot 1.4s ease-in-out infinite; }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}





// export default function LoadingAnimation() {
//   const [currentIndex, setCurrentIndex] = useState(0);
  
//   const word = "THRYVOO";
//   const animationDelay = 500;
  
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentIndex(prev => prev < word.length - 1 ? prev + 1 : prev);
//     }, animationDelay);
//     return () => clearInterval(timer);
//   }, []);
  
//   return (
//     <div className="h-screen w-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col items-center justify-center">
      
//       {/* Animated Text */}
//       <div className="flex items-center text-6xl font-bold mb-8">
//         {/* Fixed T */}
//         <span className="text-blue-600">T</span>
        
//         {/* Other letters rolling in */}
//         <div className="flex">
//           {word.split('').slice(1).map((letter, index) => (
//             <span
//               key={index}
//               className={`inline-block ${
//                 index < currentIndex
//                   ? 'spin-in text-gray-800'
//                   : 'invisible'
//               }`}
//               style={{
//                 animationDelay: '0ms'
//               }}
//             >
//               {letter}
//             </span>
//           ))}
//         </div>
//       </div>
      
//       <p className="text-gray-500 animate-pulse">Loading your experience...</p>

//       <style jsx>{`
//         @keyframes rollIn {
//           0% {
//             transform: translateX(200px) rotate(0deg);
//             opacity: 0;
//           }
//           100% {
//             transform: translateX(0) rotate(-720deg);
//             opacity: 1;
//           }
//         }

//         .spin-in {
//           animation: rollIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
//         }
//       `}</style>
//     </div>
//   );
// }