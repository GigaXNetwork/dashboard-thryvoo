// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { NavLink, useParams } from 'react-router';
// import CouponDetails from './CouponDetails';
// import MessagePopup from '../Common/MessagePopup';
// import { useUser } from '../../Context/ContextApt';
// import Cookies from "js-cookie"

// function Coupon() {
//   const [search, setSearch] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [coupons, setCoupons] = useState([]);
//   const [totalPages, setTotalPages] = useState(1);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [message, setMessage] = useState('');
//   const [messageType, setMessageType] = useState('success');
//   const [showReviewCard, setShowReviewCard] = useState({});
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [selectedCoupon, setSelectedCoupon] = useState(null);

//   const [quickDateFilter, setQuickDateFilter] = useState('');


//   const itemsPerPage = 10;
//   const { userId } = useParams();

//   const { userData } = useUser();
//   const user = userData.user.role;
//   const token = Cookies.get("authToken")

//   const apiUrl = user === "admin"
//     ? `${import.meta.env.VITE_API_URL}/api/admin/coupons?user=${userId}`
//     : `${import.meta.env.VITE_API_URL}/api/user/mycoupons`;

//   useEffect(() => {
//     const fetchCoupons = async () => {
//       try {
//         const params = {
//           page: currentPage,
//           limit: itemsPerPage,
//           ...(search && { code: search.trim() }),
//           ...(statusFilter && { status: statusFilter }),
//           ...(startDate && { 'createdAt[gt]': startDate }), // Greater than filter
//           ...(endDate && { 'createdAt[lt]': endDate }), // Less than filter
//         };

//         const res = await axios.get(apiUrl, {
//           params,
//           withCredentials: true,
//           headers: { 
//             'Content-Type': 'application/json',
//             'Authorization': `${token}`
//           }
//         });

//         setCoupons(res.data.data.coupons || []);
//         setTotalPages(Math.ceil(res.data.results / itemsPerPage));
//       } catch (error) {
//         console.error('Error fetching coupons:', error);
//       }
//     };

//     const timeout = setTimeout(fetchCoupons, 300);
//     return () => clearTimeout(timeout);
//   }, [search, statusFilter, currentPage, startDate, endDate]);

//   const handleRedeemClick = (coupon) => {
//     setSelectedCoupon(coupon);
//     setDialogOpen(true);
//   };

//   const handleConfirmRedeem = async () => {
//     if (!selectedCoupon) return;

//     try {
//       await axios.patch(
//         `${import.meta.env.VITE_API_URL}/api/coupon/${selectedCoupon._id}/redeem`,
//         {},
//         { withCredentials: true }
//       );
//       setMessage('✅ Coupon redeemed successfully!');
//       setMessageType('success');
//       setSearch(""); // trigger refetch
//     } catch (error) {
//       console.error("Error redeeming coupon:", error);
//       setMessage('❌ Failed to redeem coupon.');
//       setMessageType('error');
//     }

//     setDialogOpen(false);
//     setSelectedCoupon(null);
//   };

//   const handleCancel = () => {
//     setDialogOpen(false);
//     setSelectedCoupon(null);
//   };

//   const getPaginationRange = () => {
//     const delta = 1;
//     let left = currentPage - delta;
//     let right = currentPage + delta;

//     if (left < 2) {
//       right += 2 - left;
//       left = 2;
//     }

//     if (right > totalPages - 1) {
//       left -= right - (totalPages - 1);
//       right = totalPages - 1;
//     }

//     left = Math.max(left, 2);

//     const range = [1];
//     if (left > 2) range.push('...');
//     for (let i = left; i <= right; i++) range.push(i);
//     if (right < totalPages - 1) range.push('...');
//     if (totalPages > 1) range.push(totalPages);
//     return range;
//   };

//   const handleQuickDateFilterChange = (value) => {
//     setQuickDateFilter(value);

//     const today = new Date();
//     let start = '';
//     let end = today.toISOString().split('T')[0]; // format: yyyy-mm-dd

//     switch (value) {
//       case 'today':
//         start = end;
//         break;
//       case '7days':
//         start = new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0];
//         break;
//       case '15days':
//         start = new Date(today.setDate(today.getDate() - 15)).toISOString().split('T')[0];
//         break;
//       case '1month':
//         start = new Date(today.setMonth(today.getMonth() - 1)).toISOString().split('T')[0];
//         break;
//       default:
//         start = '';
//         end = '';
//     }

//     setStartDate(start);
//     setEndDate(end);
//   };


//   const tableHeaders = ["Sl. No", "Code", "Name", "Status", "Expiration Date", "View Details", "Manage"];

//   return (
//     <div className="p-6">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//         {/* Title */}
//         <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
//           🎟️ Coupon Management
//         </h1>

//         {/* Action Button */}
//         <NavLink
//           to={user === "admin" ? `/user/${userId}/presets` : "/presets"}
//           className="inline-flex items-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-200"
//         >
//           <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
//           </svg>
//           Coupons
//         </NavLink>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-2xl p-6 shadow-md space-y-6 mb-5">

//         {/* 🔍 Search Bar */}
//         <div className="relative  mx-auto">
//           <input
//             type="text"
//             placeholder="Search by code..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 shadow-inner text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
//           />
//           <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
//           </svg>
//         </div>

//         {/* 🔧 Filters */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

//           {/* Status Filter */}
//           <div className="relative">
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
//             >
//               <option value="">All Statuses</option>
//               <option value="active">Active</option>
//               <option value="redeemed">Redeemed</option>
//             </select>
//             <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
//             </svg>
//           </div>

//           {/* Start Date */}
//           <div className="relative">
//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => {
//                 setQuickDateFilter('');
//                 setStartDate(e.target.value);
//               }}
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm shadow-inner focus:ring-2 focus:ring-blue-500 transition duration-200"
//             />
//           </div>

//           {/* End Date */}
//           <div className="relative">
//             <input
//               type="date"
//               value={endDate}
//               onChange={(e) => {
//                 setQuickDateFilter('');
//                 setEndDate(e.target.value);
//               }}
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm shadow-inner focus:ring-2 focus:ring-blue-500 transition duration-200"
//             />
//           </div>

//           {/* Quick Filter Dropdown */}
//           <div className="relative">
//             <select
//               value={quickDateFilter}
//               onChange={(e) => handleQuickDateFilterChange(e.target.value)}
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
//             >
//               <option value="">Custom / All Time</option>
//               <option value="today">Today</option>
//               <option value="7days">Last 7 Days</option>
//               <option value="15days">Last 15 Days</option>
//               <option value="1month">Last 1 Month</option>
//             </select>
//           </div>

//         </div>
//       </div>


//       {/* Table */}

//       <div className="overflow-hidden rounded-xl  border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
//         <div className="max-w-full overflow-x-auto">
//           <table className="min-w-full w-max text-sm bg-white">
//             <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
//               <tr>
//                 {tableHeaders.map((heading, i) => (
//                   <th key={i} className="px-6 py-3 text-center">{heading}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {coupons.map((coupon, index) => {
//                 const statusColor = coupon.status === 'active'
//                   ? 'text-green-600'
//                   : coupon.status === 'redeemed'
//                     ? 'text-red-600'
//                     : 'text-gray-700';

//                 return (
//                   <tr key={coupon._id} className="border-b hover:bg-gray-50">
//                     <td className="px-6 py-4 text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
//                     <td className="px-6 py-4 font-medium text-gray-900 break-all text-center">{coupon.code}</td>
//                     <td className="px-6 py-4 font-medium capitalize break-all text-center">{coupon.account?.name || "N/A"}</td>
//                     <td className={`px-6 py-4 font-medium capitalize text-center ${statusColor}`}>{coupon.status}</td>
//                     <td className="px-6 py-4 text-center text-gray-700">
//                       {coupon.expirationDate ? new Date(coupon.expirationDate).toLocaleDateString() : ''}
//                     </td>
//                     <td className="px-6 py-4 text-center">
//                       <button
//                         className="text-blue-600 hover:underline font-medium"
//                         onClick={() => {
//                           setShowReviewCard(prev => ({ ...prev, [coupon._id]: true }));

//                         }}
//                       >
//                         See Review
//                       </button>
//                       {showReviewCard[coupon._id] && (
//                         <CouponDetails
//                           coupon={coupon}
//                           setShowReviewCard={(visible) =>
//                             setShowReviewCard(prev => ({ ...prev, [coupon._id]: visible }))}
//                         />
//                       )}
//                     </td>
//                     <td className="px-6 py-4 text-center">
//                       <button
//                         className={`font-medium ${coupon.status === "redeemed" ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:underline"}`}
//                         onClick={() => coupon.status !== "redeemed" && handleRedeemClick(coupon)}
//                         disabled={coupon.status === "redeemed"}
//                       >
//                         Redeem
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//       </div>


//       {/* Pagination */}
//       <div className="flex justify-center mt-6 gap-2">
//         <button
//           onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
//           disabled={currentPage === 1}
//           className="p-2 rounded border bg-white shadow disabled:opacity-40 hover:bg-gray-50"
//         >
//           <ChevronLeft className="w-4 h-4" />
//         </button>
//         {getPaginationRange().map((page, idx) => (
//           typeof page === 'string' ? (
//             <span key={idx} className="px-2 py-1 text-gray-500">…</span>
//           ) : (
//             <button
//               key={page}
//               onClick={() => setCurrentPage(page)}
//               className={`px-3 py-1 rounded-md border text-sm shadow ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-white hover:bg-blue-50 text-gray-700'}`}
//             >
//               {page}
//             </button>
//           )
//         ))}
//         <button
//           onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
//           disabled={currentPage === totalPages}
//           className="p-2 rounded border bg-white shadow disabled:opacity-40 hover:bg-gray-50"
//         >
//           <ChevronRight className="w-4 h-4" />
//         </button>
//       </div>

//       {/* Dialog */}
//       {dialogOpen && selectedCoupon && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
//             <h2 className="text-lg font-semibold mb-4">Redeem Coupon</h2>
//             <div className="mb-4 space-y-2 text-sm">
//               <p><strong>Code:</strong> {selectedCoupon.code}</p>
//               <p><strong>Status:</strong> {selectedCoupon.status}</p>
//               <p><strong>Expiration:</strong> {selectedCoupon.expirationDate}</p>
//             </div>
//             <div className="flex justify-end gap-2">
//               <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={handleCancel}>Cancel</button>
//               <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={handleConfirmRedeem}>Confirm Redeem</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Message Popup */}
//       {message && (
//         <MessagePopup
//           message={message}
//           type={messageType}
//           onClose={() => setMessage('')}
//         />
//       )}
//     </div>
//   );
// }

// export default Coupon;



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink, useParams } from 'react-router';
import CouponDetails from './CouponDetails';
import MessagePopup from '../Common/MessagePopup';
import { useUser } from '../../Context/ContextApt';
import Pagination from '../Common/Pagination';
import FilterBar from '../Common/FilterBar';
import { getAuthToken } from '../../Context/apiService';
import { toast } from 'react-toastify';

function Coupon() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [coupons, setCoupons] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [showReviewCard, setShowReviewCard] = useState({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [quickDateFilter, setQuickDateFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [redeemLoading, setRedeemLoading] = useState(false);

  const itemsPerPage = 10;
  const { userId } = useParams();

  const { userData } = useUser();
  const user = userData.user.role;

  const apiUrl = user === "admin"
    ? `${import.meta.env.VITE_API_URL}/api/admin/coupons?user=${userId}`
    : `${import.meta.env.VITE_API_URL}/api/user/mycoupons`;

  // Debounced search effect
  useEffect(() => {
    setSearchLoading(true);

    const timeout = setTimeout(() => {
      setSearchTerm(search);
      setCurrentPage(1);
      setSearchLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  // Main data fetching effect
  useEffect(() => {
    const fetchCoupons = async () => {
      const startTime = Date.now();
      setLoading(true);

      try {
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          ...(searchTerm && { code: searchTerm.trim() }),
          ...(statusFilter && { status: statusFilter }),
          ...(startDate && { 'createdAt[gt]': startDate }),
          ...(endDate && { 'createdAt[lt]': endDate }),
        };

        const res = await axios.get(apiUrl, {
          params,
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${getAuthToken()}`
          }
        });

        setCoupons(res.data.data.coupons || []);
        setTotalPages(Math.ceil(res.data.results / itemsPerPage));
      } catch (error) {
        console.error('Error fetching coupons:', error);
        setCoupons([]);
        toast.error('Failed to load coupons');
      } finally {
        const elapsedTime = Date.now() - startTime;
        const minLoadingTime = 500;

        if (elapsedTime < minLoadingTime) {
          setTimeout(() => setLoading(false), minLoadingTime - elapsedTime);
        } else {
          setLoading(false);
        }
      }
    };

    fetchCoupons();
  }, [searchTerm, statusFilter, currentPage, startDate, endDate, apiUrl]);

  const handleRedeemClick = (coupon) => {
    setSelectedCoupon(coupon);
    setDialogOpen(true);
  };

  const handleConfirmRedeem = async () => {
    if (!selectedCoupon) return;

    setRedeemLoading(true);
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/coupon/${selectedCoupon._id}/redeem`,
        {},
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${getAuthToken()}`
          }
        }
      );
      toast.success('Coupon redeemed successfully!');
      setSearch("");
    } catch (error) {
      console.error("Error redeeming coupon:", error);
      toast.error('Failed to redeem coupon');
    } finally {
      setRedeemLoading(false);
      setDialogOpen(false);
      setSelectedCoupon(null);
    }
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setSelectedCoupon(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    toast.info(`Loading page ${page}...`);
  };

  const handleClearFilters = () => {
    toast.info('All filters cleared');
    setCurrentPage(1);
  };

  const tableHeaders = ["Sl. No", "Code", "Name", "Status", "Expiration Date", "View Details", "Manage"];

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Coupon Management
        </h1>

        {/* Action Button */}
        <NavLink
          to={user === "admin" ? `/user/${userId}/presets` : "/presets"}
          className="inline-flex items-center px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Coupons
        </NavLink>
      </div>

      {/* FilterBar Component */}
      <FilterBar
        search={search}
        setSearch={setSearch}
        searchLoading={searchLoading || (loading && search)}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        quickDateFilter={quickDateFilter}
        setQuickDateFilter={setQuickDateFilter}
        placeholder="Search..."
        statusOptions={[
          { value: "", label: "All Statuses" },
          { value: "active", label: "Active" },
          { value: "redeemed", label: "Redeemed" }
        ]}
        quickFilterOptions={[
          { value: "", label: "Custom / All Time" },
          { value: "today", label: "Today" },
          { value: "7days", label: "Last 7 Days" },
          { value: "15days", label: "Last 15 Days" },
          { value: "1month", label: "Last 1 Month" }
        ]}
        onClearFilters={handleClearFilters}
      />

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <table className="min-w-full w-max text-sm bg-white">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                {tableHeaders.map((heading, i) => (
                  <th key={i} className="px-6 py-3 text-center">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={tableHeaders.length} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
                      <span className="text-gray-600 text-lg">Loading coupons...</span>
                      <span className="text-gray-400 text-sm mt-1">Please wait while we fetch your data</span>
                    </div>
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={tableHeaders.length} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg className="w-16 h-16 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-lg font-medium text-gray-600">No coupons found</span>
                      {searchTerm && (
                        <span className="text-sm text-gray-400 mt-1">
                          No results for "{searchTerm}"
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                coupons.map((coupon, index) => {
                  const statusColor = coupon.status === 'active'
                    ? 'text-green-600'
                    : coupon.status === 'redeemed'
                      ? 'text-red-600'
                      : 'text-gray-700';

                  return (
                    <tr key={coupon._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="px-6 py-4 font-medium text-gray-900 break-all text-center">{coupon.code}</td>
                      <td className="px-6 py-4 font-medium capitalize break-all text-center">{coupon.account?.name || "N/A"}</td>
                      <td className={`px-6 py-4 font-medium capitalize text-center ${statusColor}`}>{coupon.status}</td>
                      <td className="px-6 py-4 text-center text-gray-700">
                        {coupon.expirationDate ? new Date(coupon.expirationDate).toLocaleDateString() : ''}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          className="text-blue-600 hover:underline font-medium"
                          onClick={() => {
                            setShowReviewCard(prev => ({ ...prev, [coupon._id]: true }));
                          }}
                        >
                          See Review
                        </button>
                        {showReviewCard[coupon._id] && (
                          <CouponDetails
                            coupon={coupon}
                            setShowReviewCard={(visible) =>
                              setShowReviewCard(prev => ({ ...prev, [coupon._id]: visible }))}
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          className={`font-medium ${coupon.status === "redeemed" ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:underline"}`}
                          onClick={() => coupon.status !== "redeemed" && handleRedeemClick(coupon)}
                          disabled={coupon.status === "redeemed"}
                        >
                          Redeem
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Dialog */}
      {dialogOpen && selectedCoupon && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
            <h2 className="text-lg font-semibold mb-4">Redeem Coupon</h2>
            <div className="mb-4 space-y-2 text-sm">
              <p><strong>Code:</strong> {selectedCoupon.code}</p>
              <p><strong>Status:</strong> {selectedCoupon.status}</p>
              <p><strong>Expiration:</strong> {selectedCoupon.expirationDate}</p>
            </div>
            <div className="flex justify-end gap-2">
              <button 
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50" 
                onClick={handleCancel}
                disabled={redeemLoading}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex items-center gap-2" 
                onClick={handleConfirmRedeem}
                disabled={redeemLoading}
              >
                {redeemLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Redeeming...
                  </>
                ) : (
                  'Confirm Redeem'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Popup */}
      {message && (
        <MessagePopup
          message={message}
          type={messageType}
          onClose={() => setMessage('')}
        />
      )}
    </div>
  );
}

export default Coupon;