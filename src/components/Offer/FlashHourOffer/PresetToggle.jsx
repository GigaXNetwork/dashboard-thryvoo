import React from "react";

const PresetToggle = ({
  presetToDelete,
  setShowDeleteModal,
  handleDeletePreset,
  setPresetToDelete,
  deleteLoading
}) => {
  if (!presetToDelete) return null;

  const handleDelete = async () => {
    await handleDeletePreset(presetToDelete);
    // Don't close modal here - let parent handle it after successful deletion
  };

  const handleCancel = () => {
    if (!deleteLoading) {
      setShowDeleteModal(false);
      setPresetToDelete(null);
    }
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
            onClick={async () => {
              await handleDeletePreset(presetToDelete);
              setShowDeleteModal(false);
              setPresetToDelete(null);
            }}
            className={`px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 ${deleteLoading
                ? "bg-red-400 text-white cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white"
              }`}
          >
            {deleteLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </>
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
