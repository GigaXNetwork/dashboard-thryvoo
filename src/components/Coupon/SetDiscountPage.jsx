// import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
// import { useParams } from 'react-router-dom';
// import PresetForm from './presetForm';
// import PresetToggle from './PresetToggle';
// import PresetCard from './PresetCard';
// import FilterBar from '../Common/FilterBar';
// import { useUser } from '../../Context/ContextApt';
// import { getAuthToken } from '../../Context/apiService';
// import { toast } from 'react-toastify';

// const SetDiscountPage = () => {
//     // State management
//     const [presets, setPresets] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [presetLoading, setPresetLoading] = useState(true);
//     const [showForm, setShowForm] = useState(false);
//     const [openMenuIndex, setOpenMenuIndex] = useState(null);
//     const [presetToDelete, setPresetToDelete] = useState(null);
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [isEditing, setIsEditing] = useState(false);
//     const [editingPresetId, setEditingPresetId] = useState(null);

//     // Filter states
//     const [search, setSearch] = useState('');
//     const [statusFilter, setStatusFilter] = useState('');
//     const [startDate, setStartDate] = useState('');
//     const [endDate, setEndDate] = useState('');
//     const [quickDateFilter, setQuickDateFilter] = useState('');
//     const [searchTerm, setSearchTerm] = useState('');

//     // Refs and context
//     const menuRefs = useRef([]);
//     const { userData } = useUser();
//     const user = userData.user.role;
//     const { userId } = useParams();

//     // Memoized URLs
//     const getUrl = useMemo(() => (
//         user === 'admin'
//             ? `${import.meta.env.VITE_API_URL}/api/admin/user/${userId}/getDiscount`
//             : `${import.meta.env.VITE_API_URL}/api/user/getCoupon`
//     ), [user, userId]);

//     const setUrl = useMemo(() => (
//         user === 'admin'
//             ? `${import.meta.env.VITE_API_URL}/api/admin/user/${userId}/setDiscount`
//             : `${import.meta.env.VITE_API_URL}/api/user/setCoupon`
//     ), [user, userId]);

//     // Form state
//     const [form, setForm] = useState({
//         discountType: 'percentage',
//         presetName: '',
//         discountAmount: '',
//         maxDiscount: '',
//         minPurchase: '',
//         day: '',
//         usageLimit: '',
//         type: 'own'
//     });

//     // Debounced search effect
//     useEffect(() => {
//         setPresetLoading(true);
//         const timeout = setTimeout(() => {
//             setSearchTerm(search);
//             setPresetLoading(false);
//         }, 300);
//         return () => clearTimeout(timeout);
//     }, [search]);

//     // Optimized fetch function
//     const fetchPresets = useCallback(async () => {
//         setPresetLoading(true);
//         try {
//             const params = new URLSearchParams({
//                 type: 'own',
//                 ...(searchTerm && { presetName: searchTerm.trim() }),
//                 ...(statusFilter && { status: statusFilter }),
//                 ...(startDate && { 'createdAt[gt]': startDate }),
//                 ...(endDate && { 'createdAt[lt]': endDate }),
//             });

//             const res = await fetch(`${getUrl}?${params}`, {
//                 credentials: 'include',
//                 headers: {
//                     'Authorization': `${getAuthToken()}`,
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (res.ok) {
//                 const data = await res.json();
//                 setPresets(data.discount || []);
//             } else {
//                 toast.error('Failed to load coupons');
//                 setPresets([]);
//             }
//         } catch (err) {
//             console.error('Failed to fetch presets:', err);
//             toast.error('Error loading coupons');
//             setPresets([]);
//         } finally {
//             setPresetLoading(false);
//         }
//     }, [getUrl, searchTerm, statusFilter, startDate, endDate]);

//     // Fetch data effect
//     useEffect(() => {
//         fetchPresets();
//     }, [fetchPresets]);

//     // Menu outside click handler
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (openMenuIndex !== null &&
//                 menuRefs.current[openMenuIndex] &&
//                 !menuRefs.current[openMenuIndex].contains(event.target)
//             ) {
//                 setOpenMenuIndex(null);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, [openMenuIndex]);

//     const handleClearFilters = () => {
//         toast.info('All filters cleared');
//     };

//     // Form handlers
//     const handleChange = useCallback((e) => {
//         const { name, value } = e.target;
//         setForm(prev => ({ ...prev, [name]: value }));
//     }, []);

//     const resetForm = useCallback(() => {
//         setForm({
//             discountType: 'percentage',
//             presetName: '',
//             discountAmount: '',
//             maxDiscount: '',
//             minPurchase: '',
//             day: '',
//             usageLimit: '',
//             type: 'own'
//         });
//     }, []);

//     // Form submission
//     const handleSubmit = useCallback(async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         const { presetName, discountAmount } = form;
//         if (!presetName || !discountAmount) {
//             toast.error('Please fill in all required fields');
//             setLoading(false);
//             return;
//         }

//         try {
//             const method = isEditing ? 'PATCH' : 'POST';
//             const url = isEditing
//                 ? (user === 'admin'
//                     ? `${import.meta.env.VITE_API_URL}/api/admin/user/${userId}/presets/${editingPresetId}`
//                     : `${import.meta.env.VITE_API_URL}/api/user/coupon/presets/${editingPresetId}`)
//                 : setUrl;

//             const response = await fetch(url, {
//                 method,
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `${getAuthToken()}`
//                 },
//                 credentials: 'include',
//                 body: JSON.stringify({
//                     ...form,
//                     maxDiscount: form.maxDiscount ? parseFloat(form.maxDiscount) : undefined,
//                     minPurchase: form.minPurchase ? parseFloat(form.minPurchase) : undefined,
//                     day: form.day ? parseInt(form.day) : undefined,
//                     usageLimit: form.usageLimit ? parseInt(form.usageLimit) : undefined,
//                     type: 'own',
//                 })
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 const successMessage = isEditing ? 'Coupon updated!' : 'Coupon created successfully!';
//                 toast.success(successMessage);
//                 resetForm();
//                 fetchPresets();
//                 setShowForm(false);
//                 setIsEditing(false);
//                 setEditingPresetId(null);
//             } else {
//                 toast.error(data.message || 'Failed to save coupon.');
//             }
//         } catch (err) {
//             console.error(err);
//             toast.error('Error saving coupon.');
//         } finally {
//             setLoading(false);
//         }
//     }, [form, isEditing, editingPresetId, resetForm, fetchPresets, setUrl, user, userId]);

//     // Delete preset
//     const handleDeletePreset = useCallback(async (preset) => {
//         try {
//             const deleteUrl = user === 'admin'
//                 ? `${import.meta.env.VITE_API_URL}/api/admin/user/${userId}/presets/${preset._id}`
//                 : `${import.meta.env.VITE_API_URL}/api/user/coupon/presets/${preset._id}`;

//             const res = await fetch(deleteUrl, {
//                 method: 'DELETE',
//                 credentials: 'include',
//                 headers: {
//                     'Authorization': `${getAuthToken()}`
//                 }
//             });

//             if (res.ok) {
//                 toast.success('Coupon deleted successfully!');
//                 setOpenMenuIndex(null)
//                 setPresets(prev => prev.filter(p => p._id !== preset._id));
//             } else {
//                 const data = await res.json();
//                 toast.error(data.message || 'Failed to delete coupon.');
//             }
//         } catch (err) {
//             console.error("Delete failed:", err);
//             toast.error('Error deleting coupon.');
//         }
//     }, [user, userId]);

//     // Toggle active status
//     const handleToggleActive = useCallback(async (preset) => {
//         try {
//             const toggleUrl = user === "admin"
//                 ? `${import.meta.env.VITE_API_URL}/api/admin/user/${userId}/presets/${preset._id}/setActive`
//                 : `${import.meta.env.VITE_API_URL}/api/user/coupon/presets/${preset._id}/setActive`;

//             const res = await fetch(toggleUrl, {
//                 method: 'PATCH',
//                 credentials: 'include',
//                 headers: {
//                     'Authorization': `${getAuthToken()}`
//                 }
//             });

//             if (res.ok) {
//                 setOpenMenuIndex(null);
//                 setPresets(prev =>
//                     prev.map(p => ({
//                         ...p,
//                         isActive: p._id === preset._id
//                     }))
//                 );
//                 toast.success('✅ Status updated successfully!');
//             } else {
//                 const data = await res.json();
//                 toast.error(data.message || '❌ Failed to update status.');
//             }
//         } catch (err) {
//             console.error("Toggle error:", err);
//             toast.error('Error updating status.');
//         }
//     }, [user, userId]);

//     // Edit preset
//     const handleEditPreset = useCallback((preset) => {
//         setForm({
//             discountType: preset.discountType || 'percentage',
//             presetName: preset.presetName || '',
//             discountAmount: preset.discountAmount || '',
//             maxDiscount: preset.maxDiscount || '',
//             minPurchase: preset.minPurchase || '',
//             day: preset.day || '',
//             usageLimit: preset.usageLimit || '',
//             type: 'own',
//             conditions: preset.conditions || '',
//             link: preset.link || '',
//             startAt: preset.startAt || '',
//             expireAt: preset.expireAt || ''
//         });
//         setIsEditing(true);
//         setEditingPresetId(preset._id);
//         setShowForm(true);
//     }, []);

//     const toggleMenu = useCallback((index) => {
//         setOpenMenuIndex(prevIndex => prevIndex === index ? null : index);
//     }, []);

//     return (
//         <div className="p-8 mx-auto rounded-lg min-h-screen">
//             {/* Header */}
//             <div className="flex justify-between mb-6 items-center flex-wrap gap-4">
//                 <h1 className="text-2xl font-bold text-gray-700">All Presets</h1>
//                 <button
//                     onClick={() => setShowForm(true)}
//                     className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold px-6 py-2.5 rounded-md shadow transition"
//                 >
//                     + Create Coupon
//                 </button>
//             </div>

//             {/* FilterBar Component */}
//             <FilterBar
//                 search={search}
//                 setSearch={setSearch}
//                 searchLoading={presetLoading && search}
//                 statusFilter={statusFilter}
//                 setStatusFilter={setStatusFilter}
//                 startDate={startDate}
//                 setStartDate={setStartDate}
//                 endDate={endDate}
//                 setEndDate={setEndDate}
//                 quickDateFilter={quickDateFilter}
//                 setQuickDateFilter={setQuickDateFilter}
//                 placeholder="Search by coupon name..."
//                 statusOptions={[
//                     { value: "", label: "All Statuses" },
//                     { value: "active", label: "Active" },
//                     { value: "inactive", label: "Inactive" }
//                 ]}
//                 onClearFilters={handleClearFilters}
//             />

//             {/* Preset Cards */}
//             {presetLoading && !searchTerm && !statusFilter && !startDate && !endDate ? (
//                 <div className="flex items-center justify-center h-64 text-gray-500">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
//                     Loading...
//                 </div>
//             ) : presets.length === 0 ? (
//                 <div className="text-gray-500 col-span-full text-center py-10">
//                     No Own Brand coupons found.
//                 </div>
//             ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 my-6">
//                     {presets.map((preset, index) => (
//                         <PresetCard
//                             key={preset._id}
//                             preset={preset}
//                             index={index}
//                             openMenuIndex={openMenuIndex}
//                             toggleMenu={toggleMenu}
//                             handleEditPreset={handleEditPreset}
//                             handleDeletePreset={handleDeletePreset}
//                             setPresetToDelete={setPresetToDelete}
//                             setShowDeleteModal={setShowDeleteModal}
//                             handleToggleActive={handleToggleActive}
//                             menuRefs={menuRefs}
//                         />
//                     ))}
//                 </div>
//             )}

//             {/* Overlay and Form */}
//             {showForm && (
//                 <div className="fixed inset-0 bg-black/15 backdrop-blur-sm z-40" onClick={() => setShowForm(false)} />
//             )}

//             <PresetForm
//                 showForm={showForm}
//                 setShowForm={setShowForm}
//                 form={form}
//                 handleChange={handleChange}
//                 handleSubmit={handleSubmit}
//                 resetForm={resetForm}
//                 loading={loading}
//                 isEditing={isEditing}
//                 type="own"
//             />

//             {/* Delete Confirmation */}
//             {showDeleteModal && (
//                 <PresetToggle
//                     presetToDelete={presetToDelete}
//                     setShowDeleteModal={setShowDeleteModal}
//                     handleDeletePreset={handleDeletePreset}
//                     setPresetToDelete={setPresetToDelete}
//                 />
//             )}
//         </div>
//     );
// };

// export default SetDiscountPage;



import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import PresetForm from './presetForm';
import PresetToggle from './PresetToggle';
import PresetCard from './PresetCard';
import FilterBar from '../Common/FilterBar';
import { useUser } from '../../Context/ContextApt';
import { getAuthToken } from '../../Context/apiService';
import { toast } from 'react-toastify';

const SetDiscountPage = () => {
    // State management
    const [presets, setPresets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [presetLoading, setPresetLoading] = useState(true);
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
    const [typeFilter, setTypeFilter] = useState(''); // Add type filter

    // Refs and context
    const menuRefs = useRef([]);
    const { userData } = useUser();
    const userRole = userData?.user?.role;
    const { userId } = useParams();

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
        type: userRole === 'admin' ? 'own' : 'own' // Admin can change this in form
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
        setPresetLoading(true);
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
                toast.error('Failed to load coupons');
                setPresets([]);
            }
        } catch (err) {
            console.error('Failed to fetch presets:', err);
            toast.error('Error loading coupons');
            setPresets([]);
        } finally {
            setPresetLoading(false);
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
            type: userRole === 'admin' ? 'own' : 'own' // Reset to default based on role
        });
    }, [userRole]);

    // Form submission - Remove hardcoded type override
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
                    ? `${import.meta.env.VITE_API_URL}/api/admin/user/${userId}/presets/${editingPresetId}`
                    : `${import.meta.env.VITE_API_URL}/api/user/coupon/presets/${editingPresetId}`)
                : setUrl;

            const requestBody = {
                ...form,
                maxDiscount: form.maxDiscount ? parseFloat(form.maxDiscount) : undefined,
                minPurchase: form.minPurchase ? parseFloat(form.minPurchase) : undefined,
                day: form.day ? parseInt(form.day) : undefined,
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
                toast.success(successMessage);
                resetForm();
                fetchPresets();
                setShowForm(false);
                setIsEditing(false);
                setEditingPresetId(null);
            } else {
                toast.error(data.message || 'Failed to save coupon.');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error saving coupon.');
        } finally {
            setLoading(false);
        }
    }, [form, isEditing, editingPresetId, resetForm, fetchPresets, setUrl, userRole, userId]);

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
                toast.success('Coupon deleted successfully!');
                setOpenMenuIndex(null)
                setPresets(prev => prev.filter(p => p._id !== preset._id));
            } else {
                const data = await res.json();
                toast.error(data.message || 'Failed to delete coupon.');
            }
        } catch (err) {
            console.error("Delete failed:", err);
            toast.error('Error deleting coupon.');
        }
    }, [userRole, userId]);

    // Toggle active status
    const handleToggleActive = useCallback(async (preset) => {
        try {
            const toggleUrl = userRole === "admin"
                ? `${import.meta.env.VITE_API_URL}/api/admin/user/${userId}/presets/${preset._id}/setActive`
                : `${import.meta.env.VITE_API_URL}/api/user/coupon/presets/${preset._id}/setActive`;

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
                        isActive: p._id === preset._id
                    }))
                );
                toast.success('✅ Status updated successfully!');
            } else {
                const data = await res.json();
                toast.error(data.message || '❌ Failed to update status.');
            }
        } catch (err) {
            console.error("Toggle error:", err);
            toast.error('Error updating status.');
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
            type: preset.type || (userRole === 'admin' ? 'own' : 'own'), // Use preset type or default
            conditions: preset.conditions || '',
            link: preset.link || '',
            startAt: preset.startAt || '',
            expireAt: preset.expireAt || ''
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

            {/* FilterBar Component - Enhanced for admin */}
            <FilterBar
                search={search}
                setSearch={setSearch}
                searchLoading={presetLoading && search}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                quickDateFilter={quickDateFilter}
                setQuickDateFilter={setQuickDateFilter}
                placeholder="Search by coupon name..."
                statusOptions={[
                    { value: "", label: "All Statuses" },
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" }
                ]}
                // Add type filter for admin
                showTypeFilter={userRole === 'admin'}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                typeOptions={[
                    { value: "", label: "All Types" },
                    { value: "own", label: "Own Promotion" },
                    { value: "cross", label: "Cross Promotion" },
                    { value: "offer", label: "Special Offer" }
                ]}
                onClearFilters={handleClearFilters}
            />

            {/* Preset Cards */}
            {presetLoading && !searchTerm && !statusFilter && !startDate && !endDate && !typeFilter ? (
                <div className="flex items-center justify-center h-64 text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
                    Loading...
                </div>
            ) : presets.length === 0 ? (
                <div className="text-gray-500 col-span-full text-center py-10">
                    {userRole === 'admin' ? 'No coupons found.' : 'No Own Brand coupons found.'}
                </div>
            ) : (
                // <div className={`grid grid-cols-1 ${userRole === 'admin' ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-8 my-6`}>
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
                            handleDeletePreset={handleDeletePreset}
                            setPresetToDelete={setPresetToDelete}
                            setShowDeleteModal={setShowDeleteModal}
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
                // For admin: don't pass type prop (or pass undefined) to show type selector
                // For users: pass type="own" to hide type selector
                type={userRole === 'admin' ? undefined : 'own'}
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

export default SetDiscountPage;