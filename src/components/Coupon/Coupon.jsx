import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink, useParams } from 'react-router';
import CouponDetails from './CouponDetails';
import MessagePopup from '../Common/MessagePopup';
import { useUser } from '../../Context/ContextApt';
import Pagination from '../Common/Pagination';
// import FilterBar from '../Common/FilterBar';
import { getAuthToken } from '../../Context/apiService';
import { toast } from 'react-toastify';
import FilterBar from '../Common/FilterBar/FilterBar';


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
  const [sourceFilter, setSourceFilter] = useState('');

  const itemsPerPage = 10;
  const { userId } = useParams();

  const { userData } = useUser();
  const user = userData.user.role;

  const apiUrl = user === "admin"
    ? `${import.meta.env.VITE_API_URL}/api/admin/coupons?user=${userId}`
    : `${import.meta.env.VITE_API_URL}/api/user/mycoupons`;

  // Source type color mapping
  const sourceColors = {
    'review': 'bg-blue-50 hover:bg-blue-100 border-l-4 border-l-blue-400',
    'special-offer': 'bg-purple-50 hover:bg-purple-100 border-l-4 border-l-purple-400',
    'spin': 'bg-orange-50 hover:bg-orange-100 border-l-4 border-l-orange-400',
    'task': 'bg-green-50 hover:bg-green-100 border-l-4 border-l-green-400',
    'loyalty': 'bg-yellow-50 hover:bg-yellow-100 border-l-4 border-l-yellow-400',
    'redemption': 'bg-red-50 hover:bg-red-100 border-l-4 border-l-red-400',
    'other': 'bg-gray-50 hover:bg-gray-100 border-l-4 border-l-gray-400'
  };

  // Source type display names and badges
  const sourceDisplay = {
    'review': { name: 'Review', badge: 'bg-blue-100 text-blue-800' },
    'special-offer': { name: 'Special Offer', badge: 'bg-purple-100 text-purple-800' },
    'spin': { name: 'Spin', badge: 'bg-orange-100 text-orange-800' },
    'task': { name: 'Task', badge: 'bg-green-100 text-green-800' },
    'loyalty': { name: 'Loyalty', badge: 'bg-yellow-100 text-yellow-800' },
    'redemption': { name: 'Redemption', badge: 'bg-indigo-100 text-indigo-800' },
    'other': { name: 'Other', badge: 'bg-gray-100 text-gray-800' }
  };

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
          ...(sourceFilter && { source: sourceFilter }),
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
  }, [searchTerm, statusFilter, sourceFilter, currentPage, startDate, endDate, apiUrl]);

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

      // Update the local state to reflect the redeemed status
      setCoupons(prevCoupons =>
        prevCoupons.map(coupon =>
          coupon._id === selectedCoupon._id
            ? { ...coupon, status: 'redeemed' }
            : coupon
        )
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
  };

  const handleClearFilters = () => {
    setCurrentPage(1);
  };

  const tableHeaders = ["Sl. No", "Code", "Name", "Source", "Status", "Expiration Date", "Manage"];

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-700 tracking-tight">
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
        searchLoading={searchLoading}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        quickDateFilter={quickDateFilter}
        setQuickDateFilter={setQuickDateFilter}
        sourceFilter={sourceFilter}
        setSourceFilter={setSourceFilter}
        showSourceFilter={true}
        sourceOptions={[
          { value: "", label: "All Sources" },
          { value: "review", label: "Review" },
          { value: "special-offer", label: "Special Offer" },
          { value: "spin", label: "Spin" },
          { value: "task", label: "Task" },
          { value: "loyalty", label: "Loyalty" },
          { value: "redemption", label: "Redemption" },
          { value: "other", label: "Other" },
        ]}
        placeholder="Search..."
        statusOptions={[
          { value: "", label: "All Statuses" },
          { value: "active", label: "Active" },
          { value: "redeemed", label: "Redeemed" }
        ]}
        onClearFilters={handleClearFilters}
        showCategoryFilter={false}
        showLocationFilter={false}
        showDates={true} // Add this missing prop
        showQuickFilter={true} // Add this missing prop
        categories={[]}
        locations={[]}
      />

      {/* Source Type Legend */}
      {/* <div className="mb-4 flex flex-wrap gap-2">
        {Object.entries(sourceDisplay).map(([key, { name, badge }]) => (
          <div key={key} className="flex items-center gap-1 text-xs">
            <span className={`w-3 h-3 rounded-full ${sourceColors[key].split(' ')[0]}`}></span>
            <span className={`px-2 py-1 rounded-full ${badge} font-medium`}>
              {name}
            </span>
          </div>
        ))}
      </div> */}

      {/* Table */}
      <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white text-sm">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold select-none">
          <tr>
            {tableHeaders.map((heading, i) => (
              <th
                key={i}
                className="px-6 py-3 text-center border-b border-gray-300"
                scope="col"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={tableHeaders.length} className="py-12 text-center">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                  <span className="text-gray-600 text-lg font-medium">
                    Loading coupons...
                  </span>
                  <span className="text-gray-400 text-sm">
                    Please wait while we fetch your data
                  </span>
                </div>
              </td>
            </tr>
          ) : coupons.length === 0 ? (
            <tr>
              <td
                colSpan={tableHeaders.length}
                className="py-12 text-center text-gray-500 font-medium"
              >
                {searchTerm ? `No results found for "${searchTerm}"` : "No coupons found."}
              </td>
            </tr>
          ) : (
            coupons.map((coupon, index) => {
              const statusColor =
                coupon.status === "active"
                  ? "text-green-600"
                  : coupon.status === "redeemed"
                    ? "text-red-600"
                    : "text-gray-700";

              const sourceType = coupon.source || "other";
              const rowColor = index % 2 === 0 ? "bg-white" : "bg-gray-50"; // striped rows
              const sourceInfo = sourceDisplay[sourceType] || sourceDisplay["other"];

              return (
                <tr
                  key={coupon._id}
                  className={`${rowColor} hover:bg-blue-50 transition-colors duration-150`}
                >
                  <td className="px-6 py-4 text-center font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="px-6 py-4 font-medium text-blue-600 hover:underline cursor-pointer break-words text-center">
                    <button onClick={() => setShowReviewCard((prev) => ({ ...prev, [coupon._id]: true }))}>
                      {coupon.code}
                    </button>
                    {showReviewCard[coupon._id] && (
                      <CouponDetails
                        coupon={coupon}
                        setShowReviewCard={(visible) =>
                          setShowReviewCard((prev) => ({ ...prev, [coupon._id]: visible }))
                        }
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium capitalize break-words text-center text-gray-900">
                    {coupon.account?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold ${sourceInfo.badge} select-none`}
                      title={sourceInfo.name}
                    >
                      {sourceInfo.name}
                    </span>
                  </td>
                  <td className={`px-6 py-4 font-semibold capitalize text-center ${statusColor}`}>
                    <span
                      className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs ${coupon.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        } font-semibold select-none`}
                    >
                      {coupon.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-700 font-medium whitespace-nowrap">
                    {coupon.expirationDate ? new Date(coupon.expirationDate).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      className={`font-medium px-3 py-1 rounded-lg transition-all duration-200 ${coupon.status === "redeemed"
                        ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                        : "text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
                        }`}
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
              <p><strong>Source:</strong> {sourceDisplay[selectedCoupon.source]?.name || 'Other'}</p>
              <p><strong>Status:</strong> {selectedCoupon.status}</p>
              <p><strong>Expiration:</strong> {selectedCoupon.expirationDate}</p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition-colors"
                onClick={handleCancel}
                disabled={redeemLoading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
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