// import React, { useRef } from "react";
// import { Tag, Gift, Crosshair, Calendar, Clock, CheckCircle, Trash2, SquarePen, MoreVertical } from "lucide-react";

// const PresetCard = ({
//   preset,
//   index,
//   openMenuIndex,
//   toggleMenu,
//   handleEditPreset,
//   handleDeletePreset,
//   handleToggleActive,
//   menuRefs,
// }) => {
//   const ref = useRef();

//   // Get offer type configuration
//   const getTypeConfig = (type) => {
//     const types = {
//       cross: {
//         icon: Crosshair,
//         label: 'Cross Promotion',
//         gradient: 'from-blue-500 to-white',
//         bg: 'bg-blue-50',
//         border: 'border-blue-200',
//         text: 'text-blue-700',
//         iconColor: 'bg-blue-500'
//       },
//       own: {
//         icon: Gift,
//         label: 'Own Promotion',
//         gradient: 'from-green-500 to-white',
//         bg: 'green-50',
//         border: 'border-green-200',
//         text: 'text-green-700',
//         iconColor: 'bg-green-500'
//       },
//       offer: {
//         icon: Tag,
//         label: 'Special Offer',
//         gradient: 'from-purple-500 to-white',
//         bg: 'purple-50',
//         border: 'border-purple-200',
//         text: 'text-purple-700',
//         iconColor: 'bg-purple-500'
//       }
//     };
    
//     return types[type] || types.offer;
//   };

//   const typeConfig = getTypeConfig(preset.type || "offer");
//   const TypeIcon = typeConfig.icon;

//   // Format date range for display
//   const formatDateRange = (startAt, expireAt) => {
//     if (!startAt || !expireAt) return "No validity period set";

//     const start = new Date(startAt);
//     const end = new Date(expireAt);

//     return `${start.toLocaleDateString()} ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleDateString()} ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
//   };

//   // Check if offer is currently active based on validity period
//   const isCurrentlyActive = (preset) => {
//     if (!preset.startAt || !preset.expireAt) return preset.isActive;

//     const now = new Date();
//     const start = new Date(preset.startAt);
//     const end = new Date(preset.expireAt);

//     return preset.isActive && now >= start && now <= end;
//   };

//   const currentlyActive = isCurrentlyActive(preset);

//   return (
//     <div className="relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden">
//       {/* Card Content */}
//       <div className="p-5 pb-16"> {/* Increased bottom padding to accommodate gradient */}
//         {/* Header */}
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-3">
//             <div className={`p-2 rounded-lg ${typeConfig.iconColor}`}>
//               <TypeIcon className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
//                 {typeConfig.label}
//               </span>
//               <h3 className="text-gray-900 font-bold text-lg truncate max-w-[200px]">
//                 {preset.presetName}
//               </h3>
//             </div>
//           </div>

//           {/* Status and Actions */}
//           <div className="flex items-center gap-2">
//             {preset.isActive && (
//               <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
//                 currentlyActive 
//                   ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
//                   : "bg-amber-100 text-amber-700 border border-amber-200"
//               }`}>
//                 {currentlyActive ? "🟢 Active" : "⏰ Scheduled"}
//               </span>
//             )}
            
//             {/* 3-dot Actions Menu */}
//             <div className="relative">
//               <button
//                 onClick={() => toggleMenu(index)}
//                 className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//                 aria-label="Options"
//               >
//                 <MoreVertical className="w-4 h-4" />
//               </button>

//               {openMenuIndex === index && (
//                 <div
//                   ref={(el) => (menuRefs.current[index] = el)}
//                   className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1"
//                 >
//                   <button
//                     onClick={() => handleEditPreset(preset)}
//                     className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
//                   >
//                     <SquarePen className="w-4 h-4 text-blue-500" />
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleToggleActive(preset)}
//                     disabled={preset.isActive}
//                     className={`flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors ${
//                       preset.isActive 
//                         ? "text-gray-400 cursor-not-allowed" 
//                         : "text-gray-700 hover:bg-gray-50"
//                     }`}
//                   >
//                     ✅ Activate
//                   </button>
//                   <div className="border-t border-gray-200 my-1" />
//                   <button
//                     onClick={() => handleDeletePreset(preset)}
//                     className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                     Delete
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Discount Information */}
//         <div className="grid grid-cols-2 gap-3 mb-4">
//           <div className={`${typeConfig.bg} border ${typeConfig.border} p-3 rounded-lg`}>
//             <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">Discount Type</div>
//             <div className="font-semibold text-gray-900 capitalize mt-1">{preset.discountType}</div>
//           </div>
//           <div className={`${typeConfig.bg} border ${typeConfig.border} p-3 rounded-lg`}>
//             <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">
//               {preset.discountType === 'percentage' ? 'Discount %' : 
//                preset.discountType === 'fixed' ? 'Discount Amount' : 'Custom Offer'}
//             </div>
//             <div className="font-semibold text-gray-900 mt-1">{preset.discountAmount}</div>
//           </div>
//         </div>

//         {/* Key Metrics */}
//         <div className="grid grid-cols-3 gap-2 mb-4">
//           {[
//             { label: "Max Discount", value: preset.maxDiscount, icon: "📈" },
//             { label: "Min Purchase", value: preset.minPurchase, icon: "💰" },
//             { label: "Usage Limit", value: preset.usageLimit, icon: "🎯" },
//           ].map((item, idx) => (
//             item.value && (
//               <div key={idx} className="text-center p-2 bg-gray-50 rounded-lg">
//                 <div className="text-xs text-gray-600 mb-1">{item.icon}</div>
//                 <div className="text-xs font-medium text-gray-600">{item.label}</div>
//                 <div className="text-sm font-semibold text-gray-900">{item.value}</div>
//               </div>
//             )
//           ))}
//         </div>

//         {/* Validity Period */}
//         {preset.startAt && preset.expireAt && (
//           <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg mb-3">
//             <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
//               <Calendar className="w-4 h-4" />
//               Validity Period
//             </div>
//             <div className="text-xs text-gray-600 flex items-center gap-1">
//               <Clock className="w-3 h-3" />
//               {formatDateRange(preset.startAt, preset.expireAt)}
//             </div>
//           </div>
//         )}

//         {/* Conditions */}
//         {preset.conditions && preset.conditions.length > 0 && preset.conditions[0] !== "" && (
//           <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg mb-3">
//             <div className="text-sm font-medium text-gray-700 mb-2">Conditions</div>
//             <div className="space-y-1">
//               {preset.conditions.slice(0, 3).map((condition, idx) => (
//                 <div key={idx} className="flex items-start gap-2 text-xs text-gray-600">
//                   <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
//                   <span className="line-clamp-2">{condition}</span>
//                 </div>
//               ))}
//               {preset.conditions.length > 3 && (
//                 <div className="text-xs text-gray-500 mt-1">
//                   +{preset.conditions.length - 3} more conditions
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Footer */}
//         <div className="flex items-center justify-between pt-3 border-t border-gray-200">
//           <div className="text-xs text-gray-500">
//             Created: {preset?.createdAt ? new Date(preset.createdAt).toLocaleDateString() : "N/A"}
//           </div>
//         </div>
//       </div>

//       {/* Bottom Gradient */}
//       <div className={`absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t ${typeConfig.gradient}`} />
//     </div>
//   );
// };

// export default PresetCard;



// import React, { useRef } from "react";
// import { Tag, Gift, Crosshair, Calendar, Clock, CheckCircle, Trash2, SquarePen, MoreVertical } from "lucide-react";

// const PresetCard = ({
//   preset,
//   index,
//   openMenuIndex,
//   toggleMenu,
//   handleEditPreset,
//   handleDeletePreset,
//   handleToggleActive,
//   menuRefs,
//   showTypeBadge = false, // New prop to show type badge
// }) => {
//   const ref = useRef();

//   // Get offer type configuration
//   const getTypeConfig = (type) => {
//     const types = {
//       cross: {
//         icon: Crosshair,
//         label: 'Cross Promotion',
//         gradient: 'from-blue-500 to-white',
//         bg: 'bg-blue-50',
//         border: 'border-blue-200',
//         text: 'text-blue-700',
//         iconColor: 'bg-blue-500',
//         badgeColor: 'bg-blue-100 text-blue-800'
//       },
//       own: {
//         icon: Gift,
//         label: 'Own Promotion',
//         gradient: 'from-green-500 to-white',
//         bg: 'green-50',
//         border: 'border-green-200',
//         text: 'text-green-700',
//         iconColor: 'bg-green-500',
//         badgeColor: 'bg-green-100 text-green-800'
//       },
//       offer: {
//         icon: Tag,
//         label: 'Special Offer',
//         gradient: 'from-purple-500 to-white',
//         bg: 'purple-50',
//         border: 'border-purple-200',
//         text: 'text-purple-700',
//         iconColor: 'bg-purple-500',
//         badgeColor: 'bg-purple-100 text-purple-800'
//       }
//     };
    
//     return types[type] || types.offer;
//   };

//   const typeConfig = getTypeConfig(preset.type || "offer");
//   const TypeIcon = typeConfig.icon;

//   // Format date range for display
//   const formatDateRange = (startAt, expireAt) => {
//     if (!startAt || !expireAt) return "No validity period set";

//     const start = new Date(startAt);
//     const end = new Date(expireAt);

//     return `${start.toLocaleDateString()} ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleDateString()} ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
//   };

//   // Check if offer is currently active based on validity period
//   const isCurrentlyActive = (preset) => {
//     if (!preset.startAt || !preset.expireAt) return preset.isActive;

//     const now = new Date();
//     const start = new Date(preset.startAt);
//     const end = new Date(preset.expireAt);

//     return preset.isActive && now >= start && now <= end;
//   };

//   const currentlyActive = isCurrentlyActive(preset);

//   return (
//     <div className="relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden">
//       {/* Card Content */}
//       <div className="p-5 pb-16">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-3">
//             <div className={`p-2 rounded-lg ${typeConfig.iconColor}`}>
//               <TypeIcon className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
//                 {typeConfig.label}
//               </span>
//               <h3 className="text-gray-900 font-bold text-lg truncate max-w-[200px]">
//                 {preset.presetName}
//               </h3>
//               {/* Type Badge - Conditionally render */}
//               {showTypeBadge && (
//                 <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${typeConfig.badgeColor} mt-1`}>
//                   {preset.type || 'offer'}
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Status and Actions */}
//           <div className="flex items-center gap-2">
//             {preset.isActive && (
//               <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
//                 currentlyActive 
//                   ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
//                   : "bg-amber-100 text-amber-700 border border-amber-200"
//               }`}>
//                 {currentlyActive ? "🟢 Active" : "⏰ Scheduled"}
//               </span>
//             )}
            
//             {/* 3-dot Actions Menu */}
//             <div className="relative">
//               <button
//                 onClick={() => toggleMenu(index)}
//                 className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//                 aria-label="Options"
//               >
//                 <MoreVertical className="w-4 h-4" />
//               </button>

//               {openMenuIndex === index && (
//                 <div
//                   ref={(el) => (menuRefs.current[index] = el)}
//                   className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1"
//                 >
//                   <button
//                     onClick={() => handleEditPreset(preset)}
//                     className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
//                   >
//                     <SquarePen className="w-4 h-4 text-blue-500" />
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleToggleActive(preset)}
//                     disabled={preset.isActive}
//                     className={`flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors ${
//                       preset.isActive 
//                         ? "text-gray-400 cursor-not-allowed" 
//                         : "text-gray-700 hover:bg-gray-50"
//                     }`}
//                   >
//                     ✅ Activate
//                   </button>
//                   <div className="border-t border-gray-200 my-1" />
//                   <button
//                     onClick={() => handleDeletePreset(preset)}
//                     className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                     Delete
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Discount Information */}
//         <div className="grid grid-cols-2 gap-3 mb-4">
//           <div className={`${typeConfig.bg} border ${typeConfig.border} p-3 rounded-lg`}>
//             <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">Discount Type</div>
//             <div className="font-semibold text-gray-900 capitalize mt-1">{preset.discountType}</div>
//           </div>
//           <div className={`${typeConfig.bg} border ${typeConfig.border} p-3 rounded-lg`}>
//             <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">
//               {preset.discountType === 'percentage' ? 'Discount %' : 
//                preset.discountType === 'fixed' ? 'Discount Amount' : 'Custom Offer'}
//             </div>
//             <div className="font-semibold text-gray-900 mt-1">{preset.discountAmount}</div>
//           </div>
//         </div>

//         {/* Key Metrics */}
//         <div className="grid grid-cols-3 gap-2 mb-4">
//           {[
//             { label: "Max Discount", value: preset.maxDiscount, icon: "📈" },
//             { label: "Min Purchase", value: preset.minPurchase, icon: "💰" },
//             { label: "Usage Limit", value: preset.usageLimit, icon: "🎯" },
//           ].map((item, idx) => (
//             item.value && (
//               <div key={idx} className="text-center p-2 bg-gray-50 rounded-lg">
//                 <div className="text-xs text-gray-600 mb-1">{item.icon}</div>
//                 <div className="text-xs font-medium text-gray-600">{item.label}</div>
//                 <div className="text-sm font-semibold text-gray-900">{item.value}</div>
//               </div>
//             )
//           ))}
//         </div>

//         {/* Validity Period */}
//         {preset.startAt && preset.expireAt && (
//           <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg mb-3">
//             <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
//               <Calendar className="w-4 h-4" />
//               Validity Period
//             </div>
//             <div className="text-xs text-gray-600 flex items-center gap-1">
//               <Clock className="w-3 h-3" />
//               {formatDateRange(preset.startAt, preset.expireAt)}
//             </div>
//           </div>
//         )}

//         {/* Conditions */}
//         {preset.conditions && preset.conditions.length > 0 && preset.conditions[0] !== "" && (
//           <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg mb-3">
//             <div className="text-sm font-medium text-gray-700 mb-2">Conditions</div>
//             <div className="space-y-1">
//               {preset.conditions.slice(0, 3).map((condition, idx) => (
//                 <div key={idx} className="flex items-start gap-2 text-xs text-gray-600">
//                   <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
//                   <span className="line-clamp-2">{condition}</span>
//                 </div>
//               ))}
//               {preset.conditions.length > 3 && (
//                 <div className="text-xs text-gray-500 mt-1">
//                   +{preset.conditions.length - 3} more conditions
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Footer */}
//         <div className="flex items-center justify-between pt-3 border-t border-gray-200">
//           <div className="text-xs text-gray-500">
//             Created: {preset?.createdAt ? new Date(preset.createdAt).toLocaleDateString() : "N/A"}
//           </div>
//         </div>
//       </div>

//       {/* Bottom Gradient */}
//       <div className={`absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t ${typeConfig.gradient}`} />
//     </div>
//   );
// };

// export default PresetCard;



import React, { useRef } from "react";
import { Tag, Gift, Crosshair, Calendar, Clock, CheckCircle, Trash2, SquarePen, MoreVertical } from "lucide-react";

const PresetCard = ({
  preset,
  index,
  openMenuIndex,
  toggleMenu,
  handleEditPreset,
  handleDeletePreset,
  handleToggleActive,
  menuRefs,
  showTypeBadge = false,
}) => {
  const ref = useRef();

  // Get offer type configuration
  const getTypeConfig = (type) => {
    const types = {
      cross: {
        icon: Crosshair,
        label: 'Cross Promotion',
        gradient: 'from-blue-500 to-white',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
        iconColor: 'bg-blue-500',
        badgeColor: 'bg-blue-100 text-blue-800'
      },
      own: {
        icon: Gift,
        label: 'Own Promotion',
        gradient: 'from-green-500 to-white',
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-700',
        iconColor: 'bg-green-500',
        badgeColor: 'bg-green-100 text-green-800'
      },
      offer: {
        icon: Tag,
        label: 'Special Offer',
        gradient: 'from-purple-500 to-white',
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-700',
        iconColor: 'bg-purple-500',
        badgeColor: 'bg-purple-100 text-purple-800'
      }
    };
    
    return types[type] || types.offer;
  };

  const typeConfig = getTypeConfig(preset.type || "offer");
  const TypeIcon = typeConfig.icon;

  // Format date range for display
  const formatDateRange = (startAt, expireAt) => {
    if (!startAt || !expireAt) return "No validity period set";

    const start = new Date(startAt);
    const end = new Date(expireAt);

    return `${start.toLocaleDateString()} ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleDateString()} ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Check if offer is currently active based on validity period
  const isCurrentlyActive = (preset) => {
    if (!preset.startAt || !preset.expireAt) return preset.isActive;

    const now = new Date();
    const start = new Date(preset.startAt);
    const end = new Date(preset.expireAt);

    return preset.isActive && now >= start && now <= end;
  };

  const currentlyActive = isCurrentlyActive(preset);

  return (
    <div className="relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden flex flex-col h-full">
      {/* Card Content */}
      <div className="p-4 sm:p-5 pb-16 flex-1 flex flex-col">
        {/* Header - Stacked on small screens */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`p-2 rounded-lg ${typeConfig.iconColor} flex-shrink-0`}>
              <TypeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide block">
                {typeConfig.label}
              </span>
              <h3 className="text-base sm:text-lg text-gray-900 font-bold truncate">
                {preset.presetName}
              </h3>
              {/* Type Badge */}
              {showTypeBadge && (
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${typeConfig.badgeColor} mt-1`}>
                  {preset.type || 'offer'}
                </span>
              )}
            </div>
          </div>

          {/* Status and Actions - Better mobile layout */}
          <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0">
            {preset.isActive && (
              <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                currentlyActive 
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                  : "bg-amber-100 text-amber-700 border border-amber-200"
              }`}>
                {currentlyActive ? "🟢 Active" : "⏰ Scheduled"}
              </span>
            )}
            
            {/* 3-dot Actions Menu */}
            <div className="relative">
              <button
                onClick={() => toggleMenu(index)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {openMenuIndex === index && (
                <div
                  ref={(el) => (menuRefs.current[index] = el)}
                  className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1"
                >
                  <button
                    onClick={() => handleEditPreset(preset)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <SquarePen className="w-4 h-4 text-blue-500" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleActive(preset)}
                    disabled={preset.isActive}
                    className={`flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors ${
                      preset.isActive 
                        ? "text-gray-400 cursor-not-allowed" 
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    ✅ Activate
                  </button>
                  <div className="border-t border-gray-200 my-1" />
                  <button
                    onClick={() => handleDeletePreset(preset)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Discount Information */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className={`${typeConfig.bg} border ${typeConfig.border} p-2 sm:p-3 rounded-lg`}>
            <div className="text-xs font-medium text-gray-600 uppercase tracking-wide truncate">Discount Type</div>
            <div className="font-semibold text-sm sm:text-base text-gray-900 capitalize mt-1 truncate">{preset.discountType}</div>
          </div>
          <div className={`${typeConfig.bg} border ${typeConfig.border} p-2 sm:p-3 rounded-lg`}>
            <div className="text-xs font-medium text-gray-600 uppercase tracking-wide truncate">
              {preset.discountType === 'percentage' ? 'Discount %' : 
               preset.discountType === 'fixed' ? 'Discount Amount' : 'Custom Offer'}
            </div>
            <div className="font-semibold text-sm sm:text-base text-gray-900 mt-1 truncate">{preset.discountAmount}</div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          {[
            { label: "Max Discount", value: preset.maxDiscount, icon: "📈" },
            { label: "Min Purchase", value: preset.minPurchase, icon: "💰" },
            { label: "Usage Limit", value: preset.usageLimit, icon: "🎯" },
          ].map((item, idx) => (
            item.value && (
              <div key={idx} className="text-center p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">{item.icon}</div>
                <div className="text-xs font-medium text-gray-600 truncate">{item.label}</div>
                <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{item.value}</div>
              </div>
            )
          ))}
        </div>

        {/* Validity Period */}
        {preset.startAt && preset.expireAt && (
          <div className="bg-gray-50 border border-gray-200 p-2 sm:p-3 rounded-lg mb-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">Validity Period</span>
            </div>
            <div className="text-xs text-gray-600 flex items-start gap-1">
              <Clock className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span className="break-words">{formatDateRange(preset.startAt, preset.expireAt)}</span>
            </div>
          </div>
        )}

        {/* Conditions */}
        {preset.conditions && preset.conditions.length > 0 && preset.conditions[0] !== "" && (
          <div className="bg-gray-50 border border-gray-200 p-2 sm:p-3 rounded-lg mb-3">
            <div className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Conditions</div>
            <div className="space-y-1">
              {preset.conditions.slice(0, 3).map((condition, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                  <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2 break-words">{condition}</span>
                </div>
              ))}
              {preset.conditions.length > 3 && (
                <div className="text-xs text-gray-500 mt-1">
                  +{preset.conditions.length - 3} more conditions
                </div>
              )}
            </div>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 mt-auto">
          <div className="text-xs text-gray-500 truncate">
            Created: {preset?.createdAt ? new Date(preset.createdAt).toLocaleDateString() : "N/A"}
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className={`absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t ${typeConfig.gradient}`} />
    </div>
  );
};

export default PresetCard;
