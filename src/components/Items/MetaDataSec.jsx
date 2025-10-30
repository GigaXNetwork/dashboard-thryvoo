// import { useState, useRef, useEffect } from "react";
// import { FaGlobe, FaMapMarkedAlt, FaVideo, FaKey } from "react-icons/fa";
// import { MdPlace } from "react-icons/md";
// import { ChevronDown, ChevronRight } from "lucide-react";

// export default function MetaDataSec({ cardData, openModal }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const contentRef = useRef(null);
//   const [height, setHeight] = useState(0);

//   // Define metadata fields with icons
//   const metaFields = [
//     {
//       field: "gplaceid",
//       label: "Google Place ID",
//       value: cardData?.gplaceid || "--",
//       icon: <MdPlace className="text-red-500" />,
//     },
//     // {
//     //   field: "keyword",
//     //   label: "Keyword",
//     //   value: cardData?.keyword || "--",
//     //   icon: <FaKey className="text-yellow-600" />,
//     // },
//     {
//       field: "map",
//       label: "Map Link",
//       value: cardData?.map || "--",
//       icon: <FaMapMarkedAlt className="text-green-600" />,
//     },
//     {
//       field: "videoUrl",
//       label: "Video URL",
//       value: cardData?.videoUrl || "--",
//       icon: <FaVideo className="text-purple-600" />,
//     },
//   ];

//   const renderRow = (item) => (
//     <div
//       key={item.field}
//       className="cursor-pointer flex items-center justify-between py-4 border-t hover:bg-purple-50 transition-colors"
//     >
//       <div
//         className="flex items-center gap-3 flex-1 min-w-0"
//         onClick={() => {
//           openModal(item.field, item.label);
//         }}
//       >
//         {item.icon}
//         <span className="text-gray-600 w-32 shrink-0">{item.label}</span>
//         <span className="text-gray-800 font-medium truncate whitespace-nowrap overflow-hidden flex-1">
//           {item.value}
//         </span>
//       </div>
//       <div className="pl-4">
//         <ChevronRight
//           className="w-5 h-5 text-[#2563EB]"
//           onClick={() => openModal(item.field, item.label)}
//         />
//       </div>
//     </div>
//   );

//   useEffect(() => {
//     if (contentRef.current) {
//       setHeight(isOpen ? contentRef.current.scrollHeight : 0);
//     }
//   }, [isOpen]);

//   return (
//     <div className="bg-white shadow-lg rounded-2xl w-full my-5 overflow-hidden transition-all duration-300">
//       {/* Header */}
//       <div
//         className="flex items-center justify-between p-6 cursor-pointer"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <div className="flex items-center gap-3">
//           <FaGlobe className="text-[#2563EB] text-2xl" />
//           <h2 className="text-lg font-bold text-gray-800">Meta Information</h2>
//         </div>
//         <ChevronDown
//           className={`w-6 h-6 text-gray-500 transform transition-transform duration-300 ${
//             isOpen ? "rotate-180" : "rotate-0"
//           }`}
//         />
//       </div>

//       {/* Smooth Info List */}
//       <div
//         ref={contentRef}
//         className="px-6 overflow-hidden transition-all duration-300"
//         style={{ maxHeight: `${height}px` }}
//       >
//         {metaFields.map(renderRow)}
//       </div>
//     </div>
//   );
// }




import { Edit } from "lucide-react";
import { FaGlobe, FaMapMarkedAlt, FaVideo, FaKey } from "react-icons/fa";
import { MdPlace } from "react-icons/md";

export default function MetaDataSec({ cardData, openModal, isExpanded = false }) {
  // Define metadata fields with icons
  const metaFields = [
    {
      field: "gplaceid",
      label: "Google Place ID",
      value: cardData?.gplaceid || "--",
      icon: <MdPlace className="text-red-500" />,
    },
    {
      field: "map",
      label: "Map Link",
      value: cardData?.map || "--",
      icon: <FaMapMarkedAlt className="text-green-600" />,
    },
    {
      field: "videoUrl",
      label: "Video URL",
      value: cardData?.videoUrl || "--",
      icon: <FaVideo className="text-purple-600" />,
    },
  ];

  const renderRow = (item) => (
    <div
      key={item.field}
      className="flex items-center justify-between py-4 border-t border-gray-100 hover:bg-gray-50 transition-colors rounded-lg px-3"
    >
      <div className="flex items-start gap-4 w-32 min-w-0">
        <div className="w-6 flex justify-center shrink-0 mt-0.5">
          {item.icon}
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-4 min-w-0">
            <span className="text-gray-600 font-medium w-32 shrink-0">{item.label}</span>
            <div className="min-w-0 flex-1">
              <span className="text-gray-800 text-sm truncate block" title={item.value}>
                {item.value}
              </span>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={() => openModal(item.field, item.label)}
        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors shrink-0 ml-2"
        title={`Edit ${item.label}`}
      >
        <Edit className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="w-full">
      <div className="space-y-1">
        {metaFields.map(renderRow)}
      </div>
    </div>
  );
}