// src/components/AffiliateUsers/AffiliateManagement.jsx
import React, { useState, useEffect } from "react";
import {
    User,
    UserCheck,
    Clock,
    Download,
    X,
    Check,
    Copy
} from "lucide-react";
import { Api, apiRequest } from "../../Context/apiService";
import MessagePopup from "../Common/MessagePopup";
import AffiliateFilters from "./AffiliateFilters";
import AffiliateTable from "./AffiliateTable";

export default function AffiliateManagement({ role = "admin" }) {
    // State management
    const [affiliates, setAffiliates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: "",
        search: "",
        page: 1,
        limit: 10
    });
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1
    });

    // Modal states
    const [selectedAffiliate, setSelectedAffiliate] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);
    const [actionType, setActionType] = useState("");
    const [processingAction, setProcessingAction] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [message, setMessage] = useState({ text: '', type: '', show: false });


    const fetchAffiliates = async () => {
        setLoading(true);
        try {
            const response = await Api.getAffiliateUsers(
                filters.page,
                filters.limit,
                filters.search,
                filters.status
            );

            if (response.ok) {
                setAffiliates(response.data || []);
                setPagination({
                    total: response.total || 0,
                    page: response.page || 1,
                    limit: filters.limit,
                    totalPages: Math.ceil((response.total || 0) / filters.limit)
                });
            } else {
                throw new Error(response.message || 'Failed to fetch affiliates');
            }
        } catch (error) {
            console.error("Error fetching affiliates:", error);
            showMessage('Failed to load affiliates', 'error');
            setAffiliates([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAffiliates();
        }, 300);

        return () => clearTimeout(timer);
    }, [filters.page, filters.limit, filters.status, filters.search]);


    // Message handling
    const showMessage = (text, type) => {
        setMessage({ text, type, show: true });
    };

    const closeMessage = () => {
        setMessage({ text: '', type: '', show: false });
    };

    // Filter handlers
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handleClearFilters = () => {
        setFilters({
            status: "",
            search: "",
            page: 1,
            limit: 20
        });
    };

    // Pagination handler
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setFilters(prev => ({ ...prev, page: newPage }));
        }
    };

    // Action handlers - FIXED: Make sure we're comparing IDs correctly
    const handleApproveReject = async () => {
        if (!selectedAffiliate || !actionType) return;

        if (actionType === 'reject' && !rejectionReason.trim()) {
            showMessage('Please provide a rejection reason', 'error');
            return;
        }

        setProcessingAction(true);
        try {
            const payload = {
                action: actionType,
                ...(actionType === 'reject' && { reason: rejectionReason.trim() })
            };

            const response = await apiRequest(
                `/api/affiliate/admin/approve/${selectedAffiliate.id || selectedAffiliate._id}`,
                "POST",
                payload
            );

            if (response.ok) {
                showMessage(
                    actionType === 'approve'
                        ? `Affiliate approved! Referral Code: ${response.referralCode}`
                        : `Affiliate rejected successfully. Reason: ${rejectionReason}`,
                    'success'
                );

                setAffiliates(prev =>
                    prev.map(aff => {
                        console.log("aff", aff)
                        const currentId = aff.id || aff._id;
                        const selectedId = selectedAffiliate.id || selectedAffiliate._id;

                        return currentId === selectedId
                            ? {
                                ...aff,
                                status: actionType === 'approve' ? 'approved' : 'rejected',
                                ...(actionType === 'approve' && { referralCode: response.referralCode }),
                                rejectionReason: actionType === 'reject' ? rejectionReason : aff.rejectionReason
                            }
                            : aff;
                    })
                );

                fetchAffiliates();
                setShowActionModal(false);
                setSelectedAffiliate(null);
                setActionType("");
                setRejectionReason("");
            } else {
                throw new Error(response.message || 'Action failed');
            }
        } catch (error) {
            console.error("Error processing action:", error);
            showMessage(error.message || 'Failed to process request', 'error');
        } finally {
            setProcessingAction(false);
        }
    };

    const openActionModal = (affiliate, action) => {
        setSelectedAffiliate(affiliate);
        setActionType(action);
        setRejectionReason("");
        setShowActionModal(true);
    };

    const openDetailModal = (affiliate) => {
        setSelectedAffiliate(affiliate);
        setShowDetailModal(true);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        showMessage('Copied to clipboard!', 'success');
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Message Popup */}
            {message.show && (
                <MessagePopup
                    message={message.text}
                    type={message.type}
                    onClose={closeMessage}
                />
            )}

            {/* Header */}
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Affiliate Management</h1>
                <p className="text-gray-600">Manage and review affiliate applications</p>
            </div>

            {/* Filters */}
            <AffiliateFilters
                search={filters.search}
                setSearch={(value) => handleFilterChange('search', value)}
                statusFilter={filters.status}
                setStatusFilter={(value) => handleFilterChange('status', value)}
                onClearFilters={handleClearFilters}
                onFilterChange={() => { }}
            />

            {/* Main Table Card */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden mt-6">
                <AffiliateTable
                    affiliates={affiliates}
                    loading={loading}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onViewDetail={openDetailModal}
                    onApprove={(affiliate) => openActionModal(affiliate, 'approve')}
                    onReject={(affiliate) => openActionModal(affiliate, 'reject')}
                    onCopyCode={copyToClipboard}
                    userRole={role}
                />
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedAffiliate && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="px-6 py-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Affiliate Details</h3>
                            <button onClick={() => setShowDetailModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User className="w-8 h-8 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold">{selectedAffiliate.fullName}</h4>
                                    <p className="text-gray-600">{selectedAffiliate.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedAffiliate.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            selectedAffiliate.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-amber-100 text-amber-800'
                                            }`}>
                                            {selectedAffiliate.status}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Role</p>
                                    <p className="font-medium">{selectedAffiliate.role || 'affiliate'}</p>
                                </div>
                                {selectedAffiliate.mobile && (
                                    <div>
                                        <p className="text-sm text-gray-500">Mobile</p>
                                        <p className="font-medium">{selectedAffiliate.mobile}</p>
                                    </div>
                                )}
                                {selectedAffiliate.country && (
                                    <div>
                                        <p className="text-sm text-gray-500">Location</p>
                                        <p className="font-medium">
                                            {selectedAffiliate.city ? `${selectedAffiliate.city}, ` : ''}{selectedAffiliate.country}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {selectedAffiliate.rejectionReason && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Rejection Reason</p>
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                        <p className="text-yellow-800 text-sm">{selectedAffiliate.rejectionReason}</p>
                                    </div>
                                </div>
                            )}

                            {selectedAffiliate.referralCode && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Referral Code</p>
                                    <div className="flex items-center gap-2">
                                        <code className="bg-gray-100 px-3 py-2 rounded-lg font-mono text-sm">
                                            {selectedAffiliate.referralCode}
                                        </code>
                                        <button
                                            onClick={() => copyToClipboard(selectedAffiliate.referralCode)}
                                            className="p-2 hover:bg-gray-100 rounded-lg"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div>
                                <p className="text-sm text-gray-500">Applied On</p>
                                <p className="font-medium">
                                    {selectedAffiliate.createdAt
                                        ? `${new Date(selectedAffiliate.createdAt).toLocaleDateString()} at ${new Date(selectedAffiliate.createdAt).toLocaleTimeString()}`
                                        : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Modal - ONLY ONE MODAL SHOULD BE HERE */}
            {showActionModal && selectedAffiliate && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="px-6 py-4 border-b">
                            <h3 className="text-lg font-semibold">
                                {actionType === 'approve' ? 'Approve Affiliate' : 'Reject Affiliate'}
                            </h3>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-700 mb-4">
                                {actionType === 'approve' ? (
                                    <>
                                        Are you sure you want to approve <strong>{selectedAffiliate.fullName}</strong>?
                                        They will receive a referral code and can start earning commissions.
                                    </>
                                ) : (
                                    <>
                                        Are you sure you want to reject <strong>{selectedAffiliate.fullName}</strong>?
                                        Please provide a reason for rejection.
                                    </>
                                )}
                            </p>

                            {actionType === 'reject' && (
                                <div className="mb-4">
                                    <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-2">
                                        Rejection Reason *
                                    </label>
                                    <textarea
                                        id="rejectionReason"
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        placeholder="Provide a reason for rejection..."
                                        className="w-full px-3 py-2 border border-gray-300 outline-none rounded-lg focus:ring-0 focus:ring-blue-500 focus:border-blue-500"
                                        rows="3"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        This reason will be shared with the affiliate.
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setShowActionModal(false);
                                        setRejectionReason("");
                                    }}
                                    disabled={processingAction}
                                    className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleApproveReject}
                                    disabled={processingAction || (actionType === 'reject' && !rejectionReason.trim())}
                                    className={`px-5 py-2 rounded-lg font-medium text-white ${actionType === 'approve'
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-red-600 hover:bg-red-700'
                                        } disabled:opacity-50`}
                                >
                                    {processingAction ? 'Processing...' : actionType === 'approve' ? 'Approve' : 'Reject'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}