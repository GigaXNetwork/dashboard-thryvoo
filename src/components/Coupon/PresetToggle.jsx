import React, { useState } from "react";

const PresetToggle = ({
  presetToDelete,
  setShowDeleteModal,
  handleDeletePreset,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!presetToDelete) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    await handleDeletePreset(presetToDelete);
    setShowDeleteModal(false);
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Delete Preset</h2>
        <p className="text-sm text-gray-700 mb-6">
          Are you sure you want to delete <strong>{presetToDelete.presetName}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Deleting...</span>
              </div>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PresetToggle;
