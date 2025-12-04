// import { useState, useRef, useEffect } from "react";
// import { ChevronDown, Trash2, Loader, X, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
// import { FaImages } from "react-icons/fa";
// import { useUser } from "../../Context/ContextApt";
// import { Api } from "../../Context/apiService"; // Adjust path as needed

// export default function GallerySec({ cardData, setCardData, openModal }) {
//   const { userData } = useUser();
//   const [isOpen, setIsOpen] = useState(false);
//   const [deletingImage, setDeletingImage] = useState(null);
//   const contentRef = useRef(null);
//   const [height, setHeight] = useState(0);

//   const gallery = cardData?.gallery || [];

//   useEffect(() => {
//     if (contentRef.current) {
//       setHeight(isOpen ? contentRef.current.scrollHeight : 0);
//     }
//   }, [isOpen, gallery]);

//   const handleDeleteImage = async (imageUrl, e) => {
//     e.stopPropagation(); // Prevent opening image

//     if (!imageUrl) return;

//     try {
//       setDeletingImage(imageUrl);

//       const response = await Api.deleteGalleryImage({ imageUrl });

//       if (response.status === "success") {
//         setCardData((prevData) => ({
//           ...prevData,
//           gallery: prevData.gallery.filter((url) => url !== imageUrl),
//         }));
//       } else {
//         console.error("Failed to delete image:", response.message);
//         alert("Failed to delete image. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error deleting image:", error);
//       alert("Error deleting image. Please try again.");
//     } finally {
//       setDeletingImage(null);
//     }
//   };


//   return (
//     <>
//       <div className="bg-white shadow-lg rounded-2xl w-full my-5 overflow-hidden transition-all duration-300">
//         {/* Header */}
//         <div
//           className="flex items-center justify-between p-6 cursor-pointer"
//           onClick={() => setIsOpen(!isOpen)}
//         >
//           <div className="flex items-center gap-3">
//             <FaImages className="text-[#2563EB] text-2xl" />
//             <h2 className="text-lg font-bold text-gray-800">Gallery</h2>
//             {gallery.length > 0 && (
//               <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
//                 {gallery.length} photos
//               </span>
//             )}
//           </div>
//           <ChevronDown
//             className={`w-6 h-6 text-gray-500 transform transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
//               }`}
//           />
//         </div>

//         {/* Content */}
//         <div
//           ref={contentRef}
//           className="px-6 overflow-hidden transition-all duration-300"
//           style={{ maxHeight: `${height}px` }}
//         >
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 py-4">
//             {/* Add photo tile */}
//             <div
//               className="cursor-pointer border-2 border-dashed border-purple-400 rounded-xl flex flex-col items-center justify-center hover:bg-purple-50 transition-colors min-h-[136px]"
//               onClick={() => openModal("gallery", "Gallery")}
//             >
//               <span className="text-[#2563EB] text-2xl font-bold">+</span>
//               <span className="text-sm text-[#2563EB] font-medium">
//                 Add Photo
//               </span>
//             </div>

//             {gallery.length > 0 ? (
//               gallery.map((url, idx) => (
//                 <div
//                   key={idx}
//                   className="group relative border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
//                 >
//                   {/* Image Container */}
//                   <div className="relative overflow-hidden">
//                     <img
//                       src={url}
//                       alt={`Gallery ${idx + 1}`}
//                       className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
//                     />

//                     {userData?.user?.role === "user" && (
//                     <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
//                       {/* Delete Button - Top Right */}
//                       <button
//                         onClick={(e) => handleDeleteImage(url, e)}
//                         disabled={deletingImage === url}
//                         className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-70 shadow-lg"
//                         title="Delete image"
//                       >
//                         {deletingImage === url ? (
//                           <Loader className="w-3 h-3 animate-spin" />
//                         ) : (
//                           <Trash2 className="w-3 h-3" />
//                         )}
//                       </button>
//                     </div>
//                     )}
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="col-span-full text-gray-500 text-center py-8">
//                 <FaImages className="w-12 h-12 text-gray-300 mx-auto mb-2" />
//                 <p>No photos uploaded yet</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }



import { useState } from "react";
import { Trash2, Loader, Maximize2, Download, X } from "lucide-react";
import { FaImages } from "react-icons/fa";
import { useUser } from "../../Context/ContextApt";
import { Api } from "../../Context/apiService";
import MessagePopup from "../Common/MessagePopup";

export default function GallerySec({ cardData, setCardData, openModal, isExpanded = false }) {
  const { userData } = useUser();
  const [deletingImage, setDeletingImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  const gallery = cardData?.gallery || [];

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
  };

  const closeMessage = () => {
    setMessage({ text: "", type: "" });
  };

  const handleDeleteImage = async (imageUrl, e) => {
    e.stopPropagation(); // Prevent opening image

    if (!imageUrl) return;

    try {
      setDeletingImage(imageUrl);

      const response = await Api.deleteGalleryImage({ imageUrl });

      if (response.status === "success") {
        setCardData((prevData) => ({
          ...prevData,
          gallery: prevData.gallery.filter((url) => url !== imageUrl),
        }));
        showMessage(response.message, "success");
      } else {
        showMessage(response.message || "Failed to delete image. Please try again.", "error");
      }
    } catch (error) {
      showMessage("Error deleting image. Please try again.", "error");
    } finally {
      setDeletingImage(null);
    }
  };

  const handleImageClick = (url) => {
    setPreviewImage(url);
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
      {/* MessagePopup */}
      {message.text && (
        <MessagePopup
          message={message.text}
          type={message.type}
          onClose={closeMessage}
        />
      )}

      {/* Content - Always visible now */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {/* Add photo tile */}
        <div
          className="cursor-pointer border-2 border-dashed border-blue-300 rounded-xl flex flex-col items-center justify-center hover:bg-blue-50 transition-colors min-h-[136px]"
          onClick={() => openModal("gallery", "Gallery")}
        >
          <span className="text-blue-600 text-2xl font-bold">+</span>
          <span className="text-sm text-blue-600 font-medium">
            Add Photo
          </span>
        </div>

        {gallery.length > 0 ? (
          gallery.map((url, idx) => (
            <div
              key={idx}
              className="group relative border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
              onClick={() => handleImageClick(url)}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <img
                  src={url}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Preview Button - Bottom Right */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageClick(url);
                  }}
                  className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition opacity-0 group-hover:opacity-100"
                  title="View full size"
                >
                  <Maximize2 size={16} />
                </button>

                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  {/* Delete Button - Top Right */}
                  <button
                    onClick={(e) => handleDeleteImage(url, e)}
                    disabled={deletingImage === url}
                    className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-70 shadow-lg"
                    title="Delete image"
                  >
                    {deletingImage === url ? (
                      <Loader className="w-3 h-3 animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3" />
                    )}
                  </button>
                </div>

              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-gray-500 text-center py-8">
            <FaImages className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p>No photos uploaded yet</p>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
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