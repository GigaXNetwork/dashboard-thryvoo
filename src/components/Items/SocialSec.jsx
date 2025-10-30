// import { useState, useRef, useEffect } from "react";
// import { ChevronDown, ChevronRight } from "lucide-react";
// import { FaFacebook, FaInstagram, FaWhatsapp, FaYoutube, FaXTwitter, FaLinkedin, FaGlobe } from "react-icons/fa6";

// export default function SocialSec({ cardData, openModal }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const contentRef = useRef(null);
//   const [height, setHeight] = useState(0);

//   const socials = [
//     { field: "facebook", label: "Facebook", value: cardData?.social?.facebook || "--", icon: <FaFacebook className="text-blue-600" /> },
//     { field: "insta", label: "Instagram", value: cardData?.social?.insta || "--", icon: <FaInstagram className="text-pink-500" /> },
//     { field: "whatsapp", label: "WhatsApp", value: cardData?.social?.whatsapp || "--", icon: <FaWhatsapp className="text-green-500" /> },
//     { field: "youtube", label: "YouTube", value: cardData?.social?.youtube || "--", icon: <FaYoutube className="text-red-600" /> },
//     { field: "twitter", label: "X (Twitter)", value: cardData?.social?.twitter || "--", icon: <FaXTwitter className="text-black" /> },
//     { field: "linkedin", label: "LinkedIn", value: cardData?.social?.linkedin || "--", icon: <FaLinkedin className="text-blue-700" /> },
//     { field: "website", label: "Website", value: cardData?.social?.website || "--", icon: <FaGlobe className="text-[#2563EB]" /> },
//   ];

//   const renderRow = (item) => (
//     <div
//       key={item.field}
//       className="cursor-pointer flex items-center justify-between py-4 border-t hover:bg-purple-50 transition-colors"
//     >
//       <div
//         className="flex items-center gap-3 flex-1 min-w-0"
//         onClick={() => {
//           const value = cardData?.social?.[item.field];
//           if (value && value !== "--") {
//             window.open(value, "_blank", "noopener,noreferrer");
//           } else {
//             openModal(item.field, item.label);
//           }
//         }}
//       >
//         {item.icon}
//         <span className="text-gray-600 w-28 shrink-0">{item.label}</span>
//         <span className="text-gray-800 font-medium truncate break-all flex-1">{item.value}</span>
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
//           <h2 className="text-lg font-bold text-gray-800">Social Media</h2>
//         </div>
//         <ChevronDown
//           className={`w-6 h-6 text-gray-500 transform transition-transform duration-300 ${
//             isOpen ? "rotate-180" : "rotate-0"
//           }`}
//         />
//       </div>

//       {/* Smooth Social Links List */}
//       <div
//         ref={contentRef}
//         className="px-6 overflow-hidden transition-all duration-300"
//         style={{ maxHeight: `${height}px` }}
//       >
//         {socials.map(renderRow)}
//       </div>
//     </div>
//   );
// }




import { Edit } from "lucide-react";
import { FaFacebook, FaInstagram, FaWhatsapp, FaYoutube, FaXTwitter, FaLinkedin, FaGlobe } from "react-icons/fa6";

export default function SocialSec({ cardData, openModal, isExpanded = false }) {
  const socials = [
    { field: "facebook", label: "Facebook", value: cardData?.social?.facebook || "--", icon: <FaFacebook className="text-blue-600" /> },
    { field: "insta", label: "Instagram", value: cardData?.social?.insta || "--", icon: <FaInstagram className="text-pink-500" /> },
    { field: "whatsapp", label: "WhatsApp", value: cardData?.social?.whatsapp || "--", icon: <FaWhatsapp className="text-green-500" /> },
    { field: "youtube", label: "YouTube", value: cardData?.social?.youtube || "--", icon: <FaYoutube className="text-red-600" /> },
    { field: "twitter", label: "X (Twitter)", value: cardData?.social?.twitter || "--", icon: <FaXTwitter className="text-black" /> },
    { field: "linkedin", label: "LinkedIn", value: cardData?.social?.linkedin || "--", icon: <FaLinkedin className="text-blue-700" /> },
    { field: "website", label: "Website", value: cardData?.social?.website || "--", icon: <FaGlobe className="text-blue-600" /> },
  ];

  const renderRow = (item) => (
    <div
      key={item.field}
      className="flex items-center justify-between py-4 border-t border-gray-100 hover:bg-gray-50 transition-colors rounded-lg px-3"
    >
      <div
        className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer"
        onClick={() => {
          const value = cardData?.social?.[item.field];
          if (value && value !== "--") {
            window.open(value, "_blank", "noopener,noreferrer");
          }
        }}
      >
        <div className="w-6 flex justify-center">
          {item.icon}
        </div>
        <span className="text-gray-600 font-medium min-w-[100px]">{item.label}</span>
        <span className={`flex-1 truncate break-all ${item.value !== "--" ? "text-blue-600 hover:underline" : "text-gray-800"}`}>
          {item.value}
        </span>
      </div>
      <button
        onClick={() => openModal(item.field, item.label)}
        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ml-2"
        title={`Edit ${item.label}`}
      >
        <Edit className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="w-full">
      <div className="space-y-1">
        {socials.map(renderRow)}
      </div>
    </div>
  );
}