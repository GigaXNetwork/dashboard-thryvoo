import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { X } from 'lucide-react';

const SetDiscountPage = ({ user }) => {
    const [presets, setPresets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [presetToDelete, setPresetToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingPresetId, setEditingPresetId] = useState(null);

    const menuRefs = useRef([]);


    const toggleMenu = (i) => {
        setOpenMenuIndex(openMenuIndex === i ? null : i);
    };

    const [form, setForm] = useState({
        discountType: 'percentage',
        presetName: '',
        discountAmount: '',
        maxDiscount: '',
        minPurchase: '',
        day: '',
        usageLimit: ''
    });

    const { userId } = useParams();
    const getUrl = user === 'admin'
        ? `${import.meta.env.VITE_API_URL}/api/admin/user/${userId}/getDiscount`
        : `${import.meta.env.VITE_API_URL}/api/user/getCoupon`;

    const setUrl = user === 'admin'
        ? `${import.meta.env.VITE_API_URL}/api/admin/user/${userId}/setDiscount`
        : `${import.meta.env.VITE_API_URL}/api/user/setCoupon`;


    // fetch all presets data
    const fetchPresets = async () => {
        try {
            const res = await fetch(getUrl, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setPresets(data.discount || []);
            }
        } catch (err) {
            console.error("Failed to fetch presets:", err);
        }
    };

    useEffect(() => {
        fetchPresets();
    }, []);


    // handle change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setForm({
            discountType: 'percentage',
            presetName: '',
            discountAmount: '',
            maxDiscount: '',
            minPurchase: '',
            day: '',
            usageLimit: ''
        });
    };


    // handle submit 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const {
            discountType, presetName, discountAmount,
            maxDiscount, minPurchase, day, usageLimit
        } = form;

        try {
            const method = isEditing ? 'PATCH' : 'POST';
            const url = isEditing
                ? `${import.meta.env.VITE_API_URL}/api/user/coupon/presets/${editingPresetId}`
                : setUrl;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    discountType,
                    presetName,
                    discountAmount,
                    maxDiscount: parseFloat(maxDiscount),
                    minPurchase: parseFloat(minPurchase),
                    day: parseInt(day),
                    usageLimit: parseInt(usageLimit)
                })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(isEditing ? '✅ Preset updated!' : '✅ Coupon set successfully!');
                resetForm();
                fetchPresets();
                setShowForm(false);
                setIsEditing(false);
                setEditingPresetId(null);
            } else {
                setMessage(data.message || '❌ Failed to save preset.');
            }
        } catch (err) {
            console.error(err);
            setMessage('❌ Error saving preset.');
        } finally {
            setLoading(false);
        }
    };



    // 3 dots menu action
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                openMenuIndex !== null &&
                menuRefs.current[openMenuIndex] &&
                !menuRefs.current[openMenuIndex].contains(event.target)
            ) {
                setOpenMenuIndex(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openMenuIndex]);

    // delete preset
    const handleDeletePreset = async (preset) => {

        try {
            const deleteUrl = `${import.meta.env.VITE_API_URL}/api/user/coupon/presets/${preset._id}`;
            const res = await fetch(deleteUrl, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (res.ok) {
                setMessage('✅ Preset deleted successfully!');
                setPresets(prev => prev.filter(p => p._id !== preset._id));
                // Refresh the list
            } else {
                const data = await res.json();
                setMessage(data.message || '❌ Failed to delete preset.');
            }
        } catch (err) {
            console.error("Delete failed:", err);
            setMessage('❌ Error deleting preset.');
        }
    };


    // set active status
    const handleToggleActive = async (preset) => {
        try {
            const toggleUrl = `${import.meta.env.VITE_API_URL}/api/user/coupon/presets/${preset._id}/setActive`;
            const res = await fetch(toggleUrl, {
                method: 'PATCH', // Assuming PATCH is used for partial updates
                credentials: 'include',
            });

            const data = await res.json();

            if (res.ok) {
                // Update local state

                setPresets(prev =>
                    prev.map(p => ({
                        ...p,
                        isActive: p._id === preset._id
                    }))
                );

            } else {
                setMessage(data.message || '❌ Failed to update status.');
            }
        } catch (err) {
            console.error("Toggle error:", err);
            setMessage('❌ Error updating status.');
        }
    };

    // edit preset
    const handleEditPreset = (preset) => {
        setForm({
            discountType: preset.discountType || 'percentage',
            presetName: preset.presetName || '',
            discountAmount: preset.discountAmount || '',
            maxDiscount: preset.maxDiscount || '',
            minPurchase: preset.minPurchase || '',
            day: preset.day || '',
            usageLimit: preset.usageLimit || ''
        });

        setIsEditing(true);
        setEditingPresetId(preset._id);
        setShowForm(true);
    };


    return (
        <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-md min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 text-center">Discount Presets</h1>
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setShowForm(true)}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md shadow transition"
                >
                    + Create Preset
                </button>
            </div>



            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {presets.map((preset, index) => (
                    <div
                        key={index}
                        className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200 shadow-md rounded-2xl p-6 transform hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
                    >

                        {/* 3-dots menu */}
                        <div className="absolute top-4 right-4">
                            <button
                                onClick={() => toggleMenu(index)}
                                className="text-gray-500 hover:text-gray-700"
                                aria-label="Options"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
                                </svg>
                            </button>


                            {/* Dropdown menu */}
                            {openMenuIndex === index && (
                                <div
                                    key={index}
                                    ref={(el) => (menuRefs.current[index] = el)}
                                    className="absolute right-0 mt-2 w-48 bg-white z-10 bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200 shadow-md rounded-2xl p-6 transform hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
                                >

                                    <button
                                        onClick={() => {
                                            handleEditPreset(preset)
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                    >
                                        ✏️ Edit
                                    </button>

                                    <button
                                        onClick={() => {
                                            setPresetToDelete(preset);
                                            setShowDeleteModal(true);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        🗑️ Delete
                                    </button>
                                    <button
                                        onClick={() => handleToggleActive(preset)}
                                        disabled={preset.isActive} // disables when true
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${preset.isActive ? 'text-gray-400 cursor-not-allowed' : ''
                                            }`}
                                    >
                                        ✅ Activate
                                    </button>

                                </div>
                            )}
                        </div>

                        {/* Preset Content */}
                        <div className="mb-5">
                            <h3 className="text-xl font-bold text-indigo-600 tracking-wide border-b-2 pb-2 border-indigo-200 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2a1 1 0 00-.894.553L7.382 6H4a1 1 0 000 2h3a1 1 0 00.894-.553L9.618 4H16a1 1 0 100-2h-6z" />
                                    <path d="M4 10a1 1 0 011-1h10a1 1 0 011 1v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6z" />
                                </svg>
                                {preset.presetName}
                            </h3>
                        </div>

                        <div className="text-sm text-gray-700">
                            <div className="text-sm text-gray-700">
                                {[
                                    { label: "Type", value: preset.discountType },
                                    { label: "Amount", value: preset.discountAmount },
                                    { label: "Max Discount", value: preset.maxDiscount },
                                    { label: "Min Purchase", value: preset.minPurchase },
                                    { label: "Valid Days", value: preset.day },
                                    { label: "Usage Limit", value: preset.usageLimit },
                                ].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between py-2 border-b hover:bg-muted transition-colors"
                                    >
                                        <span className="font-medium text-gray-600">{item.label}:</span>
                                        <span>{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Active badge */}
                        <div className="mt-6 text-right">
                            {preset.isActive && (
                                <span className="inline-block bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full font-semibold tracking-wide shadow-sm">
                                    Active
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>


            {/* Backdrop Overlay */}
            {showForm && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                    onClick={() => setShowForm(false)}
                />
            )}

            {/* Slide-In Form Drawer */}
            <div
                className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${showForm ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b bg-white sticky top-0 z-10">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Create Discount Preset</h2>
                    <button
                        onClick={() => setShowForm(false)}
                        className="text-gray-500 hover:text-red-500 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6 overflow-y-auto h-[calc(100%-64px)]">

                    {/* Type Selector */}
                    <div className="space-y-1">
                        <label htmlFor="discountType" className="text-sm font-medium text-gray-700">
                            Discount Type
                        </label>
                        <select
                            id="discountType"
                            name="discountType"
                            value={form.discountType}
                            onChange={handleChange}
                            disabled={loading}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>

                    {/* Inputs */}
                    {[
                        { label: 'Preset Name', name: 'presetName', type: 'text' },
                        { label: 'Discount Amount', name: 'discountAmount', type: form.discountType === 'custom' ? 'text' : 'number' },
                        { label: 'Max Discount', name: 'maxDiscount', type: 'number' },
                        { label: 'Min Purchase', name: 'minPurchase', type: 'number' },
                        { label: 'Valid Days', name: 'day', type: 'number' },
                        { label: 'Usage Limit', name: 'usageLimit', type: 'number' },
                    ].map(({ label, name, type }) => (
                        <div key={name} className="w-full">
                            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                                {label}
                            </label>
                            <input
                                id={name}
                                name={name}
                                type={type}
                                required
                                value={form[name]}
                                onChange={handleChange}
                                placeholder={`Enter ${label}`}
                                disabled={loading}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 shadow-sm"
                            />
                        </div>

                    ))}

                    {/* Status Message */}
                    {message && (
                        <p
                            className={`text-center text-sm font-medium ${message.includes('✅') ? 'text-green-600' : 'text-red-500'
                                }`}
                        >
                            {message}
                        </p>
                    )}

                    <div className="flex items-center justify-between gap-4">
                        <button
                            type="button"
                            disabled={loading}
                            onClick={resetForm}
                            className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg py-2.5 transition border border-gray-300 shadow-sm"
                        >
                            Reset
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2.5 transition flex items-center justify-center shadow-md"
                        >
                            {loading && (
                                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                            )}
                            {loading ? (isEditing ? 'Updating...' : 'Saving...') : (isEditing ? 'Update Coupon' : 'Create Coupon')}

                        </button>
                    </div>



                </form>
            </div>


            {showDeleteModal && presetToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Delete Preset</h2>
                        <p className="text-sm text-gray-700 mb-6">
                            Are you sure you want to delete <strong>{presetToDelete.presetName}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    await handleDeletePreset(presetToDelete);
                                    setShowDeleteModal(false);
                                    setPresetToDelete(null);
                                }}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SetDiscountPage;
