// // import React, { useRef } from "react";
// // import { Tag, Gift, Crosshair, Calendar, Clock, CheckCircle, Trash2, SquarePen } from "lucide-react";

// // const PresetCard = ({
// //   preset,
// //   index,
// //   openMenuIndex,
// //   toggleMenu,
// //   handleEditPreset,
// //   handleDeletePreset,
// //   setPresetToDelete,
// //   setShowDeleteModal,
// //   handleToggleActive,
// //   menuRefs,
// // }) => {
// //   const ref = useRef();

// //   // Get icon based on offer type
// //   const getTypeIcon = (type) => {
// //     switch (type) {
// //       case 'cross':
// //         return <Crosshair className="w-4 h-4 text-blue-500" />;
// //       case 'own':
// //         return <Gift className="w-4 h-4 text-green-500" />;
// //       case 'offer':
// //       default:
// //         return <Tag className="w-4 h-4 text-purple-500" />;
// //     }
// //   };

// //   // Get label based on offer type
// //   const getTypeLabel = (type) => {
// //     switch (type) {
// //       case 'cross':
// //         return 'Cross Promotion';
// //       case 'own':
// //         return 'Own Promotion';
// //       case 'offer':
// //       default:
// //         return 'Special Offer';
// //     }
// //   };

// //   // Format date range for display
// //   const formatDateRange = (startAt, expireAt) => {
// //     if (!startAt || !expireAt) return "No validity period set";

// //     const start = new Date(startAt);
// //     const end = new Date(expireAt);

// //     return `${start.toLocaleDateString()} ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleDateString()} ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
// //   };

// //   // Check if offer is currently active based on validity period
// //   const isCurrentlyActive = (preset) => {
// //     if (!preset.startAt || !preset.expireAt) return preset.isActive;

// //     const now = new Date();
// //     const start = new Date(preset.startAt);
// //     const end = new Date(preset.expireAt);

// //     return preset.isActive && now >= start && now <= end;
// //   };

// //   const currentlyActive = isCurrentlyActive(preset);

// //   return (
// //     <div
// //       key={index}
// //       className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200 shadow-md rounded-2xl p-6 transform hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
// //     >

// //       {/* Preset Content */}
// //       <div className="relative mb-5">
// //         <div className="flex flex-wrap items-center justify-between gap-2">
// //           <h3 className="flex items-center gap-2 text-xl font-bold text-indigo-600 tracking-wide border-b-2 pb-2 border-indigo-200 min-w-0">
// //             {getTypeIcon(preset.type || "offer")}
// //             <span className="truncate">{preset.presetName}</span>
// //           </h3>

// //           {/* Type Label */}
// //           <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full flex-shrink-0">
// //             {getTypeLabel(preset.type || "offer")}
// //           </span>

// //           {/* 3-dot menu */}
// //           <div className="flex-shrink-0 relative">
// //             <button
// //               onClick={() => toggleMenu(index)}
// //               className="text-gray-500 hover:text-gray-700"
// //               aria-label="Options"
// //             >
// //               <svg
// //                 xmlns="http://www.w3.org/2000/svg"
// //                 className="h-5 w-5"
// //                 fill="currentColor"
// //                 viewBox="0 0 20 20"
// //               >
// //                 <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
// //               </svg>
// //             </button>

// //             {openMenuIndex === index && (
// //               <div
// //                 ref={(el) => (menuRefs.current[index] = el)}
// //                 className="absolute right-0 mt-2 w-40 bg-white z-10 bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200 shadow-md rounded-xl px-2 py-2 transition-all duration-300"
// //               >
// //                 <button
// //                   onClick={() => handleEditPreset(preset)}
// //                   className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
// //                 >
// //                   <span className="flex items-center gap-2">
// //                     <SquarePen className="text-blue-500" size={16}/>
// //                     Edit
// //                   </span>
// //                 </button>
// //                 <button
// //                   onClick={() => handleDeletePreset(preset)}
// //                   className="w-full text-left px-3 py-2 rounded-md text-sm text-red-600 hover:bg-gray-100"
// //                 >
// //                   <span className="flex items-center gap-2">
// //                     <Trash2 className="text-red-500" size={16}/>
// //                     Delete
// //                   </span>
// //                 </button>
// //                 <button
// //                   onClick={() => handleToggleActive(preset)}
// //                   disabled={preset.isActive}
// //                   className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md ${preset.isActive
// //                       ? "text-gray-400 cursor-not-allowed"
// //                       : ""
// //                     }`}
// //                 >
// //                   ✅ Activate
// //                 </button>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       <div className="text-sm text-gray-700 space-y-2">
// //         {/* Discount Information */}
// //         <div className="grid grid-cols-2 gap-4 mb-3">
// //           <div className="bg-blue-50 p-3 rounded-lg">
// //             <div className="font-medium text-blue-700">Discount Type</div>
// //             <div className="capitalize text-blue-900">{preset.discountType}</div>
// //           </div>
// //           <div className="bg-green-50 p-3 rounded-lg">
// //             <div className="font-medium text-green-700">
// //               {preset.discountType === 'custom' ? 'Custom Offer' : preset.discountType === 'percentage' ? 'Discount %' : 'Discount Amount'}
// //             </div>
// //             <div className="text-green-900">{preset.discountAmount}</div>
// //           </div>
// //         </div>

// //         {/* Additional Details */}
// //         {[
// //           { label: "Max Discount", value: preset.maxDiscount || "N/A", bg: "bg-purple-50", text: "text-purple-700" },
// //           { label: "Min Purchase", value: preset.minPurchase || "N/A", bg: "bg-orange-50", text: "text-orange-700" },
// //           { label: "Usage Limit", value: preset.usageLimit || "N/A", bg: "bg-red-50", text: "text-red-700" },
// //         ].map((item, idx) => (
// //           item.value !== "N/A" && (
// //             <div key={idx} className={`flex items-center justify-between p-3 rounded-lg ${item.bg}`}>
// //               <span className={`font-medium ${item.text}`}>{item.label}:</span>
// //               <span className={item.text.replace('700', '900')}>{item.value}</span>
// //             </div>
// //           )
// //         ))}

// //         {/* Validity Period */}
// //         {preset.startAt && preset.expireAt && (
// //           <div className="bg-indigo-50 p-3 rounded-lg">
// //             <div className="font-medium text-indigo-700 flex items-center gap-2 mb-1">
// //               <Calendar className="w-4 h-4" />
// //               Validity Period
// //             </div>
// //             <div className="text-indigo-900 text-xs flex items-center gap-1">
// //               <Clock className="w-3 h-3" />
// //               {formatDateRange(preset.startAt, preset.expireAt)}
// //             </div>
// //           </div>
// //         )}

// //         {/* Conditions */}
// //         {preset.conditions && preset.conditions.length > 0 && preset.conditions[0] !== "" && (
// //           <div className="bg-gray-50 p-3 rounded-lg">
// //             <div className="font-medium text-gray-700 mb-1">Conditions</div>
// //             <div className="text-gray-900 text-xs space-y-1">
// //               {preset.conditions.map((condition, idx) => (
// //                 <div key={idx} className="flex items-start gap-1">
// //                   <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
// //                   <span>{condition}</span>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         )}

// //         {/* Link */}
// //         {preset.link && (
// //           <div className="bg-blue-50 p-3 rounded-lg">
// //             <div className="font-medium text-blue-700">Offer Link</div>
// //             <a
// //               href={preset.link}
// //               target="_blank"
// //               rel="noopener noreferrer"
// //               className="text-blue-900 text-xs underline truncate block"
// //             >
// //               {preset.link}
// //             </a>
// //           </div>
// //         )}

// //         {/* Created At */}
// //         <div className="flex items-center justify-between py-2 border-t border-gray-200 mt-2">
// //           <span className="font-medium text-gray-600">Created:</span>
// //           <span className="text-gray-500 text-xs">
// //             {preset?.createdAt ? new Date(preset.createdAt).toLocaleDateString() : "N/A"}
// //           </span>
// //         </div>
// //       </div>

// //       {/* Status Badges */}
// //       <div className="mt-4 flex justify-between items-center">
// //         {preset.isActive && (
// //           <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-sm ${currentlyActive
// //             ? "bg-emerald-100 text-emerald-700"
// //             : "bg-gray-100 text-gray-700"
// //             }`}>
// //             {currentlyActive ? "Currently Active" : "Scheduled"}
// //           </span>
// //         )}

// //         {preset.startAt && preset.expireAt && !currentlyActive && preset.isActive && (
// //           <span className="text-xs text-gray-500">
// //             {new Date() < new Date(preset.startAt) ? "Starts soon" : "Expired"}
// //           </span>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default PresetCard;



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
//         text: 'text-blue-700'
//       },
//       own: {
//         icon: Gift,
//         label: 'Own Promotion',
//         gradient: 'from-green-500 to-white',
//         bg: 'green-50',
//         border: 'border-green-200',
//         text: 'text-green-700'
//       },
//       offer: {
//         icon: Tag,
//         label: 'Special Offer',
//         gradient: 'from-purple-500 to-indigo-500',
//         bg: 'purple-50',
//         border: 'border-purple-200',
//         text: 'text-purple-700'
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
//     <div className="relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group">
//       {/* Offer Type Header */}
//       <div className={`bg-gradient-to-b ${typeConfig.gradient} rounded-t-xl p-4`}>
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
//               <TypeIcon className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <span className="text-sm font-semibold text-white/90 uppercase tracking-wide">
//                 {typeConfig.label}
//               </span>
//               <h3 className="text-white font-bold text-lg truncate max-w-[200px]">
//                 {preset.presetName}
//               </h3>
//             </div>
//           </div>

//           {/* Status Badge */}
//           <div className="text-right">
//             {preset.isActive && (
//               <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
//                 currentlyActive 
//                   ? "bg-emerald-500 text-white" 
//                   : "bg-white/20 text-white"
//               }`}>
//                 {currentlyActive ? "🟢 Active" : "⏰ Scheduled"}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Card Content */}
//       <div className="p-5">
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

//           {/* Action Menu */}
//           <div className="relative">
//             <button
//               onClick={() => toggleMenu(index)}
//               className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//               aria-label="Options"
//             >
//               <MoreVertical className="w-4 h-4" />
//             </button>

//             {openMenuIndex === index && (
//               <div
//                 ref={(el) => (menuRefs.current[index] = el)}
//                 className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1"
//               >
//                 <button
//                   onClick={() => handleEditPreset(preset)}
//                   className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
//                 >
//                   <SquarePen className="w-4 h-4 text-blue-500" />
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleToggleActive(preset)}
//                   disabled={preset.isActive}
//                   className={`flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors ${
//                     preset.isActive 
//                       ? "text-gray-400 cursor-not-allowed" 
//                       : "text-gray-700 hover:bg-gray-50"
//                   }`}
//                 >
//                   ✅ Activate
//                 </button>
//                 <div className="border-t border-gray-200 my-1" />
//                 <button
//                   onClick={() => handleDeletePreset(preset)}
//                   className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                   Delete
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
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
        iconColor: 'bg-blue-500'
      },
      own: {
        icon: Gift,
        label: 'Own Promotion',
        gradient: 'from-green-500 to-white',
        bg: 'green-50',
        border: 'border-green-200',
        text: 'text-green-700',
        iconColor: 'bg-green-500'
      },
      offer: {
        icon: Tag,
        label: 'Special Offer',
        gradient: 'from-purple-500 to-white',
        bg: 'purple-50',
        border: 'border-purple-200',
        text: 'text-purple-700',
        iconColor: 'bg-purple-500'
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
    <div className="relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden">
      {/* Card Content */}
      <div className="p-5 pb-16"> {/* Increased bottom padding to accommodate gradient */}
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${typeConfig.iconColor}`}>
              <TypeIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                {typeConfig.label}
              </span>
              <h3 className="text-gray-900 font-bold text-lg truncate max-w-[200px]">
                {preset.presetName}
              </h3>
            </div>
          </div>

          {/* Status and Actions */}
          <div className="flex items-center gap-2">
            {preset.isActive && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
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
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className={`${typeConfig.bg} border ${typeConfig.border} p-3 rounded-lg`}>
            <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">Discount Type</div>
            <div className="font-semibold text-gray-900 capitalize mt-1">{preset.discountType}</div>
          </div>
          <div className={`${typeConfig.bg} border ${typeConfig.border} p-3 rounded-lg`}>
            <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              {preset.discountType === 'percentage' ? 'Discount %' : 
               preset.discountType === 'fixed' ? 'Discount Amount' : 'Custom Offer'}
            </div>
            <div className="font-semibold text-gray-900 mt-1">{preset.discountAmount}</div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: "Max Discount", value: preset.maxDiscount, icon: "📈" },
            { label: "Min Purchase", value: preset.minPurchase, icon: "💰" },
            { label: "Usage Limit", value: preset.usageLimit, icon: "🎯" },
          ].map((item, idx) => (
            item.value && (
              <div key={idx} className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">{item.icon}</div>
                <div className="text-xs font-medium text-gray-600">{item.label}</div>
                <div className="text-sm font-semibold text-gray-900">{item.value}</div>
              </div>
            )
          ))}
        </div>

        {/* Validity Period */}
        {preset.startAt && preset.expireAt && (
          <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg mb-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4" />
              Validity Period
            </div>
            <div className="text-xs text-gray-600 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDateRange(preset.startAt, preset.expireAt)}
            </div>
          </div>
        )}

        {/* Conditions */}
        {preset.conditions && preset.conditions.length > 0 && preset.conditions[0] !== "" && (
          <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg mb-3">
            <div className="text-sm font-medium text-gray-700 mb-2">Conditions</div>
            <div className="space-y-1">
              {preset.conditions.slice(0, 3).map((condition, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                  <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{condition}</span>
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

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500">
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