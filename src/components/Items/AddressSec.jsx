// import { useState, useRef, useEffect } from "react";
// import { MapPin } from "lucide-react";
// import { ChevronDown, ChevronRight } from "lucide-react";

// export default function AddressSec({ cardData, openModal }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const contentRef = useRef(null);
//   const [height, setHeight] = useState(0);

//   const addressLine = cardData?.addressLine || "--";
//   const city = cardData?.city || "--";
//   const state = cardData?.state || "--";
//   const country = cardData?.country || "--";
//   const pinCode = cardData?.pinCode || "--";

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
//         <ChevronRight className="w-5 h-5 text-[#2563EB] transform transition-transform duration-300" />
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
//           <MapPin className="text-[#2563EB] text-2xl" />
//           <h2 className="text-lg font-bold text-gray-800">Address Information</h2>
//         </div>
//         <ChevronDown
//           className={`w-6 h-6 text-gray-500 transform transition-transform duration-300 ${
//             isOpen ? "rotate-180" : "rotate-0"
//           }`}
//         />
//       </div>

//       {/* Smooth Address List */}
//       <div
//         ref={contentRef}
//         className="px-6 overflow-hidden transition-all duration-300"
//         style={{ maxHeight: `${height}px` }}
//       >
//         {renderRow("Address Line", addressLine, "addressLine")}
//         {renderRow("City", city, "city")}
//         {renderRow("State", state, "state")}
//         {renderRow("Country", country, "country")}
//         {renderRow("Pin Code", pinCode, "pinCode")}
//       </div>
//     </div>
//   );
// }




import { MapPin } from "lucide-react";
import { Edit } from "lucide-react";

export default function AddressSec({ cardData, openModal, isExpanded = false }) {
  const addressLine = cardData?.addressLine || "--";
  const city = cardData?.city || "--";
  const state = cardData?.state || "--";
  const country = cardData?.country || "--";
  const pinCode = cardData?.pinCode || "--";

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
        {renderRow("Address Line", addressLine, "addressLine")}
        {renderRow("City", city, "city")}
        {renderRow("State", state, "state")}
        {renderRow("Country", country, "country")}
        {renderRow("Pin Code", pinCode, "pinCode")}
      </div>
    </div>
  );
}