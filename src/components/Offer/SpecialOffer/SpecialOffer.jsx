import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../../../Context/ContextApt';
import Cookies from "js-cookie"
import PresetCard from '../FlashHourOffer/PresetCard';

const SpecialOffer = () => {
    const [presets, setPresets] = useState([]);
    const [filteredPresets, setFilteredPresets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [presetToDelete, setPresetToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingPresetId, setEditingPresetId] = useState(null);

    // Filter states
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [quickDateFilter, setQuickDateFilter] = useState('');
    const [isSpinningEnabled, setSpinningEnabled] = useState(true);
    const [isToggling, setIsToggling] = useState(false);

    const token = Cookies.get("authToken")
    const menuRefs = useRef([]);
    const { userData } = useUser();
    const { userId } = useParams();

    const userRole = userData?.user?.role || '';

    // Memoize API URLs to prevent recalculations on every render
    const apiUrls = useMemo(() => {
        const baseUrl = import.meta.env.VITE_API_URL;
        return {
            getUrl: userRole === 'admin'
                ? `${baseUrl}/api/admin/user/${userId}/getDiscount`
                : `${baseUrl}/api/user/getCoupon`,
            setUrl: userRole === 'admin'
                ? `${baseUrl}/api/admin/user/${userId}/setDiscount`
                : `${baseUrl}/api/user/setCoupon`,
            editUrl: (id) => userRole === 'admin'
                ? `${baseUrl}/api/admin/user/${userId}/presets/${id}`
                : `${baseUrl}/api/user/coupon/presets/${id}`,
            toggleUrl: (id) => userRole === 'admin'
                ? `${baseUrl}/api/admin/user/${userId}/presets/${id}/setActive`
                : `${baseUrl}/api/user/coupon/presets/${id}/setActive`
        };
    }, [userRole, userId]);

    const initialFormState = useMemo(() => ({
        discountType: 'percentage',
        presetName: '',
        discountAmount: '',
        maxDiscount: '',
        minPurchase: '',
        day: '',
        usageLimit: '',
        type: 'offer'
    }), []);

    const [form, setForm] = useState(initialFormState);

    useEffect(() => {
        const fetchPresets = async () => {
            setFetchLoading(true);

            try {
                const buildQuery = (params) => {
                    return Object.entries(params)
                        .filter(([_, v]) => v !== '' && v !== undefined && v !== null)
                        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
                        .join('&');
                };

                const queryParams = {
                    type: 'offer',
                    ...(search ? { presetName: search.trim() } : {}),
                    ...(statusFilter ? { status: statusFilter } : {}),
                    ...(startDate ? { 'createdAt[gt]': startDate } : {}),
                    ...(endDate ? { 'createdAt[lt]': endDate } : {}),
                };

                const url = `${apiUrls.getUrl}?${buildQuery(queryParams)}`;

                const res = await fetch(url, {
                    credentials: 'include',
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    const offerPresets = data.discount || [];
                    setPresets(offerPresets);
                    setFilteredPresets(offerPresets);
                } else {
                    setMessage('❌ Failed to load offers');
                }
            } catch (err) {
                console.error('Failed to fetch presets:', err);
                setMessage('❌ Error loading offers');
            } finally {
                setFetchLoading(false);
            }
        };

        const timeout = setTimeout(fetchPresets, 300);
        return () => clearTimeout(timeout);
    }, [search, statusFilter, startDate, endDate, apiUrls.getUrl, token]);


    // Handle quick date filter changes
    const handleQuickDateFilterChange = useCallback((value) => {
        setQuickDateFilter(value);
        const today = new Date();

        switch (value) {
            case 'today':
                const todayStr = today.toISOString().split('T')[0];
                setStartDate(todayStr);
                setEndDate(todayStr);
                break;
            case '7days':
                const sevenDaysAgo = new Date(today);
                sevenDaysAgo.setDate(today.getDate() - 7);
                setStartDate(sevenDaysAgo.toISOString().split('T')[0]);
                setEndDate(today.toISOString().split('T')[0]);
                break;
            case '15days':
                const fifteenDaysAgo = new Date(today);
                fifteenDaysAgo.setDate(today.getDate() - 15);
                setStartDate(fifteenDaysAgo.toISOString().split('T')[0]);
                setEndDate(today.toISOString().split('T')[0]);
                break;
            case '1month':
                const oneMonthAgo = new Date(today);
                oneMonthAgo.setMonth(today.getMonth() - 1);
                setStartDate(oneMonthAgo.toISOString().split('T')[0]);
                setEndDate(today.toISOString().split('T')[0]);
                break;
            default:
                setStartDate('');
                setEndDate('');
                break;
        }
    }, []);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }, []);

    const resetForm = useCallback(() => {
        setForm(initialFormState);
    }, [initialFormState]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.presetName || !form.discountAmount) {
            setMessage('❌ Please fill in all required fields');
            return;
        }

        setLoading(true);
        setMessage('');

        const {
            discountType, presetName, discountAmount,
            maxDiscount, minPurchase, usageLimit, startAt, expireAt
        } = form;

        try {
            const method = isEditing ? 'PATCH' : 'POST';
            const url = isEditing ? apiUrls.editUrl(editingPresetId) : apiUrls.setUrl;

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
                credentials: 'include',
                body: JSON.stringify({
                    discountType,
                    presetName,
                    discountAmount,
                    maxDiscount: maxDiscount ? parseFloat(maxDiscount) : undefined,
                    minPurchase: minPurchase ? parseFloat(minPurchase) : undefined,
                    usageLimit: usageLimit ? parseInt(usageLimit) : undefined,
                    startAt: startAt ? new Date(startAt).toISOString() : undefined,
                    expireAt: expireAt ? new Date(expireAt).toISOString() : undefined,
                    type: 'offer'
                })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(isEditing ? '✅ Offer updated!' : '✅ Offer created successfully!');
                resetForm();
                // Trigger a refetch by updating search
                setSearch(prev => prev + ' ');
                setTimeout(() => setSearch(prev => prev.trim()), 100);
                setShowForm(false);
                setIsEditing(false);
                setEditingPresetId(null);
            } else {
                setMessage(data.message || '❌ Failed to save offer.');
            }
        } catch (err) {
            console.error(err);
            setMessage('❌ Error saving offer.');
        } finally {
            setLoading(false);
        }
    };

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

    const handleDeletePreset = useCallback(async (preset) => {
        try {
            const deleteUrl = userRole === 'admin'
                ? `${import.meta.env.VITE_API_URL}/api/admin/user/${userId}/presets/${preset._id}`
                : `${import.meta.env.VITE_API_URL}/api/user/coupon/presets/${preset._id}`;

            const res = await fetch(deleteUrl, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (res.ok) {
                setMessage('✅ Offer deleted successfully!');
                // Trigger a refetch
                setSearch(prev => prev + ' ');
                setTimeout(() => setSearch(prev => prev.trim()), 100);
            } else {
                const data = await res.json();
                setMessage(data.message || '❌ Failed to delete offer.');
            }
        } catch (err) {
            console.error("Delete failed:", err);
            setMessage('❌ Error deleting offer.');
        }
    }, [userRole, userId]);

    const handleToggleActive = useCallback(async (preset) => {
        try {
            const res = await fetch(apiUrls.toggleUrl(preset._id), {
                method: 'PATCH',
                credentials: 'include',
            });

            const data = await res.json();

            if (res.ok) {
                setMessage('✅ Status updated successfully!');
                // Trigger a refetch
                setSearch(prev => prev + ' ');
                setTimeout(() => setSearch(prev => prev.trim()), 100);
            } else {
                setMessage(data.message || '❌ Failed to update status.');
            }
        } catch (err) {
            console.error("Toggle error:", err);
            setMessage('❌ Error updating status.');
        }
    }, [apiUrls]);

    const handleEditPreset = useCallback((preset) => {
        setForm({
            discountType: preset.discountType || 'percentage',
            presetName: preset.presetName || '',
            discountAmount: preset.discountAmount || '',
            maxDiscount: preset.maxDiscount || '',
            minPurchase: preset.minPurchase || '',
            day: preset.day || '',
            usageLimit: preset.usageLimit || '',
            type: preset.type || 'offer',
            startAt: preset.startAt ? preset.startAt.split('T')[0] : '',
            expireAt: preset.expireAt ? preset.expireAt.split('T')[0] : ''
        });

        setIsEditing(true);
        setEditingPresetId(preset._id);
        setShowForm(true);
    }, []);

    const closeForm = useCallback(() => {
        setShowForm(false);
        setIsEditing(false);
        setEditingPresetId(null);
        resetForm();
    }, [resetForm]);

    // Handle search input change
    const handleSearchChange = useCallback((e) => {
        setSearch(e.target.value);
    }, []);

    // Clear all filters
    const clearAllFilters = useCallback(() => {
        setSearch('');
        setStatusFilter('');
        setStartDate('');
        setEndDate('');
        setQuickDateFilter('');
    }, []);

    const handleToggleSpinning = async () => {
        // if (!spinData?._id) return;

        setIsToggling(true);
        setSpinningEnabled((prev) => !prev);

        try {
            // const data = await apiRequest(`/api/spin/${spinData._id}/toggle`, "POST");

            // if (data.status !== "success") {
            //     setSpinningEnabled((prev) => !prev);
            // }

        } catch {
            setSpinningEnabled((prev) => !prev);
            alert("Network error: Could not toggle spinning");
        } finally {
            setIsToggling(false);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-md min-h-screen">
            {message && (
                <MessagePopup
                    message={message}
                    type={`${message.includes('✅') ? 'success' : 'error'}`}
                    onClose={() => setMessage('')}
                />
            )}

            <div className="flex justify-between mb-6 items-center flex-wrap gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Special Offers</h1>
                <div className='flex justify-end gap-3'>
                    <div className="flex items-center gap-4 bg-gray-50 px-6 py-3 rounded-xl border border-gray-200 shadow-sm">
                        <button
                            type="button"
                            onClick={handleToggleSpinning}
                            aria-pressed={isSpinningEnabled}
                            className={`relative inline-flex items-center h-6 w-14 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50
                            ${isSpinningEnabled ? "bg-gradient-to-r from-blue-500 to-blue-600 focus:ring-blue-300" : "bg-gray-300 focus:ring-gray-200"}`}
                        >
                            <span
                                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out
                                ${isSpinningEnabled ? "translate-x-9" : "translate-x-1"}`}
                            />
                        </button>
                        <div className="flex flex-col">
                            <span className={`text-sm font- leading-tight ${isSpinningEnabled ? "text-blue-700" : "text-gray-700"}`}>
                                {isSpinningEnabled ? "Enabled" : "Disabled"}
                            </span>
                            <span className="text-xs text-gray-500">Special Offers</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md shadow transition"
                    >
                        + Create Offer
                    </button>
                </div>
            </div>

            {/* 🔍 Filter Section */}
            <div className="bg-white rounded-2xl p-6 shadow-md space-y-6 mb-5">
                {/* 🔍 Search Bar */}
                <div className="relative mx-auto">
                    <input
                        type="text"
                        placeholder="Search by offer name..."
                        value={search}
                        onChange={handleSearchChange}
                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 shadow-inner text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
                    />
                    <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
                    </svg>
                    {/* Loading indicator */}
                    {fetchLoading && (
                        <div className="absolute right-4 top-3.5">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                        </div>
                    )}
                </div>

                {/* 🔧 Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Status Filter */}
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
                        >
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="expired">Expired</option>
                            <option value="redeemed">Redeemed</option>
                        </select>
                        <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </div>

                    {/* Start Date */}
                    <div className="relative">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => {
                                setQuickDateFilter('');
                                setStartDate(e.target.value);
                            }}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm shadow-inner focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>

                    {/* End Date */}
                    <div className="relative">
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => {
                                setQuickDateFilter('');
                                setEndDate(e.target.value);
                            }}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm shadow-inner focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>

                    {/* Quick Filter Dropdown */}
                    <div className="relative">
                        <select
                            value={quickDateFilter}
                            onChange={(e) => handleQuickDateFilterChange(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
                        >
                            <option value="">Custom / All Time</option>
                            <option value="today">Today</option>
                            <option value="7days">Last 7 Days</option>
                            <option value="15days">Last 15 Days</option>
                            <option value="1month">Last 1 Month</option>
                        </select>
                    </div>
                </div>

                {/* Clear Filters Button */}
                {(search || statusFilter || startDate || endDate) && (
                    <div className="flex justify-end">
                        <button
                            onClick={clearAllFilters}
                            className="text-sm text-gray-600 hover:text-gray-800 underline transition duration-200"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>

            {/* Loading State */}
            {fetchLoading && (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <span className="ml-2 text-gray-600">Loading offers...</span>
                </div>
            )}

            {/* Results count */}
            {!fetchLoading && (
                <div className="mb-4 text-sm text-gray-600">
                    Showing {filteredPresets.length} offers
                    {(search || statusFilter || startDate || endDate) && " (filtered)"}
                    {search && (
                        <span className="ml-1">for "{search}"</span>
                    )}
                </div>
            )}

            {/* Offers Grid */}
            {!fetchLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 my-6">
                    {filteredPresets.length > 0 ? (
                        filteredPresets.map((preset, index) => (
                            <PresetCard
                                key={preset._id || index}
                                preset={preset}
                                index={index}
                                openMenuIndex={openMenuIndex}
                                toggleMenu={setOpenMenuIndex}
                                handleEditPreset={handleEditPreset}
                                handleDeletePreset={handleDeletePreset}
                                setPresetToDelete={setPresetToDelete}
                                setShowDeleteModal={setShowDeleteModal}
                                handleToggleActive={handleToggleActive}
                                menuRefs={menuRefs}
                            />
                        ))
                    ) : (
                        <div className="text-gray-500 col-span-full text-center py-10">
                            {presets.length === 0
                                ? "No offers found. Create your first offer!"
                                : "No offers match your current filters."}
                        </div>
                    )}
                </div>
            )}

            {/* Backdrop Overlay */}
            {showForm && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                    onClick={closeForm}
                />
            )}
        </div>
    );
};

export default React.memo(SpecialOffer);