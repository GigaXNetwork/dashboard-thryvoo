import { Edit } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
  FaXTwitter,
  FaLinkedin,
  FaGlobe,
} from "react-icons/fa6";

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

  const renderRow = (item) => {
    const isWhatsApp = item.field === "whatsapp";
    const hasValue = item.value && item.value !== "--";
    const isClickable = hasValue && !isWhatsApp;

    const handleValueClick = () => {
      const value = cardData?.social?.[item.field];
      if (isClickable && value) {
        window.open(value, "_blank", "noopener,noreferrer");
      }
    };

    return (
      <div
        key={item.field}
        className="flex items-start justify-between py-4 border-t border-gray-100 hover:bg-gray-50 transition-colors rounded-lg px-3"
      >
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="w-6 flex justify-center pt-1">
            {item.icon}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-gray-600 font-medium block mb-1">
              {item.label}
            </span>
            <span
              className={`block text-sm break-all whitespace-normal ${
                isClickable ? "text-blue-600 hover:underline cursor-pointer" : "text-gray-800"
              }`}
              onClick={handleValueClick}
            >
              {item.value}
            </span>
          </div>
        </div>

        <button
          onClick={() => openModal(item.field, item.label)}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ml-2 self-start"
          title={`Edit ${item.label}`}
        >
          <Edit className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="space-y-1">
        {socials.map(renderRow)}
      </div>
    </div>
  );
}
