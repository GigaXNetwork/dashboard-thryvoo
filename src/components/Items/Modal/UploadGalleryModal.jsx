import React, { useState } from "react";
import Cookies from "js-cookie";
import { FaImages } from "react-icons/fa";

export default function UploadGalleryModal({ cardId, role, onClose, onSubmit }) {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;

    const invalidFiles = selectedFiles.filter(
      (file) => !file.type.startsWith("image/")
    );
    if (invalidFiles.length > 0) {
      setErrorMessage("Only image files (JPG/PNG) are allowed.");
      return;
    }

    setFiles(selectedFiles);
    setErrorMessage("");

    const readers = selectedFiles.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((results) => setPreviews(results));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!files.length) {
      setErrorMessage("Please select at least one image.");
      return;
    }

    const authToken = Cookies.get("authToken");
    setIsSubmitting(true);
    setErrorMessage("");
    setProgress(0);

    let url =
      role === "admin"
        ? `${import.meta.env.VITE_API_URL}/api/admin/card/${cardId}/gallery`
        : `${import.meta.env.VITE_API_URL}/api/user/card/${cardId}/gallery`;

    const formData = new FormData();
    files.forEach((file) => formData.append("gallery", file));

    // ✅ Use XMLHttpRequest to track progress
    const xhr = new XMLHttpRequest();
    xhr.open("PATCH", url, true);
    xhr.setRequestHeader("Authorization", authToken);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      setIsSubmitting(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const result = JSON.parse(xhr.responseText);
          const uploadedFiles = result?.data?.gallery;
          if (onSubmit) onSubmit(uploadedFiles);
          onClose();
        } catch {
          setErrorMessage("Upload succeeded but response parsing failed.");
        }
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText);
          setErrorMessage(errorData?.message || "Failed to upload gallery photos");
        } catch {
          setErrorMessage("Upload failed. Please try again.");
        }
      }
    };

    xhr.onerror = () => {
      setIsSubmitting(false);
      setErrorMessage("Network error during upload.");
    };

    xhr.send(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[9999] backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Upload Gallery Photos
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              multiple
              onChange={handleFileChange}
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer"
            />
            {errorMessage && (
              <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
            )}
          </div>

          {/* Progress Bar */}
          {isSubmitting && (
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-600 h-3 transition-all duration-200"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          {/* Previews */}
          {files.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {previews.map((src, idx) => (
                <div
                  key={idx}
                  className="relative border rounded-lg bg-gray-50 overflow-hidden"
                >
                  <img
                    src={src}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-24 object-cover"
                  />
                  <p className="text-xs text-gray-600 p-1 truncate text-center">
                    {files[idx].name}
                  </p>
                </div>
              ))}
            </div>
          )}

          {files.length === 0 && (
            <div className="mt-4 flex flex-col items-center text-gray-400">
              <FaImages className="text-5xl mb-2" />
              <p className="text-sm">No images selected</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-blue-600 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 rounded-lg font-medium text-white bg-blue-600 transition ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? `Uploading... ${progress}%` : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
