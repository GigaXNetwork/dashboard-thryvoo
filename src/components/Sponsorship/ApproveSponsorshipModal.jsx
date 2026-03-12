// import React, { useState } from 'react';
// import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
// import { Api } from '../../Context/apiService';

import { X } from "lucide-react";
import { useState } from "react";
import { Api } from "../../Context/apiService";

// const ApproveSponsorshipModal = ({ request, onClose, onSuccess }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [error, setError] = useState(null);

//     const handleApprove = async () => {
//         setSubmitting(true);
//         setError(null);
//         try {
//             const res = await Api.approveSponsorship(request._id);
//             if (res.success) {
//                 // You can access res.offer here if you want to show a success summary
//                 onSuccess();
//             } else {
//                 setError(res.message || "Failed to approve sponsorship.");
//             }
//         } catch (err) {
//             setError("A network error occurred. Please try again.");
//             console.error("Approval Error:", err);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     return (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
//             <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
//                 {/* Header */}
//                 <div className="flex items-center justify-between p-5 border-b">
//                     <div className="flex items-center gap-2 text-green-600">
//                         <CheckCircle className="w-5 h-5" />
//                         <h3 className="text-lg font-bold text-gray-800">Confirm Approval</h3>
//                     </div>
//                     <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//                         <X className="w-5 h-5 text-gray-400" />
//                     </button>
//                 </div>
                
//                 {/* Body */}
//                 <div className="p-6">
//                     <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-4">
//                         <p className="text-sm text-green-800 leading-relaxed">
//                             You are about to approve the sponsorship for <strong>{request?.business_id?.name}</strong>. 
//                             This will activate the offer for the product <strong>{request?.product?.name}</strong>.
//                         </p>
//                     </div>

//                     <div className="space-y-3">
//                         <div className="flex justify-between text-sm">
//                             <span className="text-gray-500">Business Email:</span>
//                             <span className="font-medium text-gray-900">{request?.business_id?.email}</span>
//                         </div>
//                         <div className="flex justify-between text-sm">
//                             <span className="text-gray-500">Discount Price:</span>
//                             <span className="font-medium text-gray-900">₹{request?.discount_price}</span>
//                         </div>
//                         <div className="flex justify-between text-sm">
//                             <span className="text-gray-500">Quantity:</span>
//                             <span className="font-medium text-gray-900">{request?.quantity} Units</span>
//                         </div>
//                     </div>

//                     {error && (
//                         <div className="mt-4 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
//                             <AlertCircle className="w-4 h-4" />
//                             {error}
//                         </div>
//                     )}
//                 </div>

//                 {/* Footer */}
//                 <div className="flex gap-3 p-5 bg-gray-50 border-t">
//                     <button 
//                         onClick={onClose}
//                         className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-white transition-all"
//                     >
//                         Cancel
//                     </button>
//                     <button 
//                         onClick={handleApprove}
//                         disabled={submitting}
//                         className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:bg-green-400 transition-all shadow-lg shadow-green-200"
//                     >
//                         {submitting ? (
//                             <Loader2 className="w-4 h-4 animate-spin" />
//                         ) : (
//                             "Yes, Approve"
//                         )}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ApproveSponsorshipModal;


const ApproveSponsorshipModal = ({ request, actionType, onClose, onSuccess }) => {
    const [submitting, setSubmitting] = useState(false);
    const isApprove = actionType === 'approve';

    const handleAction = async () => {
        console.log("object")
        setSubmitting(true);
        try {
            const res = await Api.approveSponsorship(request._id, actionType);
            if (res.success) {
                onSuccess();
            } else {
                alert(res.message || `Failed to ${actionType} request`);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                <div className={`p-5 border-b flex justify-between items-center ${isApprove ? 'bg-green-50' : 'bg-red-50'}`}>
                    <h3 className={`font-bold ${isApprove ? 'text-green-700' : 'text-red-700'}`}>
                        Confirm {isApprove ? 'Approval' : 'Rejection'}
                    </h3>
                    <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
                </div>
                
                <div className="p-6">
                    <p className="text-sm text-gray-600">
                        Are you sure you want to <strong>{actionType}</strong> the sponsorship for 
                        <strong> {request?.business_id?.name}</strong>?
                    </p>
                </div>

                <div className="flex gap-3 p-4 bg-gray-50 border-t">
                    <button onClick={onClose} className="flex-1 px-4 py-2 border rounded-xl hover:bg-white transition-all">Cancel</button>
                    <button 
                        onClick={handleAction}
                        disabled={submitting}
                        className={`flex-1 py-2 text-white rounded-xl font-bold transition-all ${
                            isApprove ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                        }`}
                    >
                        {submitting ? "Processing..." : `Yes, ${isApprove ? 'Approve' : 'Reject'}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApproveSponsorshipModal;