import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NavLink, useParams } from 'react-router';
import CouponDetails from './CouponDetails';
import MessagePopup from '../Common/MessagePopup';

function Coupon({ user }) {
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
  const [selectedReview, setSelectedReview] = useState({});

  const itemsPerPage = 10;
  const { userId } = useParams();

  const apiUrl = user === "admin"
    ? `${import.meta.env.VITE_API_URL}/api/admin/coupons?user=${userId}`
    : `${import.meta.env.VITE_API_URL}/api/user/mycoupons`;

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          ...(search && { code: search.trim() }),
          ...(statusFilter && { status: statusFilter }),
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        };

        const res = await axios.get(apiUrl, { params, withCredentials: true });

        setCoupons(res.data.data.coupons || []);
        setTotalPages(Math.ceil(res.data.results / itemsPerPage));
      } catch (error) {
        console.error('Error fetching coupons:', error);
      }
    };

    const timeout = setTimeout(fetchCoupons, 300);
    return () => clearTimeout(timeout);
  }, [search, statusFilter, currentPage, startDate, endDate]);

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
      setMessage('✅ Coupon redeemed successfully!');
      setMessageType('success');
      setSearch(""); // trigger refetch
    } catch (error) {
      console.error("Error redeeming coupon:", error);
      setMessage('❌ Failed to redeem coupon.');
      setMessageType('error');
    }

    setDialogOpen(false);
    setSelectedCoupon(null);
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setSelectedCoupon(null);
  };

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

    const range = [1];
    if (left > 2) range.push('...');
    for (let i = left; i <= right; i++) range.push(i);
    if (right < totalPages - 1) range.push('...');
    if (totalPages > 1) range.push(totalPages);
    return range;
  };

  const tableHeaders = ["Sl. No", "Code", "Name", "Status", "Expiration Date", "View Review", "Manage"];

  return (
    <div className="container p-2 sm:p-4 md:p-6 mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Coupon Management</h1>

      {/* Set Coupon Button */}
      <div className="flex justify-end mb-4">
        <NavLink
          to={user === "admin" ? `/user/${userId}/presets` : "/presets"}
          className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md"
        >
         Coupons
        </NavLink>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="relative col-span-2">
          <input
            type="text"
            placeholder="Search by code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
          </svg>
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="redeemed">Redeemed</option>
          </select>
          <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow min-w-0">
        <table className="min-w-[800px] w-full text-sm bg-white">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              {tableHeaders.map((heading, i) => (
                <th key={i} className="px-6 py-3 text-center">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon, index) => {
              const statusColor = coupon.status === 'active'
                ? 'text-green-600'
                : coupon.status === 'redeemed'
                  ? 'text-red-600'
                  : 'text-gray-700';

              return (
                <tr key={coupon._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 break-all text-center">{coupon.code}</td>
                  <td className="px-6 py-4 font-medium capitalize break-all text-center">{coupon.review?.name || "N/A"}</td>
                  <td className={`px-6 py-4 font-medium capitalize text-center ${statusColor}`}>{coupon.status}</td>
                  <td className="px-6 py-4 text-center text-gray-700">
                    {coupon.expirationDate ? new Date(coupon.expirationDate).toLocaleDateString() : ''}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      className="text-blue-600 hover:underline font-medium"
                      onClick={() => {
                        setShowReviewCard(prev => ({ ...prev, [coupon._id]: true }));
                        setSelectedReview({
                          ...coupon.review,
                          ...coupon,
                          number: coupon.review?.phone || "N/A",
                          name: coupon.review?.name || "N/A",
                          review: coupon.review?.review || "No review available"
                        });
                      }}
                    >
                      See Review
                    </button>
                    {showReviewCard[coupon._id] && (
                      <CouponDetails
                        {...selectedReview}
                        setShowReviewCard={(visible) =>
                          setShowReviewCard(prev => ({ ...prev, [coupon._id]: visible }))
                        }
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
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 rounded border bg-white shadow disabled:opacity-40 hover:bg-gray-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {getPaginationRange().map((page, idx) => (
          typeof page === 'string' ? (
            <span key={idx} className="px-2 py-1 text-gray-500">…</span>
          ) : (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-md border text-sm shadow ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-white hover:bg-blue-50 text-gray-700'}`}
            >
              {page}
            </button>
          )
        ))}
        <button
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-2 rounded border bg-white shadow disabled:opacity-40 hover:bg-gray-50"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

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
              <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={handleCancel}>Cancel</button>
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={handleConfirmRedeem}>Confirm Redeem</button>
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
