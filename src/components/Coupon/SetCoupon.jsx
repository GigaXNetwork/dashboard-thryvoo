import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react'; // Using lucide-react for the close icon

const SetCoupon = ({ onClose }) => {
    const [form, setForm] = useState({
        discountType: 'percentage',
        discountAmount: '',
        maxDiscount: '',
        minPurchase: '',
        day: '',
        usageLimit: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setForm({
            discountType: 'percentage',
            discountAmount: '',
            maxDiscount: '',
            minPurchase: '',
            day: '',
            usageLimit: ''
        });
    };

    useEffect(() => {
        const fetchCoupon = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/getCoupon`, {
                    credentials: 'include'
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data) {
                        setForm({
                            discountType: data.discount.discountType || 'percentage',
                            discountAmount: data.discount.discountAmount?.toString() || '',
                            maxDiscount: data.discount.maxDiscount?.toString() || '',
                            minPurchase: data.discount.minPurchase?.toString() || '',
                            day: data.discount.day?.toString() || '',
                            usageLimit: data.discount.usageLimit?.toString() || ''
                        });
                    }
                }
            } catch (err) {
                // Handle error if needed
            }
        };
        fetchCoupon();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const {
            discountType, discountAmount, maxDiscount,
            minPurchase, day, usageLimit
        } = form;

        setLoading(true);
        setMessage('');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/setCoupon`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    discountType,
                    discountAmount: parseFloat(discountAmount),
                    maxDiscount: parseFloat(maxDiscount),
                    minPurchase: parseFloat(minPurchase),
                    day: parseInt(day),
                    usageLimit: parseInt(usageLimit)
                })
            });

            const data = await res.json();
            if (res.ok) {
                setMessage("✅ Coupon set successfully!");
                resetForm();
            } else {
                setMessage(data.message || '❌ Failed to set coupon.');
            }
        } catch (err) {
            setMessage('❌ Error setting coupon.');
        } finally {
            setLoading(false);
        }
    };
    console.log(onClose);
    
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
            <form
                onSubmit={handleSubmit}
                className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-md space-y-4 animate-fade-in"
            >
                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
                >
                    <X size={20} className="pointer-events-none"/>
                </button>

                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">Set Coupon</h2>

                {[ 
                    { label: 'Discount Amount', name: 'discountAmount', type: 'number', min: 1 },
                    { label: 'Max Discount', name: 'maxDiscount', type: 'number', min: 0 },
                    { label: 'Min Purchase', name: 'minPurchase', type: 'number', min: 0 },
                    { label: 'Valid Days', name: 'day', type: 'number', min: 1 },
                    { label: 'Usage Limit', name: 'usageLimit', type: 'number', min: 1 },
                ].map(({ label, name, type, min }) => (
                    <div key={name}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {label}
                        </label>
                        <input
                            type={type}
                            name={name}
                            min={min}
                            value={form[name]}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                ))}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Discount Type
                    </label>
                    <select
                        name="discountType"
                        value={form.discountType}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center transition"
                >
                    {loading && (
                        <svg
                            className="animate-spin h-5 w-5 mr-2 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8z"
                            ></path>
                        </svg>
                    )}
                    {loading ? 'Setting...' : 'Set Coupon'}
                </button>

                {message && (
                    <div className={`text-center text-sm font-medium mt-2 ${message.includes("✅") ? 'text-green-600' : 'text-red-500'}`}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
};

export default SetCoupon;
