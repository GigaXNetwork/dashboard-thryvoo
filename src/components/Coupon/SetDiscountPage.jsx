import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import PresetForm from './presetForm';
import PresetToggle from './PresetToggle';
import PresetCard from './PresetCard';
import FilterBar from '../Common/FilterBar/FilterBar';
import { useUser } from '../../Context/ContextApt';
import { getAuthToken } from '../../Context/apiService';
import MessagePopup from '../Common/MessagePopup';

const SetDiscountPage = () => {
    const [presets, setPresets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [presetLoading, setPresetLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [presetToDelete, setPresetToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingPresetId, setEditingPresetId] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });


    // Filter states
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [quickDateFilter, setQuickDateFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    // Refs and context
    const menuRefs = useRef([]);
    const { userData } = useUser();
    const userRole = userData?.user?.role;
    const { userId } = useParams();

    const showMessage = (text, type = "success") => {
        setMessage({ text, type });
    }

    const closeMessage = () => {
        setMessage({ type: '', text: '' });
    }

    // Memoized URLs
    const getUrl = useMemo(() => (
        userRole === 'admin'
            ? `${import.meta.env.VITE_API_URL}/api/admin/user/${userId}/getDiscount`
            : `${import.meta.env.VITE_API_URL}/api/user/getCoupon`
    ), [userRole, userId]);

    const setUrl = useMemo(() => (
        userRole === 'admin'
            ? `${import.meta.env.VITE_API_URL}/api/admin/user/${userId}/setDiscount`
            : `${import.meta.env.VITE_API_URL}/api/user/setCoupon`
    ), [userRole, userId]);

    // Form state - Dynamic type based on user role
    const [form, setForm] = useState({
        discountType: 'percentage',
        presetName: '',
        discountAmount: '',
        maxDiscount: '',
        minPurchase: '',
        day: '',
        usageLimit: '',
        type: userRole === 'admin' ? 'own' : 'own'
    });

    // Debounced search effect
    useEffect(() => {
        setPresetLoading(true);
        const timeout = setTimeout(() => {
            setSearchTerm(search);
            setPresetLoading(false);
        }, 300);
        return () => clearTimeout(timeout);
    }, [search]);

    // Optimized fetch function - Include type filter for admin
    const fetchPresets = useCallback(async () => {
        const startTime = Date.now();
        setLoading(true);

        try {
            const params = new URLSearchParams({
                // For admin, don't hardcode type - use filter or fetch all
                ...(userRole !== 'admin' && { type: 'own' }), // Only restrict for non-admin
                ...(searchTerm && { presetName: searchTerm.trim() }),
                ...(statusFilter && { status: statusFilter }),
                ...(typeFilter && { type: typeFilter }), // Add type filter for admin
                ...(startDate && { 'createdAt[gt]': startDate }),
                ...(endDate && { 'createdAt[lt]': endDate }),
            });

            const res = await fetch(`${getUrl}?${params}`, {
                credentials: 'include',
                headers: {
                    'Authorization': `${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            if (res.ok) {
                const data = await res.json();
                setPresets(data.discount || []);
            } else {
                showMessage('Failed to load coupons', 'error');
                setPresets([]);
            }
        } catch (err) {
            console.error('Failed to fetch presets:', err);
            showMessage('Error loading coupons', 'error');
            setPresets([]);
        } finally {
            const elapsedTime = Date.now() - startTime;
            const minLoadingTime = 500;

            if (elapsedTime < minLoadingTime) {
                setTimeout(() => setLoading(false), minLoadingTime - elapsedTime);
            } else {
                setLoading(false);
            }
        }
    }, [getUrl, searchTerm, statusFilter, typeFilter, startDate, endDate, userRole]);

    // Fetch data effect
    useEffect(() => {
        fetchPresets();
    }, [fetchPresets]);

    // Menu outside click handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openMenuIndex !== null &&
                menuRefs.current[openMenuIndex] &&
                !menuRefs.current[openMenuIndex].contains(event.target)
            ) {
                setOpenMenuIndex(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openMenuIndex]);

    const handleClearFilters = () => {
        setSearch('');
        setStatusFilter('');
        setTypeFilter('');
        setStartDate('');
        setEndDate('');
        setQuickDateFilter('');
    };

    // Form handlers
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }, []);

    const resetForm = useCallback(() => {
        setForm({
            discountType: 'percentage',
            presetName: '',
            discountAmount: '',
            maxDiscount: '',
            minPurchase: '',
            day: '',
            usageLimit: '',
            type: userRole === 'admin' ? 'own' : 'own'
        });
    }, [userRole]);

    // Form submission - Remove hardcoded type override
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true);

        const { presetName, discountAmount } = form;
        if (!presetName || !discountAmount) {
            showMessage('Please fill in all required fields', 'error');
            setLoading(false);
            return;
        }

        try {
            const method = isEditing ? 'PATCH' : 'POST';
            const url = isEditing
                ? (userRole === 'admin'
                    ? `${import.meta.env.VITE_API_URL}/api/admin/user/${userId}/presets/${editingPresetId}`
                    : `${import.meta.env.VITE_API_URL}/api/user/coupon/presets/${editingPresetId}`)
                : setUrl;

            const requestBody = {
                ...form,
                maxDiscount: form.maxDiscount ? parseFloat(form.maxDiscount) : undefined,
                minPurchase: form.minPurchase ? parseFloat(form.minPurchase) : undefined,
                day: form.day ? parseInt(form.day) : undefined, // Expiry duration in days
                usageLimit: form.usageLimit ? parseInt(form.usageLimit) : undefined,
                // Type is already in form state, no need to override
            };

            // For non-admin users, ensure type is always 'own'
            if (userRole !== 'admin') {
                requestBody.type = 'own';
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${getAuthToken()}`
                },
                credentials: 'include',
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            if (response.ok) {
                const successMessage = isEditing ? 'Coupon updated!' : 'Coupon created successfully!';
                showMessage(successMessage, 'success');
                resetForm();
                fetchPresets();
                setShowForm(false);
                setIsEditing(false);
                setEditingPresetId(null);
            } else {
                showMessage(data.message || 'Failed to save coupon.', 'error');
            }
        } catch (err) {
            console.error(err);
            showMessage('Error saving coupon.', 'error');
        } finally {
            setLoading(false);
        }
    }, [form, isEditing, editingPresetId, resetForm, fetchPresets, setUrl, userRole, userId]);

    const handleDeletePresetWithLoader = async (preset) => {
        setIsDeleting(true);
        await handleDeletePreset(preset);
        setIsDeleting(false);
    };

    // Delete preset
    const handleDeletePreset = useCallback(async (preset) => {
        try {
            const deleteUrl = userRole === 'admin'
                ? `${import.meta.env.VITE_API_URL}/api/admin/user/${userId}/presets/${preset._id}`
                : `${import.meta.env.VITE_API_URL}/api/user/coupon/presets/${preset._id}`;

            const res = await fetch(deleteUrl, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Authorization': `${getAuthToken()}`
                }
            });

            if (res.ok) {
                showMessage('Coupon deleted successfully!', 'success');
                setOpenMenuIndex(null)
                setPresets(prev => prev.filter(p => p._id !== preset._id));
            } else {
                const data = await res.json();
                showMessage(data.message || 'Failed to delete coupon.', 'error');
            }
        } catch (err) {
            console.error("Delete failed:", err);
            showMessage('Error deleting coupon.', 'error');
        } finally {
            setPresetToDelete(null);
        }
    }, [userRole, userId]);

    // Toggle active status
    const handleToggleActive = useCallback(async (preset) => {
        try {
            const isCurrentlyActive = preset.isActive;
            const action = 'setActive';

            const toggleUrl = userRole === "admin"
                ? `${import.meta.env.VITE_API_URL}/api/admin/user/${userId}/presets/${preset._id}/${action}`
                : `${import.meta.env.VITE_API_URL}/api/user/coupon/presets/${preset._id}/${action}`;

            const res = await fetch(toggleUrl, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Authorization': `${getAuthToken()}`
                }
            });

            if (res.ok) {
                setOpenMenuIndex(null);
                setPresets(prev =>
                    prev.map(p => ({
                        ...p,
                        isActive: p._id === preset._id ? !isCurrentlyActive : p.isActive
                    }))
                );
                showMessage(`Coupon ${isCurrentlyActive ? 'deactivated' : 'activated'} successfully!`, 'success');
            } else {
                const data = await res.json();
                showMessage(data.message || `Failed to ${isCurrentlyActive ? 'deactivate' : 'activate'} coupon.`, 'error');
            }
        } catch (err) {
            console.error("Toggle error:", err);
            showMessage('Error updating status.', 'error');
        }
    }, [userRole, userId]);

    // Edit preset
    const handleEditPreset = useCallback((preset) => {
        setForm({
            discountType: preset.discountType || 'percentage',
            presetName: preset.presetName || '',
            discountAmount: preset.discountAmount || '',
            maxDiscount: preset.maxDiscount || '',
            minPurchase: preset.minPurchase || '',
            day: preset.day || '',
            usageLimit: preset.usageLimit || '',
            type: preset.type || (userRole === 'admin' ? 'own' : 'own'),
            conditions: preset.conditions || '',
            link: preset.link || ''
        });
        setIsEditing(true);
        setEditingPresetId(preset._id);
        setShowForm(true);
    }, [userRole]);

    const toggleMenu = useCallback((index) => {
        setOpenMenuIndex(prevIndex => prevIndex === index ? null : index);
    }, []);

    return (
        <div className="p-8 mx-auto rounded-lg min-h-screen">
            {/* Message Popup */}
            {message.text && (
                <MessagePopup
                    message={message.text}
                    type={message.type}
                    onClose={closeMessage}
                />
            )}

            {/* Header */}
            <div className="flex justify-between mb-6 items-center flex-wrap gap-4">
                <h1 className="text-2xl font-bold text-gray-700">
                    {userRole === 'admin' ? 'All Coupons' : 'My Coupons'}
                </h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold px-6 py-2.5 rounded-md shadow transition"
                >
                    + Create Coupon
                </button>
            </div>

            {/* FilterBar Component */}
            <FilterBar
                // onFilterChange={() => setCurrentPage(1)}
                search={search}
                setSearch={setSearch}
                searchLoading={presetLoading && search}
                placeholder="Search by coupon name..."
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                showStatus={true}
                statusOptions={[
                    { value: "", label: "All Statuses" },
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" }
                ]}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                quickDateFilter={quickDateFilter}
                setQuickDateFilter={setQuickDateFilter}
                showDates={true}
                showQuickFilter={true}
                showTypeFilter={userRole === 'admin'}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                typeOptions={[
                    { value: "", label: "All Types" },
                    { value: "own", label: "Own Promotion" },
                    { value: "cross", label: "Cross Promotion" },
                    { value: "offer", label: "Special Offer" }
                ]}
                // Clear all handler
                onClearFilters={handleClearFilters}
                // Hide unused filters
                showCategoryFilter={false}
                showLocationFilter={false}
                showSourceFilter={false}
            />

            {/* Results Count - Only show when not loading */}
            {!loading && !presetLoading && (
                <div className="mb-4 text-sm text-gray-600">
                    Showing {presets.length} coupon{presets.length !== 1 ? 's' : ''}
                    {(search || statusFilter || startDate || endDate || typeFilter) && " (filtered)"}
                    {search && (
                        <span className="ml-1">for "{search}"</span>
                    )}
                </div>
            )}

            {/* Preset Cards with Loading State */}
            {loading ? (
                <div className="col-span-full">
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
                        <span className="text-gray-600 text-lg">Loading coupons...</span>
                        <span className="text-gray-400 text-sm mt-1">Please wait while we fetch your data</span>
                    </div>
                </div>
            ) : presets.length === 0 ? (
                <div className="text-gray-500 col-span-full text-center py-10">
                    <div className="flex flex-col items-center">
                        <svg className="w-16 h-16 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-lg font-medium text-gray-600">
                            {userRole === 'admin' ? 'No coupons found.' : 'No Own Brand coupons found.'}
                        </span>
                        {search && (
                            <span className="text-sm text-gray-400 mt-1">
                                No results for "{search}"
                            </span>
                        )}
                    </div>
                </div>
            ) : (
                <div className={`grid grid-cols-1 gap-6 my-6 ${userRole === 'admin'
                    ? 'md:grid-cols-2'
                    : 'sm:grid-cols-2 lg:grid-cols-3'
                    }`}>
                    {presets.map((preset, index) => (
                        <PresetCard
                            key={preset._id}
                            preset={preset}
                            index={index}
                            openMenuIndex={openMenuIndex}
                            toggleMenu={toggleMenu}
                            handleEditPreset={handleEditPreset}
                            handleDeletePreset={(p) => {
                                setPresetToDelete(p);
                                setShowDeleteModal(true);
                                setIsDeleting(true);
                            }}
                            handleToggleActive={handleToggleActive}
                            menuRefs={menuRefs}
                            showTypeBadge={userRole === 'admin'}
                        />
                    ))}
                </div>
            )}

            {/* Overlay and Form */}
            {showForm && (
                <div className="fixed inset-0 bg-black/15 backdrop-blur-sm z-40" onClick={() => setShowForm(false)} />
            )}

            {/* CRITICAL FIX: Don't pass 'type' prop for admin users */}
            <PresetForm
                showForm={showForm}
                setShowForm={setShowForm}
                form={form}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                resetForm={resetForm}
                loading={loading}
                isEditing={isEditing}
                type={userRole === 'admin' ? undefined : 'own'}
            />

            {/* Delete Confirmation */}
            {showDeleteModal && (
                <PresetToggle
                    presetToDelete={presetToDelete}
                    setShowDeleteModal={setShowDeleteModal}
                    handleDeletePreset={handleDeletePresetWithLoader}
                    setPresetToDelete={setPresetToDelete}
                    isLoading={isDeleting}
                />
            )}
        </div>
    );
};

export default SetDiscountPage;