import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { FaImages } from "react-icons/fa";

export default function GallerySec({ cardData, openModal }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  const gallery = cardData?.gallery || [];

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen, gallery]);

  return (
    <div className="bg-white shadow-lg rounded-2xl w-full my-5 overflow-hidden transition-all duration-300">
      {/* Header */}
      <div
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <FaImages className="text-[#2563EB] text-2xl" />
          <h2 className="text-lg font-bold text-gray-800">Gallery</h2>
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
          {gallery.length > 0 ? (
            gallery.map((url, idx) => (
              <div
                key={idx}
                className="group cursor-pointer border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
                onClick={() => window.open(url, "_blank")}
                title={url}
              >
                <img
                  src={url}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                />
                <div className="px-2 py-1 text-center bg-gray-50">
                  <span className="text-xs text-gray-600 truncate block">
                    {url.split("/").pop()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-gray-500 text-center">
              No photos uploaded yet
            </div>
          )}

          {/* Add photo tile */}
          <div
            className="cursor-pointer border-2 border-dashed border-purple-400 rounded-xl flex flex-col items-center justify-center hover:bg-purple-50 transition-colors"
            onClick={() => openModal("gallery", "Gallery")}
          >
            <span className="text-[#2563EB] text-2xl font-bold">+</span>
            <span className="text-sm text-[#2563EB] font-medium">
              Add Photo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
