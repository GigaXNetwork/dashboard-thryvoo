import React, { useState, useEffect } from "react";
import { Search, Calendar, Filter, Eye, CheckCircle, Package, IndianRupee, Clock, Clock1, Clock4, XCircle } from "lucide-react";
import { Api } from "../../Context/apiService";
import Pagination from "../Common/Pagination";
import SetVisibilityModal from "./SetVisibilityModal"; // We will create this next
import { BiRupee } from "react-icons/bi";
import { Link } from "react-router";
import ApproveSponsorshipModal from "./ApproveSponsorshipModal";

const SponsorshipPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ search: "", startDate: "", endDate: "" });
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isApproveOpen, setIsApproveOpen] = useState(false);
    const [selectedForApproval, setSelectedForApproval] = useState(null);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [actionType, setActionType] = useState('approve');

    const fetchSponsorships = async (page = 1) => {
        setLoading(true);
        try {
            const res = await Api.getSponsorshipRequests(page, pagination.limit, filters.search, filters.startDate, filters.endDate);
            if (res.success) {
                setRequests(res.data);
                setPagination(prev => ({ ...prev, page: res.page, total: res.total, totalPages: res.total_pages }));
            }
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSponsorships(); }, [filters.startDate, filters.endDate]);

    const openApproveModal = (item) => {
        setSelectedForApproval(item);
        setIsApproveOpen(true);
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'paid':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'price_proposed': // New Status
                return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            case 'pending':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border">
                <h1 className="text-xl font-bold text-gray-800">Sponsorship Management</h1>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text" placeholder="Search business..."
                            className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && fetchSponsorships(1)}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                    </div>
                    <input
                        type="date"
                        className="p-2 border rounded-lg text-sm"
                        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    />
                    <input
                        type="date"
                        className="p-2 border rounded-lg text-sm"
                        onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Business</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Product</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Pricing</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Applied On</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        {/* <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="5" className="py-20 text-center text-gray-500">Loading...</td></tr>
                            ) : requests.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <Link
                                            to={`/user/${item.business_id?._id}`}
                                            className="font-medium text-sm text-blue-600 transition-colors duration-200 hover:underline"
                                        >
                                            {item.business_id?.name || "Unknown Business"}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="font-medium text-gray-900">{item.product?.name}</div>
                                        <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold text-gray-700">
                                            ₹{item.discount_price}
                                            <span className="text-xs ml-1 text-gray-400">(Discounted)</span>
                                        </div>
                                        <div className="text-sm font-semibold text-gray-700">
                                            ₹{item.product?.price}
                                            <span className="text-xs ml-1 text-gray-400">(Original)</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-[10px] font-bold border inline-flex items-center justify-center whitespace-nowrap ${getStatusStyles(item.status)}`}
                                        >
                                            {item.status === 'price_proposed' ? 'PRICE PROPOSED' : item.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {item.status === 'pending' && (
                                                <button
                                                    onClick={() => { setSelectedRequest(item); setIsModalOpen(true); }}
                                                    className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 text-sm rounded-lg hover:bg-blue-50 transition-all font-medium"
                                                >
                                                    <Eye className="w-4 h-4" /> Set Visibility
                                                </button>
                                            )}

                                            {item.status === 'paid' && (
                                                <button
                                                    onClick={() => openApproveModal(item)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-all font-medium shadow-sm shadow-green-200"
                                                >
                                                    <CheckCircle className="w-4 h-4" /> Approve
                                                </button>
                                            )}

                                            {item.status === 'approved' && (
                                                <div className="flex items-center gap-2 px-0 py-2 text-gray-400 text-sm font-normal">
                                                    <CheckCircle className="w-3.5 h-3.5 text-green-500" /> No actions left
                                                </div>
                                            )}

                                            {item.status === 'price_proposed' && (
                                                <div className="flex items-center gap-2 px-0 py-2 text-gray-400 text-sm font-normal ">
                                                    <Clock4 className="w-3.5 h-3.5 text-amber-500" /> Waiting for payment
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody> */}

                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="6" className="py-20 text-center text-gray-500">Loading...</td></tr>
                            ) : requests.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <Link
                                            to={`/user/${item.business_id?._id}`}
                                            className="font-medium text-sm text-blue-600 transition-colors duration-200 hover:underline"
                                        >
                                            {item.business_id?.name || "Unknown Business"}
                                        </Link>
                                        <div className="text-[10px] text-gray-400 truncate max-w-[150px]">{item.business_id?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="font-medium text-gray-900">{item.product?.name}</div>
                                        <div className="text-xs text-gray-500">Qty: {item.quantity} | {item.offer_duration_days} Days</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {/* Display Final Offer Price if it exists, otherwise show request prices */}
                                        {item.offer_price ? (
                                            <div className="space-y-1">
                                                <div className="text-sm font-bold text-green-600">
                                                    ₹{item.offer_price} <span className="text-[10px] font-normal text-gray-400">(Final Offer)</span>
                                                </div>
                                                <div className="text-[11px] text-gray-500 line-through">Original: ₹{item.product?.price}</div>
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                <div className="text-sm font-semibold text-gray-700">
                                                    ₹{item.discount_price} <span className="text-[10px] font-normal text-gray-400">(Requested)</span>
                                                </div>
                                                <div className="text-[11px] text-gray-500">Original: ₹{item.product?.price}</div>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-2">
                                            <span className={`px-3 py-1 rounded-full text-[10px] w-fit font-bold border inline-flex items-center justify-center whitespace-nowrap ${getStatusStyles(item.status)}`}>
                                                {item.status === 'price_proposed' ? 'PRICE PROPOSED' : item.status.toUpperCase()}
                                            </span>
                                            {/* Display Coins and Rank details if they have been set */}
                                            {(item.coins_per_coupon || item.rank) && (
                                                <div className="flex gap-2 text-[10px] font-medium text-gray-500">
                                                    <span className="bg-gray-100 px-1.5 py-0.5 rounded">Coins: {item.coins_per_coupon || 0}</span>
                                                    <span className="bg-gray-100 px-1.5 py-0.5 rounded">Rank: {item.rank || 'N/A'}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {item.status === 'pending' && (
                                                <button
                                                    onClick={() => { setSelectedRequest(item); setIsModalOpen(true); }}
                                                    className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 text-sm rounded-lg hover:bg-blue-50 transition-all font-medium"
                                                >
                                                    <Eye className="w-4 h-4" /> Set Visibility
                                                </button>
                                            )}

                                            {item.status === 'paid' && (
                                                <div className="flex items-center gap-2">
                                                    {/* Approve Button */}
                                                    <button
                                                        onClick={() => {
                                                            setSelectedRequest(item);
                                                            setActionType('approve'); // State to track "approve" or "reject"
                                                            setIsApproveModalOpen(true);
                                                        }}
                                                        className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-all font-medium"
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                                                    </button>

                                                    {/* Reject Button */}
                                                    <button
                                                        onClick={() => {
                                                            setSelectedRequest(item);
                                                            setActionType('reject');
                                                            setIsApproveModalOpen(true);
                                                        }}
                                                        className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 text-xs rounded-lg hover:bg-red-100 transition-all font-medium"
                                                    >
                                                        <XCircle className="w-3.5 h-3.5" /> Reject
                                                    </button>
                                                </div>
                                            )}

                                            {item.status === 'approved' && (
                                                <div className="flex items-center gap-2 px-0 py-2 text-gray-400 text-sm font-normal">
                                                    <CheckCircle className="w-3.5 h-3.5 text-green-500" /> No actions left
                                                </div>
                                            )}

                                            {item.status === 'price_proposed' && (
                                                <div className="flex items-center gap-2 px-0 py-2 text-gray-400 text-sm font-normal ">
                                                    <Clock4 className="w-3.5 h-3.5 text-amber-500" /> Waiting for payment
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {pagination.totalPages > 1 && (
                    <div className="p-4 border-t flex items-center justify-between">
                        <p className="text-sm text-gray-600">Total {pagination.total} requests</p>
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            onPageChange={fetchSponsorships}
                        />
                    </div>
                )}
            </div>

            {/* Set Price Modal */}
            {isModalOpen && (
                <SetVisibilityModal
                    request={selectedRequest}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => { setIsModalOpen(false); fetchSponsorships(pagination.page); }}
                />
            )}

            {/* Approve Modal */}
            {isApproveModalOpen && (
                <ApproveSponsorshipModal
                    request={selectedRequest}
                    actionType={actionType}
                    onClose={() => setIsApproveModalOpen(false)}
                    onSuccess={() => {
                        setIsApproveModalOpen(false);
                        fetchSponsorships(pagination.page);
                    }}
                />
            )}
        </div>
    );
};

export default SponsorshipPage;