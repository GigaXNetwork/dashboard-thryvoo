// import { useState, useRef, useEffect } from "react";
// import { FaUser } from "react-icons/fa";
// import { ChevronDown, ChevronRight } from "lucide-react";

// export default function BasicDataSec({ cardData, openModal }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const contentRef = useRef(null);
//   const [height, setHeight] = useState(0);

//   const name = cardData?.name || "Not available";
//   const email = cardData?.email || "Not available";
//   const phone = cardData?.phone || "Not available";
//   const bio = cardData?.bio || "Not available";
//   const desc = cardData?.desc || "Not available";

//   const renderRow = (label, value, field) => (
//     <div
//       key={field}
//       className="cursor-pointer flex items-center justify-between py-4 border-t hover:bg-purple-50 transition-colors"
//       onClick={() => openModal(field, label)}
//       title={value}
//     >
//       <div className="flex-1 flex items-center gap-4 flex-wrap">
//         <span className="text-gray-600 flex-1 basis-[100px]">{label}</span>
//         <span className="text-gray-800 font-medium flex-1 basis-[100px] truncate break-all">
//           {value}
//         </span>
//       </div>
//       <div className="pl-4">
//         <ChevronRight
//           className='w-5 h-5 text-[#2563EB] transform transition-transform duration-300'
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
//           <FaUser className="text-[#2563EB] text-2xl" />
//           <h2 className="text-lg font-bold text-gray-800">Basic Information</h2>
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
//         {renderRow("Name", name, "name")}
//         {renderRow("Email", email, "email")}
//         {renderRow("Phone", phone, "phone")}
//         {renderRow("Bio", bio, "bio")}
//         {renderRow("Description", desc, "desc")}
//       </div>
//     </div>
//   );
// }




import { FaUser } from "react-icons/fa";
import { Edit } from "lucide-react";

export default function BasicDataSec({ cardData, openModal, isExpanded = false }) {
  const name = cardData?.name || "Not available";
  const email = cardData?.email || "Not available";
  const phone = cardData?.phone || "Not available";
  const bio = cardData?.bio || "Not available";
  const desc = cardData?.desc || "Not available";

  const renderRow = (label, value, field) => (
    <div
      key={field}
      className="flex items-center justify-between py-4 border-t border-gray-100 hover:bg-gray-50 transition-colors rounded-lg px-3"
    >
      <div className="flex-1 flex items-center gap-6">
        <span className="text-gray-600 font-medium min-w-[120px]">{label}</span>
        <span className="text-gray-800 flex-1 truncate break-all">
          {value}
        </span>
      </div>
      <button
        onClick={() => openModal(field, label)}
        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title={`Edit ${label}`}
      >
        <Edit className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="w-full">
      <div className="space-y-1">
        {renderRow("Business Name", name, "name")}
        {renderRow("Email Address", email, "email")}
        {renderRow("Phone Number", phone, "phone")}
        {renderRow("Bio", bio, "bio")}
        {renderRow("Description", desc, "desc")}
      </div>
    </div>
  );
}