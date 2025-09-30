// import React, { useState, useEffect } from "react";
// import Cookies from "js-cookie";
// import SpinList from "./SpinList";
// import CouponPresetSelector from "./CouponPresetSelector";
// import SpinningWheel from "./SpinningWheel";
// import { apiRequest } from "../../Context/apiService";

// const Spinning = () => {
//   const [spinData, setSpinData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [fetchError, setFetchError] = useState(null);
//   const [addError, setAddError] = useState(null);
//   const [removeError, setRemoveError] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isSpinningEnabled, setSpinningEnabled] = useState(true);

//   const token = Cookies.get("authToken");

//   const spinId = spinData?._id;

//   const fetchSpinData = async () => {
//     try {
//       setLoading(true);
//       setFetchError(null);

//       const data = await apiRequest(
//         "/api/spin/my-spins",
//         "GET",
//         null,
//         { Authorization: `${token}` }
//       );

//       if (data.status === "success") {
//         setSpinData(data.data.spin || { spins: [] });
//         if (typeof data.data.spin?.isActive === "boolean") {
//           setSpinningEnabled(data.data.spin.isActive);
//         }
//       } else {
//         setFetchError(data.message || "Failed to fetch spin data");
//       }
//     } catch (err) {
//       setFetchError("Network error: Could not fetch spin data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token) fetchSpinData();
//   }, [token]);

//   const handleToggleSpinning = async () => {
//     if (!spinId) return;

//     try {
//       const response = await fetch(`https://api.thryvoo.com/api/spin/${spinId}/toggle`, {
//         method: "POST",
//         headers: {
//           Authorization: token,
//         },
//         credentials: "include",
//       });
//       const data = await response.json();

//       if (data.status === "success" && data.data) {
//         setSpinningEnabled(data.data.isActive);
//       } else {
//         alert(data.message || "Failed to toggle spinning");
//       }
//     } catch {
//       alert("Network error: Could not toggle spinning");
//     }
//   };

//   // Add and Remove handlers can be filled here as per your existing logic.

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (!spinData) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Setup Spins</h2>
//           <p className="text-gray-600 mb-6">
//             No spin data found. Please set up your spins to get started.
//           </p>
//           {/* Include your create spin button */}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex flex-col lg:flex-row items-center justify-between mb-10">
//           <h1 className="text-3xl font-bold text-gray-800 mb-4 lg:mb-0">
//             Spinning Management
//           </h1>
//           <div className="flex items-center space-x-3 mr-5 border p-3 rounded-full bg-white shadow-sm">
//             <button
//               type="button"
//               onClick={handleToggleSpinning}
//               aria-pressed={isSpinningEnabled}
//               className={`relative inline-flex items-center h-8 w-16 rounded-full transition-colors duration-300 focus:outline-none
//                 ${isSpinningEnabled ? "bg-blue-600" : "bg-gray-300"}`}
//               style={{ minWidth: '4rem' }}
//             >
//               <span
//                 className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200
//                   ${isSpinningEnabled ? "translate-x-8" : "translate-x-0"}`}
//               />
//             </button>
//             <span className={`ml-2 text-base font-semibold ${isSpinningEnabled ? "text-blue-700" : "text-gray-500"}`}>
//               {isSpinningEnabled ? "Spinning Enabled" : "Spinning Disabled"}
//             </span>
//           </div>
//         </div>

//         <div className="flex flex-col lg:flex-row gap-8">
//           <div className="lg:w-1/2">
//             <SpinList
//               spins={spinData.spins}
//               openModal={() => setIsModalOpen(true)}
//               onRemoveSpin={() => { }}
//               onToggleActive={() => { }}
//               error={removeError || fetchError}
//             />
//           </div>
//         </div>
//       </div>

//       {isModalOpen && (
//         <CouponPresetSelector
//           existingPresets={spinData.spins.map((s) => s._id)}
//           onAddSpin={() => { }}
//           onClose={() => setIsModalOpen(false)}
//           error={addError}
//         />
//       )}
//     </div>
//   );
// };

// export default Spinning;



import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import SpinList from "./SpinList";
import CouponPresetSelector from "./CouponPresetSelector";
import SpinningWheel from "./SpinningWheel";
import { apiRequest } from "../../Context/apiService";

const Spinning = () => {
  const [spinData, setSpinData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [addError, setAddError] = useState(null);
  const [removeError, setRemoveError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSpinningEnabled, setSpinningEnabled] = useState(true);

  const token = Cookies.get("authToken");
  const spinId = spinData?._id;

  const fetchSpinData = async () => {
    try {
      setLoading(true);
      setFetchError(null);

      const data = await apiRequest(
        "/api/spin/my-spins",
        "GET",
        null,
        { Authorization: `${token}` }
      );

      if (data.status === "success") {
        setSpinData(data.data.spin || { spins: [] });
        if (typeof data.data.spin?.isActive === "boolean") {
          setSpinningEnabled(data.data.spin.isActive);
        }
      } else {
        setFetchError(data.message || "Failed to fetch spin data");
      }
    } catch (err) {
      setFetchError("Network error: Could not fetch spin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchSpinData();
  }, [token]);

  const handleToggleSpinning = async () => {
    if (!spinId) return;

    try {
      const response = await fetch(`https://api.thryvoo.com/api/spin/${spinId}/toggle`, {
        method: "POST",
        headers: {
          Authorization: token,
        },
        credentials: "include",
      });
      const data = await response.json();

      if (data.status === "success" && data.data) {
        setSpinningEnabled(data.data.isActive);
      } else {
        alert(data.message || "Failed to toggle spinning");
      }
    } catch {
      alert("Network error: Could not toggle spinning");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading spins...</p>
        </div>
      </div>
    );
  }

  if (!spinData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Setup Spins</h2>
          <p className="text-gray-600 mb-8">
            No spin data found. Please set up your spins to get started.
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md">
            Create Your First Spin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Spinning Management
              </h1>
              <p className="text-gray-600">
                Manage your spin-the-wheel campaigns and rewards
              </p>
            </div>
            
            {/* Toggle Switch */}
            <div className="flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-xl border border-gray-200 shadow-sm">
              <button
                type="button"
                onClick={handleToggleSpinning}
                aria-pressed={isSpinningEnabled}
                className={`relative inline-flex items-center h-8 w-16 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50
                  ${isSpinningEnabled 
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 focus:ring-blue-300" 
                    : "bg-gray-300 focus:ring-gray-200"
                  }`}
              >
                <span
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out
                    ${isSpinningEnabled ? "translate-x-9" : "translate-x-1"}`}
                />
              </button>
              <div className="flex flex-col">
                <span className={`text-sm font-bold leading-tight ${isSpinningEnabled ? "text-blue-700" : "text-gray-700"}`}>
                  {isSpinningEnabled ? "Enabled" : "Disabled"}
                </span>
                <span className="text-xs text-gray-500">
                  Spinning Status
                </span>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {(fetchError || removeError) && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{fetchError || removeError}</p>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-full">
            <SpinList
              spins={spinData.spins}
              openModal={() => setIsModalOpen(true)}
              onRemoveSpin={() => { }}
              onToggleActive={() => { }}
              error={removeError || fetchError}
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <CouponPresetSelector
          existingPresets={spinData.spins.map((s) => s._id)}
          onAddSpin={() => { }}
          onClose={() => setIsModalOpen(false)}
          error={addError}
        />
      )}
    </div>
  );
};

export default Spinning;