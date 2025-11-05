import React, { useState } from "react";
import { FaTrashAlt, FaGift, FaPercentage } from "react-icons/fa";
import { MdDiscount } from "react-icons/md";
import { Calendar, Eye, EyeOff, Tag, ShoppingCart, BarChart3, Link, Zap, FileText, X } from "lucide-react";

const DiscountIcons = {
  percentage: () => <FaPercentage className="text-blue-600" />,
  fixed: () => <MdDiscount size={22} color="#e53e3e" />,
  custom: () => <FaGift className="text-indigo-600" />,
  default: () => (
    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
      <circle cx="10" cy="10" r="8" />
    </svg>
  ),
};

const DataField = ({ label, value, icon: Icon, truncate = true }) => (
  <div className="flex items-center gap-1 py-1">
    {Icon && <Icon className="w-4 h-4 text-gray-400" />}
    <div className="flex-1 min-w-0">
      <span className="text-[11px] text-gray-500 uppercase font-medium">{label}</span>
      <div className={`text-xs font-semibold text-gray-900 ${truncate ? 'truncate' : ''}`}>{value || "—"}</div>
    </div>
  </div>
);

function SpinCard({ spin, onRemove }) {
  const [showModal, setShowModal] = useState(false);

  const getDiscountDisplay = () => {
    if (spin.discountType === "percentage") return `${spin.discountAmount}% OFF`;
    if (spin.discountType === "fixed") return `$${spin.discountAmount} OFF`;
    if (spin.discountType === "custom") return "FREE OFFER";
    if (spin.discountAmount) return `${spin.discountAmount}`;
    return "NO DISCOUNT";
  };

  const formatData = {
    type: spin.discountType ? spin.discountType.charAt(0).toUpperCase() + spin.discountType.slice(1) : "Unknown",
    amount: spin.discountType === "percentage"
      ? `${spin.discountAmount}%`
      : spin.discountType === "fixed"
        ? `$${spin.discountAmount}`
        : spin.discountType === "custom"
          ? "FREE"
          : spin.discountAmount || "—",
    maxDiscount: spin.maxDiscount ? `$${spin.maxDiscount}` : "No limit",
    minPurchase: spin.minPurchase ? `$${spin.minPurchase}` : "No minimum",
    usageLimit: spin.usageLimit || "Unlimited",
    isActive: spin.isActive ? "Active" : "Inactive",
    offerType: spin.type ? spin.type.charAt(0).toUpperCase() + spin.type.slice(1) : "Standard",
    expiry: spin.expireAt ? new Date(spin.expireAt).toLocaleDateString() : "No expiry",
    duration: spin.day ? `${spin.day} days` : "Not specified",
    conditions: spin.conditions || [],
    link: spin.link || "No link",
    created: spin.createdAt ? new Date(spin.createdAt).toLocaleDateString() : "—",
  };

  return (
    <>
      {/* Card */}
      <div className="relative flex flex-col bg-white rounded-xl shadow p-5 w-full h-[160px] max-w-[280px] mx-auto border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center shadow-inner">
              {spin.discountType
                ? DiscountIcons[spin.discountType]?.() || DiscountIcons.default()
                : DiscountIcons.default()}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-base capitalize truncate max-w-[85px]" title={spin.presetName}>
                {spin.presetName || "Unnamed Offer"}
              </h3>
              <p className="text-xs text-gray-500 font-medium">{formatData.offerType}</p>
            </div>
          </div>
          <button aria-label="Remove spin" className="p-2 rounded-full hover:bg-red-100" onClick={() => onRemove(spin._id)}>
            <FaTrashAlt className="text-red-500 hover:text-red-700" />
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl blur opacity-20 pointer-events-none" />
            <div className="relative px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
              <span className="text-lg font-semibold tracking-tight">{getDiscountDisplay()}</span>
            </div>
          </div>
          <button
            aria-label="Show details"
            className="flex items-center gap-2 text-xs mt-2 text-gray-500 hover:text-blue-600 font-medium"
            onClick={() => setShowModal(true)}
          >
            <Eye className="w-4 h-4" />
            <span>Show details</span>
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-3 ring-1 ring-black/10 relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 p-1.5" onClick={() => setShowModal(false)} aria-label="Close modal">
              <X className="w-4 h-4" />
            </button>
            <h2 className="text-base font-semibold text-gray-800 mb-2">{spin.presetName || "Unnamed Offer"}</h2>
            <div className="grid grid-cols-3 gap-2 max-h-fit overflow-y-auto">
              <div className="bg-blue-50 rounded-lg p-2 border border-blue-100">
                <Tag className="w-4 h-4 text-blue-600 mb-1" />
                <DataField label="Type" value={formatData.type} />
                <DataField label="Amount" value={formatData.amount} />
                <DataField label="Status" value={formatData.isActive} />
              </div>
              <div className="bg-purple-50 rounded-lg p-2 border border-purple-100">
                <ShoppingCart className="w-4 h-4 text-purple-600 mb-1" />
                <DataField label="Max Discount" value={formatData.maxDiscount} />
                <DataField label="Min Purchase" value={formatData.minPurchase} />
                <DataField label="Usage Limit" value={formatData.usageLimit} />
              </div>
              <div className="bg-orange-50 rounded-lg p-2 border border-orange-100">
                <Calendar className="w-4 h-4 text-orange-600 mb-1" />
                <DataField label="Expiry" value={formatData.expiry} />
                <DataField label="Duration" value={formatData.duration} />
                <DataField label="Link" value={formatData.link !== "No link" ? "Click to view" : "No link"} />
              </div>
            </div>
            <div className="mt-3 text-right">
              <button
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                onClick={() => setShowModal(false)}
              >
                <EyeOff className="w-4 h-4" />
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}



const SpinList = ({ spins, openModal, onRemoveSpin, error }) => (
  <div className="bg-white rounded-xl p-6 shadow-md">
    <div className="mb-6 col-span-full flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Spin Items</h2>
      {(!spins || spins.length < 5) && (
        <div className="flex justify-center col-span-full">
          <button
            onClick={openModal}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow font-semibold hover:bg-blue-700"
          >
            + Add Item
          </button>
        </div>
      )}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {!spins || spins.length === 0 ? (
        <p className="text-gray-500 text-center col-span-full py-4">No spins available</p>
      ) : (
        spins.map((spin) => (
          <SpinCard
            key={spin._id}
            spin={spin}
            onRemove={onRemoveSpin}
          />
        ))
      )}

    </div>
  </div>
);

export default SpinList