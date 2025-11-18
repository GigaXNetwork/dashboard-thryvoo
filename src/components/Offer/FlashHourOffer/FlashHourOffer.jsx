import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import MessagePopup from '../../Common/MessagePopup';
import PresetForm from './presetForm'
import PresetToggle from './PresetToggle';
import PresetCard from './PresetCard';
import { useUser } from '../../../Context/ContextApt';
import Cookies from "js-cookie"
import { getAuthToken } from '../../../Context/apiService';
import FilterBar from '../../Common/FilterBar/FilterBar';


const FlashHourOffer = () => {
    const [presets, setPresets] = useState([]);
    const [filteredPresets, setFilteredPresets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [presetToDelete, setPresetToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingPresetId, setEditingPresetId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Filter states
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [quickDateFilter, setQuickDateFilter] = useState('');

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
        startAt: '',
        expireAt: '',
        type: 'offer'
    }), []);

    const [form, setForm] = useState(initialFormState);

    useEffect(() => {
        const fetchPresets = async () => {
            if (search.trim()) {
                setSearchLoading(true);
            }
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
                setSearchLoading(false);
                setFetchLoading(false);
            }
        };

        const timeout = setTimeout(fetchPresets, 300);
        return () => clearTimeout(timeout);
    }, [search, statusFilter, startDate, endDate, apiUrls.getUrl, token]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }, []);

    const resetForm = useCallback(() => {
        setForm(initialFormState);
    }, [initialFormState]);

    const handleSubmit = async (e) => {
        // Prevent default if it's a regular event
        if (e.preventDefault) {
            e.preventDefault();
        }

        // Use formData from the custom event or fall back to form state
        const submitData = e.formData || form;

        if (!submitData.presetName || !submitData.discountAmount) {
            setMessage('❌ Please fill in all required fields');
            return;
        }

        setLoading(true);
        setMessage('');

        const {
            discountType, presetName, discountAmount,
            maxDiscount, minPurchase, usageLimit, startAt, expireAt
        } = submitData;

        // Debug log to verify the payload
        console.log('Final payload with dates:', {
            discountType,
            presetName,
            discountAmount,
            maxDiscount: maxDiscount ? parseFloat(maxDiscount) : undefined,
            minPurchase: minPurchase ? parseFloat(minPurchase) : undefined,
            usageLimit: usageLimit ? parseInt(usageLimit) : undefined,
            startAt: startAt || undefined,
            expireAt: expireAt || undefined,
            type: 'offer'
        });

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
                    startAt: startAt || undefined,
                    expireAt: expireAt || undefined,
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
        setDeleteLoading(true);

        try {
            const deleteUrl = userRole === 'admin'
                ? `${import.meta.env.VITE_API_URL}/api/admin/user/${userId}/presets/${preset._id}`
                : `${import.meta.env.VITE_API_URL}/api/user/coupon/presets/${preset._id}`;

            const res = await fetch(deleteUrl, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    "Authorization": `${getAuthToken()}`
                }
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
        } finally {
            setDeleteLoading(false);
        }
    }, [userRole, userId]);

    const handleToggleActive = useCallback(async (preset) => {
        try {
            const res = await fetch(apiUrls.toggleUrl(preset._id), {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    "Authorization": `${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
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
            startAt: preset.startAt || '',
            expireAt: preset.expireAt || '',
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
    const handleClearFilters = () => {
        setSearch('');
        setStatusFilter('');
        setStartDate('');
        setEndDate('');
        setQuickDateFilter('');
    };

    return (
        <div className="p-8 mx-auto bg-white rounded-lg shadow-md min-h-screen">
            {message && (
                <MessagePopup
                    message={message}
                    type={`${message.includes('✅') ? 'success' : 'error'}`}
                    onClose={() => setMessage('')}
                />
            )}

            <div className="flex justify-between mb-6 items-center flex-wrap gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Flash Hour Offers</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 font-semibold px-4 py-2 rounded-md shadow transition"
                >
                    + Create Offer
                </button>
            </div>

            {/* 🔍 Filter Section */}
            <FilterBar
                search={search}
                setSearch={setSearch}
                searchLoading={searchLoading}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                quickDateFilter={quickDateFilter}
                setQuickDateFilter={setQuickDateFilter}
                placeholder="Search by offer name..."
                statusOptions={[
                    { value: "", label: "All Statuses" },
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                    { value: "expired", label: "Expired" },
                    { value: "redeemed", label: "Redeemed" }
                ]}
                onClearFilters={handleClearFilters}
                showDates={true}
                showQuickFilter={true}
                showStatus={true}
                showTypeFilter={false}
                showCategoryFilter={false}
                showLocationFilter={false}
                showSourceFilter={false}
            />

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

            {/* Slide-In Form Drawer */}
            <PresetForm
                showForm={showForm}
                setShowForm={setShowForm}
                form={form}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                resetForm={resetForm}
                loading={loading}
                isEditing={isEditing}
                title={isEditing ? "Edit Offer" : "Create Flash Offer"}
                onClose={closeForm}
            />

            {showDeleteModal && (
                <PresetToggle
                    presetToDelete={presetToDelete}
                    setShowDeleteModal={setShowDeleteModal}
                    handleDeletePreset={handleDeletePreset}
                    setPresetToDelete={setPresetToDelete}
                    deleteLoading={deleteLoading}
                    title="Delete Offer"
                    message="Are you sure you want to delete this offer?"
                />
            )}
        </div>
    );
};

export default React.memo(FlashHourOffer);