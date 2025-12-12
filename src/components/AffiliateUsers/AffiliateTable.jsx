import React from "react";
import {
    User,
    Mail,
    Phone,
    Calendar,
    Check,
    X
} from "lucide-react";
import Pagination from "../Common/Pagination";
import { Link } from "react-router";

const AffiliateTable = ({
    affiliates,
    loading,
    pagination,
    onPageChange,
    onViewDetail,
    onApprove,
    onReject,
    userRole = "admin"
}) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'pending': return 'bg-amber-100 text-amber-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="py-20 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-3 text-gray-600">Loading affiliates...</p>
            </div>
        );
    }

    if (affiliates.length === 0) {
        return (
            <div className="py-20 text-center">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No affiliates found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
            </div>
        );
    }

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Affiliate
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Contact
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Location
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Applied
                            </th>
                            {userRole === "admin" && (
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {affiliates.map((affiliate) => (
                            <tr key={affiliate.id || affiliate._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                            <User className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <Link
                                                to={`/affiliate/${affiliate.id || affiliate._id}`}
                                                className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer text-left transition-colors duration-200 group"
                                            >
                                                <span className="relative">
                                                    {affiliate.fullName}
                                                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-200"></span>
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                            <span className="truncate max-w-[180px]" title={affiliate.email}>
                                                {affiliate.email}
                                            </span>
                                        </div>
                                        {affiliate.mobile && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                                <span>{affiliate.mobile}</span>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(affiliate.status)}`}>
                                            {affiliate.status?.charAt(0).toUpperCase() + affiliate.status?.slice(1) || 'Unknown'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {affiliate.country ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600 truncate max-w-[150px]" title={`${affiliate.city ? `${affiliate.city}, ` : ''}${affiliate.country}`}>
                                                {affiliate.city ? `${affiliate.city}, ` : ''}{affiliate.country}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 text-sm">Not specified</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                        <span>
                                            {affiliate.createdAt ? new Date(affiliate.createdAt).toLocaleDateString('en-US', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            }) : 'N/A'}
                                        </span>
                                    </div>
                                </td>
                                {userRole === "admin" && (
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {affiliate.status === 'pending' ? (
                                                <>
                                                    <button
                                                        onClick={() => onApprove(affiliate)}
                                                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                                        title="Approve"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => onReject(affiliate)}
                                                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                        title="Reject"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-sm text-gray-400 px-2">
                                                    {affiliate.status === 'approved' ? 'Approved' : 'Rejected'}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Component */}
            {pagination && pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t bg-gray-50">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-700">
                            Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                            <span className="font-medium">
                                {Math.min(pagination.page * pagination.limit, pagination.total)}
                            </span> of{' '}
                            <span className="font-medium">{pagination.total}</span> affiliates
                        </div>
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            onPageChange={onPageChange}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default AffiliateTable;