// import { useState, useRef, useEffect } from "react";
// import { FaFilePdf } from "react-icons/fa";
// import { ChevronDown, Trash2, Loader } from "lucide-react";
// import { useUser } from "../../Context/ContextApt";
// import { Api } from "../../Context/apiService"; // Adjust path as needed
// export default function BrochuresSec({ cardData, openModal, setCardData }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [deleteBrochure, setDeleteBrochure] = useState(null);
//   const contentRef = useRef(null);
//   const [height, setHeight] = useState(0);
//   const { userData } = useUser();

//   const brochures = cardData?.brochures || [];

//   useEffect(() => {
//     if (contentRef.current) {
//       setHeight(isOpen ? contentRef.current.scrollHeight : 0);
//     }
//   }, [isOpen, brochures]);

//   const handleDeleteBrochure = async (brochureUrl, e) => {
//     e.stopPropagation();

//     if (!brochureUrl) return;

//     try {
//       setDeleteBrochure(brochureUrl);

//       const response = await Api.deleteBrochure({ brochureUrl });

//       if (response.status === "success") {
//         setCardData((prevData) => ({
//           ...prevData,
//           brochures: prevData.brochures.filter((url) => url !== brochureUrl),
//         }));
//       } else {
//         console.error("Failed to delete image:", response.message);
//         alert("Failed to delete image. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error deleting image:", error);
//       alert("Error deleting image. Please try again.");
//     } finally {
//       setDeleteBrochure(null);
//     }
//   };

//   return (
//     <div className="bg-white shadow-lg rounded-2xl w-full my-5 overflow-hidden transition-all duration-300">
//       {/* Header */}
//       <div
//         className="flex items-center justify-between p-6 cursor-pointer"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <div className="flex items-center gap-3">
//           <FaFilePdf className="text-[#2563EB] text-2xl" />
//           <h2 className="text-lg font-bold text-gray-800">Price List / Brochures</h2>
//         </div>
//         <ChevronDown
//           className={`w-6 h-6 text-gray-500 transform transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
//             }`}
//         />
//       </div>

//       {/* Content */}
//       <div
//         ref={contentRef}
//         className="px-6 overflow-hidden transition-all duration-300"
//         style={{ maxHeight: `${height}px` }}
//       >
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 py-4">
//           {/* Add brochure tile */}
//           <div
//             className="cursor-pointer border-2 border-dashed border-purple-400 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-purple-50 transition-colors"
//             onClick={() => openModal("brochures", "Brochures")}
//           >
//             <span className="text-[#2563EB] text-2xl font-bold">+</span>
//             <span className="text-sm text-[#2563EB] font-medium">
//               Add Brochure
//             </span>
//           </div>

//           {brochures.length > 0 ? (
//             brochures.map((url, idx) => (
//               <div
//                 key={idx}
//                 className="group cursor-pointer relative border rounded-xl p-4 flex flex-col items-center justify-center hover:bg-purple-50 transition-colors shadow-sm"
//                 onClick={() => window.open(url, "_blank")}
//                 title={url}
//               >
//                 {/* <div className="relative"> */}
//                 {userData?.user?.role === "user" && (
//                   <div className="absolute inset-0 bg-black bg-opacity-0 rounded-xl group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
//                     {/* Delete Button - Top Right */}
//                     <button
//                       onClick={(e) => handleDeleteBrochure(url, e)}
//                       disabled={deleteBrochure === url}
//                       className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-70 shadow-lg"
//                       title="Delete image"
//                     >
//                       {deleteBrochure === url ? (
//                         <Loader className="w-3 h-3 animate-spin" />
//                       ) : (
//                         <Trash2 className="w-3 h-3" />
//                       )}
//                     </button>
//                   </div>
//                 )}

//                 <FaFilePdf className="text-[#2563EB] text-3xl mb-2 group-hover:scale-110 transition-transform" />
//                 <span className="text-sm text-gray-700 font-medium truncate w-full text-center">
//                   Brochure {idx + 1}
//                 </span>
//                 <span className="text-xs text-gray-500 truncate w-full text-center">
//                   {url.split("/").pop()}
//                 </span>
//               </div>
//               // </div>
//             ))
//           ) : (
//             <div className="col-span-full text-gray-500 text-center">
//               No brochures uploaded yet
//             </div>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }



import { useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { Trash2, Loader } from "lucide-react";
import { useUser } from "../../Context/ContextApt";
import { Api } from "../../Context/apiService";

export default function BrochuresSec({ cardData, openModal, setCardData, isExpanded = false }) {
  const [deleteBrochure, setDeleteBrochure] = useState(null);
  const { userData } = useUser();

  const brochures = cardData?.brochures || [];

  // Function to check if file is an image
  const isImageFile = (url) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    const extension = url.toLowerCase().split('.').pop();
    return imageExtensions.includes(`.${extension}`);
  };

  // Function to check if file is PDF
  const isPdfFile = (url) => {
    return url.toLowerCase().endsWith('.pdf');
  };

  const handleFileClick = (url) => {
    window.open(url, "_blank");
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
      } else {
        console.error("Failed to delete file:", response.message);
        alert("Failed to delete file. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Error deleting file. Please try again.");
    } finally {
      setDeleteBrochure(null);
    }
  };

  return (
    <div className="w-full">
      {/* Content - Always visible now */}
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
            
            return (
              <div
                key={idx}
                className="group relative border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* File Container */}
                <div className="relative overflow-hidden">
                  {isImage ? (
                    // Image Preview (styled exactly like GallerySec)
                    <img
                      src={url}
                      alt={`Brochure ${idx + 1}`}
                      className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    // PDF Preview (simple icon display)
                    <div className="w-full h-36 bg-gray-100 flex flex-col items-center justify-center group-hover:bg-gray-200 transition-colors">
                      <FaFilePdf className="text-blue-600 text-3xl mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs text-gray-600">PDF Document</span>
                    </div>
                  )}

                  {userData?.user?.role === "user" && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      {/* Delete Button - Top Right */}
                      <button
                        onClick={(e) => handleDeleteBrochure(url, e)}
                        disabled={deleteBrochure === url}
                        className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-70 shadow-lg"
                        title="Delete file"
                      >
                        {deleteBrochure === url ? (
                          <Loader className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-gray-500 text-center py-8">
            <FaFilePdf className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p>No files uploaded yet</p>
          </div>
        )}
      </div>
    </div>
  );
}