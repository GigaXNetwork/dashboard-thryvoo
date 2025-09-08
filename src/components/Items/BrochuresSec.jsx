import { useState, useRef, useEffect } from "react";
import { FaFilePdf } from "react-icons/fa";
import { ChevronDown } from "lucide-react";

export default function BrochuresSec({ cardData, openModal }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  const brochures = cardData?.brochures || [];

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen, brochures]);

  return (
    <div className="bg-white shadow-lg rounded-2xl w-full my-5 overflow-hidden transition-all duration-300">
      {/* Header */}
      <div
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <FaFilePdf className="text-[#2563EB] text-2xl" />
          <h2 className="text-lg font-bold text-gray-800">Brochures</h2>
        </div>
        <ChevronDown
          className={`w-6 h-6 text-gray-500 transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="px-6 overflow-hidden transition-all duration-300"
        style={{ maxHeight: `${height}px` }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 py-4">
          {brochures.length > 0 ? (
            brochures.map((url, idx) => (
              <div
                key={idx}
                className="group cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center hover:bg-purple-50 transition-colors shadow-sm"
                onClick={() => window.open(url, "_blank")}
                title={url}
              >
                <FaFilePdf className="text-[#2563EB] text-3xl mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm text-gray-700 font-medium truncate w-full text-center">
                  Brochure {idx + 1}
                </span>
                <span className="text-xs text-gray-500 truncate w-full text-center">
                  {url.split("/").pop()}
                </span>
              </div>
            ))
          ) : (
            <div className="col-span-full text-gray-500 text-center">
              No brochures uploaded yet
            </div>
          )}

          {/* Add brochure tile */}
          <div
            className="cursor-pointer border-2 border-dashed border-purple-400 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-purple-50 transition-colors"
            onClick={() => openModal("brochures", "Brochures")}
          >
            <span className="text-[#2563EB] text-2xl font-bold">+</span>
            <span className="text-sm text-[#2563EB] font-medium">
              Add Brochure
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
