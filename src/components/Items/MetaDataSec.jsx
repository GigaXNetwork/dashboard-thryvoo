import { useState, useRef, useEffect } from "react";
import { FaGlobe } from "react-icons/fa";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function MetaDataSec({ cardData, openModal }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  const gplaceid = cardData?.gplaceid || "--";
  const keyword = cardData?.keyword || "--";
  const map = cardData?.map || "--";
  const videoUrl = cardData?.videoUrl || "--";

  const renderRow = (label, value, field) => (
    <div
      key={field}
      className="cursor-pointer flex items-center justify-between py-4 border-t hover:bg-purple-50 transition-colors"
      onClick={() => openModal(field, label)}
      title={value}
    >
      <div className="flex-1 flex items-center gap-4 flex-wrap">
        <span className="text-gray-600 flex-1 basis-[100px]">{label}</span>
        <span className="text-gray-800 font-medium flex-1 basis-[100px] truncate break-all">
          {value}
        </span>
      </div>
      <div className="pl-4">
        <ChevronRight className="w-5 h-5 text-purple-500" />
      </div>
    </div>
  );

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div className="bg-white shadow-lg rounded-2xl w-full my-5 overflow-hidden transition-all duration-300">
      {/* Header */}
      <div
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <FaGlobe className="text-purple-500 text-2xl" />
          <h2 className="text-lg font-bold text-gray-800">Meta Information</h2>
        </div>
        <ChevronDown
          className={`w-6 h-6 text-gray-500 transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>

      {/* Smooth Info List */}
      <div
        ref={contentRef}
        className="px-6 overflow-hidden transition-all duration-300"
        style={{ maxHeight: `${height}px` }}
      >
        {renderRow("Google Place ID", gplaceid, "gplaceid")}
        {renderRow("Keyword", keyword, "keyword")}
        {renderRow("Map", map, "map")}
        {renderRow("Video URL", videoUrl, "videoUrl")}
      </div>
    </div>
  );
}
