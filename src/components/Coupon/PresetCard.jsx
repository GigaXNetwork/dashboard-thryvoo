import React, { useRef } from "react";

const PresetCard = ({
  preset,
  index,
  openMenuIndex,
  toggleMenu,
  handleEditPreset,
  handleDeletePreset,
  setPresetToDelete,
  setShowDeleteModal,
  handleToggleActive,
  menuRefs,
}) => {
  const ref = useRef();

  return (
    <div
      key={index}
      className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200 shadow-md rounded-2xl p-6 transform hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
    >
      {/* 3-dots menu */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => toggleMenu(index)}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Options"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
          </svg>
        </button>

        {openMenuIndex === index && (
          <div
            ref={(el) => (menuRefs.current[index] = el)}
            className="absolute right-0 mt-2 w-48 bg-white z-10 bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200 shadow-md rounded-2xl p-4 transition-all duration-300"
          >
            <button
              onClick={() => handleEditPreset(preset)}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => {
                setPresetToDelete(preset);
                setShowDeleteModal(true);
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              🗑️ Delete
            </button>
            <button
              onClick={() => handleToggleActive(preset)}
              disabled={preset.isActive}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                preset.isActive ? "text-gray-400 cursor-not-allowed" : ""
              }`}
            >
              ✅ Activate
            </button>
          </div>
        )}
      </div>

      {/* Preset Content */}
      <div className="mb-5">
        <h3 className="text-xl font-bold text-indigo-600 tracking-wide border-b-2 pb-2 border-indigo-200 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a1 1 0 00-.894.553L7.382 6H4a1 1 0 000 2h3a1 1 0 00.894-.553L9.618 4H16a1 1 0 100-2h-6z" />
            <path d="M4 10a1 1 0 011-1h10a1 1 0 011 1v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6z" />
          </svg>
          {preset.presetName}
        </h3>
      </div>

      <div className="text-sm text-gray-700">
        {[
          { label: "Type", value: preset.discountType },
          { label: "Amount/Offer", value: preset.discountAmount },
          { label: "Max Discount", value: preset.maxDiscount || "N/A" },
          { label: "Min Purchase", value: preset.minPurchase || "N/A" },
          { label: "Valid Days", value: preset.day || "N/A" },
          { label: "Usage Limit", value: preset.usageLimit || "N/A" },
          { label: "Created At", value: preset?.createdAt ? new Date(preset.createdAt).toLocaleDateString() : "N/A" },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center justify-between py-2 border-b hover:bg-muted transition-colors">
            <span className="font-medium text-gray-600">{item.label}:</span>
            <span className="capitalize">{item.value}</span>
          </div>
        ))}
      </div>

      {preset.isActive && (
        <div className="mt-6 text-right">
          <span className="inline-block bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full font-semibold tracking-wide shadow-sm">
            Active
          </span>
        </div>
      )}
    </div>
  );
};

export default PresetCard;
