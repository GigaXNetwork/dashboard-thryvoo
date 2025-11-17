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

  const tableHeaders = ["Sl. No", "Code", "Name", "Status", "Expiration Date", "Manage"];

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
                      <td className="px-6 py-4 font-medium text-gray-900 break-all text-center">
                        <button
                          className="text-blue-600 hover:underline font-medium"
                          onClick={() => {
                            setShowReviewCard(prev => ({ ...prev, [coupon._id]: true }));
                          }}
                        >
                          {coupon.code}
                        </button>
                        {showReviewCard[coupon._id] && (
                          <CouponDetails
                            coupon={coupon}
                            setShowReviewCard={(visible) =>
                              setShowReviewCard(prev => ({ ...prev, [coupon._id]: visible }))}
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium capitalize break-all text-center">{coupon.account?.name || "N/A"}</td>
                      <td className={`px-6 py-4 font-medium capitalize text-center ${statusColor}`}>{coupon.status}</td>
                      <td className="px-6 py-4 text-center text-gray-700">
                        {coupon.expirationDate ? new Date(coupon.expirationDate).toLocaleDateString() : ''}
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