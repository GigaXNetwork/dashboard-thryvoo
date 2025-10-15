// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaPercentage, FaGift } from "react-icons/fa";
// import { MdDiscount } from 'react-icons/md';

// const MAX_SPINS = 5;

// // Icons for discount types
// const DiscountIcons = {
//   percentage: () => <FaPercentage />,
//   fixed: () => <MdDiscount size={24} color="red" />,
//   custom: () => <FaGift />,   // unified as "custom" instead of "free"
//   default: () => (
//     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
//       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//     </svg>
//   )
// };

// // Accordion animations
// const accordionVariants = {
//   closed: { height: 0, opacity: 0, transition: { duration: 0.25, ease: "easeInOut" } },
//   open: { height: "auto", opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } }
// };

// const chevronVariants = {
//   closed: { rotate: 0 },
//   open: { rotate: 180 }
// };

// // Accordion Item
// const SpinAccordionItem = ({ spin, isOpen, onToggle, index, onRemoveSpin }) => {
//   const spinId = spin._id || spin;

//   return (
//     <motion.div
//       className="border border-gray-200 rounded-lg mb-3 overflow-hidden"
//       initial={false}
//       animate={{ backgroundColor: isOpen ? "#f9fafb" : "#ffffff" }}
//       transition={{ duration: 0.2 }}
//     >
//       {/* Header button */}
//       <motion.button
//         className="w-full p-4 text-left focus:outline-none"
//         onClick={onToggle}
//         aria-expanded={isOpen}
//       >
//         <div className="flex items-center justify-between">
//           <div className="flex items-center">
//             <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
//               {spin.discountType
//                 ? DiscountIcons[spin.discountType]?.() || DiscountIcons.default()
//                 : DiscountIcons.default()}
//             </div>
//             <div className="ml-4">
//               <div className="text-sm font-medium text-gray-900">
//                 {spin.presetName || 'Unnamed Offer'}
//               </div>
//               <div className="text-sm text-gray-500">
//                 {spin.type || 'Standard'}
//               </div>
//             </div>
//           </div>
//           <div className="flex items-center">
//             <div className="mr-4 text-sm text-gray-900">
//               {spin.discountType === 'percentage' && `${spin.discountAmount}%`}
//               {spin.discountType === 'fixed' && `$${spin.discountAmount}`}
//               {spin.discountType === 'custom' && 'FREE'}
//               {!spin.discountType && spin.discountAmount && `${spin.discountAmount}`}
//               {!spin.discountType && !spin.discountAmount && 'N/A'}
//             </div>
//             <motion.svg
//               className="w-5 h-5 text-gray-500"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//               variants={chevronVariants}
//               animate={isOpen ? "open" : "closed"}
//               transition={{ duration: 0.3 }}
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//             </motion.svg>
//           </div>
//         </div>
//       </motion.button>

//       {/* Body */}
//       <AnimatePresence initial={false}>
//         {isOpen && (
//           <motion.div
//             initial="closed"
//             animate="open"
//             exit="closed"
//             variants={accordionVariants}
//             className="overflow-hidden"
//           >
//             <div className="p-4 border-t border-gray-200">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                 {/* Discount Details */}
//                 <div>
//                   <h4 className="font-medium text-gray-700 mb-1">Discount Details</h4>
//                   <p className="text-gray-600">
//                     Type: <span className="capitalize">{spin.discountType || 'Unknown'}</span>
//                   </p>
//                   <p className="text-gray-600">
//                     Amount: {spin.discountType === 'percentage' && `${spin.discountAmount}%`}
//                     {spin.discountType === 'fixed' && `$${spin.discountAmount}`}
//                     {spin.discountType === 'custom' && 'FREE'}
//                     {!spin.discountType && spin.discountAmount && `${spin.discountAmount}`}
//                     {!spin.discountType && !spin.discountAmount && 'N/A'}
//                   </p>
//                 </div>

//                 {/* Validity */}
//                 <div>
//                   <h4 className="font-medium text-gray-700 mb-1">Validity Period</h4>
//                   <p className="text-gray-600">
//                     {spin.startAt ? `Starts: ${new Date(spin.startAt).toLocaleDateString()}` : 'Starts: Immediately'}
//                   </p>
//                   <p className="text-gray-600">
//                     {spin.expireAt ? `Expires: ${new Date(spin.expireAt).toLocaleDateString()}` : 'No expiration'}
//                   </p>
//                 </div>

//                 {/* Additional Info */}
//                 <div>
//                   <h4 className="font-medium text-gray-700 mb-1">Additional Info</h4>
//                   <p className="text-gray-600">ID: {spinId}</p>
//                   <p className="text-gray-600">Offer Type: {spin.type || 'Standard'}</p>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex items-end">
//                   <motion.button
//                     onClick={() => onRemoveSpin(spinId)}
//                     className="text-red-600 hover:text-red-800 text-sm font-medium"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     Remove
//                   </motion.button>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// };

// // Main Spin List
// const SpinList = ({ spins, openModal, onRemoveSpin, error }) => {
//   const [openIndex, setOpenIndex] = useState(null);

//   const toggleAccordion = (index) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   return (
//     <motion.div
//       className="bg-white p-6 rounded-lg shadow-md"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//     >
//       <h2 className="text-xl font-semibold text-gray-700 mb-4">Spin List</h2>

//       {error && (
//         <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">
//           {error}
//         </div>
//       )}

//       {!spins || spins.length === 0 ? (
//         <p className="text-gray-500 text-center py-4">No spins available</p>
//       ) : (
//         spins.map((spin, index) => (
//           <SpinAccordionItem
//             key={spin._id || index}
//             spin={spin}
//             isOpen={openIndex === index}
//             onToggle={() => toggleAccordion(index)}
//             index={index}
//             onRemoveSpin={onRemoveSpin}
//           />
//         ))
//       )}

//       {/* Add button */}
//       {(!spins || spins.length < MAX_SPINS) && (
//         <div className="mt-6 flex justify-center">
//           <motion.button
//             onClick={openModal}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             + Add Item
//           </motion.button>
//         </div>
//       )}
//     </motion.div>
//   );
// };

// export default SpinList;





//--------------------------------------------

// import { Calendar, Eye, EyeClosed, EyeClosedIcon, EyeOff, Tag } from "lucide-react";
// import React, { useState } from "react";
// import { FaTrashAlt, FaChevronDown, FaChevronUp, FaGift, FaPercentage } from "react-icons/fa";
// import { MdDiscount } from "react-icons/md";

// const DiscountIcons = {
//   percentage: () => <FaPercentage className="text-blue-600" />,
//   fixed: () => <MdDiscount size={22} color="#e53e3e" />,
//   custom: () => <FaGift className="text-indigo-600" />,
//   default: () => (
//     <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
//       <circle cx="10" cy="10" r="8" />
//     </svg>
//   ),
// };

// function SpinCard({ spin, onRemove }) {
//   const [showDetails, setShowDetails] = useState(false);

//   const getDiscountDisplay = () => {
//     if (spin.discountType === "percentage") return `${spin.discountAmount}% OFF`;
//     if (spin.discountType === "fixed") return `$${spin.discountAmount} OFF`;
//     if (spin.discountType === "custom") return "FREE OFFER";
//     if (spin.discountAmount) return `${spin.discountAmount}`;
//     return "NO DISCOUNT";
//   };

//   const getAmountDisplay = () => {
//     if (spin.discountType === "percentage") return `${spin.discountAmount}%`;
//     if (spin.discountType === "fixed") return `$${spin.discountAmount}`;
//     if (spin.discountType === "custom") return "FREE";
//     if (spin.discountAmount) return `${spin.discountAmount}`;
//     return "N/A";
//   };

//   return (
//     <div className="relative flex flex-col bg-gray-50 rounded-2xl shadow-md p-6 transition-all hover:-translate-y-1 hover:shadow-xl w-full h-[320px] max-w-[400px] mx-auto border border-gray-100">
//       {/* Header Row */}
//       <div className="flex items-center justify-between mb-3">
//         <div className="flex items-center gap-3">
//           <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center shadow">
//             {spin.discountType
//               ? DiscountIcons[spin.discountType]?.() || DiscountIcons.default()
//               : DiscountIcons.default()}
//           </div>
//           <div>
//             <h3 className="font-semibold text-gray-900 text-base capitalize truncate max-w-[180px]">
//               {spin.presetName || "Unnamed Offer"}
//             </h3>
//             <p className="text-xs text-gray-500 font-medium">
//               {spin.type || "Standard"}
//             </p>
//           </div>
//         </div>
//         <button
//           aria-label="Remove spin"
//           className="p-2 rounded-md hover:bg-red-50 transition"
//           onClick={() => onRemove(spin._id)}
//         >
//           <FaTrashAlt className="text-red-500 hover:text-red-700" />
//         </button>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col justify-center transition-all duration-300 ease-in-out">
//         {!showDetails ? (
//           // Compact quick view
//           <div className={`flex flex-col items-center justify-center text-center space-y-10 py-4 transition-all duration-300 ease-in-out ${!showDetails ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
//             }`}>
//             <div className="relative">
//               <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-30 animate-pulse" />
//               <div className="relative px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
//                 <div className="text-2xl font-bold tracking-tight">
//                   {getDiscountDisplay()}
//                 </div>
//               </div>
//             </div>
//             <button
//               aria-label="Show details"
//               className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-200 p-2 rounded-xl transition"
//               onClick={() => setShowDetails(true)}
//             >
//               <Eye className="w-4 h-4" />
//               <span>Show details</span>
//             </button>
//           </div>
//         ) : (
//           // Detailed view
//           <div className={`flex flex-col gap-3 transition-all duration-300 ease-in-out ${showDetails ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
//             }`}>
//             <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-4 border border-blue-200">
//               <div className="flex items-center gap-2 mb-2">
//                 <Tag className="w-4 h-4 text-blue-600" />
//                 <h4 className="font-bold text-gray-800 text-sm">Discount Information</h4>
//               </div>
//               <div className="grid grid-cols-2 gap-3 text-sm">
//                 <div>
//                   <span className="text-gray-600 font-medium">Type</span>
//                   <div className="font-semibold text-gray-900 capitalize mt-0.5">
//                     {spin.discountType || "Unknown"}
//                   </div>
//                 </div>
//                 <div>
//                   <span className="text-gray-600 font-medium">Amount</span>
//                   <div className="font-semibold text-gray-900 mt-0.5">
//                     {getAmountDisplay()}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-4 border border-green-200">
//               <div className="flex items-center gap-2 mb-2">
//                 <Calendar className="w-4 h-4 text-green-600" />
//                 <h4 className="font-bold text-gray-800 text-sm">Validity Period</h4>
//               </div>
//               <div className="grid grid-cols-2 gap-3 text-sm">
//                 <div>
//                   <span className="text-gray-600 font-medium">Start Date</span>
//                   <div className="font-semibold text-gray-900 mt-0.5 text-xs">
//                     {spin.startAt ? new Date(spin.startAt).toLocaleDateString() : "Immediately"}
//                   </div>
//                 </div>
//                 <div>
//                   <span className="text-gray-600 font-medium">Expiry Date</span>
//                   <div className="font-semibold text-gray-900 mt-0.5 text-xs">
//                     {spin.expireAt ? new Date(spin.expireAt).toLocaleDateString() : "No expiration"}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//         )}
//       </div>

//       {showDetails && (
//         <div className="flex items-center justify-center p-1">
//           <button
//             aria-label="Hide details"
//             className="flex items-center gap-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition border-4 border-white"
//             onClick={() => setShowDetails(false)}
//           >
//             <EyeOff className="w-4 h-4 text-gray-600" />
//             <span className="text-xs text-gray-600">Hide</span>
//           </button>
//         </div>
//       )}

//     </div >
//   );
// }


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
      {error && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200 col-span-full">{error}</div>
      )}
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