import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, NavLink, useParams } from 'react-router';
import CouponDetails from './CouponDetails';

function Coupon({ user }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [coupons, setCoupons] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [showReviewCard, setShowReviewCard] = useState({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');


  const [selectedReview, setSelectedReview] = useState({});
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const itemsPerPage = 10;
  let apiUrl;
  if (user === "admin") {
    const { userId } = useParams()
    apiUrl = `${import.meta.env.VITE_API_URL}/api/admin/coupons?user=${userId}`
  }
  else {
    apiUrl = `${import.meta.env.VITE_API_URL}/api/user/mycoupons`
  }
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const params = {
          page: currentPage,
          limit: itemsPerPage,
        };

        if (search.trim()) params.code = search.trim();
        if (statusFilter) params.status = statusFilter;
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const res = await axios.get(apiUrl, {
          params,
          withCredentials: true,
        });

        setCoupons(res.data.data.coupons || []);
        setTotalPages(Math.ceil(res.data.results / itemsPerPage));
      } catch (error) {
        console.error('Error fetching coupons:', error);
      }
    };

    const timeout = setTimeout(fetchCoupons, 300);
    return () => clearTimeout(timeout);
  }, [search, statusFilter, currentPage]);

  const handleRedeemClick = (coupon) => {
    setSelectedCoupon(coupon);
    setDialogOpen(true);
  };

  const handleConfirmRedeem = async () => {
    if (!selectedCoupon) return;
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/coupon/${selectedCoupon._id}/redeem`,
        {},
        { withCredentials: true }
      );
      // Optionally, refresh coupons list
      setSearch(""); // This will trigger useEffect to refetch
    } catch (error) {
      console.error("Error redeeming coupon:", error);
      // Optionally, show error to user
    }
    setDialogOpen(false);
    setSelectedCoupon(null);
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setSelectedCoupon(null);
  };

  // Generate pagination range with ellipsis
  const getPaginationRange = () => {
    const delta = 1;
    let left = currentPage - delta;
    let right = currentPage + delta;

    if (left < 2) {
      right += 2 - left;
      left = 2;
    }
    if (right > totalPages - 1) {
      left -= right - (totalPages - 1);
      right = totalPages - 1;
    }
    left = Math.max(left, 2);

    const range = [];
    range.push(1);

    if (left > 2) {
      range.push('left-ellipsis');
    }

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (right < totalPages - 1) {
      range.push('right-ellipsis');
    }

    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  const paginationRange = getPaginationRange();

  return (
    <div className="container p-2 sm:p-4 md:p-6 w-full mx-auto">

      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">Coupon Management</h1>

      <div className="flex flex-col sm:flex-row justify-end mb-4 gap-2 sm:gap-0">

        <NavLink
          to="/coupon/presets"
          className="w-full sm:w-auto px-4 sm:px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-shadow shadow-md text-center"
        >
          Set Coupon
        </NavLink>
      </div>

      <div className="bg-white rounded-xl p-2 sm:p-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6 items-center">
        {/* Search */}
        <div className="relative col-span-1 sm:col-span-2">
          <input
            type="text"
            placeholder="Search by code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm"
          />
          <svg
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
            />
          </svg>
        </div>

        {/* Filter */}
        <div className="relative col-span-1 sm:col-span-1">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all appearance-none text-sm"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="redeemed">Redeemed</option>
          </select>
          <svg
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 12h14M12 5l7 7-7 7"
            />
          </svg>
        </div>

        {/* Date Range Filters */}
        <div className="col-span-1 sm:col-span-1 grid grid-cols-2 gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Start date"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="End date"
          />
        </div>

      </div>

      {/* Table */}
      <div className="max-w-[100%] overflow-x-auto rounded-lg shadow custom-scrollbar min-w-0">
        <table className="min-w-[600px] sm:min-w-[800px] w-full text-sm text-left bg-white">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              {["Sl. No", "Code", "Status", "Expiration Date", "View Review", "Manage"].map((heading, i) => (
                <th key={i} className="px-3 sm:px-6 py-3 whitespace-nowrap">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon, index) => (
              <tr key={coupon._id} className="border-b hover:bg-gray-50 transition">
                <td className="px-3 sm:px-6 py-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="px-3 sm:px-6 py-4 font-medium text-gray-900 break-all">{coupon.code}</td>
                <td className="px-3 sm:px-6 py-4 capitalize">{coupon.status}</td>
                <td className="px-3 sm:px-6 py-4 text-gray-700">{coupon.expirationDate ? new Date(coupon.expirationDate).toLocaleDateString() : ''}</td>
                <td className="px-3 sm:px-6 py-4 text-blue-600 hover:underline cursor-pointer font-medium">
                  <button
                    onClick={() => {
                      setShowReviewCard(prev => ({ ...prev, [coupon._id]: true }));
                      setSelectedReview({
                        name: coupon.review?.name || "N/A",
                        review: coupon.review?.review || "No review available",
                        rating: coupon.review?.rating || "N/A",
                        ...coupon,
                      });
                    }}
                  >
                    See Review
                  </button>

                  {showReviewCard[coupon._id] && (
                    <CouponDetails
                      review={coupon.review?.name || "N/A"}
                      rating={coupon.review?.rating || "N/A"}
                      code={coupon.code}
                      discountType={coupon.discountType}
                      discountAmount={coupon.discountAmount}
                      maxDiscount={coupon.maxDiscount}
                      minPurchase={coupon.minPurchase}
                      expirationDate={coupon.expirationDate}
                      usageLimit={coupon.usageLimit}
                      usageCount={coupon.usageCount}
                      status={coupon.status}
                      setShowReviewCard={(visible) =>
                        setShowReviewCard(prev => ({ ...prev, [coupon._id]: visible }))
                      }
                    />
                  )}
                </td>
                <td className="px-3 sm:px-6 py-4">
                  <button
                    className="text-blue-600 hover:underline font-medium"
                    onClick={() => handleRedeemClick(coupon)}
                  >
                    Redeem
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap justify-center mt-4 sm:mt-6 gap-1 sm:gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 rounded border bg-white shadow disabled:opacity-40 hover:bg-gray-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {paginationRange.map((page, idx) =>
          typeof page === "string" ? (
            <span key={idx} className="px-2 sm:px-3 py-1 text-gray-500 select-none">…</span>
          ) : (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-2 sm:px-3 py-1 rounded-md border text-sm shadow ${page === currentPage ? "bg-blue-600 text-white" : "bg-white hover:bg-blue-50 text-gray-700"
                }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-2 rounded border bg-white shadow disabled:opacity-40 hover:bg-gray-50"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Dialog */}
      {dialogOpen && selectedCoupon && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-md mx-auto">
            <h2 className="text-lg font-semibold mb-4">Redeem Coupon</h2>
            <div className="mb-4 space-y-2 text-sm">
              <p><strong>Code:</strong> {selectedCoupon.code}</p>
              <p><strong>Status:</strong> {selectedCoupon.status}</p>
              <p><strong>Expiration:</strong> {selectedCoupon.expirationDate}</p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleConfirmRedeem}
              >
                Confirm Redeem
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Set Coupon */}

    </div>

  );
}

export default Coupon;
