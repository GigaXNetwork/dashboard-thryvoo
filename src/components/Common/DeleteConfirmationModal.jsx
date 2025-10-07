import React, { useState } from 'react';

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  description,
  confirmButtonText = "Delete",
  cancelButtonText = "Cancel",
  isLoading = false
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      // Close modal on successful deletion
      onClose();
    } catch (error) {
      console.error("Error in delete confirmation:", error);
      // Don't close modal on error - let the parent handle the error
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting && !isLoading) {
      onClose();
    }
  };

  const isButtonDisabled = isDeleting || isLoading;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
        
        {/* Custom Description */}
        {description && (
          <div className="text-sm text-gray-700 mb-6">
            {description}
          </div>
        )}
        
        {/* Default fallback description */}
        {!description && (
          <p className="text-sm text-gray-700 mb-6">
            Are you sure you want to delete this item? This action cannot be undone.
          </p>
        )}

        <div className="flex justify-end gap-4">
          <button
            onClick={handleClose}
            disabled={isButtonDisabled}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow-sm disabled:opacity-50 transition-colors"
          >
            {cancelButtonText}
          </button>
          <button
            onClick={handleDelete}
            disabled={isButtonDisabled}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm flex items-center justify-center min-w-[80px] disabled:opacity-50 transition-colors"
          >
            {isButtonDisabled ? (
              <>
                <svg 
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  ></circle>
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Deleting...
              </>
            ) : (
              confirmButtonText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;