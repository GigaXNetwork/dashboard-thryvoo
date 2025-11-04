// import React from "react";

// const PresetToggle = ({
//   presetToDelete,
//   setShowDeleteModal,
//   handleDeletePreset,
//   title = "Delete Coupon",
//   message = "Are you sure you want to delete this coupon?"
// }) => {
//   if (!presetToDelete) return null;

//   const handleCancel = () => {
//     setShowDeleteModal(false);
//   };

//   const handleConfirmDelete = async () => {


//     await handleDeletePreset(presetToDelete);
//     setShowDeleteModal(false);
//   };

//   console.log('presetToDelete', presetToDelete);


//   return (
//     <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50">
//       <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
//         <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
//         <p className="text-sm text-gray-700 mb-6">
//           {message}
//         </p>
//         {presetToDelete && (
//           <div className="bg-gray-50 p-3 rounded-md mb-4">
//             <p className="text-sm font-medium text-gray-800">
//               {presetToDelete.presetName || presetToDelete.preset.presetName || "Untitled Coupon"}
//             </p>
//           </div>
//         )}
//         <div className="flex justify-end gap-4">
//           <button
//             onClick={handleCancel}
//             className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow-sm transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleConfirmDelete}
//             className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition-colors"
//           >
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PresetToggle;


import React from "react";

const PresetToggle = ({
  presetToDelete,
  setShowDeleteModal,
  handleDeletePreset,
  title = "Delete Coupon",
  message = "Are you sure you want to delete this coupon?",
  isLoading = false,
  confirmButtonText = "Delete",
  confirmButtonColor = "bg-red-600 hover:bg-red-700"
}) => {
  if (!presetToDelete) return null;

  const handleCancel = () => {
    setShowDeleteModal(false);
  };

  const handleConfirm = async () => {
    await handleDeletePreset(presetToDelete);
    setShowDeleteModal(false);
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
        <p className="text-sm text-gray-700 mb-6">
          {message}
        </p>
        {presetToDelete && (
          <div className="bg-gray-50 p-3 rounded-md mb-4">
            <p className="text-sm font-medium text-gray-800">
              {presetToDelete.presetName || presetToDelete.preset?.presetName || "Untitled Coupon"}
            </p>
          </div>
        )}
        <div className="flex justify-end gap-4">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`px-4 py-2 ${confirmButtonColor} text-white rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PresetToggle;