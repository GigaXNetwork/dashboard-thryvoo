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