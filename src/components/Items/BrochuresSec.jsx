import { useState } from "react";
import { FaFilePdf, FaTimes } from "react-icons/fa";
import { Trash2, Loader, Eye, Maximize2, Download, X } from "lucide-react";
import { useUser } from "../../Context/ContextApt";
import { Api } from "../../Context/apiService";
import MessagePopup from "../Common/MessagePopup";

export default function BrochuresSec({ cardData, openModal, setCardData, isExpanded = false }) {
  const [deleteBrochure, setDeleteBrochure] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const { userData } = useUser();

  const brochures = cardData?.brochures || [];

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
  };

  const closeMessage = () => {
    setMessage({ text: "", type: "" });
  };

  // Function to check if file is an image
  const isImageFile = (url) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    const extension = url.toLowerCase().split('.').pop();
    return imageExtensions.includes(`.${extension}`);
  };

  const handleFileClick = (url) => {
    const isImage = isImageFile(url);

    if (isImage) {
      // For images: open preview modal
      setPreviewImage(url);
    } else {
      // For PDFs: open directly in new tab
      window.open(url, '_blank');
    }
  };

  const handleDeleteBrochure = async (brochureUrl, e) => {
    e.stopPropagation();

    if (!brochureUrl) return;

    try {
      setDeleteBrochure(brochureUrl);

      const response = await Api.deleteBrochure({ brochureUrl });

      if (response.status === "success") {
        setCardData((prevData) => ({
          ...prevData,
          brochures: prevData.brochures.filter((url) => url !== brochureUrl),
        }));
        showMessage(response.message, "success");
      } else {
        showMessage(response.message, "error");
      }
    } catch (error) {
      showMessage("Error deleting file. Please try again.", "error");
    } finally {
      setDeleteBrochure(null);
    }
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  const handleDownload = async (fileUrl, fileName) => {
    if (!fileUrl) return;

    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Network response was not ok');

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName || fileUrl.split('/').pop();

      link.style.display = 'none';
      document.body.appendChild(link);

      setTimeout(() => {
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 100);

    } catch (err) {
      console.error('Download failed:', err);
      // Fallback: Simple direct download
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName || fileUrl.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full">
      {/* Message Popup */}
      {message.text && (
        <MessagePopup
          message={message.text}
          type={message.type}
          onClose={closeMessage}
        />
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {/* Add file tile */}
        <div
          className="cursor-pointer border-2 border-dashed border-blue-300 rounded-xl flex flex-col items-center justify-center hover:bg-blue-50 transition-colors min-h-[136px]"
          onClick={() => openModal("brochures", "Brochures")}
        >
          <span className="text-blue-600 text-2xl font-bold">+</span>
          <span className="text-sm text-blue-600 font-medium">
            Add File
          </span>
        </div>

        {brochures.length > 0 ? (
          brochures.map((url, idx) => {
            const isImage = isImageFile(url);
            const fileName = url.split('/').pop();

            return (
              <div
                key={idx}
                className="group relative border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white"
              >
                {/* File Container */}
                <div className="relative overflow-hidden">
                  {isImage ? (
                    // Image Preview
                    <div className="w-full h-36 bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={url}
                        alt={`Brochure ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    // PDF Preview
                    <div className="w-full h-36 bg-gray-100 flex flex-col items-center justify-center group-hover:bg-gray-200 transition-colors">
                      <FaFilePdf className="text-red-500 text-4xl mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs text-gray-600 font-medium">PDF Document</span>
                    </div>
                  )}

                  {/* Preview Button - Bottom Right */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFileClick(url);
                    }}
                    className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition opacity-0 group-hover:opacity-100"
                    title={isImage ? "View full size" : "Open PDF in new tab"}
                  >
                    {isImage ? <Maximize2 size={16} /> : <Eye size={16} />}
                  </button>

                  {/* Delete Button - Top Right */}
                  <button
                    onClick={(e) => handleDeleteBrochure(url, e)}
                    disabled={deleteBrochure === url}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-70 shadow-lg"
                    title="Delete file"
                  >
                    {deleteBrochure === url ? (
                      <Loader className="w-3 h-3 animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-gray-500 text-center py-8">
            <FaFilePdf className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-600">No files uploaded yet</p>
          </div>
        )}
      </div>

      {/* Image Preview Modal - Only for images */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm">
          {/* Close Button */}
          <button
            onClick={closePreview}
            className="absolute top-6 right-6 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition z-10"
          >
            <X size={28} />
          </button>

          {/* Download Button for Images */}
          <button
            onClick={() => handleDownload(previewImage, previewImage.split('/').pop())}
            className="absolute top-6 right-20 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition z-10"
            title="Download image"
          >
            <Download size={24} />
          </button>

          {/* Image Content */}
          <div className="max-w-[90vw] max-h-[90vh] flex items-center justify-center">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}