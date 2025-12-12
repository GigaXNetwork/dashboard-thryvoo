import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Users,
    DollarSign,
    Activity,
    Copy,
    Check,
    X,
    FileText
} from "lucide-react";
import { Api } from "../../Context/apiService";
import MessagePopup from "../../components/Common/MessagePopup";
import EditAffiliateModal from "./EditAffiliateModal";

const AffiliateDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [affiliate, setAffiliate] = useState(null);
    const [totals, setTotals] = useState({});
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showActionModal, setShowActionModal] = useState(false);
    const [actionType, setActionType] = useState("");
    const [processingAction, setProcessingAction] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [message, setMessage] = useState({ text: '', type: '', show: false });
    const [showEditModal, setShowEditModal] = useState(false)

    useEffect(() => {
        const fetchAffiliateDetails = async () => {
            try {
                setLoading(true);
                const response = await Api.getAffiliateDetail(id);

                if (response.ok) {
                    setAffiliate(response.affiliate || response.data?.affiliate);
                    setTotals(response.totals || response.data?.totals || {});
                    setTransactions(response.transactions || response.data?.transactions || []);
                } else {
                    throw new Error(response.message || 'Failed to fetch affiliate details');
                }
            } catch (err) {
                console.error("Error fetching affiliate details:", err);
                setError(err.message || 'Failed to load affiliate details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchAffiliateDetails();
        }
    }, [id]);

    const showMessage = (text, type) => {
        setMessage({ text, type, show: true });
    };

    const closeMessage = () => {
        setMessage({ text: '', type: '', show: false });
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        showMessage('Copied to clipboard!', 'success');
    };

    const handleApproveReject = async () => {
        if (!affiliate || !actionType) return;

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
                `/api/affiliate/admin/approve/${affiliate.id || affiliate._id}`,
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

                // Update affiliate status locally
                setAffiliate(prev => ({
                    ...prev,
                    status: actionType === 'approve' ? 'approved' : 'rejected',
                    ...(actionType === 'approve' && { referralCode: response.referralCode }),
                    rejectionReason: actionType === 'reject' ? rejectionReason : prev.rejectionReason
                }));

                setShowActionModal(false);
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

    const openActionModal = (action) => {
        setActionType(action);
        setRejectionReason("");
        setShowActionModal(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'pending': return 'bg-amber-100 text-amber-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleEditSuccess = (updatedAffiliate) => {
        setAffiliate(prev => ({
            ...prev,
            ...updatedAffiliate
        }));
        showMessage('Affiliate details updated successfully!', 'success');
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (error || !affiliate) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="text-center py-12">
                    <p className="text-red-600 mb-4">{error || 'Affiliate not found'}</p>
                    <button
                        onClick={() => navigate('/affiliate-users')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Back to Affiliates
                    </button>
                </div>
            </div>
        );
    }

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
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Link
                                to="/affiliate-users"
                                className="inline-flex items-center justify-center text-blue-600 hover:text-blue-800 p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <h1 className="text-2xl font-bold text-gray-900">{affiliate.fullName}</h1>
                        </div>
                        <span className={`px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(affiliate.status)}`}>
                            {affiliate.status?.charAt(0).toUpperCase() + affiliate.status?.slice(1)}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        {affiliate.status === 'pending' && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openActionModal('approve')}
                                    className="px-3 py-1 bg-white text-green-600 border border-green-600 text-sm rounded-md hover:bg-green-600 hover:text-white"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => openActionModal('reject')}
                                    className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                                >
                                    Reject
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Affiliate Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Information Card */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-gray-400" />
                            Personal Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                        <Mail className="w-4 h-4" />
                                        Email
                                    </div>
                                    <p className="font-medium">{affiliate.email}</p>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                        <Phone className="w-4 h-4" />
                                        Mobile
                                    </div>
                                    <p className="font-medium">{affiliate.mobile || 'Not provided'}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                        <MapPin className="w-4 h-4" />
                                        Location
                                    </div>
                                    <p className="font-medium">
                                        {affiliate.city ? `${affiliate.city}, ${affiliate.country}` : affiliate.country || 'Not specified'}
                                    </p>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                        <Calendar className="w-4 h-4" />
                                        Joined Date
                                    </div>
                                    <p className="font-medium">
                                        {affiliate.createdAt ? new Date(affiliate.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Affiliate Details Card */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-gray-400" />
                            Affiliate Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Referral Code</p>
                                    <div className="flex items-center gap-2">
                                        {affiliate.referralCode ? (
                                            <>
                                                <code className="bg-gray-100 px-4 py-2 rounded-lg font-mono text-lg font-bold">
                                                    {affiliate.referralCode}
                                                </code>
                                                <button
                                                    onClick={() => copyToClipboard(affiliate.referralCode)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                                    title="Copy to clipboard"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <p className="text-gray-400">No referral code assigned</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Commission Percentage</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {affiliate.commissionPercentage || 0}%
                                    </p>
                                </div>
                            </div>

                            {affiliate.rejectionReason && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Rejection Reason</p>
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                        <p className="text-red-800">{affiliate.rejectionReason}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Transactions Card */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-gray-400" />
                            Recent Transactions
                        </h2>
                        {transactions.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {transactions.map((transaction, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    {new Date(transaction.date || transaction.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap font-medium">
                                                    ${transaction.amount}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${(transaction.status || '').toLowerCase() === 'completed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {transaction.status || 'pending'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-500">No transactions found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Stats & Actions */}
                <div className="space-y-6">
                    {/* Stats Card */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-gray-400" />
                            Performance Stats
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-center">
                                    <Users className="w-5 h-5 text-blue-600 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-600">Referred Users</p>
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {totals.referredUsers || 0}
                                </p>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                                <div className="flex items-center">
                                    <DollarSign className="w-5 h-5 text-green-600 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-600">Total Transactions</p>
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {totals.transactions || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Additional Actions Card */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-gray-400" />
                            Quick Actions
                        </h2>
                        <div className="space-y-3">
                            <button
                                onClick={() => setShowEditModal(true)}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Edit Affiliate Details
                            </button>
                            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                Send Email Notification
                            </button>
                            <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                                View Commission Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Modal */}
            {showActionModal && (
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
                                        Are you sure you want to approve <strong>{affiliate.fullName}</strong>?
                                        They will receive a referral code and can start earning commissions.
                                    </>
                                ) : (
                                    <>
                                        Are you sure you want to reject <strong>{affiliate.fullName}</strong>?
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

            {showEditModal && (
                <EditAffiliateModal
                    affiliate={affiliate}
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={handleEditSuccess}
                />
            )}
        </div>
    );
};

export default AffiliateDetails;