import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import PresetForm from '../Coupon/presetForm';
import PresetToggle from './PresetToggle';
import PresetCard from '../Coupon/PresetCard';
import FilterBar from '../Common/FilterBar';
import { useUser } from '../../Context/ContextApt';
import { Plus } from 'lucide-react';
import { getAuthToken } from '../../Context/apiService';
import { toast } from 'react-toastify';

const CreateCrossPromotion = () => {
    // State management
    const [presets, setPresets] = useState([]);
    const [loading, setLoading] = useState(false);
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
    const [searchTerm, setSearchTerm] = useState('');

    // Refs and context
    const menuRefs = useRef([]);
    const { userData } = useUser();
    const userRole = userData?.user?.role;
    const { userId } = useParams();
    const API = import.meta.env.VITE_API_URL;

    // Memoized URLs
    const getUrl = useMemo(() => (
        userRole === 'admin'
            ? `${API}/api/admin/user/${userId}/getDiscount`
            : `${API}/api/user/getCoupon`
    ), [API, userRole, userId]);

    const setUrl = useMemo(() => (
        userRole === 'admin'
            ? `${API}/api/admin/user/${userId}/setDiscount`
            : `${API}/api/user/setCoupon`
    ), [API, userRole, userId]);

    // Form state
    const [form, setForm] = useState({
        discountType: 'percentage',
        presetName: '',
        discountAmount: '',
        maxDiscount: '',
        minPurchase: '',
        day: '',
        usageLimit: '',
        type: 'cross',
        conditions: [''],
        link: '',
        startAt: '',
        expireAt: ''
    });

    // Debounced search effect
    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => {
            setSearchTerm(search);
            setLoading(false);
        }, 300);
        return () => clearTimeout(timeout);
    }, [search]);

    // Optimized fetch function
    const fetchPresets = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                type: 'cross',
                ...(searchTerm && { presetName: searchTerm.trim() }),
                ...(statusFilter && { isActive: statusFilter === 'active' }),
                ...(startDate && { 'createdAt[gt]': startDate }),
                ...(endDate && { 'createdAt[lt]': endDate }),
            });

            const res = await fetch(`${getUrl}?${params}`, {
                credentials: 'include',
                headers: {
                    'Authorization': `${getAuthToken()}`,
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                const data = await res.json();
                const list = data.discount || data.data?.coupon || data.data || [];
                const onlyCross = Array.isArray(list) 
                    ? list.filter(p => p.type === 'cross' || p.type === undefined)
                    : [];
                setPresets(onlyCross);
            } else {
                toast.error('Failed to load coupons');
                setPresets([]);
            }
        } catch (err) {
            console.error('Fetch cross presets error:', err);
            toast.error('Error loading coupons');
            setPresets([]);
        } finally {
            setLoading(false);
        }
    }, [getUrl, searchTerm, statusFilter, startDate, endDate]);

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
        toast.info('All filters cleared');
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
            type: 'cross',
            conditions: [''],
            link: '',
            startAt: '',
            expireAt: ''
        });
        setIsEditing(false);
        setEditingPresetId(null);
    }, []);

    // Form submission
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true);

        const { presetName, discountAmount } = form;
        if (!presetName || !discountAmount) {
            toast.error('Please fill in all required fields');
            setLoading(false);
            return;
        }

        try {
            const method = isEditing ? 'PATCH' : 'POST';
            const url = isEditing
                ? (userRole === 'admin'
                    ? `${API}/api/admin/user/${userId}/presets/${editingPresetId}`
                    : `${API}/api/user/coupon/presets/${editingPresetId}`)
                : setUrl;

            const bodyPayload = {
                discountType: form.discountType,
                presetName: form.presetName,
                discountAmount: form.discountAmount,
                ...(form.maxDiscount && { maxDiscount: parseFloat(form.maxDiscount) }),
                ...(form.minPurchase && { minPurchase: parseFloat(form.minPurchase) }),
                ...(form.day && { day: parseInt(form.day) }),
                ...(form.usageLimit && { usageLimit: parseInt(form.usageLimit) }),
                type: 'cross',
                conditions: form.conditions.filter(cond => cond.trim() !== ''),
                ...(form.link && { link: form.link }),
                ...(form.startAt && { startAt: form.startAt }),
                ...(form.expireAt && { expireAt: form.expireAt })
            };

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${getAuthToken()}`
                },
                credentials: 'include',
                body: JSON.stringify(bodyPayload)
            });

            const data = await response.json();

            if (response.ok) {
                const successMessage = isEditing ? 'Coupon updated successfully!' : 'Coupon created successfully!';
                toast.success(successMessage);
                resetForm();
                fetchPresets();
                setShowForm(false);
                setIsEditing(false);
                setEditingPresetId(null);
            } else {
                toast.error(data.message || `Failed to ${isEditing ? 'update' : 'create'} coupon.`);
            }
        } catch (err) {
            console.error(err);
            toast.error('Error saving coupon.');
        } finally {
            setLoading(false);
        }
    }, [form, isEditing, editingPresetId, API, setUrl, userRole, userId, resetForm, fetchPresets]);

    // Delete preset
    const handleDeletePreset = useCallback(async (preset) => {
        try {

            const deleteUrl = userRole === 'admin'
                ? `${API}/api/admin/user/${userId}/presets/${preset._id}`
                : `${API}/api/user/coupon/presets/${preset._id}`;

            const res = await fetch(deleteUrl, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Authorization': `${getAuthToken()}`
                }
            });

            if (res.ok) {
                toast.success('Coupon deleted successfully!');
                setPresets(prev => prev.filter(p => p._id !== preset._id));
            } else {
                const data = await res.json();
                toast.error(data.message || 'Failed to delete coupon.');
            }
        } catch (err) {
            console.error("Delete failed:", err);
            toast.error('Error deleting coupon.');
        } finally {
            setShowDeleteModal(false);
            setPresetToDelete(null);
        }
    }, [API, userRole, userId]);

    // Toggle active status
    const handleToggleActive = useCallback(async (preset) => {
        try {
            const toggleUrl = userRole === "admin"
                ? `${API}/api/admin/user/${userId}/presets/${preset._id}/setActive`
                : `${API}/api/user/coupon/presets/${preset._id}/setActive`;

            const res = await fetch(toggleUrl, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Authorization': `${getAuthToken()}`
                }
            });

            if (res.ok) {
                setPresets(prev =>
                    prev.map(p => ({
                        ...p,
                        isActive: p._id === preset._id
                    }))
                );
                toast.success('Status updated successfully!');
            } else {
                const data = await res.json();
                toast.error(data.message || 'Failed to update status.');
            }
        } catch (err) {
            console.error("Toggle error:", err);
            toast.error('Error updating status.');
        }
    }, [API, userRole, userId]);

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
            type: 'cross',
            conditions: preset.conditions || [''],
            link: preset.link || '',
            startAt: preset.startAt || '',
            expireAt: preset.expireAt || ''
        });
        setIsEditing(true);
        setEditingPresetId(preset._id);
        setShowForm(true);
    }, []);

    const toggleMenu = useCallback((index) => {
        setOpenMenuIndex(prevIndex => prevIndex === index ? null : index);
    }, []);

    const handleCreateCoupon = () => {
        resetForm();
        setShowForm(true);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-md min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
                <h1 className="text-2xl font-bold text-gray-700 flex-shrink-0">Cross Brand Coupons</h1>
                <button
                    onClick={handleCreateCoupon}
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md shadow transition flex items-center gap-2 justify-center"
                >
                    <Plus className="w-4 h-4" />
                    Create Coupon
                </button>
            </div>

            {/* FilterBar Component */}
            <FilterBar
                search={search}
                setSearch={setSearch}
                searchLoading={loading && search}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                quickDateFilter={quickDateFilter}
                setQuickDateFilter={setQuickDateFilter}
                placeholder="Search by coupon or business name..."
                statusOptions={[
                    { value: "", label: "All Statuses" },
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" }
                ]}
                onClearFilters={handleClearFilters}
            />

            {/* Preset Cards */}
            {loading && !searchTerm && !statusFilter && !startDate && !endDate ? (
                <div className="flex items-center justify-center h-64 text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                    Loading...
                </div>
            ) : presets.length === 0 ? (
                <div className="text-gray-500 col-span-full text-center py-10">
                    No cross-brand coupons found.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 my-6">
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
                            }}
                            setPresetToDelete={setPresetToDelete}
                            setShowDeleteModal={setShowDeleteModal}
                            handleToggleActive={handleToggleActive}
                            menuRefs={menuRefs}
                        />
                    ))}
                </div>
            )}

            {/* Overlay and Form */}
            {showForm && (
                <div className="fixed inset-0 bg-black/15 backdrop-blur-sm z-40" onClick={() => setShowForm(false)} />
            )}

            <PresetForm
                showForm={showForm}
                setShowForm={setShowForm}
                form={form}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                resetForm={resetForm}
                loading={loading}
                isEditing={isEditing}
                type="cross"
            />

            {/* Delete Confirmation */}
            {showDeleteModal && (
                <PresetToggle
                    presetToDelete={presetToDelete}
                    setShowDeleteModal={setShowDeleteModal}
                    handleDeletePreset={handleDeletePreset}
                    setPresetToDelete={setPresetToDelete}
                />
            )}
        </div>
    );
};

export default CreateCrossPromotion;