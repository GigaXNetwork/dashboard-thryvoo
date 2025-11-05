// // // components/SpecialOffer/SpecialOfferList.jsx
// // import React from "react";
// // import { Trash2, Plus, Tag } from "lucide-react";

// // const SpecialOfferList = ({ items, openModal, onRemoveItem, error }) => {
// //   return (
// //     <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
// //       {/* Header */}
// //       <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-green-200">
// //         <div className="flex items-center justify-between">
// //           <div className="flex items-center gap-3">
// //             <Tag className="w-6 h-6 text-green-600" />
// //             <h2 className="text-xl font-bold text-gray-800">Special Offer Items</h2>
// //             <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
// //               {items.length} {items.length === 1 ? 'Item' : 'Items'}
// //             </span>
// //           </div>
// //           <button
// //             onClick={openModal}
// //             className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-md"
// //           >
// //             <Plus className="w-4 h-4" />
// //             Add Item
// //           </button>
// //         </div>
// //       </div>

// //       {/* Error Message */}
// //       {error && (
// //         <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-6 mt-4 rounded">
// //           <div className="flex">
// //             <div className="flex-shrink-0">
// //               <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
// //                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
// //               </svg>
// //             </div>
// //             <div className="ml-3">
// //               <p className="text-sm text-red-700">{error}</p>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Items Grid */}
// //       <div className="p-6">
// //         {items.length === 0 ? (
// //           <div className="text-center py-12">
// //             <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
// //             <h3 className="text-lg font-semibold text-gray-600 mb-2">No Items Added</h3>
// //             <p className="text-gray-500 mb-6">Add items to your special offer to get started.</p>
// //             <button
// //               onClick={openModal}
// //               className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
// //             >
// //               Add Your First Item
// //             </button>
// //           </div>
// //         ) : (
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //             {items.map((item) => (
// //               <div
// //                 key={item._id}
// //                 className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300 group"
// //               >
// //                 <div className="flex items-start justify-between mb-3">
// //                   <div className="flex-1">
// //                     <h3 className="font-semibold text-gray-800 text-lg mb-1 line-clamp-2">
// //                       {item.presetName || "Untitled Item"}
// //                     </h3>
// //                     {item.description && (
// //                       <p className="text-gray-600 text-sm line-clamp-2">
// //                         {item.description}
// //                       </p>
// //                     )}
// //                   </div>
// //                   <button
// //                     onClick={() => onRemoveItem(item._id)}
// //                     className="ml-3 p-2 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
// //                     title="Remove from special offer"
// //                   >
// //                     <Trash2 className="w-4 h-4" />
// //                   </button>
// //                 </div>

// //                 {/* Item details */}
// //                 <div className="flex items-center justify-between text-sm text-gray-500 mt-4 pt-3 border-t border-gray-100">
// //                   <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
// //                     Special Offer
// //                   </span>
// //                   {item.price && (
// //                     <span className="font-medium text-gray-700">
// //                       ${item.price}
// //                     </span>
// //                   )}
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default SpecialOfferList;




// // components/SpecialOffer/SpecialOfferList.jsx
// import React, { useState } from "react";
// import { Trash2, Plus, Tag, Calendar, Users, DollarSign, Percent, Clock, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

// const SpecialOfferList = ({ items, openModal, onRemoveItem, error }) => {
//   const [expandedItem, setExpandedItem] = useState(null);

//   const toggleExpand = (itemId) => {
//     setExpandedItem(expandedItem === itemId ? null : itemId);
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const getDiscountText = (item) => {
//     if (item.discountType === 'percentage') {
//       return `${item.discountAmount}% OFF`;
//     } else if (item.discountType === 'fixed') {
//       return `₹${item.discountAmount} OFF`;
//     } else if (item.discountType === 'custom') {
//       return item.discountAmount;
//     }
//     return 'No Discount';
//   };

//   const getStatusBadge = (item) => {
//     const isExpired = new Date(item.expireAt) < new Date();
//     if (isExpired) {
//       return { text: 'Expired', color: 'bg-red-100 text-red-800 border-red-200' };
//     }
//     return item.isActive 
//       ? { text: 'Active', color: 'bg-green-100 text-green-800 border-green-200' }
//       : { text: 'Inactive', color: 'bg-gray-100 text-gray-800 border-gray-200' };
//   };

//   const getTypeBadge = (item) => {
//     return item.type === 'cross' 
//       ? { text: 'Cross Brand', color: 'bg-blue-100 text-blue-800 border-blue-200' }
//       : { text: 'Own Brand', color: 'bg-blue-100 text-blue-800 border-blue-200' };
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-green-200">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <Tag className="w-6 h-6 text-green-600" />
//             <h2 className="text-xl font-bold text-gray-800">Special Offer Coupons</h2>
//             <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
//               {items.length} {items.length === 1 ? 'Coupon' : 'Coupons'}
//             </span>
//           </div>
//           <button
//             onClick={openModal}
//             className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-md"
//           >
//             <Plus className="w-4 h-4" />
//             Add Coupon
//           </button>
//         </div>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-6 mt-4 rounded">
//           <div className="flex">
//             <div className="flex-shrink-0">
//               <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <div className="ml-3">
//               <p className="text-sm text-red-700">{error}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Items Grid */}
//       <div className="p-6">
//         {items.length === 0 ? (
//           <div className="text-center py-12">
//             <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold text-gray-600 mb-2">No Coupons Added</h3>
//             <p className="text-gray-500 mb-6">Add coupon presets to your special offer to get started.</p>
//             <button
//               onClick={openModal}
//               className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
//             >
//               Add Your First Coupon
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//             {items.map((item) => {
//               const status = getStatusBadge(item);
//               const type = getTypeBadge(item);
//               const isExpanded = expandedItem === item._id;

//               return (
//                 <div
//                   key={item._id}
//                   className="bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 overflow-hidden"
//                 >
//                   {/* Card Header - Fixed Height */}
//                   <div className="p-5">
//                     <div className="flex items-start justify-between mb-3">
//                       <div className="flex-1 min-w-0">
//                         <h3 className="font-bold text-gray-800 text-lg truncate mb-2">
//                           {item.presetName}
//                         </h3>
//                         <div className="flex flex-wrap gap-2 mb-3">
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium border ${status.color}`}>
//                             {status.text}
//                           </span>
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium border ${type.color}`}>
//                             {type.text}
//                           </span>
//                         </div>
//                       </div>
//                       <button
//                         onClick={() => onRemoveItem(item._id)}
//                         className="ml-2 p-2 text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
//                         title="Remove from special offer"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>

//                     {/* Main Discount Info */}
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded-lg">
//                         {item.discountType === 'percentage' ? (
//                           <Percent className="w-4 h-4" />
//                         ) : (
//                           <DollarSign className="w-4 h-4" />
//                         )}
//                         <span className="font-bold text-sm">{getDiscountText(item)}</span>
//                       </div>

//                       {/* Expand Button */}
//                       <button
//                         onClick={() => toggleExpand(item._id)}
//                         className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
//                       >
//                         {isExpanded ? (
//                           <ChevronUp className="w-4 h-4" />
//                         ) : (
//                           <ChevronDown className="w-4 h-4" />
//                         )}
//                       </button>
//                     </div>

//                     {/* Quick Info Bar */}
//                     <div className="flex items-center justify-between text-xs text-gray-500">
//                       <div className="flex items-center gap-1">
//                         <Calendar className="w-3 h-3" />
//                         <span>{formatDate(item.expireAt)}</span>
//                       </div>
//                       {item.minPurchase && (
//                         <div className="flex items-center gap-1">
//                           <DollarSign className="w-3 h-3" />
//                           <span>₹{item.minPurchase}+</span>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Accordion Content */}
//                   <div className={`
//                     border-t border-gray-100 transition-all duration-300 overflow-hidden
//                     ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
//                   `}>
//                     <div className="p-5 bg-gray-50">
//                       {/* Detailed Information */}
//                       <div className="space-y-3 text-sm">
//                         {/* Discount Details */}
//                         <div className="grid grid-cols-2 gap-4">
//                           <div>
//                             <span className="text-gray-500">Discount Type:</span>
//                             <p className="font-medium capitalize">{item.discountType}</p>
//                           </div>
//                           {item.maxDiscount && item.discountType === 'percentage' && (
//                             <div>
//                               <span className="text-gray-500">Max Discount:</span>
//                               <p className="font-medium">₹{item.maxDiscount}</p>
//                             </div>
//                           )}
//                         </div>

//                         {/* Usage Limits */}
//                         <div className="grid grid-cols-2 gap-4">
//                           {item.usageLimit && (
//                             <div className="flex items-center gap-2">
//                               <Users className="w-4 h-4 text-gray-400" />
//                               <div>
//                                 <span className="text-gray-500">Usage Limit:</span>
//                                 <p className="font-medium">{item.usageLimit} time{item.usageLimit !== 1 ? 's' : ''}</p>
//                               </div>
//                             </div>
//                           )}
//                           {item.day && (
//                             <div className="flex items-center gap-2">
//                               <Clock className="w-4 h-4 text-gray-400" />
//                               <div>
//                                 <span className="text-gray-500">Duration:</span>
//                                 <p className="font-medium">{item.day} day{item.day !== 1 ? 's' : ''}</p>
//                               </div>
//                             </div>
//                           )}
//                         </div>

//                         {/* Conditions */}
//                         {item.conditions && item.conditions.length > 0 && item.conditions[0] !== "" && (
//                           <div>
//                             <span className="text-gray-500 block mb-1">Conditions:</span>
//                             <ul className="space-y-1">
//                               {item.conditions.map((condition, index) => (
//                                 condition && (
//                                   <li key={index} className="flex items-start gap-2 text-xs">
//                                     <span className="text-green-500 mt-1">•</span>
//                                     <span className="flex-1">{condition}</span>
//                                   </li>
//                                 )
//                               ))}
//                             </ul>
//                           </div>
//                         )}

//                         {/* Cross Brand Link */}
//                         {item.type === 'cross' && item.link && (
//                           <div className="pt-2">
//                             <a 
//                               href={item.link} 
//                               target="_blank" 
//                               rel="noopener noreferrer"
//                               className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium bg-blue-50 px-3 py-2 rounded-lg transition-colors"
//                             >
//                               <ExternalLink className="w-4 h-4" />
//                               <span>View Brand Website</span>
//                             </a>
//                           </div>
//                         )}

//                         {/* Created Date */}
//                         <div className="pt-2 border-t border-gray-200">
//                           <span className="text-gray-500 text-xs">Created: {formatDate(item.createdAt)}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SpecialOfferList;



// components/SpecialOffer/SpecialOfferList.jsx
import React, { useState } from "react";
import { Trash2, Plus, Tag, Calendar, ShoppingCart, RefreshCw, User, Clock, CheckCircle, Percent, DollarSign, ExternalLink } from "lucide-react";

const SpecialOfferList = ({ items, openModal, onRemoveItem, error }) => {
    const [flippedCard, setFlippedCard] = useState(null);

    const toggleFlip = (itemId) => {
        setFlippedCard(flippedCard === itemId ? null : itemId);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDiscountText = (item) => {
        if (item.discountType === 'percentage') {
            return `${item.discountAmount}% OFF`;
        } else if (item.discountType === 'fixed') {
            return `₹${item.discountAmount} OFF`;
        } else if (item.discountType === 'custom') {
            return `${item.discountAmount} OFF`;
        }
        return 'No Discount';
    };

    const getDiscountTypeText = (item) => {
        if (item.discountType === 'percentage') return 'Percentage Discount';
        if (item.discountType === 'fixed') return 'Fixed Amount';
        if (item.discountType === 'custom') return 'Custom Discount';
        return 'Discount';
    };

    const getStatusBadge = (item) => {
        const isExpired = (item.expireAt && new Date(item.expireAt) < new Date());
        if (isExpired) {
            return { text: 'Expired', color: 'bg-red-100' };
        }
        return item.isActive
            ? { text: 'Active', color: 'bg-green-500' }
            : { text: 'Inactive', color: 'bg-gray-500' };
    };

    const getTypeBadge = (item) => {
        return item.type === 'cross'
            ? { text: 'Cross Brand', color: 'bg-blue-500' }
            : { text: 'Own Brand', color: 'bg-blue-500' };
    };

    const getDiscountIcon = (item) => {
        if (item.discountType === 'percentage') return <Percent className="w-5 h-5" />;
        if (item.discountType === 'fixed') return <DollarSign className="w-5 h-5" />;
        return <Tag className="w-5 h-5" />;
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Tag className="w-6 h-6" />
                        <h2 className="text-xl font-bold">Special Offer Coupons</h2>
                        <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {items.length} {items.length === 1 ? 'Coupon' : 'Coupons'}
                        </span>
                    </div>
                    <button
                        onClick={openModal}
                        className="flex items-center gap-2 text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-4 py-2 rounded-lg transition-colors shadow-md font-semibold"
                    >
                        <Plus className="w-4 h-4" />
                        Add Coupon
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-6 mt-4 rounded">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Items Grid */}
            <div className="p-6 min-h-screen">
                {items.length === 0 ? (
                    <div className="text-center py-12">
                        <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Coupons Added</h3>
                        <p className="text-gray-500 mb-6">Add coupon presets to your special offer to get started.</p>
                        <button
                            onClick={openModal}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Add Your First Coupon
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {items.map((item) => {
                            const status = getStatusBadge(item);
                            const type = getTypeBadge(item);
                            const isFlipped = flippedCard === item._id;

                            return (
                                <div key={item._id} className="w-full perspective-1000">
                                    {/* Flip Card Container */}
                                    <div
                                        className={`relative w-full h-96 transition-transform duration-700 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''
                                            }`}
                                        onClick={() => toggleFlip(item._id)}
                                        style={{ transformStyle: 'preserve-3d' }}
                                    >
                                        {/* Front Face */}
                                        <div
                                            className="absolute w-full h-full backface-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-5 flex flex-col border-2"
                                            style={{ backfaceVisibility: 'hidden' }}
                                        >

                                            <div className="text-center mb-4 pb-4 border-b-2">
                                                <div className="flex items-center gap-2">
                                                    <h2 className="text-lg font-bold text-gray-600 mb-1 truncate">
                                                        {item.presetName}
                                                    </h2>

                                                    <span className={`${status.color} ${status.text === "Expired" ? "text-red-600" : "text-white"} px-2 py-1 rounded-md text-xs uppercase`}>
                                                        {status.text}
                                                    </span>
                                                    <span className={`${type.color} text-white px-2 py-1 rounded-full text-xs uppercase`}>
                                                        {type.text}
                                                    </span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onRemoveItem(item._id);
                                                        }}
                                                        className="ml-auto right-3 p-2 text-gray-400 hover:text-red-600 transition-colors z-10"
                                                        title="Remove from special offer"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Main Discount */}
                                            <div className="bg-gradient-to-br from-blue-500 to-indigo-700 text-white p-2 rounded-xl shadow-lg mb-2">
                                                <div className="flex items-center justify-center gap-2 mb-1">
                                                    <div className="text-md font-bold">{getDiscountText(item)}</div>
                                                </div>
                                            </div>

                                            {/* Quick Info */}
                                            <div className="space-y-2 flex-1">
                                                {item.minPurchase && (
                                                    <div className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg">
                                                        <span className="text-xs text-gray-500 uppercase tracking-wide font-medium flex items-center gap-2">
                                                            <ShoppingCart size={14} />
                                                            Min Purchase
                                                        </span>
                                                        <span className="text-base text-gray-800">₹{item.minPurchase}</span>
                                                    </div>
                                                )}

                                                {item.day && (
                                                    <div className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg">
                                                        <span className="text-xs text-gray-500 uppercase tracking-wide font-medium flex items-center gap-2">
                                                            <Calendar size={14} />
                                                            Valid for
                                                        </span>
                                                        <span className="text-base text-gray-800">{item.day} Day{item.day !== 1 ? 's' : ''}</span>
                                                    </div>
                                                )}

                                                {item.usageLimit && (
                                                    <div className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg">
                                                        <span className="text-xs text-gray-500 uppercase tracking-wide font-medium flex items-center gap-2">
                                                            <Tag size={14} />
                                                            Usage Limit
                                                        </span>
                                                        <span className="text-base text-gray-800">{item.usageLimit} Time{item.usageLimit !== 1 ? 's' : ''}</span>
                                                    </div>
                                                )}

                                                <div className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg">
                                                    <span className="text-xs text-gray-500 uppercase tracking-wide font-medium flex items-center gap-2">
                                                        <CheckCircle size={14} />
                                                        Expires
                                                    </span>
                                                    <span className="text-sm text-gray-800">{formatDate(item.expireAt)}</span>
                                                </div>
                                            </div>

                                            {/* Flip Hint */}
                                            <div className="text-center mt-3 pt-3 text-xs text-gray-400 flex items-center justify-center gap-2 border-t border-gray-200">
                                                <span>Click to see more details</span>
                                                <RefreshCw size={14} className="animate-spin" style={{ animationDuration: '3s' }} />
                                            </div>
                                        </div>

                                        {/* Back Face */}
                                        <div
                                            className="absolute w-full h-full backface-hidden bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 flex flex-col text-white"
                                            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                                        >

                                            <div className="space-y-3 flex-1 text-sm overflow-y-auto">
                                                {/* ID Section */}
                                                <div>
                                                    <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Coupon ID</div>
                                                    <div className="bg-gray-700 px-3 py-2 rounded-lg text-xs break-all font-mono">{item._id}</div>
                                                </div>

                                                {/* User ID */}
                                                <div>
                                                    <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1 flex items-center gap-1">
                                                        <User size={12} /> User ID
                                                    </div>
                                                    <div className="bg-gray-700 px-3 py-2 rounded-lg text-xs break-all font-mono">{item.user}</div>
                                                </div>

                                                {/* Discount Details */}
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Discount Type</div>
                                                        <div className="bg-gray-700 px-3 py-2 rounded-lg text-xs capitalize">{item.discountType}</div>
                                                    </div>
                                                    {item.maxDiscount && (
                                                        <div>
                                                            <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Max Discount</div>
                                                            <div className="bg-gray-700 px-3 py-2 rounded-lg text-xs">₹{item.maxDiscount}</div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Dates */}
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1 flex items-center gap-1">
                                                            <Clock size={12} /> Expires
                                                        </div>
                                                        <div className="bg-gray-700 px-3 py-2 rounded-lg text-xs">{formatDate(item.expireAt)}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Type</div>
                                                        <div className="bg-gray-700 px-3 py-2 rounded-lg text-xs capitalize">{item.type}</div>
                                                    </div>
                                                </div>

                                                {/* Creation Dates */}
                                                <div>
                                                    <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1 flex items-center gap-1">
                                                        <Calendar size={12} /> Created
                                                    </div>
                                                    <div className="bg-gray-700 px-3 py-2 rounded-lg text-xs">{formatDateTime(item.createdAt)}</div>
                                                </div>

                                                <div>
                                                    <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Last Updated</div>
                                                    <div className="bg-gray-700 px-3 py-2 rounded-lg text-xs">{formatDateTime(item.updatedAt)}</div>
                                                </div>

                                                {/* Conditions */}
                                                {item.conditions && item.conditions.length > 0 && item.conditions[0] !== "" && (
                                                    <div>
                                                        <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Conditions</div>
                                                        <div className="bg-gray-700 px-3 py-2 rounded-lg text-xs max-h-20 overflow-y-auto">
                                                            {item.conditions.map((condition, index) => (
                                                                condition && <div key={index} className="mb-1 last:mb-0">• {condition}</div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Cross Brand Link */}
                                                {item.type === 'cross' && item.link && (
                                                    <div className="pt-2">
                                                        <a
                                                            href={item.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 justify-center bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <ExternalLink size={14} />
                                                            Visit Brand Website
                                                        </a>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Back Hint */}
                                            <div className="text-center mt-3 pt-3 text-xs text-gray-500 flex items-center justify-center gap-2 border-t border-gray-700">
                                                <span>Click to go back</span>
                                                <RefreshCw size={14} className="animate-spin" style={{ animationDuration: '3s' }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* CSS for flip animation */}
            <style>{`
                .perspective-1000 {
                perspective: 1000px;
                }
                .transform-style-3d {
                transform-style: preserve-3d;
                }
                .backface-hidden {
                backface-visibility: hidden;
                }
                .rotate-y-180 {
                transform: rotateY(180deg);
                }
            `}</style>
        </div>
    );
};

export default SpecialOfferList;