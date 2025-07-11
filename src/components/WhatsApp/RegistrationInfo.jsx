import React, { useState } from 'react';
import { ClipboardCopy, Trash2, PencilLine, Check } from 'lucide-react';

function RegistrationInfo({ data, onUpdate = () => { }, onDelete = () => { } }) {
    const [copied, setCopied] = useState(false);

    if (!data) {
        return (
            <div className="text-center text-gray-400 p-4 font-medium">
                🚫 No registration data available.
            </div>
        );
    }

    const {
        whatsappToken,
        whatsappBusinessId,
        phoneNumberId,
        createdAt,
        updatedAt,
    } = data;

    const formatDate = (isoDate) =>
        new Date(isoDate).toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this registration?')) {
            onDelete(data);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 bg-white/80 backdrop-blur-lg shadow-xl rounded-3xl border border-gray-200 transition hover:shadow-2xl">
            {/* Header */}
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
                📋 WhatsApp Registration Details
            </h2>

            {/* Warning Note */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 text-sm p-4 rounded-md mb-4">
                ⚠️ <strong>Warning:</strong> Changing or deleting this registration may interrupt your WhatsApp message delivery. Please proceed with caution.
            </div>


            {/* Grid Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700 mb-6">
                <div className="md:col-span-2">
                    <label className="block font-medium text-gray-700 mb-1">🔐 WhatsApp Token</label>

                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono text-gray-700 overflow-x-auto whitespace-nowrap relative">
                        <span className="flex-1 min-w-0 truncate">
                            {whatsappToken.slice(0, 80)}...
                        </span>

                        <button
                            onClick={() => copyToClipboard(whatsappToken)}
                            className="ml-2 flex-shrink-0 text-blue-600 hover:text-blue-800 transition"
                            title="Copy token"
                            aria-label="Copy WhatsApp token"
                        >
                            {copied ? (
                                <Check size={16} className="text-green-500" />
                            ) : (
                                <ClipboardCopy size={16} />
                            )}
                        </button>
                    </div>
                </div>



                <InfoCard label="🏢 Business ID" value={whatsappBusinessId} />
                <InfoCard label="📞 Phone Number ID" value={phoneNumberId} />
                <InfoCard label="📅 Created At" value={formatDate(createdAt)} />
                <InfoCard label="♻️ Updated At" value={formatDate(updatedAt)} />
            </div>

            {/* Action Buttons at the Bottom */}
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4 border-t mt-6">
                <button
                    onClick={() => onUpdate(data)}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition"
                >
                    <PencilLine size={16} />
                    Update
                </button>
                <button
                    onClick={handleDelete}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-full hover:bg-red-700 transition"
                >
                    <Trash2 size={16} />
                    Delete
                </button>
            </div>
        </div>
    );
}

function InfoCard({ label, value }) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <div className="text-xs text-gray-500 uppercase font-semibold mb-1 tracking-wide">
                {label}
            </div>
            <div className="text-gray-800 text-sm break-words font-medium">{value}</div>
        </div>
    );
}

export default RegistrationInfo;
