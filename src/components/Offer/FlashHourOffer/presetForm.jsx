// import { X, Calendar, Tag } from 'lucide-react';
// import { useState, useEffect, useCallback } from 'react';

// export default function OfferForm({
//   showForm,
//   setShowForm,
//   form,
//   handleChange,
//   handleSubmit,
//   resetForm,
//   loading,
//   isEditing,
//   title = isEditing ? "Edit Special Offer" : "Create Special Offer",
//   onClose,
//   type
// }) {
//   const [startDate, setStartDate] = useState('');
//   const [startTime, setStartTime] = useState('09:00');
//   const [endDate, setEndDate] = useState('');
//   const [endTime, setEndTime] = useState('17:00');
//   const [errors, setErrors] = useState({});

//   // UTIL: Reconstruct a local date-time in 'yyyy-mm-dd' and 'HH:MM'
//   function getDateLocalParts(isoString) {
//     if (!isoString) return ['', '09:00'];
//     const dateObj = new Date(isoString);
//     // Local date parts
//     const yyyy = dateObj.getFullYear();
//     const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
//     const dd = String(dateObj.getDate()).padStart(2, '0');
//     const hh = String(dateObj.getHours()).padStart(2, '0');
//     const min = String(dateObj.getMinutes()).padStart(2, '0');
//     return [`${yyyy}-${mm}-${dd}`, `${hh}:${min}`];
//   }

//   // Initialize fields FROM form values (ALWAYS USE LOCAL PARTS)
//   useEffect(() => {
//     if (showForm && isEditing) {
//       const [sd, st] = getDateLocalParts(form.startAt);
//       const [ed, et] = getDateLocalParts(form.expireAt);
//       setStartDate(sd);
//       setStartTime(st);
//       setEndDate(ed);
//       setEndTime(et);
//     }
//     if (showForm && !isEditing) {
//       setStartDate('');
//       setStartTime('09:00');
//       setEndDate('');
//       setEndTime('17:00');
//     }
//   }, [form.startAt, form.expireAt, showForm, isEditing]);

//   // Validate the form
//   const validateForm = useCallback(() => {
//     const newErrors = {};
//     if (!form.presetName || form.presetName.trim() === '') newErrors.presetName = 'Offer name is required';
//     if (form.discountType !== 'custom') {
//       if (!form.discountAmount || Number(form.discountAmount) <= 0) newErrors.discountAmount = 'Valid discount amount is required';
//       // Only validate maxDiscount for percentage type
//       if (form.discountType === 'percentage' && (!form.maxDiscount || Number(form.maxDiscount) <= 0)) {
//         newErrors.maxDiscount = 'Valid max discount is required';
//       }
//     } else if (!form.discountAmount || form.discountAmount.trim() === '') {
//       newErrors.discountAmount = 'Custom offer description is required';
//     }
//     if (!form.minPurchase || Number(form.minPurchase) < 0) newErrors.minPurchase = 'Valid minimum purchase is required';
//     if (!form.usageLimit || Number(form.usageLimit) <= 0) newErrors.usageLimit = 'Valid usage limit is required';

//     if (!startDate) newErrors.startDate = 'Start date is required';
//     if (!endDate) newErrors.endDate = 'End date is required';

//     if (startDate && endDate) {
//       const start = new Date(`${startDate}T${startTime}`);
//       const end = new Date(`${endDate}T${endTime}`);
//       if (end <= start) newErrors.endDate = 'End date must be after start date';
//       if (start < new Date()) newErrors.startDate = 'Start date cannot be in the past';
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   }, [form, startDate, startTime, endDate, endTime]);

//   // Submit handler
//   // Submit handler - FIXED VERSION
//   const handleFormSubmit = useCallback((e) => {
//     e.preventDefault();

//     // Validate first
//     if (!validateForm()) {
//       return;
//     }

//     // Construct the date strings directly
//     let startAtISO = '';
//     let expireAtISO = '';

//     if (startDate && startTime) {
//       const startAt = new Date(`${startDate}T${startTime}`);
//       if (!isNaN(startAt.getTime())) {
//         startAtISO = startAt.toISOString();
//       }
//     }

//     if (endDate && endTime) {
//       const expireAt = new Date(`${endDate}T${endTime}`);
//       if (!isNaN(expireAt.getTime())) {
//         expireAtISO = expireAt.toISOString();
//       }
//     }

//     // Create a custom event with the complete form data
//     const submitEvent = {
//       ...e,
//       formData: {
//         ...form,
//         startAt: startAtISO,
//         expireAt: expireAtISO,
//         type: type || 'offer'
//       }
//     };

//     handleSubmit(submitEvent);
//   }, [form, startDate, startTime, endDate, endTime, validateForm, type, handleSubmit]);

//   // Field change for form inputs
//   const handleFieldChange = (e) => {
//     handleChange(e);
//     const { name } = e.target;
//     if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
//   };

//   // Date/time pickers
//   const handleDateTimeChange = (type, value) => {
//     if (type === 'startDate') setStartDate(value);
//     if (type === 'startTime') setStartTime(value);
//     if (type === 'endDate') setEndDate(value);
//     if (type === 'endTime') setEndTime(value);
//     if (errors[type]) setErrors(prev => ({ ...prev, [type]: '' }));
//   };

//   // Today string for min
//   const getTodayDate = () => new Date().toISOString().split('T')[0];

//   // Close and Reset handlers
//   const handleClose = () => {
//     setShowForm(false);
//     setErrors({});
//     if (!isEditing) {
//       setStartDate('');
//       setEndDate('');
//       setStartTime('09:00');
//       setEndTime('17:00');
//     }
//     if (onClose) onClose();
//   };
//   const handleReset = () => {
//     resetForm();
//     setStartDate('');
//     setEndDate('');
//     setStartTime('09:00');
//     setEndTime('17:00');
//     setErrors({});
//   };

//   return (
//     <>
//       {showForm && (
//         <div
//           className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] transition-opacity duration-300"
//           onClick={handleClose}
//         />
//       )}
//       <div className={`fixed inset-0 flex items-center justify-center z-[9999] transition-opacity duration-300 ${showForm ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
//         <div className={`relative w-full max-w-md bg-white rounded-xl shadow-2xl transform transition-transform duration-300 ${showForm ? 'scale-100' : 'scale-95'}`}>
//           <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
//             <div className="flex items-center">
//               <div className="p-2 bg-blue-100 rounded-lg mr-3">
//                 <Tag className="w-5 h-5 text-[#2563EB]" />
//               </div>
//               <h2 className="text-xl font-bold text-gray-800">{title}</h2>
//             </div>
//             <button
//               onClick={handleClose}
//               className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>

//           <form onSubmit={handleFormSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
//             {/* Discount Type */}
//             <div className="space-y-2">
//               <label htmlFor="discountType" className="text-sm font-medium text-gray-700 flex items-center">
//                 Discount Type
//               </label>
//               <select
//                 id="discountType"
//                 name="discountType"
//                 value={form.discountType}
//                 onChange={handleFieldChange}
//                 disabled={loading}
//                 className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
//               >
//                 <option value="percentage">Percentage Off</option>
//                 <option value="fixed">Fixed Amount Off</option>
//                 <option value="custom">Custom Offer</option>
//               </select>
//             </div>

//             {/* Offer Name */}
//             <div className="space-y-2">
//               <label htmlFor="presetName" className="text-sm font-medium text-gray-700 flex items-center">
//                 Offer Name *
//               </label>
//               <input
//                 id="presetName"
//                 name="presetName"
//                 type="text"
//                 value={form.presetName}
//                 onChange={handleFieldChange}
//                 placeholder="Enter offer name"
//                 disabled={loading}
//                 className={`w-full rounded-lg border ${errors.presetName ? 'border-red-500' : 'border-gray-200'} px-4 py-3 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-colors shadow-sm`}
//               />
//               {errors.presetName && <p className="text-red-500 text-xs mt-1">{errors.presetName}</p>}
//             </div>

//             {/* Discount Amount/Offer */}
//             <div className="space-y-2">
//               <label htmlFor="discountAmount" className="text-sm font-medium text-gray-700 flex items-center">
//                 {form.discountType === 'custom' ? 'Custom Offer *' : form.discountType === 'percentage' ? 'Discount Percentage *' : 'Discount Amount *'}
//               </label>
//               <input
//                 id="discountAmount"
//                 name="discountAmount"
//                 type={form.discountType === 'custom' ? 'text' : 'number'}
//                 value={form.discountAmount}
//                 onChange={handleFieldChange}
//                 placeholder={form.discountType === 'custom' ? 'E.g., Buy 1 Get 1 Free' : form.discountType === 'percentage' ? 'E.g., 10 for 10%' : 'E.g., 5 for $5 off'}
//                 disabled={loading}
//                 min={form.discountType === 'percentage' ? 0 : undefined}
//                 max={form.discountType === 'percentage' ? 100 : undefined}
//                 step={form.discountType === 'percentage' ? 0.01 : 1}
//                 className={`w-full rounded-lg border ${errors.discountAmount ? 'border-red-500' : 'border-gray-200'} px-4 py-3 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-colors shadow-sm`}
//               />
//               {errors.discountAmount && <p className="text-red-500 text-xs mt-1">{errors.discountAmount}</p>}
//               {form.discountType === 'percentage' && form.discountAmount > 0 && (
//                 <p className="text-xs text-gray-500">{form.discountAmount}% discount</p>
//               )}
//             </div>

//             {/* Max Discount */}
//             {form.discountType === 'percentage' && (
//               <div className="space-y-2">
//                 <label htmlFor="maxDiscount" className="text-sm font-medium text-gray-700 flex items-center">
//                   Maximum Discount *
//                 </label>
//                 <input
//                   id="maxDiscount"
//                   name="maxDiscount"
//                   type="number"
//                   value={form.maxDiscount}
//                   onChange={handleFieldChange}
//                   placeholder="Enter maximum discount"
//                   disabled={loading}
//                   min="0"
//                   step="0.01"
//                   className={`w-full rounded-lg border ${errors.maxDiscount ? 'border-red-500' : 'border-gray-200'} px-4 py-3 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-colors shadow-sm`}
//                 />
//                 {errors.maxDiscount && <p className="text-red-500 text-xs mt-1">{errors.maxDiscount}</p>}
//               </div>
//             )}

//             {/* Minimum Purchase */}
//             <div className="space-y-2">
//               <label htmlFor="minPurchase" className="text-sm font-medium text-gray-700 flex items-center">
//                 Minimum Purchase Amount *
//               </label>
//               <input
//                 id="minPurchase"
//                 name="minPurchase"
//                 type="number"
//                 value={form.minPurchase}
//                 onChange={handleFieldChange}
//                 placeholder="Enter minimum purchase amount"
//                 disabled={loading}
//                 min="0"
//                 step="0.01"
//                 className={`w-full rounded-lg border ${errors.minPurchase ? 'border-red-500' : 'border-gray-200'} px-4 py-3 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-colors shadow-sm`}
//               />
//               {errors.minPurchase && <p className="text-red-500 text-xs mt-1">{errors.minPurchase}</p>}
//             </div>

//             {/* Validity Period */}
//             <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200 form-field">
//               <div className="flex items-center">
//                 <Calendar className="w-4 h-4 mr-2 text-gray-700" />
//                 <h3 className="text-sm font-medium text-gray-700">
//                   Validity Period *
//                 </h3>
//               </div>
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="space-y-2">
//                   <label htmlFor="startDate" className="block text-xs font-medium text-gray-600">Start Date *</label>
//                   <input
//                     id="startDate"
//                     type="date"
//                     value={startDate}
//                     onChange={e => handleDateTimeChange('startDate', e.target.value)}
//                     min={getTodayDate()}
//                     className={`w-full rounded-lg border ${errors.startDate ? 'border-red-500' : 'border-gray-200'} px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
//                   />
//                   {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
//                 </div>
//                 <div className="space-y-2">
//                   <label htmlFor="startTime" className="block text-xs font-medium text-gray-600">Start Time *</label>
//                   <input
//                     id="startTime"
//                     type="time"
//                     value={startTime}
//                     onChange={e => handleDateTimeChange('startTime', e.target.value)}
//                     className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                   />
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="space-y-2">
//                   <label htmlFor="endDate" className="block text-xs font-medium text-gray-600">End Date *</label>
//                   <input
//                     id="endDate"
//                     type="date"
//                     value={endDate}
//                     onChange={e => handleDateTimeChange('endDate', e.target.value)}
//                     min={startDate || getTodayDate()}
//                     className={`w-full rounded-lg border ${errors.endDate ? 'border-red-500' : 'border-gray-200'} px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
//                   />
//                   {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
//                 </div>
//                 <div className="space-y-2">
//                   <label htmlFor="endTime" className="block text-xs font-medium text-gray-600">End Time *</label>
//                   <input
//                     id="endTime"
//                     type="time"
//                     value={endTime}
//                     onChange={e => handleDateTimeChange('endTime', e.target.value)}
//                     className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Usage Limit */}
//             <div className="space-y-2">
//               <label htmlFor="usageLimit" className="text-sm font-medium text-gray-700 flex items-center">Usage Limit (per customer) *</label>
//               <input
//                 id="usageLimit"
//                 name="usageLimit"
//                 type="number"
//                 value={form.usageLimit}
//                 onChange={handleFieldChange}
//                 placeholder="Enter usage limit"
//                 disabled={loading}
//                 min="1"
//                 className={`w-full rounded-lg border ${errors.usageLimit ? 'border-red-500' : 'border-gray-200'} px-4 py-3 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-colors shadow-sm`}
//               />
//               {errors.usageLimit && <p className="text-red-500 text-xs mt-1">{errors.usageLimit}</p>}
//             </div>

//             {/* Buttons */}
//             <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-100">
//               <button type="button" disabled={loading} onClick={handleReset} className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg py-3 transition-colors border border-gray-200 shadow-sm">
//                 Clear All
//               </button>
//               <button type="submit" disabled={loading} className="w-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg py-3 transition-all flex items-center justify-center shadow-md disabled:opacity-50">
//                 {loading ? (
//                   <>
//                     <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                     </svg>
//                     {isEditing ? 'Updating...' : 'Creating...'}
//                   </>
//                 ) : (
//                   isEditing ? 'Update Offer' : 'Create Offer'
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// }




import { X, Calendar, Tag, Loader2, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';

export default function OfferForm({
  showForm,
  setShowForm,
  form,
  handleChange,
  handleSubmit,
  resetForm,
  loading,
  isEditing,
  title = isEditing ? "Edit Special Offer" : "Create Special Offer",
  onClose,
  type
}) {
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('17:00');
  const [errors, setErrors] = useState({});
  const [isClosing, setIsClosing] = useState(false);
  const formRef = useRef(null);

  // UTIL: Reconstruct a local date-time in 'yyyy-mm-dd' and 'HH:MM'
  function getDateLocalParts(isoString) {
    if (!isoString) return ['', '09:00'];
    const dateObj = new Date(isoString);
    // Local date parts
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const hh = String(dateObj.getHours()).padStart(2, '0');
    const min = String(dateObj.getMinutes()).padStart(2, '0');
    return [`${yyyy}-${mm}-${dd}`, `${hh}:${min}`];
  }

  // Initialize fields FROM form values (ALWAYS USE LOCAL PARTS)
  useEffect(() => {
    if (showForm && isEditing) {
      const [sd, st] = getDateLocalParts(form.startAt);
      const [ed, et] = getDateLocalParts(form.expireAt);
      setStartDate(sd);
      setStartTime(st);
      setEndDate(ed);
      setEndTime(et);
    }
    if (showForm && !isEditing) {
      setStartDate('');
      setStartTime('09:00');
      setEndDate('');
      setEndTime('17:00');
    }
  }, [form.startAt, form.expireAt, showForm, isEditing]);

  // Validate the form
  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!form.presetName || form.presetName.trim() === '') newErrors.presetName = 'Offer name is required';
    if (form.discountType !== 'custom') {
      if (!form.discountAmount || Number(form.discountAmount) <= 0) newErrors.discountAmount = 'Valid discount amount is required';
      // Only validate maxDiscount for percentage type
      if (form.discountType === 'percentage' && (!form.maxDiscount || Number(form.maxDiscount) <= 0)) {
        newErrors.maxDiscount = 'Valid max discount is required';
      }
    } else if (!form.discountAmount || form.discountAmount.trim() === '') {
      newErrors.discountAmount = 'Custom offer description is required';
    }
    if (!form.minPurchase || Number(form.minPurchase) < 0) newErrors.minPurchase = 'Valid minimum purchase is required';
    if (!form.usageLimit || Number(form.usageLimit) <= 0) newErrors.usageLimit = 'Valid usage limit is required';

    if (!startDate) newErrors.startDate = 'Start date is required';
    if (!endDate) newErrors.endDate = 'End date is required';

    if (startDate && endDate) {
      const start = new Date(`${startDate}T${startTime}`);
      const end = new Date(`${endDate}T${endTime}`);
      if (end <= start) newErrors.endDate = 'End date must be after start date';
      if (start < new Date()) newErrors.startDate = 'Start date cannot be in the past';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form, startDate, startTime, endDate, endTime]);

  // Submit handler
  const handleFormSubmit = useCallback((e) => {
    e.preventDefault();

    // Validate first
    if (!validateForm()) {
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        const errorElement = formRef.current?.querySelector(`[name="${firstError}"]`);
        errorElement?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Construct the date strings directly
    let startAtISO = '';
    let expireAtISO = '';

    if (startDate && startTime) {
      const startAt = new Date(`${startDate}T${startTime}`);
      if (!isNaN(startAt.getTime())) {
        startAtISO = startAt.toISOString();
      }
    }

    if (endDate && endTime) {
      const expireAt = new Date(`${endDate}T${endTime}`);
      if (!isNaN(expireAt.getTime())) {
        expireAtISO = expireAt.toISOString();
      }
    }

    // Create a custom event with the complete form data
    const submitEvent = {
      ...e,
      formData: {
        ...form,
        startAt: startAtISO,
        expireAt: expireAtISO,
        type: type || 'offer'
      }
    };

    handleSubmit(submitEvent);
  }, [form, startDate, startTime, endDate, endTime, validateForm, type, handleSubmit, errors]);

  // Field change for form inputs
  const handleFieldChange = (e) => {
    handleChange(e);
    const { name } = e.target;
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Date/time pickers
  const handleDateTimeChange = (type, value) => {
    if (type === 'startDate') setStartDate(value);
    if (type === 'startTime') setStartTime(value);
    if (type === 'endDate') setEndDate(value);
    if (type === 'endTime') setEndTime(value);
    if (errors[type]) setErrors(prev => ({ ...prev, [type]: '' }));
  };

  // Today string for min
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  // Smooth Close
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowForm(false);
      setErrors({});
      onClose?.();
      setIsClosing(false);
    }, 300);
  };

  const handleResetForm = () => {
    resetForm();
    setStartDate('');
    setEndDate('');
    setStartTime('09:00');
    setEndTime('17:00');
    setErrors({});
  };

  return (
    <>
      {showForm && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={handleClose}
        />
      )}
      
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 pt-14
          ${showForm && !isClosing ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
      >
        <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 w-full sm:max-w-xl md:max-w-2xl max-h-[85vh] flex flex-col mx-4 overflow-hidden">
          
          {/* Header */}
          <header className="sticky top-0 z-10 bg-white p-5 border-b flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Tag className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">{title}</h2>
                <p className="text-sm text-gray-500">
                  {isEditing ? "Update your offer details" : "Fill in the details to create your offer"}
                </p>
              </div>
            </div>
            <button 
              onClick={handleClose} 
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </header>

          {/* Body */}
          <form ref={formRef} onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {/* Discount Type */}
            <SelectField
              label="Discount Type"
              name="discountType"
              value={form.discountType}
              onChange={handleFieldChange}
              options={[
                { value: "percentage", label: "Percentage Off" },
                { value: "fixed", label: "Fixed Amount Off" },
                { value: "custom", label: "Custom Offer" },
              ]}
            />

            {/* Offer Name */}
            <InputField
              label="Offer Name"
              name="presetName"
              value={form.presetName || ""}
              onChange={handleFieldChange}
              error={errors.presetName}
              placeholder="Enter offer name"
              required
            />

            {/* Discount Amount/Offer */}
            {form.discountType === "custom" ? (
              <InputField
                label="Custom Offer"
                name="discountAmount"
                value={form.discountAmount || ""}
                onChange={handleFieldChange}
                error={errors.discountAmount}
                placeholder="e.g. Buy 1 Get 1 Free"
                required
              />
            ) : (
              <div>
                {/* For Fixed Amount - show single full width field */}
                {form.discountType === "fixed" ? (
                  <InputField
                    label="Discount Amount"
                    name="discountAmount"
                    type="number"
                    value={form.discountAmount || ""}
                    onChange={handleFieldChange}
                    error={errors.discountAmount}
                    required
                  />
                ) : (
                  /* For Percentage - show both fields in grid */
                  <ResponsiveGrid cols={2}>
                    <InputField
                      label="Discount Percentage"
                      name="discountAmount"
                      type="number"
                      value={form.discountAmount || ""}
                      onChange={handleFieldChange}
                      error={errors.discountAmount}
                      required
                    />
                    <InputField
                      label="Max Discount"
                      name="maxDiscount"
                      type="number"
                      value={form.maxDiscount || ""}
                      onChange={handleFieldChange}
                      error={errors.maxDiscount}
                      required
                    />
                  </ResponsiveGrid>
                )}
              </div>
            )}

            <ResponsiveGrid cols={2}>
              {/* Minimum Purchase */}
              <InputField
                label="Minimum Purchase"
                name="minPurchase"
                type="number"
                value={form.minPurchase || ""}
                onChange={handleFieldChange}
                error={errors.minPurchase}
                required
              />

              {/* Usage Limit */}
              <InputField
                label="Usage Limit"
                name="usageLimit"
                type="number"
                value={form.usageLimit || ""}
                onChange={handleFieldChange}
                error={errors.usageLimit}
                required
              />
            </ResponsiveGrid>

            {/* Validity Period */}
            <div className="border border-gray-200 bg-gray-50 rounded-lg p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-700" />
                <h3 className="font-semibold text-gray-800">Validity Period</h3>
                <span className="text-red-500">*</span>
              </div>
              
              <ResponsiveGrid cols={2}>
                <div>
                  <label className="text-sm font-medium text-gray-800 mb-2 block">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => handleDateTimeChange('startDate', e.target.value)}
                    min={getTodayDate()}
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition
                      ${errors.startDate ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"}`}
                  />
                  {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-800 mb-2 block">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => handleDateTimeChange('startTime', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  />
                </div>
              </ResponsiveGrid>
              
              <ResponsiveGrid cols={2}>
                <div>
                  <label className="text-sm font-medium text-gray-800 mb-2 block">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => handleDateTimeChange('endDate', e.target.value)}
                    min={startDate || getTodayDate()}
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition
                      ${errors.endDate ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"}`}
                  />
                  {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-800 mb-2 block">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => handleDateTimeChange('endTime', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  />
                </div>
              </ResponsiveGrid>
            </div>

          </form>

          {/* Footer */}
          <footer className="sticky bottom-0 bg-white border-t p-4 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleResetForm}
              disabled={loading}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              Clear All
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex justify-center items-center gap-2 transition-colors disabled:opacity-70"
              onClick={handleFormSubmit}
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Offer" : "Create Offer")}
            </button>
          </footer>
        </div>
      </div>
    </>
  );
}

/* -------------------------------------------- */
/* 🔹 Reusable Subcomponents                    */
/* -------------------------------------------- */
const InputField = ({ label, error, required, ...props }) => (
  <div className="flex flex-col gap-2">
    {label && (
      <label className="text-sm font-medium text-gray-800">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <input
      {...props}
      className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition
        ${error ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200" : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"}`}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const SelectField = ({ label, name, value, options, onChange }) => (
  <div className="flex flex-col gap-2">
    {label && <label className="text-sm font-medium text-gray-800">{label}</label>}
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

const ResponsiveGrid = ({ cols = 2, children }) => (
  <div className={`grid grid-cols-1 ${cols === 2 ? 'sm:grid-cols-2' : ''} gap-4`}>
    {children}
  </div>
);