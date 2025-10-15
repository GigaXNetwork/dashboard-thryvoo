// import { useState, useEffect, useRef } from "react";
// import { Search, Calendar, ExternalLink } from "lucide-react";
// import axios from "axios";
// import Cookies from "js-cookie";

// const CrossBrand = () => {
//   const [data, setData] = useState(null);
//   const [filteredPromotions, setFilteredPromotions] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [loadingSet, setLoadingSet] = useState(null);

//   // Filter states
//   const [search, setSearch] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [typeFilter, setTypeFilter] = useState('');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [quickDateFilter, setQuickDateFilter] = useState('');
//   const [fetchLoading, setFetchLoading] = useState(false);
//   const [searchLoading, setSearchLoading] = useState(false);

//   const token = Cookies.get("authToken");
//   const API_URL = import.meta.env.VITE_API_URL;

//   // Simple buildQuery function - send dates as YYYY-MM-DD
//   const buildQuery = (params) => {
//     const queryParams = new URLSearchParams();

//     Object.entries(params).forEach(([key, value]) => {
//       if (value !== '' && value !== undefined && value !== null) {
//         queryParams.append(key, value);
//       }
//     });

//     return queryParams.toString();
//   };

//   // Fetch cross brand data with filters
//   useEffect(() => {
//     const fetchCrossBrandData = async () => {
//       setFetchLoading(true);
//       setError(null);

//       try {
//         // Build query params object
//         const queryParams = {};
        
//         // Add search filter
//         if (search) {
//           queryParams.presetName = search.trim();
//         }
        
//         if (statusFilter !== '') {
//           queryParams.isActive = statusFilter === 'true';
//         }
        
//         if (typeFilter) {
//           queryParams.type = typeFilter;
//         }
        
//         if (startDate) {
//           queryParams['createdAt[gt]'] = startDate;
//         }
        
//         if (endDate) {
//           queryParams['createdAt[lt]'] = endDate;
//         }

//         const queryString = buildQuery(queryParams);
//         const url = `${API_URL}/api/cross-brand/store${queryString ? `?${queryString}` : ''}`;
        
//         const response = await axios.get(url, {
//           headers: { 'Authorization': `${token}` },
//           withCredentials: true,
//         });

//         const allPresets = response.data.data.crossBrand.flatMap((brand) =>
//           brand.presets.map((preset) => ({
//             ...preset,
//             brandInfo: brand.card,
//           }))
//         );

//         setData(response.data);
//         setFilteredPromotions(allPresets);
//       } catch (err) {
//         console.error("Failed to fetch cross brand data:", err);
//         setError("Failed to load promotions. Please try again later.");
//       } finally {
//         setIsLoading(false);
//         setFetchLoading(false);
//         setSearchLoading(false);
//       }
//     };

//     const timeout = setTimeout(() => {
//       fetchCrossBrandData();
//     }, 300);
    
//     return () => clearTimeout(timeout);
//   }, [API_URL, token, search, statusFilter, typeFilter, startDate, endDate]);

//   // Handle search with separate loading state
//   const handleSearchChange = (e) => {
//     setSearch(e.target.value);
//     if (e.target.value.trim()) {
//       setSearchLoading(true);
//     }
//   };

//   // Handle quick date filter changes - send simple date strings
//   const handleQuickDateFilterChange = (value) => {
//     setQuickDateFilter(value);
//     const today = new Date();
//     const todayStr = today.toISOString().split('T')[0];

//     switch (value) {
//       case 'today':
//         setStartDate(todayStr);
//         setEndDate(todayStr);
//         break;
//       case '7days':
//         const sevenDaysAgo = new Date(today);
//         sevenDaysAgo.setDate(today.getDate() - 7);
//         setStartDate(sevenDaysAgo.toISOString().split('T')[0]);
//         setEndDate(todayStr);
//         break;
//       case '15days':
//         const fifteenDaysAgo = new Date(today);
//         fifteenDaysAgo.setDate(today.getDate() - 15);
//         setStartDate(fifteenDaysAgo.toISOString().split('T')[0]);
//         setEndDate(todayStr);
//         break;
//       case '1month':
//         const oneMonthAgo = new Date(today);
//         oneMonthAgo.setMonth(today.getMonth() - 1);
//         setStartDate(oneMonthAgo.toISOString().split('T')[0]);
//         setEndDate(todayStr);
//         break;
//       default:
//         setStartDate('');
//         setEndDate('');
//         break;
//     }
//   };

//   // Clear all filters
//   const clearAllFilters = () => {
//     setSearch('');
//     setStatusFilter('');
//     setTypeFilter('');
//     setStartDate('');
//     setEndDate('');
//     setQuickDateFilter('');
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "No expiration";
//     const options = { year: "numeric", month: "short", day: "numeric" };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   const getDiscountText = (promotion) => {
//     if (promotion.discountType === "percentage") {
//       return `${promotion.discountAmount}% Off`;
//     } else if (promotion.discountType === "fixed") {
//       return `₹${promotion.discountAmount} Off`;
//     } else {
//       return promotion.discountAmount;
//     }
//   };

//   const getStatusBadge = (promotion) => {
//     const now = new Date();
//     const expireDate = promotion.expireAt ? new Date(promotion.expireAt) : null;

//     if (!promotion.isActive) {
//       return { text: "Inactive", color: "bg-red-100 text-red-700" };
//     }

//     if (expireDate && expireDate < now) {
//       return { text: "Expired", color: "bg-gray-100 text-gray-700" };
//     }

//     return { text: "Active", color: "bg-green-100 text-green-700" };
//   };

//   // Handle setting a coupon
//   const handleSetCoupon = async (presetId) => {
//     setLoadingSet(presetId);
//     try {
//       const response = await fetch(`${API_URL}/api/cross-brand/${presetId}/set`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `${token}`,
//         },
//         credentials: "include",
//       });

//       const result = await response.json();
//       console.log(result);
      
//       if (response.ok) {
//         alert("Coupon set successfully!");
//       } else {
//         alert("Failed to set coupon. Please try again.");
//       }
//     } catch (err) {
//       console.error("Failed to set coupon:", err);
//       alert("Failed to set coupon. Please try again.");
//     } finally {
//       setLoadingSet(null);
//     }
//   };

//   // Refresh function
//   const handleRefresh = () => {
//     setSearch(prev => prev + ' ');
//     setTimeout(() => setSearch(prev => prev.trim()), 100);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between mb-6 items-center flex-wrap gap-4">
//           <h1 className="text-3xl font-semibold text-gray-900">
//             Cross Brand Promotions
//           </h1>
//           <button
//             onClick={handleRefresh}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md shadow transition"
//           >
//             🔄 Refresh
//           </button>
//         </div>

//         {/* 🔍 Filter Section */}
//         <div className="bg-white rounded-2xl p-6 shadow-md space-y-6 mb-8">
//           {/* 🔍 Search Bar */}
//           <div className="relative mx-auto">
//             <input
//               type="text"
//               placeholder="Search by promotion name..."
//               value={search}
//               onChange={handleSearchChange}
//               className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 shadow-inner text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
//             />
//             <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
//             {/* Search loading indicator - only shows during search */}
//             {searchLoading && (
//               <div className="absolute right-4 top-3.5">
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//               </div>
//             )}
//           </div>

//           {/* 🔧 Filters */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
//             {/* Status Filter */}
//             <div className="relative">
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
//               >
//                 <option value="">All Statuses</option>
//                 <option value="true">Active</option>
//                 <option value="false">Inactive</option>
//               </select>
//               <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
//               </svg>
//             </div>

//             {/* Type Filter */}
//             <div className="relative">
//               <select
//                 value={typeFilter}
//                 onChange={(e) => setTypeFilter(e.target.value)}
//                 className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
//               >
//                 <option value="">All Types</option>
//                 <option value="cross">Cross Brand</option>
//                 <option value="own">Own Brand</option>
//                 <option value="offer">Offer</option>
//               </select>
//               <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
//               </svg>
//             </div>

//             {/* Start Date */}
//             <div className="relative">
//               <input
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => {
//                   setQuickDateFilter('');
//                   setStartDate(e.target.value);
//                 }}
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm shadow-inner focus:ring-2 focus:ring-blue-500 transition duration-200"
//               />
//             </div>

//             {/* End Date */}
//             <div className="relative">
//               <input
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => {
//                   setQuickDateFilter('');
//                   setEndDate(e.target.value);
//                 }}
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm shadow-inner focus:ring-2 focus:ring-blue-500 transition duration-200"
//               />
//             </div>

//             {/* Quick Filter Dropdown */}
//             <div className="relative">
//               <select
//                 value={quickDateFilter}
//                 onChange={(e) => handleQuickDateFilterChange(e.target.value)}
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
//               >
//                 <option value="">Custom / All Time</option>
//                 <option value="today">Today</option>
//                 <option value="7days">Last 7 Days</option>
//                 <option value="15days">Last 15 Days</option>
//                 <option value="1month">Last 1 Month</option>
//               </select>
//             </div>
//           </div>

//           {/* Clear Filters Button */}
//           {(search || statusFilter || typeFilter || startDate || endDate) && (
//             <div className="flex justify-end">
//               <button
//                 onClick={clearAllFilters}
//                 className="text-sm text-gray-600 hover:text-gray-800 underline transition duration-200"
//               >
//                 Clear all filters
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Global loading indicator */}
//         {fetchLoading && (
//           <div className="flex justify-center items-center py-4 mb-4">
//             <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
//             <span className="ml-2 text-gray-600">Loading promotions...</span>
//           </div>
//         )}

//         {/* Results count */}
//         {!isLoading && !fetchLoading && (
//           <div className="mb-4 text-sm text-gray-600">
//             Showing {filteredPromotions.length} promotions
//             {(search || statusFilter || typeFilter || startDate || endDate) && " (filtered)"}
//             {search && (
//               <span className="ml-1">for "{search}"</span>
//             )}
//           </div>
//         )}

//         {error && (
//           <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg mb-6">
//             {error}
//           </div>
//         )}

//         {isLoading ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[...Array(6)].map((_, i) => (
//               <div
//                 key={i}
//                 className="bg-white rounded-xl shadow-md h-52 animate-pulse"
//               />
//             ))}
//           </div>
//         ) : filteredPromotions.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredPromotions.map((promotion) => {
//               const status = getStatusBadge(promotion);

//               return (
//                 <div
//                   key={promotion._id}
//                   className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 border border-gray-100"
//                 >
//                   {/* Brand Info */}
//                   <div className="flex items-center gap-3 mb-4">
//                     {promotion.brandInfo.logo ? (
//                       <img
//                         src={promotion.brandInfo.logo}
//                         alt={promotion.brandInfo.name}
//                         className="w-12 h-12 rounded-full object-cover border"
//                       />
//                     ) : (
//                       <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium">
//                         {promotion.brandInfo.name?.charAt(0) || "B"}
//                       </div>
//                     )}
//                     <div>
//                       <h3 className="text-sm font-semibold text-gray-900">
//                         {promotion.brandInfo.name || "Unknown Brand"}
//                       </h3>
//                       <p className="text-xs text-gray-500 truncate max-w-[180px]">
//                         {promotion.brandInfo.address || "No address"}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Status */}
//                   <span
//                     className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}
//                   >
//                     {status.text}
//                   </span>

//                   {/* Promotion Title */}
//                   <h2 className="text-lg font-medium text-gray-900 mt-3 mb-1">
//                     {promotion.presetName}
//                   </h2>

//                   {/* Discount */}
//                   <p className="text-blue-600 font-semibold mb-3">
//                     {getDiscountText(promotion)}{" "}
//                     {promotion.maxDiscount && (
//                       <span className="text-gray-500 text-sm">
//                         (Upto ₹{promotion.maxDiscount})
//                       </span>
//                     )}
//                   </p>

//                   {/* Expiry */}
//                   <div className="flex items-center text-xs text-gray-500 mb-4">
//                     <Calendar className="h-3 w-3 mr-1" />
//                     Expires: {formatDate(promotion.expireAt)}
//                   </div>

//                   {/* Actions */}
//                   <div className="flex items-center justify-between">
//                     {promotion.link && (
//                       <a
//                         href={promotion.link}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 text-sm inline-flex items-center hover:underline"
//                       >
//                         <ExternalLink className="h-4 w-4 mr-1" />
//                         Visit Offer
//                       </a>
//                     )}
//                     <button
//                       onClick={() => handleSetCoupon(promotion._id)}
//                       disabled={loadingSet === promotion._id}
//                       className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm px-4 py-2 rounded-lg"
//                     >
//                       {loadingSet === promotion._id ? "Setting..." : "Set Coupon"}
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         ) : (
//           <div className="text-center text-gray-500 py-12">
//             {data?.data?.crossBrand?.length === 0 
//               ? "No promotions found." 
//               : "No promotions match your current filters."}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CrossBrand;




import { useState, useEffect, useRef } from "react";
import { Search, Calendar, ExternalLink, Plus } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import PresetForm from "../Coupon/presetForm"



const CrossBrand = () => {
  const [data, setData] = useState(null);
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingSet, setLoadingSet] = useState(null);

  // Filter states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [quickDateFilter, setQuickDateFilter] = useState('');
  const [fetchLoading, setFetchLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState('');

  const token = Cookies.get("authToken");
  const API_URL = import.meta.env.VITE_API_URL;

  // Form state for PresetForm
  const [form, setForm] = useState({
    discountType: 'percentage',
    presetName: '',
    discountAmount: '',
    maxDiscount: '',
    minPurchase: '',
    day: '',
    usageLimit: '',
    type: 'cross', // Always set to 'cross' for cross promotion
    conditions: [''],
    link: '',
    startAt: '',
    expireAt: ''
  });

  // Simple buildQuery function - send dates as YYYY-MM-DD
  const buildQuery = (params) => {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== '' && value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });

    return queryParams.toString();
  };

  // Fetch cross brand data with filters
  useEffect(() => {
    const fetchCrossBrandData = async () => {
      setFetchLoading(true);
      setError(null);

      try {
        // Build query params object
        const queryParams = {};
        
        // Add search filter
        if (search) {
          queryParams.presetName = search.trim();
        }
        
        if (statusFilter !== '') {
          queryParams.isActive = statusFilter === 'true';
        }
        
        if (typeFilter) {
          queryParams.type = typeFilter;
        }
        
        if (startDate) {
          queryParams['createdAt[gt]'] = startDate;
        }
        
        if (endDate) {
          queryParams['createdAt[lt]'] = endDate;
        }

        const queryString = buildQuery(queryParams);
        const url = `${API_URL}/api/cross-brand/store${queryString ? `?${queryString}` : ''}`;
        
        const response = await axios.get(url, {
          headers: { 'Authorization': `${token}` },
          withCredentials: true,
        });

        const allPresets = response.data.data.crossBrand.flatMap((brand) =>
          brand.presets.map((preset) => ({
            ...preset,
            brandInfo: brand.card,
          }))
        );

        setData(response.data);
        setFilteredPromotions(allPresets);
      } catch (err) {
        console.error("Failed to fetch cross brand data:", err);
        setError("Failed to load promotions. Please try again later.");
      } finally {
        setIsLoading(false);
        setFetchLoading(false);
        setSearchLoading(false);
      }
    };

    const timeout = setTimeout(() => {
      fetchCrossBrandData();
    }, 300);
    
    return () => clearTimeout(timeout);
  }, [API_URL, token, search, statusFilter, typeFilter, startDate, endDate]);

  // Handle form input changes for PresetForm
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission for creating cross promotion using PresetForm
  const handleCreateCrossPromotion = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormMessage('');

    const {
      discountType, presetName, discountAmount, maxDiscount,
      minPurchase, day, usageLimit, conditions, link, startAt, expireAt
    } = form;

    if (!presetName || !discountAmount) {
      setFormMessage('❌ Please fill in all required fields');
      setFormLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/user/setCoupon`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          discountType,
          presetName,
          discountAmount,
          maxDiscount: maxDiscount ? parseFloat(maxDiscount) : undefined,
          minPurchase: minPurchase ? parseFloat(minPurchase) : undefined,
          day: day ? parseInt(day) : undefined,
          usageLimit: usageLimit ? parseInt(usageLimit) : undefined,
          type: 'cross', // Force type to 'cross'
          conditions: conditions?.filter(cond => cond?.trim() !== '') || [],
          link,
          startAt,
          expireAt
        })
      });

      const data = await response.json();

      if (response.ok) {
        setFormMessage('✅ Cross promotion created successfully!');
        // Reset form
        resetForm();
        setShowForm(false);
        // Refresh the promotions list
        handleRefresh();
      } else {
        setFormMessage(data.message || '❌ Failed to create cross promotion.');
      }
    } catch (err) {
      console.error(err);
      setFormMessage('❌ Error creating cross promotion.');
    } finally {
      setFormLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setForm({
      discountType: 'percentage',
      presetName: '',
      discountAmount: '',
      maxDiscount: '',
      minPurchase: '',
      day: '',
      usageLimit: '',
      type: 'cross',
      conditions: [''],
      link: '',
      startAt: '',
      expireAt: ''
    });
    setFormMessage('');
  };

  // Handle search with separate loading state
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    if (e.target.value.trim()) {
      setSearchLoading(true);
    }
  };

  // Handle quick date filter changes - send simple date strings
  const handleQuickDateFilterChange = (value) => {
    setQuickDateFilter(value);
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    switch (value) {
      case 'today':
        setStartDate(todayStr);
        setEndDate(todayStr);
        break;
      case '7days':
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        setStartDate(sevenDaysAgo.toISOString().split('T')[0]);
        setEndDate(todayStr);
        break;
      case '15days':
        const fifteenDaysAgo = new Date(today);
        fifteenDaysAgo.setDate(today.getDate() - 15);
        setStartDate(fifteenDaysAgo.toISOString().split('T')[0]);
        setEndDate(todayStr);
        break;
      case '1month':
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(today.getMonth() - 1);
        setStartDate(oneMonthAgo.toISOString().split('T')[0]);
        setEndDate(todayStr);
        break;
      default:
        setStartDate('');
        setEndDate('');
        break;
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearch('');
    setStatusFilter('');
    setTypeFilter('');
    setStartDate('');
    setEndDate('');
    setQuickDateFilter('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No expiration";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getDiscountText = (promotion) => {
    if (promotion.discountType === "percentage") {
      return `${promotion.discountAmount}% Off`;
    } else if (promotion.discountType === "fixed") {
      return `₹${promotion.discountAmount} Off`;
    } else {
      return promotion.discountAmount;
    }
  };

  const getStatusBadge = (promotion) => {
    const now = new Date();
    const expireDate = promotion.expireAt ? new Date(promotion.expireAt) : null;

    if (!promotion.isActive) {
      return { text: "Inactive", color: "bg-red-100 text-red-700" };
    }

    if (expireDate && expireDate < now) {
      return { text: "Expired", color: "bg-gray-100 text-gray-700" };
    }

    return { text: "Active", color: "bg-green-100 text-green-700" };
  };

  // Handle setting a coupon
  const handleSetCoupon = async (presetId) => {
    setLoadingSet(presetId);
    try {
      const response = await fetch(`${API_URL}/api/cross-brand/${presetId}/set`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        credentials: "include",
      });

      const result = await response.json();
      console.log(result);
      
      if (response.ok) {
        alert("Coupon set successfully!");
      } else {
        alert("Failed to set coupon. Please try again.");
      }
    } catch (err) {
      console.error("Failed to set coupon:", err);
      alert("Failed to set coupon. Please try again.");
    } finally {
      setLoadingSet(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between mb-6 items-center flex-wrap gap-4">
          <h1 className="text-3xl font-semibold text-gray-900">
            Cross Brand Promotions
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md shadow transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Cross Promotion
            </button>
          </div>
        </div>

        {/* PresetForm Component */}
        <PresetForm
          showForm={showForm}
          setShowForm={setShowForm}
          form={form}
          handleChange={handleFormChange}
          handleSubmit={handleCreateCrossPromotion}
          resetForm={resetForm}
          loading={formLoading}
          isEditing={false}
          type="cross" // Force type to 'cross' - this will hide the type selection
          onClose={() => {
            setShowForm(false);
            resetForm();
          }}
        />

        {/* 🔍 Filter Section */}
        <div className="bg-white rounded-2xl p-6 shadow-md space-y-6 mb-8">
          {/* 🔍 Search Bar */}
          <div className="relative mx-auto">
            <input
              type="text"
              placeholder="Search by promotion name..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 shadow-inner text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
            />
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
            {/* Search loading indicator - only shows during search */}
            {searchLoading && (
              <div className="absolute right-4 top-3.5">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>

          {/* 🔧 Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
                <option value="">All Statuses</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>

            {/* Type Filter */}
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
                <option value="">All Types</option>
                <option value="cross">Cross Brand</option>
                <option value="own">Own Brand</option>
                <option value="offer">Offer</option>
              </select>
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>

            {/* Start Date */}
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setQuickDateFilter('');
                  setStartDate(e.target.value);
                }}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm shadow-inner focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>

            {/* End Date */}
            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setQuickDateFilter('');
                  setEndDate(e.target.value);
                }}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm shadow-inner focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>

            {/* Quick Filter Dropdown */}
            <div className="relative">
              <select
                value={quickDateFilter}
                onChange={(e) => handleQuickDateFilterChange(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
                <option value="">Custom / All Time</option>
                <option value="today">Today</option>
                <option value="7days">Last 7 Days</option>
                <option value="15days">Last 15 Days</option>
                <option value="1month">Last 1 Month</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(search || statusFilter || typeFilter || startDate || endDate) && (
            <div className="flex justify-end">
              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-600 hover:text-gray-800 underline transition duration-200"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Global loading indicator */}
        {fetchLoading && (
          <div className="flex justify-center items-center py-4 mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading promotions...</span>
          </div>
        )}

        {/* Results count */}
        {!isLoading && !fetchLoading && (
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredPromotions.length} promotions
            {(search || statusFilter || typeFilter || startDate || endDate) && " (filtered)"}
            {search && (
              <span className="ml-1">for "{search}"</span>
            )}
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md h-52 animate-pulse"
              />
            ))}
          </div>
        ) : filteredPromotions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPromotions.map((promotion) => {
              const status = getStatusBadge(promotion);

              return (
                <div
                  key={promotion._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 border border-gray-100"
                >
                  {/* Brand Info */}
                  <div className="flex items-center gap-3 mb-4">
                    {promotion.brandInfo.logo ? (
                      <img
                        src={promotion.brandInfo.logo}
                        alt={promotion.brandInfo.name}
                        className="w-12 h-12 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium">
                        {promotion.brandInfo.name?.charAt(0) || "B"}
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {promotion.brandInfo.name || "Unknown Brand"}
                      </h3>
                      <p className="text-xs text-gray-500 truncate max-w-[180px]">
                        {promotion.brandInfo.address || "No address"}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}
                  >
                    {status.text}
                  </span>

                  {/* Promotion Title */}
                  <h2 className="text-lg font-medium text-gray-900 mt-3 mb-1">
                    {promotion.presetName}
                  </h2>

                  {/* Discount */}
                  <p className="text-blue-600 font-semibold mb-3">
                    {getDiscountText(promotion)}{" "}
                    {promotion.maxDiscount && (
                      <span className="text-gray-500 text-sm">
                        (Upto ₹{promotion.maxDiscount})
                      </span>
                    )}
                  </p>

                  {/* Expiry */}
                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <Calendar className="h-3 w-3 mr-1" />
                    Expires: {formatDate(promotion.expireAt)}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    {promotion.link && (
                      <a
                        href={promotion.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm inline-flex items-center hover:underline"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Visit Offer
                      </a>
                    )}
                    <button
                      onClick={() => handleSetCoupon(promotion._id)}
                      disabled={loadingSet === promotion._id}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm px-4 py-2 rounded-lg"
                    >
                      {loadingSet === promotion._id ? "Setting..." : "Set Coupon"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12">
            {data?.data?.crossBrand?.length === 0 
              ? "No promotions found." 
              : "No promotions match your current filters."}
          </div>
        )}
      </div>
    </div>
  );
};

export default CrossBrand;