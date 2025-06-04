import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams } from 'react-router';

function Coupon({user}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [coupons, setCoupons] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const itemsPerPage = 3;
  let apiUrl;
  if(user==="admin"){
    const {userId}=useParams()
    apiUrl=`https://api.thryvoo.com/api/admin/coupons?user=${userId}`
  }
  else{
    apiUrl="https://api.thryvoo.com/api/user/mycoupons"
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
        `https://api.thryvoo.com/api/coupon/${selectedCoupon._id}/redeem`,
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
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Coupon Management</h1>

<div className="bg-gray-50 rounded-xl p-4 shadow-md flex flex-wrap gap-4 items-center justify-between mb-6">
  <div className="relative w-full sm:w-64">
    <input
      type="text"
      placeholder="Search by code..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
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

  <div className="relative w-full sm:w-52">
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all appearance-none"
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
</div>


      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full text-sm text-left bg-white">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Sl. No</th>
              <th className="px-6 py-3">Code</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Expiration Date</th>
              <th className="px-6 py-3">Manage</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon, index) => (
              <tr key={coupon._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{coupon.code}</td>
                <td className="px-6 py-4 capitalize">{coupon.status}</td>
                <td className="px-6 py-4 text-gray-700">{coupon.expirationDate}</td>
                <td className="px-6 py-4">
                  <button
                    className="text-blue-600 hover:underline font-medium"
                    onClick={() => handleRedeemClick(coupon)}
                  >
                    redeem
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Redeem Dialog */}
      {dialogOpen && selectedCoupon && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Redeem Coupon</h2>
            <div className="mb-4">
              <div className="mb-2"><span className="font-medium">Code:</span> {selectedCoupon.code}</div>
              <div className="mb-2"><span className="font-medium">Status:</span> {selectedCoupon.status}</div>
              <div className="mb-2"><span className="font-medium">Expiration Date:</span> {selectedCoupon.expirationDate}</div>
              {/* Add more fields if needed */}
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

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-2 items-center">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-md border bg-white shadow disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {paginationRange.map((page, idx) => {
          if (page === 'left-ellipsis' || page === 'right-ellipsis') {
            return (
              <span
                key={page + idx}
                className="px-3 py-1 text-gray-500 select-none"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-md border text-sm shadow ${
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'bg-white hover:bg-blue-50 text-gray-700'
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md border bg-white shadow disabled:opacity-50"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default Coupon;
