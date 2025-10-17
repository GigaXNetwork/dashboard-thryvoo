// import React, { useEffect, useState, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import MessagePopup from '../Common/MessagePopup';
// import PresetForm from './presetForm';
// import PresetToggle from './PresetToggle';
// import PresetCard from './PresetCard';
// import { useUser } from '../../Context/ContextApt';
// import Cookies from "js-cookie"

// const SetDiscountPage = () => {
//     const [presets, setPresets] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState('');
//     const [showForm, setShowForm] = useState(false);
//     const [openMenuIndex, setOpenMenuIndex] = useState(null);
//     const [presetToDelete, setPresetToDelete] = useState(null);
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [isEditing, setIsEditing] = useState(false);
//     const [editingPresetId, setEditingPresetId] = useState(null);
//     const [activeTab, setActiveTab] = useState("Own");

//     const menuRefs = useRef([]);
//     const { userData } = useUser();
//     const user = userData.user.role;


//     const toggleMenu = (i) => {
//         setOpenMenuIndex(openMenuIndex === i ? null : i);
//     };

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

//     const tabs = ["Own", "Cross Brand"]
//     const token = Cookies.get("authToken")
//     const { userId } = useParams();
//     const getUrl = user === 'admin'
//         ? `${import.meta.env.VITE_API_URL}/api/admin/user/${userId}/getDiscount`
//         : `${import.meta.env.VITE_API_URL}/api/user/getCoupon`;

//     const setUrl = user === 'admin'
//         ? `${import.meta.env.VITE_API_URL}/api/admin/user/${userId}/setDiscount`
//         : `${import.meta.env.VITE_API_URL}/api/user/setCoupon`;


//     // fetch all presets data
//     const fetchPresets = async () => {
//         try {
//             const res = await fetch(getUrl, {
//                 method: "GET",
//                 headers: {
//                     'Authorization': `${token}`,
//                     'Content-Type': 'application/json'
//                 }
//             });
//             if (res.ok) {
//                 const data = await res.json();
//                 setPresets(data.discount || []);
//             }
//         } catch (err) {
//             console.error("Failed to fetch presets:", err);
//         }
//     };



//     useEffect(() => {
//         fetchPresets();
//     }, []);





//     // handle change
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setForm(prev => ({ ...prev, [name]: value }));
//     };

//     const resetForm = () => {
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
//     };


//     // handle submit 
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setMessage('');

//         const {
//             discountType, presetName, discountAmount,
//             maxDiscount, minPurchase, day, usageLimit, type, conditions, link, startAt,
//             expireAt
//         } = form;

//         try {
//             const method = isEditing ? 'PATCH' : 'POST';
//             let url;

//             if (isEditing) {
//                 url = user === 'admin'
//                     ? `${import.meta.env.VITE_API_URL}/api/admin/user/${userId}/presets/${editingPresetId}`
//                     : `${import.meta.env.VITE_API_URL}/api/user/coupon/presets/${editingPresetId}`;
//             } else {
//                 url = setUrl;
//             }
//             console.log({
//                 discountType,
//                 presetName,
//                 discountAmount,
//                 maxDiscount: parseFloat(maxDiscount),
//                 minPurchase: parseFloat(minPurchase),
//                 day: parseInt(day),
//                 usageLimit: parseInt(usageLimit),
//                 type
//             });

//             const res = await fetch(url, {
//                 method,
//                 headers: { 'Content-Type': 'application/json' },
//                 credentials: 'include',
//                 body: JSON.stringify({
//                     discountType,
//                     presetName,
//                     discountAmount,
//                     maxDiscount: parseFloat(maxDiscount),
//                     minPurchase: parseFloat(minPurchase),
//                     day: parseInt(day),
//                     usageLimit: parseInt(usageLimit),
//                     type,
//                     conditions,
//                     link,
//                     startAt,
//                     expireAt
//                 })
//             });

//             const data = await res.json();

//             if (res.ok) {
//                 setMessage(isEditing ? '✅ Preset updated!' : '✅ Coupon set successfully!');
//                 resetForm();
//                 fetchPresets();
//                 setShowForm(false);
//                 setIsEditing(false);
//                 setEditingPresetId(null);
//             } else {
//                 setMessage(data.message || '❌ Failed to save preset.');
//             }
//         } catch (err) {
//             console.error(err);
//             setMessage('❌ Error saving preset.');
//         } finally {
//             setLoading(false);
//         }
//     };




//     // 3 dots menu action
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (
//                 openMenuIndex !== null &&
//                 menuRefs.current[openMenuIndex] &&
//                 !menuRefs.current[openMenuIndex].contains(event.target)
//             ) {
//                 setOpenMenuIndex(null);
//             }
//         };

//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, [openMenuIndex]);

//     // delete preset
//     const handleDeletePreset = async (preset) => {

//         try {
//             const deleteUrl = `${import.meta.env.VITE_API_URL}/api/user/coupon/presets/${preset._id}`;
//             const res = await fetch(deleteUrl, {
//                 method: 'DELETE',
//                 credentials: 'include',
//             });

//             if (res.ok) {
//                 setMessage('✅ Preset deleted successfully!');
//                 setPresets(prev => prev.filter(p => p._id !== preset._id));
//                 // Refresh the list
//             } else {
//                 const data = await res.json();
//                 setMessage(data.message || '❌ Failed to delete preset.');
//             }
//         } catch (err) {
//             console.error("Delete failed:", err);
//             setMessage('❌ Error deleting preset.');
//         }
//     };


//     // set active status
//     const handleToggleActive = async (preset) => {
//         try {
//             let toggleUrl;
//             if (user === "admin") {
//                 toggleUrl = `${import.meta.env.VITE_API_URL}/api/admin/user/${userId}/presets/${preset._id}/setActive`;
//             } else {
//                 toggleUrl = `${import.meta.env.VITE_API_URL}/api/user/coupon/presets/${preset._id}/setActive`;
//             }
//             const res = await fetch(toggleUrl, {
//                 method: 'PATCH', // Assuming PATCH is used for partial updates
//                 credentials: 'include',
//             });

//             const data = await res.json();

//             if (res.ok) {
//                 // Update local state

//                 setPresets((prevPresets) =>
//                     prevPresets.map((p) => ({
//                         ...p,
//                         isActive: p._id === preset._id, // Only one active at a time
//                     }))
//                 );

//                 // ✅ Optional: ensure consistency with server
//                 fetchPresets();

//             } else {
//                 setMessage(data.message || '❌ Failed to update status.');
//             }
//         } catch (err) {
//             console.error("Toggle error:", err);
//             setMessage('❌ Error updating status.');
//         }
//     };

//     // edit preset
//     const handleEditPreset = (preset) => {
//         setForm({
//             discountType: preset.discountType || 'percentage',
//             presetName: preset.presetName || '',
//             discountAmount: preset.discountAmount || '',
//             maxDiscount: preset.maxDiscount || '',
//             minPurchase: preset.minPurchase || '',
//             day: preset.day || '',
//             usageLimit: preset.usageLimit || '',
//             type: preset.type || 'own'
//         });

//         setIsEditing(true);
//         setEditingPresetId(preset._id);
//         setShowForm(true);
//     };



//     const filteredPresets = presets.filter(preset => {
//         if (activeTab === 'Own') return preset.type === 'own';
//         if (activeTab === 'Cross Brand') return preset.type === 'cross';
//         if (activeTab === 'Offer') return preset.type === 'offer';
//         return false;
//     });

//     return (
//         <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-md min-h-screen">

//             {message && (
//                 <MessagePopup message={message} type={`${message.includes('✅') ? 'success' : 'error'}`} onClose={() => setMessage('')} />
//             )}

//             <div className="flex justify-between mb-6 items-center flex-wrap gap-4">
//                 <h1 className="text-3xl font-bold text-gray-900">Coupon Presets</h1>
//                 <button
//                     onClick={() => setShowForm(true)}
//                     className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md shadow transition"
//                 >
//                     + Create Coupon
//                 </button>
//             </div>

//             {/* Tabs */}
//             <div className="flex border-b border-gray-200">
//                 {tabs.map((tab) => (
//                     <button
//                         key={tab}
//                         onClick={() => setActiveTab(tab)}
//                         className={`px-4 py-2 -mb-px text-sm font-medium border-b-2 transition-colors duration-200 ${activeTab === tab
//                             ? "border-indigo-600 text-indigo-600"
//                             : "border-transparent text-gray-500 hover:text-indigo-500 hover:border-gray-300"
//                             }`}
//                     >
//                         {tab}
//                     </button>
//                 ))}
//             </div>



//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 my-6">
//                 {filteredPresets.length > 0 ? (
//                     filteredPresets.map((preset, index) => (
//                         <PresetCard
//                             key={index}
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
//                     ))
//                 ) : (
//                     <div className="text-gray-500 col-span-full text-center py-10">
//                         No {activeTab} presets found.
//                     </div>
//                 )}

//             </div>


//             {/* Backdrop Overlay */}
//             {showForm && (
//                 <div
//                     className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
//                     onClick={() => setShowForm(false)}
//                 />
//             )}

//             {/* Slide-In Form Drawer */}
//             <PresetForm
//                 showForm={showForm}
//                 setShowForm={setShowForm}
//                 form={form}
//                 handleChange={handleChange}
//                 handleSubmit={handleSubmit}
//                 resetForm={resetForm}
//                 loading={loading}
//                 isEditing={isEditing}
//             />

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




// import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
// import { useParams } from 'react-router-dom';
// import MessagePopup from '../Common/MessagePopup';
// import PresetForm from './presetForm';
// import PresetToggle from './PresetToggle';
// import PresetCard from './PresetCard';
// import { useUser } from '../../Context/ContextApt';
// import Cookies from "js-cookie";

// const SetDiscountPage = () => {
//     const [presets, setPresets] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [fetchLoading, setFetchLoading] = useState(false);
//     const [message, setMessage] = useState('');
//     const [showForm, setShowForm] = useState(false);
//     const [openMenuIndex, setOpenMenuIndex] = useState(null);
//     const [presetToDelete, setPresetToDelete] = useState(null);
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [isEditing, setIsEditing] = useState(false);
//     const [editingPresetId, setEditingPresetId] = useState(null);
//     const [activeTab, setActiveTab] = useState("Own");

//     const [search, setSearch] = useState('');
//     const [statusFilter, setStatusFilter] = useState('');
//     const [startDate, setStartDate] = useState('');
//     const [endDate, setEndDate] = useState('');
//     const [quickDateFilter, setQuickDateFilter] = useState('');

//     const menuRefs = useRef([]);
//     const { userData } = useUser();
//     const user = userData.user.role;
//     const token = Cookies.get("authToken");
//     const { userId } = useParams();

//     const tabs = useMemo(() => ["Own", "Cross Brand"], []);

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

//     // Debounced fetch presets with filters
//     useEffect(() => {
//         const fetchPresets = async () => {
//             setFetchLoading(true);

//             try {
//                 // Custom query builder that encodes values but keeps keys intact as-is
//                 const buildQuery = (params) => {
//                     return Object.entries(params)
//                         .filter(([_, v]) => v !== '' && v !== undefined && v !== null)
//                         .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
//                         .join('&');
//                 };

//                 const queryParams = {
//                     type: 'offer',
//                     ...(search ? { presetName: search.trim() } : {}),
//                     ...(statusFilter ? { status: statusFilter } : {}),
//                     ...(startDate ? { 'createdAt[gt]': startDate } : {}),
//                     ...(endDate ? { 'createdAt[lt]': endDate } : {}),
//                 };

//                 const url = `${getUrl}?${buildQuery(queryParams)}`;

//                 const res = await fetch(url, {
//                     credentials: 'include',
//                     headers: {
//                         Authorization: `${token}`,
//                         'Content-Type': 'application/json',
//                     },
//                 });

//                 if (res.ok) {
//                     const data = await res.json();
//                     const offerPresets = data.discount || [];
//                     setPresets(offerPresets);
//                     // setFilteredPresets(offerPresets);
//                 } else {
//                     setMessage('❌ Failed to load offers');
//                 }
//             } catch (err) {
//                 console.error('Failed to fetch presets:', err);
//                 setMessage('❌ Error loading offers');
//             } finally {
//                 setFetchLoading(false);
//             }
//         };

//         const timeout = setTimeout(fetchPresets, 300);
//         return () => clearTimeout(timeout);
//     }, [search, statusFilter, startDate, endDate, getUrl, token]);

//     // Reset quickDateFilter and set start and end dates
//     const handleQuickDateFilterChange = useCallback((value) => {
//         setQuickDateFilter(value);
//         const today = new Date();
//         let start = '', end = today.toISOString().split('T')[0];

//         switch (value) {
//             case 'today': start = end; break;
//             case '7days': start = new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0]; break;
//             case '15days': start = new Date(today.setDate(today.getDate() - 15)).toISOString().split('T')[0]; break;
//             case '1month': start = new Date(today.setMonth(today.getMonth() - 1)).toISOString().split('T')[0]; break;
//             default: start = ''; end = ''; break;
//         }

//         setStartDate(start);
//         setEndDate(end);
//     }, []);

//     // Fetch all presets initially
//     const fetchPresets = useCallback(async () => {
//         try {
//             setFetchLoading(true);
//             const res = await fetch(getUrl, {
//                 method: "GET",
//                 headers: {
//                     'Authorization': token,
//                     'Content-Type': 'application/json'
//                 }
//             });

//             if (res.ok) {
//                 const data = await res.json();
//                 setPresets(data.discount || []);
//             }
//         } catch (err) {
//             console.error("Failed to fetch presets:", err);
//             setMessage('❌ Error loading presets.');
//         } finally {
//             setFetchLoading(false);
//         }
//     }, [getUrl, token]);

//     useEffect(() => {
//         fetchPresets();
//     }, [fetchPresets]);

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

//     // Handle form submission for create or edit
//     const handleSubmit = useCallback(async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setMessage('');

//         const {
//             discountType, presetName, discountAmount, maxDiscount,
//             minPurchase, day, usageLimit, type, conditions, link, startAt, expireAt
//         } = form;

//         if (!presetName || !discountAmount) {
//             setMessage('❌ Please fill in all required fields');
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
//                 headers: { 'Content-Type': 'application/json' },
//                 credentials: 'include',
//                 body: JSON.stringify({
//                     discountType,
//                     presetName,
//                     discountAmount,
//                     maxDiscount: maxDiscount ? parseFloat(maxDiscount) : undefined,
//                     minPurchase: minPurchase ? parseFloat(minPurchase) : undefined,
//                     day: day ? parseInt(day) : undefined,
//                     usageLimit: usageLimit ? parseInt(usageLimit) : undefined,
//                     type,
//                     conditions,
//                     link,
//                     startAt,
//                     expireAt
//                 })
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 setMessage(isEditing ? '✅ Preset updated!' : '✅ Coupon set successfully!');
//                 resetForm();
//                 fetchPresets();
//                 setShowForm(false);
//                 setIsEditing(false);
//                 setEditingPresetId(null);
//             } else {
//                 setMessage(data.message || '❌ Failed to save preset.');
//             }
//         } catch (err) {
//             console.error(err);
//             setMessage('❌ Error saving preset.');
//         } finally {
//             setLoading(false);
//         }
//     }, [form, isEditing, editingPresetId, resetForm, fetchPresets, setUrl, user, userId]);

//     // Handle 3-dot menu outside click
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

//     // Delete preset
//     const handleDeletePreset = useCallback(async (preset) => {
//         try {
//             const deleteUrl = user === 'admin'
//                 ? `${import.meta.env.VITE_API_URL}/api/admin/user/${userId}/presets/${preset._id}`
//                 : `${import.meta.env.VITE_API_URL}/api/user/coupon/presets/${preset._id}`;

//             const res = await fetch(deleteUrl, {
//                 method: 'DELETE',
//                 credentials: 'include',
//             });

//             if (res.ok) {
//                 setMessage('✅ Preset deleted successfully!');
//                 setPresets(prev => prev.filter(p => p._id !== preset._id));
//             } else {
//                 const data = await res.json();
//                 setMessage(data.message || '❌ Failed to delete preset.');
//             }
//         } catch (err) {
//             console.error("Delete failed:", err);
//             setMessage('❌ Error deleting preset.');
//         }
//     }, [user, userId]);

//     // Toggle active status (only one active preset at a time)
//     const handleToggleActive = useCallback(async (preset) => {
//         try {
//             const toggleUrl = user === "admin"
//                 ? `${import.meta.env.VITE_API_URL}/api/admin/user/${userId}/presets/${preset._id}/setActive`
//                 : `${import.meta.env.VITE_API_URL}/api/user/coupon/presets/${preset._id}/setActive`;

//             const res = await fetch(toggleUrl, {
//                 method: 'PATCH',
//                 credentials: 'include',
//             });

//             const data = await res.json();

//             if (res.ok) {
//                 setPresets(prev =>
//                     prev.map(p => ({
//                         ...p,
//                         isActive: p._id === preset._id
//                     }))
//                 );
//                 fetchPresets();
//             } else {
//                 setMessage(data.message || '❌ Failed to update status.');
//             }
//         } catch (err) {
//             console.error("Toggle error:", err);
//             setMessage('❌ Error updating status.');
//         }
//     }, [user, userId, fetchPresets]);

//     const handleEditPreset = useCallback((preset) => {
//         setForm({
//             discountType: preset.discountType || 'percentage',
//             presetName: preset.presetName || '',
//             discountAmount: preset.discountAmount || '',
//             maxDiscount: preset.maxDiscount || '',
//             minPurchase: preset.minPurchase || '',
//             day: preset.day || '',
//             usageLimit: preset.usageLimit || '',
//             type: preset.type || 'own',
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

//     const filteredPresets = useMemo(() => {
//         return presets.filter(preset => {
//             if (activeTab === 'Own') return preset.type === 'own';
//             if (activeTab === 'Cross Brand') return preset.type === 'cross';
//             if (activeTab === 'Offer') return preset.type === 'offer';
//             return false;
//         });
//     }, [presets, activeTab]);

//     const clearAllFilters = useCallback(() => {
//         setSearch('');
//         setStatusFilter('');
//         setStartDate('');
//         setEndDate('');
//         setQuickDateFilter('');
//     }, []);

//     return (
//         <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-md min-h-screen">
//             {message && (
//                 <MessagePopup
//                     message={message}
//                     type={message.includes('✅') ? 'success' : 'error'}
//                     onClose={() => setMessage('')}
//                 />
//             )}

//             {/* Header */}
//             <div className="flex justify-between mb-6 items-center flex-wrap gap-4">
//                 <h1 className="text-3xl font-bold text-gray-900">Coupon Presets</h1>
//                 <button
//                     onClick={() => setShowForm(true)}
//                     className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md shadow transition"
//                 >
//                     + Create Coupon
//                 </button>
//             </div>

//             {/* Filters */}
//             <div className="bg-white rounded-2xl p-6 shadow-md space-y-6 mb-5">
//                 <div className="relative mx-auto">
//                     <input
//                         type="text"
//                         placeholder="Search by offer name..."
//                         value={search}
//                         onChange={e => setSearch(e.target.value)}
//                         className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 shadow-inner text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
//                     />
//                     {fetchLoading && <div className="absolute right-4 top-3.5 animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>}
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                     <select
//                         value={statusFilter}
//                         onChange={e => setStatusFilter(e.target.value)}
//                         className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
//                     >
//                         <option value="">All Statuses</option>
//                         <option value="active">Active</option>
//                         <option value="inactive">Inactive</option>
//                     </select>

//                     <input
//                         type="date"
//                         value={startDate}
//                         onChange={e => {
//                             setQuickDateFilter('');
//                             setStartDate(e.target.value);
//                         }}
//                         className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm shadow-inner focus:ring-2 focus:ring-blue-500 transition duration-200"
//                     />

//                     <input
//                         type="date"
//                         value={endDate}
//                         onChange={e => {
//                             setQuickDateFilter('');
//                             setEndDate(e.target.value);
//                         }}
//                         className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm shadow-inner focus:ring-2 focus:ring-blue-500 transition duration-200"
//                     />

//                     <select
//                         value={quickDateFilter}
//                         onChange={e => handleQuickDateFilterChange(e.target.value)}
//                         className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
//                     >
//                         <option value="">Quick Filter</option>
//                         <option value="today">Today</option>
//                         <option value="7days">Last 7 Days</option>
//                         <option value="15days">Last 15 Days</option>
//                         <option value="1month">Last 1 Month</option>
//                     </select>
//                 </div>

//                 {(search || statusFilter || startDate || endDate) && (
//                     <button onClick={clearAllFilters} className="text-sm text-gray-600 hover:text-gray-900 underline mt-2">
//                         Clear All Filters
//                     </button>
//                 )}
//             </div>

//             {/* Tabs */}
//             <div className="flex border-b border-gray-200">
//                 {tabs.map(tab => (
//                     <button
//                         key={tab}
//                         onClick={() => setActiveTab(tab)}
//                         className={`px-4 py-2 -mb-px text-sm font-medium border-b-2 transition-colors duration-200 ${activeTab === tab ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-indigo-500 hover:border-gray-300"
//                             }`}
//                     >
//                         {tab}
//                     </button>
//                 ))}
//             </div>

//             {/* Preset Cards */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 my-6">
//                 {filteredPresets.length > 0 ? (
//                     filteredPresets.map((preset, index) => (
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
//                     ))
//                 ) : (
//                     <div className="text-gray-500 col-span-full text-center py-10">
//                         No {activeTab} presets found.
//                     </div>
//                 )}
//             </div>

//             {/* Overlay and Form */}
//             {showForm && (
//                 <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={() => setShowForm(false)} />
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








// import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
// import { useParams } from 'react-router-dom';
// import MessagePopup from '../Common/MessagePopup';
// import PresetForm from './presetForm';
// import PresetToggle from './PresetToggle';
// import PresetCard from './PresetCard';
// import { useUser } from '../../Context/ContextApt';
// import Cookies from "js-cookie";
// import { getAuthToken } from '../../Context/apiService';

// const SetDiscountPage = () => {
//     const [presets, setPresets] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [presetLoading, setPresetLoading] = useState(false);
//     const [fetchLoading, setFetchLoading] = useState(false);
//     const [message, setMessage] = useState('');
//     const [showForm, setShowForm] = useState(false);
//     const [openMenuIndex, setOpenMenuIndex] = useState(null);
//     const [presetToDelete, setPresetToDelete] = useState(null);
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [isEditing, setIsEditing] = useState(false);
//     const [editingPresetId, setEditingPresetId] = useState(null);

//     const [search, setSearch] = useState('');
//     const [statusFilter, setStatusFilter] = useState('');
//     const [startDate, setStartDate] = useState('');
//     const [endDate, setEndDate] = useState('');
//     const [quickDateFilter, setQuickDateFilter] = useState('');

//     const menuRefs = useRef([]);
//     const { userData } = useUser();
//     const user = userData.user.role;
//     const token = Cookies.get("authToken");
//     const { userId } = useParams();

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

//     // Debounced fetch presets with filters
//     useEffect(() => {
//         const fetchPresets = async () => {
//             setFetchLoading(true);
//             setPresetLoading(true);
//             try {
//                 const buildQuery = (params) => {
//                     return Object.entries(params)
//                         .filter(([_, v]) => v !== '' && v !== undefined && v !== null)
//                         .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
//                         .join('&');
//                 };

//                 const queryParams = {
//                     type: 'own', // Only fetch own type
//                     ...(search ? { presetName: search.trim() } : {}),
//                     ...(statusFilter ? { status: statusFilter } : {}),
//                     ...(startDate ? { 'createdAt[gt]': startDate } : {}),
//                     ...(endDate ? { 'createdAt[lt]': endDate } : {}),
//                 };

//                 const url = `${getUrl}?${buildQuery(queryParams)}`;

//                 const res = await fetch(url, {
//                     credentials: 'include',
//                     headers: {
//                         'Authorization': `${getAuthToken()}`,
//                         'Content-Type': 'application/json',
//                     },
//                 });

//                 if (res.ok) {
//                     const data = await res.json();
//                     const ownPresets = data.discount || [];
//                     setPresets(ownPresets);
//                 } else {
//                     setMessage('❌ Failed to load coupons');
//                 }
//             } catch (err) {
//                 console.error('Failed to fetch presets:', err);
//                 setMessage('❌ Error loading coupons');
//             } finally {
//                 setFetchLoading(false);
//                 setPresetLoading(false)
//             }
//         };

//         const timeout = setTimeout(fetchPresets, 300);
//         return () => clearTimeout(timeout);
//     }, [search, statusFilter, startDate, endDate, getUrl]);

//     // Reset quickDateFilter and set start and end dates
//     const handleQuickDateFilterChange = useCallback((value) => {
//         setQuickDateFilter(value);
//         const today = new Date();
//         let start = '', end = today.toISOString().split('T')[0];

//         switch (value) {
//             case 'today': start = end; break;
//             case '7days': start = new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0]; break;
//             case '15days': start = new Date(today.setDate(today.getDate() - 15)).toISOString().split('T')[0]; break;
//             case '1month': start = new Date(today.setMonth(today.getMonth() - 1)).toISOString().split('T')[0]; break;
//             default: start = ''; end = ''; break;
//         }

//         setStartDate(start);
//         setEndDate(end);
//     }, []);

//     // Fetch all presets initially
//     const fetchPresets = useCallback(async () => {
//         try {
//             setFetchLoading(true);
//             setPresetLoading(true)
//             const res = await fetch(getUrl, {
//                 method: "GET",
//                 headers: {
//                     'Authorization': `${getAuthToken()}`,
//                     'Content-Type': 'application/json'
//                 }
//             });

//             if (res.ok) {
//                 const data = await res.json();
//                 // Filter only own type presets
//                 const ownPresets = (data.discount || []).filter(preset => preset.type === 'own');
//                 setPresets(ownPresets);
//             }
//         } catch (err) {
//             console.error("Failed to fetch presets:", err);
//             setMessage('❌ Error loading coupons.');
//         } finally {
//             setFetchLoading(false);
//             setPresetLoading(false);
//         }
//     }, [getUrl]);

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
//             type: 'own' // Always set to 'own' for this page
//         });
//     }, []);

//     const [form, setForm] = useState({
//         discountType: 'percentage',
//         presetName: '',
//         discountAmount: '',
//         maxDiscount: '',
//         minPurchase: '',
//         day: '',
//         usageLimit: '',
//         type: 'own' // Default to 'own' type
//     });

//     // Handle form submission for create or edit
//     const handleSubmit = useCallback(async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setMessage('');

//         const {
//             discountType, presetName, discountAmount, maxDiscount,
//             minPurchase, day, usageLimit, conditions, link, startAt, expireAt
//         } = form;

//         if (!presetName || !discountAmount) {
//             setMessage('❌ Please fill in all required fields');
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
//                     discountType,
//                     presetName,
//                     discountAmount,
//                     maxDiscount: maxDiscount ? parseFloat(maxDiscount) : undefined,
//                     minPurchase: minPurchase ? parseFloat(minPurchase) : undefined,
//                     day: day ? parseInt(day) : undefined,
//                     usageLimit: usageLimit ? parseInt(usageLimit) : undefined,
//                     type: 'own', // Force type to 'own'
//                     conditions,
//                     link,
//                     startAt,
//                     expireAt
//                 })
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 setMessage(isEditing ? '✅ Coupon updated!' : '✅ Coupon created successfully!');
//                 resetForm();
//                 fetchPresets();
//                 setShowForm(false);
//                 setIsEditing(false);
//                 setEditingPresetId(null);
//             } else {
//                 setMessage(data.message || '❌ Failed to save coupon.');
//             }
//         } catch (err) {
//             console.error(err);
//             setMessage('❌ Error saving coupon.');
//         } finally {
//             setLoading(false);
//         }
//     }, [form, isEditing, editingPresetId, resetForm, fetchPresets, setUrl, user, userId]);

//     // Handle 3-dot menu outside click
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
//                 setMessage('✅ Coupon deleted successfully!');
//                 setPresets(prev => prev.filter(p => p._id !== preset._id));
//             } else {
//                 const data = await res.json();
//                 setMessage(data.message || '❌ Failed to delete coupon.');
//             }
//         } catch (err) {
//             console.error("Delete failed:", err);
//             setMessage('❌ Error deleting coupon.');
//         }
//     }, [user, userId]);

//     // Toggle active status (only one active preset at a time)
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

//             const data = await res.json();

//             if (res.ok) {
//                 setPresets(prev =>
//                     prev.map(p => ({
//                         ...p,
//                         isActive: p._id === preset._id
//                     }))
//                 );
//                 fetchPresets();
//             } else {
//                 setMessage(data.message || '❌ Failed to update status.');
//             }
//         } catch (err) {
//             console.error("Toggle error:", err);
//             setMessage('❌ Error updating status.');
//         }
//     }, [user, userId, fetchPresets]);

//     const handleEditPreset = useCallback((preset) => {
//         setForm({
//             discountType: preset.discountType || 'percentage',
//             presetName: preset.presetName || '',
//             discountAmount: preset.discountAmount || '',
//             maxDiscount: preset.maxDiscount || '',
//             minPurchase: preset.minPurchase || '',
//             day: preset.day || '',
//             usageLimit: preset.usageLimit || '',
//             type: 'own', // Force type to 'own'
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

//     const clearAllFilters = useCallback(() => {
//         setSearch('');
//         setStatusFilter('');
//         setStartDate('');
//         setEndDate('');
//         setQuickDateFilter('');
//     }, []);

//     return (
//         <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-md min-h-screen">
//             {message && (
//                 <MessagePopup
//                     message={message}
//                     type={message.includes('✅') ? 'success' : 'error'}
//                     onClose={() => setMessage('')}
//                 />
//             )}

//             {/* Header */}
//             <div className="flex justify-between mb-6 items-center flex-wrap gap-4">
//                 <h1 className="text-3xl font-bold text-gray-900">All Presets</h1>
//                 <button
//                     onClick={() => setShowForm(true)}
//                     className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md shadow transition"
//                 >
//                     + Create Coupon
//                 </button>
//             </div>

//             {/* Filters */}
//             <div className="bg-white rounded-2xl p-6 shadow-md space-y-6 mb-5">
//                 <div className="relative mx-auto">
//                     <input
//                         type="text"
//                         placeholder="Search by coupon name..."
//                         value={search}
//                         onChange={e => setSearch(e.target.value)}
//                         className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 shadow-inner text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
//                     />
//                     {fetchLoading && <div className="absolute right-4 top-3.5 animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>}
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                     <select
//                         value={statusFilter}
//                         onChange={e => setStatusFilter(e.target.value)}
//                         className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
//                     >
//                         <option value="">All Statuses</option>
//                         <option value="active">Active</option>
//                         <option value="inactive">Inactive</option>
//                     </select>

//                     <input
//                         type="date"
//                         value={startDate}
//                         onChange={e => {
//                             setQuickDateFilter('');
//                             setStartDate(e.target.value);
//                         }}
//                         className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm shadow-inner focus:ring-2 focus:ring-blue-500 transition duration-200"
//                     />

//                     <input
//                         type="date"
//                         value={endDate}
//                         onChange={e => {
//                             setQuickDateFilter('');
//                             setEndDate(e.target.value);
//                         }}
//                         className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm shadow-inner focus:ring-2 focus:ring-blue-500 transition duration-200"
//                     />

//                     <select
//                         value={quickDateFilter}
//                         onChange={e => handleQuickDateFilterChange(e.target.value)}
//                         className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
//                     >
//                         <option value="">Quick Filter</option>
//                         <option value="today">Today</option>
//                         <option value="7days">Last 7 Days</option>
//                         <option value="15days">Last 15 Days</option>
//                         <option value="1month">Last 1 Month</option>
//                     </select>
//                 </div>

//                 {(search || statusFilter || startDate || endDate) && (
//                     <button onClick={clearAllFilters} className="text-sm text-gray-600 hover:text-gray-900 underline mt-2">
//                         Clear All Filters
//                     </button>
//                 )}
//             </div>

//             {/* Preset Cards */}
//             {presetLoading ? (
//                 <div className="flex items-center justify-center h-64 text-gray-500">
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

    // Refs and context
    const menuRefs = useRef([]);
    const { userData } = useUser();
    const user = userData.user.role;
    const { userId } = useParams();

    // Memoized URLs
    const getUrl = useMemo(() => (
        user === 'admin'
            ? `${import.meta.env.VITE_API_URL}/api/admin/user/${userId}/getDiscount`
            : `${import.meta.env.VITE_API_URL}/api/user/getCoupon`
    ), [user, userId]);

    const setUrl = useMemo(() => (
        user === 'admin'
            ? `${import.meta.env.VITE_API_URL}/api/admin/user/${userId}/setDiscount`
            : `${import.meta.env.VITE_API_URL}/api/user/setCoupon`
    ), [user, userId]);

    // Form state
    const [form, setForm] = useState({
        discountType: 'percentage',
        presetName: '',
        discountAmount: '',
        maxDiscount: '',
        minPurchase: '',
        day: '',
        usageLimit: '',
        type: 'own'
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

    // Optimized fetch function
    const fetchPresets = useCallback(async () => {
        setPresetLoading(true);
        try {
            const params = new URLSearchParams({
                type: 'own',
                ...(searchTerm && { presetName: searchTerm.trim() }),
                ...(statusFilter && { status: statusFilter }),
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
            type: 'own'
        });
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
                ? (user === 'admin'
                    ? `${import.meta.env.VITE_API_URL}/api/admin/user/${userId}/presets/${editingPresetId}`
                    : `${import.meta.env.VITE_API_URL}/api/user/coupon/presets/${editingPresetId}`)
                : setUrl;

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${getAuthToken()}`
                },
                credentials: 'include',
                body: JSON.stringify({
                    ...form,
                    maxDiscount: form.maxDiscount ? parseFloat(form.maxDiscount) : undefined,
                    minPurchase: form.minPurchase ? parseFloat(form.minPurchase) : undefined,
                    day: form.day ? parseInt(form.day) : undefined,
                    usageLimit: form.usageLimit ? parseInt(form.usageLimit) : undefined,
                    type: 'own',
                })
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
    }, [form, isEditing, editingPresetId, resetForm, fetchPresets, setUrl, user, userId]);

    // Delete preset
    const handleDeletePreset = useCallback(async (preset) => {
        try {
            const deleteUrl = user === 'admin'
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
                setPresets(prev => prev.filter(p => p._id !== preset._id));
            } else {
                const data = await res.json();
                toast.error(data.message || 'Failed to delete coupon.');
            }
        } catch (err) {
            console.error("Delete failed:", err);
            toast.error('Error deleting coupon.');
        }
    }, [user, userId]);

    // Toggle active status
    const handleToggleActive = useCallback(async (preset) => {
        try {
            const toggleUrl = user === "admin"
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
    }, [user, userId]);

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
            type: 'own',
            conditions: preset.conditions || '',
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

    return (
        <div className="p-6 max-w-7xl mx-auto rounded-lg min-h-screen">
            {/* Header */}
            <div className="flex justify-between mb-6 items-center flex-wrap gap-4">
                <h1 className="text-3xl font-bold text-gray-900">All Presets</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold px-6 py-2.5 rounded-md shadow transition"
                >
                    + Create Coupon
                </button>
            </div>

            {/* FilterBar Component */}
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
                onClearFilters={handleClearFilters}
            />

            {/* Preset Cards */}
            {presetLoading && !searchTerm && !statusFilter && !startDate && !endDate ? (
                <div className="flex items-center justify-center h-64 text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
                    Loading...
                </div>
            ) : presets.length === 0 ? (
                <div className="text-gray-500 col-span-full text-center py-10">
                    No Own Brand coupons found.
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
                            handleDeletePreset={handleDeletePreset}
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
                type="own"
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