import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { Api } from '../../Context/apiService';

const SetVisibilityModal = ({ request, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        request_id: request._id,
        price: "",
        coins: "",
        rank: "",
        start_date: "",
        end_date: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '', show: false });

    const showMessage = (text, type) => {
        setMessage({ text, type, show: true });
    };

    const closeMessage = () => {
        setMessage({ text: '', type: '', show: false });
    };

    const handleChange = (field, value) => {
        if (message.show) closeMessage();
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        closeMessage();

        if (!formData.price) return showMessage('Please enter price', 'error');
        if (!formData.coins) return showMessage('Please enter coins', 'error');
        if (!formData.rank) return showMessage('Please enter rank priority', 'error');
        if (!formData.start_date) return showMessage('Please select a start date', 'error');
        if (!formData.end_date) return showMessage('Please select an end date', 'error');

        setSubmitting(true);
        try {
            const res = await Api.setSponsorshipPrice(formData);
            if (res.success) {
                onSuccess();
            } else {
                showMessage(res.message || "Failed to set visibility", 'error');
            }
        } catch (err) {
            console.error(err);
            showMessage("An internal server error occurred", 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b">
                    <h3 className="text-lg font-bold">Set Sponsorship Visibility</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {message.show && (
                        <div className={`p-3 rounded-lg flex items-center gap-2 text-sm border animate-in slide-in-from-top-2 ${message.type === 'error' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'
                            }`}>
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span className="flex-1">{message.text}</span>
                            <button type="button" onClick={closeMessage} className="text-lg leading-none">&times;</button>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Price (INR)</label>
                        <input
                            type="text"
                            className="w-full p-2.5 border font-normal text-sm rounded-lg outline-none focus:ring-1"
                            value={formData.price}
                            onChange={e => {
                                const val = e.target.value.replace(/\D/g, '');
                                handleChange('price', val);
                            }}
                            placeholder='Enter price'
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase">Rank (Priority)</label>
                            <input
                                type="text"
                                className="w-full p-2.5 font-normal text-sm border rounded-lg outline-none focus:ring-1"
                                value={formData.rank}
                                onChange={e => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    handleChange('rank', val);
                                }}
                                placeholder='Enter rank value'
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase">Coins</label>
                            <input
                                type="text"
                                className="w-full p-2.5 font-normal text-sm border rounded-lg outline-none focus:ring-1"
                                value={formData.coins}
                                onChange={e => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    handleChange('coins', val);
                                }}
                                placeholder='Enter coins value'
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase">Start Date</label>
                            <input
                                type="date"
                                className="w-full p-2.5 border font-normal text-sm rounded-lg outline-none focus:ring-1"
                                value={formData.start_date}
                                onChange={e => handleChange('start_date', e.target.value)}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase">End Date</label>
                            <input
                                type="date"
                                className="w-full p-2.5 font-normal text-sm border rounded-lg outline-none focus:ring-1"
                                value={formData.end_date}
                                onChange={e => handleChange('end_date', e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
                    >
                        {submitting ? "Saving..." : <><Save className="w-4 h-4" /> Save Configuration</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SetVisibilityModal;