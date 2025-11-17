// import {
//   X, Tag, Crosshair, Gift, Loader2, Plus, Trash2, Calendar
// } from "lucide-react";
// import { useState, useEffect, useCallback, useMemo, useRef } from "react";
// import { toast } from "react-toastify";

// const parseDateTime = (isoString) => {
//   if (!isoString) return { date: "", time: "09:00" };
//   const d = new Date(isoString);
//   if (isNaN(d.getTime())) return { date: "", time: "09:00" };
//   return { date: d.toISOString().split("T")[0], time: d.toTimeString().slice(0, 5) };
// };

// const typeConfig = {
//   cross: { label: "Cross Promotion", icon: <Crosshair className="w-4 h-4" />, color: "text-blue-600" },
//   own: { label: "Own Promotion", icon: <Gift className="w-4 h-4" />, color: "text-purple-600" },
//   offer: { label: "Special Offer", icon: <Tag className="w-4 h-4" />, color: "text-green-600" },
// };

// export default function OfferForm({
//   showForm,
//   setShowForm,
//   form,
//   handleChange,
//   handleSubmit,
//   resetForm,
//   loading,
//   isEditing,
//   title,
//   onClose,
//   type = null,
// }) {
//   const formRef = useRef(null);
//   const [errors, setErrors] = useState({});
//   const [isClosing, setIsClosing] = useState(false);

//   const startDT = useMemo(() => parseDateTime(form.startAt), [form.startAt]);
//   const endDT = useMemo(() => parseDateTime(form.expireAt), [form.expireAt]);
//   const currentType = type || form.type || "offer";
//   const { label: typeLabel, icon: typeIcon, color: typeColor } = typeConfig[currentType];
//   const computedTitle = useMemo(
//     () => title || (isEditing ? `Edit ${typeLabel}` : `Create ${typeLabel}`),
//     [title, isEditing, typeLabel]
//   );

//   // ✅ Initialization
//   useEffect(() => {
//     if (!Array.isArray(form.conditions))
//       handleChange({ target: { name: "conditions", value: [""] } });
//     if (type && form.type !== type)
//       handleChange({ target: { name: "type", value: type } });
//   }, [form, type, handleChange]);

//   // ✅ Fixed Validation
//   const validateForm = useCallback(() => {
//     const e = {};
//     const num = (v) => (v === "" || v === null || v === undefined ? NaN : parseFloat(v));

//     if (!form.presetName?.trim()) e.presetName = "Offer name is required";
//     else if (form.presetName.length < 3) e.presetName = "At least 3 characters";

//     if (form.discountType !== "custom") {
//       const discount = num(form.discountAmount);
//       const max = num(form.maxDiscount);
//       if (isNaN(discount) || discount <= 0) e.discountAmount = "Valid discount amount required";
//       if (isNaN(max) || max <= 0) e.maxDiscount = "Valid max discount required";
//     } else if (!form.discountAmount?.trim()) {
//       e.discountAmount = "Custom offer description required";
//     }

//     const usage = num(form.usageLimit);
//     if (isNaN(usage) || usage <= 0) e.usageLimit = "Usage limit required";

//     if (!startDT.date) e.startDate = "Start date is required";
//     if (!endDT.date) e.endDate = "End date is required";

//     if (startDT.date && endDT.date) {
//       try {
//         // Use local datetime strings for comparison
//         const startTime = startDT.time || "00:00";
//         const endTime = endDT.time || "23:59";

//         const start = new Date(`${startDT.date}T${startTime}`);
//         const end = new Date(`${endDT.date}T${endTime}`);

//         // Only validate date part for "past date" check
//         const startDateOnly = new Date(startDT.date);
//         const todayDateOnly = new Date();
//         todayDateOnly.setHours(0, 0, 0, 0);

//         if (startDateOnly < todayDateOnly) {
//           e.startDate = "Start date cannot be in the past";
//         }

//         if (end <= start) e.endDate = "End date must be after start date";
//       } catch (error) {
//         console.error('Date validation error:', error);
//         e.startDate = "Invalid date format";
//       }
//     }

//     setErrors(e);
//     return Object.keys(e).length === 0;
//   }, [form, startDT, endDT]);

//   // ✅ Fixed Date/Time Handlers
//   const handleDateTimeChange = useCallback((field, value) => {
//     if (field === "startDate") {
//       const time = startDT.time || "09:00";
//       handleChange({ target: { name: "startAt", value: `${value}T${time}` } });
//     } else if (field === "startTime") {
//       const date = startDT.date || new Date().toISOString().split("T")[0];
//       handleChange({ target: { name: "startAt", value: `${date}T${value}` } });
//     } else if (field === "endDate") {
//       const time = endDT.time || "23:59";
//       handleChange({ target: { name: "expireAt", value: `${value}T${time}` } });
//     } else if (field === "endTime") {
//       const date = endDT.date || new Date().toISOString().split("T")[0];
//       handleChange({ target: { name: "expireAt", value: `${date}T${value}` } });
//     }

//     if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
//   }, [errors, handleChange, startDT, endDT]);

//   // ✅ Input Change Handler
//   const handleInputChange = (e) => {
//     const { name, value, type } = e.target;

//     let processedValue = value;

//     if (type === "number") {
//       if (value === "") {
//         processedValue = "";
//       } else if (value.includes('.')) {
//         processedValue = parseFloat(value) || value;
//       } else if (/^\d+$/.test(value)) {
//         processedValue = parseInt(value, 10);
//       } else {
//         processedValue = value;
//       }
//     }

//     handleChange({ target: { name, value: processedValue } });

//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: "" }));
//     }
//   };

//   // ✅ Smooth Close
//   const handleClose = () => {
//     setIsClosing(true);
//     setTimeout(() => {
//       setShowForm(false);
//       setErrors({});
//       onClose?.();
//       setIsClosing(false);
//     }, 300);
//   };

//   // ✅ Fixed Form Submission - Convert to UTC before sending
//   const handleFormSubmit = async (e) => {
//     e.preventDefault();

//     // Convert local datetime to UTC ISO strings before sending
//     if (startDT.date && startDT.time) {
//       const localDateTime = `${startDT.date}T${startDT.time}`;
//       const utcDate = new Date(localDateTime);
//       const utcISOString = utcDate.toISOString(); // Converts to UTC
//       handleChange({ target: { name: "startAt", value: utcISOString } });
//     }

//     if (endDT.date && endDT.time) {
//       const localDateTime = `${endDT.date}T${endDT.time}`;
//       const utcDate = new Date(localDateTime);
//       const utcISOString = utcDate.toISOString(); // Converts to UTC
//       handleChange({ target: { name: "expireAt", value: utcISOString } });
//     }

//     if (!validateForm()) {
//       const firstError = Object.keys(errors)[0];
//       if (firstError) {
//         const errorElement = formRef.current?.querySelector(`[name="${firstError}"]`);
//         errorElement?.scrollIntoView({ behavior: "smooth", block: "center" });
//       }
//       return;
//     }

//     try {
//       const success = await handleSubmit(e);
//       if (success) {
//         toast.success(isEditing ? "Offer updated successfully!" : "Offer created successfully!");
//         handleClose();
//       }
//     } catch (err) {
//       console.error('Submit error:', err);
//       toast.error("Something went wrong. Please try again.");
//     }
//   };

//   // ✅ Condition Handlers
//   const handleConditionChange = (i, val) => {
//     const c = [...(form.conditions || [])];
//     c[i] = val;
//     handleChange({ target: { name: "conditions", value: c } });
//   };

//   const addCondition = () =>
//     handleChange({ target: { name: "conditions", value: [...(form.conditions || []), ""] } });

//   const removeCondition = (i) =>
//     handleChange({
//       target: { name: "conditions", value: form.conditions.filter((_, idx) => idx !== i) },
//     });

//   const getTodayDate = () => new Date().toISOString().split("T")[0];

//   return (
//     <>
//       {showForm && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={handleClose} />}

//       <div
//         className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 pt-14
//           ${showForm && !isClosing ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
//       >
//         <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 w-full sm:max-w-xl md:max-w-2xl max-h-[85vh] flex flex-col mx-4 overflow-hidden">

//           {/* Header */}
//           <header className="sticky top-0 z-10 bg-white p-5 border-b flex justify-between items-center">
//             <div className="flex items-center gap-3">
//               <span className={`p-2 rounded-lg bg-blue-50 ${typeColor}`}>{typeIcon}</span>
//               <div>
//                 <h2 className="text-lg md:text-xl font-semibold text-gray-800">{computedTitle}</h2>
//                 <p className="text-sm text-gray-500">
//                   {isEditing ? "Update your offer details" : "Fill in the details to create your offer"}
//                 </p>
//               </div>
//             </div>
//             <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-100 transition">
//               <X className="w-5 h-5 text-gray-600" />
//             </button>
//           </header>

//           {/* Body */}
//           <form ref={formRef} onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-5 space-y-6">

//             <ResponsiveGrid cols={type ? 1 : 2}>
//               {!type && (
//                 <SelectField
//                   label="Offer Type"
//                   name="type"
//                   value={form.type || "own"}
//                   onChange={handleInputChange}
//                   options={[
//                     { value: "own", label: "Own Promotion" },
//                     { value: "cross", label: "Cross Promotion" },
//                     { value: "offer", label: "Special Offer" },
//                   ]}
//                 />
//               )}
//               <SelectField
//                 label="Discount Type"
//                 name="discountType"
//                 value={form.discountType}
//                 onChange={handleInputChange}
//                 options={[
//                   { value: "percentage", label: "Percentage" },
//                   { value: "fixed", label: "Fixed Amount" },
//                   { value: "custom", label: "Custom" },
//                 ]}
//               />
//             </ResponsiveGrid>

//             <ResponsiveGrid cols={2}>
//               <InputField
//                 label="Offer Name"
//                 name="presetName"
//                 value={form.presetName || ""}
//                 onChange={handleInputChange}
//                 error={errors.presetName}
//                 required
//               />
//               <InputField
//                 label="Offer Link"
//                 name="link"
//                 value={form.link || ""}
//                 onChange={handleInputChange}
//                 placeholder="https://example.com/offer"
//               />
//             </ResponsiveGrid>

//             {form.discountType === "custom" ? (
//               <InputField
//                 label="Custom Offer"
//                 name="discountAmount"
//                 value={form.discountAmount || ""}
//                 onChange={handleInputChange}
//                 error={errors.discountAmount}
//                 placeholder="e.g. Buy 1 Get 1 Free"
//                 required
//               />
//             ) : (
//               <ResponsiveGrid cols={2}>
//                 <InputField
//                   label={form.discountType === "percentage" ? "Discount Percentage" : "Discount Amount"}
//                   name="discountAmount"
//                   type="number"
//                   value={form.discountAmount || ""}
//                   onChange={handleInputChange}
//                   error={errors.discountAmount}
//                   required
//                 />
//                 <InputField
//                   label="Max Discount"
//                   name="maxDiscount"
//                   type="number"
//                   value={form.maxDiscount || ""}
//                   onChange={handleInputChange}
//                   error={errors.maxDiscount}
//                   required
//                 />
//               </ResponsiveGrid>
//             )}

//             <ResponsiveGrid cols={2}>
//               <InputField
//                 label="Minimum Purchase"
//                 name="minPurchase"
//                 type="number"
//                 value={form.minPurchase || ""}
//                 onChange={handleInputChange}
//                 error={errors.minPurchase}
//               />
//               <InputField
//                 label="Usage Limit"
//                 name="usageLimit"
//                 type="number"
//                 value={form.usageLimit || ""}
//                 onChange={handleInputChange}
//                 error={errors.usageLimit}
//                 required
//               />
//             </ResponsiveGrid>

//             {/* Validity Period */}
//             <div className="border border-gray-200 bg-gray-50 rounded-lg p-5 space-y-4">
//               <div className="flex items-center gap-2">
//                 <Calendar className="w-5 h-5 text-gray-700" />
//                 <h3 className="font-semibold text-gray-800">Validity Period</h3>
//                 <span className="text-red-500">*</span>
//               </div>
//               <ResponsiveGrid cols={2}>
//                 <div>
//                   <label className="text-sm font-medium text-gray-800 mb-2 block">Start Date</label>
//                   <input
//                     type="date"
//                     value={startDT.date}
//                     onChange={(e) => handleDateTimeChange('startDate', e.target.value)}
//                     min={getTodayDate()}
//                     className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition
//                       ${errors.startDate ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"}`}
//                   />
//                   {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>}
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-gray-800 mb-2 block">Start Time</label>
//                   <input
//                     type="time"
//                     value={startDT.time}
//                     onChange={(e) => handleDateTimeChange('startTime', e.target.value)}
//                     className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
//                   />
//                 </div>
//               </ResponsiveGrid>
//               <ResponsiveGrid cols={2}>
//                 <div>
//                   <label className="text-sm font-medium text-gray-800 mb-2 block">End Date</label>
//                   <input
//                     type="date"
//                     value={endDT.date}
//                     onChange={(e) => handleDateTimeChange('endDate', e.target.value)}
//                     min={startDT.date || getTodayDate()}
//                     className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition
//                       ${errors.endDate ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"}`}
//                   />
//                   {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>}
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium text-gray-800 mb-2 block">End Time</label>
//                   <input
//                     type="time"
//                     value={endDT.time}
//                     onChange={(e) => handleDateTimeChange('endTime', e.target.value)}
//                     className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
//                   />
//                 </div>
//               </ResponsiveGrid>
//             </div>

//             {/* Conditions */}
//             <ConditionList
//               conditions={form.conditions || []}
//               onAdd={addCondition}
//               onRemove={removeCondition}
//               onChange={handleConditionChange}
//               errors={errors}
//             />
//           </form>

//           {/* Footer */}
//           <footer className="sticky bottom-0 bg-white border-t p-4 flex flex-col sm:flex-row gap-3">
//             <button
//               type="button"
//               onClick={resetForm}
//               disabled={loading}
//               className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
//             >
//               Clear All
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex justify-center items-center gap-2 transition-colors disabled:opacity-70"
//               onClick={handleFormSubmit}
//             >
//               {loading && <Loader2 className="w-5 h-5 animate-spin" />}
//               {loading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Offer" : "Create Offer")}
//             </button>
//           </footer>
//         </div>
//       </div>
//     </>
//   );
// }

// /* -------------------------------------------- */
// /* 🔹 Reusable Subcomponents                    */
// /* -------------------------------------------- */
// const InputField = ({ label, error, required, ...props }) => (
//   <div className="flex flex-col gap-2">
//     {label && (
//       <label className="text-sm font-medium text-gray-800">
//         {label}
//         {required && <span className="text-red-500 ml-1">*</span>}
//       </label>
//     )}
//     <input
//       {...props}
//       className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition
//         ${error ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200" : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"}`}
//     />
//     {error && <p className="text-xs text-red-500">{error}</p>}
//   </div>
// );

// const SelectField = ({ label, name, value, options, onChange }) => (
//   <div className="flex flex-col gap-2">
//     {label && <label className="text-sm font-medium text-gray-800">{label}</label>}
//     <select
//       name={name}
//       value={value}
//       onChange={onChange}
//       className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
//     >
//       {options.map((o) => (
//         <option key={o.value} value={o.value}>
//           {o.label}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// const ResponsiveGrid = ({ cols = 2, children }) => (
//   <div className={`grid grid-cols-1 ${cols === 2 ? 'sm:grid-cols-2' : ''} gap-4`}>
//     {children}
//   </div>
// );

// const ConditionList = ({ conditions, onAdd, onRemove, onChange, errors }) => {
//   return (
//     <div className="space-y-3">
//       <div className="flex justify-between items-center">
//         <label className="text-sm font-medium text-gray-800">Conditions (Optional)</label>
//         <button
//           type="button"
//           onClick={onAdd}
//           className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
//         >
//           <Plus className="w-4 h-4" /> Add Condition
//         </button>
//       </div>

//       {conditions.map((condition, index) => (
//         <div key={index} className="flex gap-2 items-start">
//           <input
//             value={condition || ""}
//             onChange={(e) => onChange(index, e.target.value)}
//             placeholder={`Condition ${index + 1}`}
//             className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
//           />
//           {conditions.length > 1 && (
//             <button
//               type="button"
//               onClick={() => onRemove(index)}
//               className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors"
//             >
//               <Trash2 className="w-4 h-4" />
//             </button>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };




import {
  X, Tag, Crosshair, Gift, Loader2, Plus, Trash2, Clock
} from "lucide-react";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { toast } from "react-toastify";

const typeConfig = {
  cross: { label: "Cross Promotion", icon: <Crosshair className="w-4 h-4" />, color: "text-blue-600" },
  own: { label: "Own Promotion", icon: <Gift className="w-4 h-4" />, color: "text-purple-600" },
  offer: { label: "Special Offer", icon: <Tag className="w-4 h-4" />, color: "text-green-600" },
};

export default function OfferForm({
  showForm,
  setShowForm,
  form,
  handleChange,
  handleSubmit,
  resetForm,
  loading,
  isEditing,
  title,
  onClose,
  type = null,
}) {
  const formRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [isClosing, setIsClosing] = useState(false);

  const currentType = type || form.type || "offer";
  const { label: typeLabel, icon: typeIcon, color: typeColor } = typeConfig[currentType];
  const computedTitle = useMemo(
    () => title || (isEditing ? `Edit ${typeLabel}` : `Create ${typeLabel}`),
    [title, isEditing, typeLabel]
  );

  // ✅ Initialization
  useEffect(() => {
    if (!Array.isArray(form.conditions))
      handleChange({ target: { name: "conditions", value: [""] } });
    if (type && form.type !== type)
      handleChange({ target: { name: "type", value: type } });
  }, [form, type, handleChange]);

  // ✅ Fixed Validation - Updated for max discount
  const validateForm = useCallback(() => {
    const e = {};
    const num = (v) => (v === "" || v === null || v === undefined ? NaN : parseFloat(v));

    if (!form.presetName?.trim()) e.presetName = "Offer name is required";
    else if (form.presetName.length < 3) e.presetName = "At least 3 characters";

    if (form.discountType !== "custom") {
      const discount = num(form.discountAmount);
      if (isNaN(discount) || discount <= 0) e.discountAmount = "Valid discount amount required";

      if (form.discountType === "percentage") {
        const max = num(form.maxDiscount);
        if (isNaN(max) || max <= 0) e.maxDiscount = "Valid max discount required";
      }
    } else if (!form.discountAmount?.trim()) {
      e.discountAmount = "Custom offer description required";
    }

    const usage = num(form.usageLimit);
    if (isNaN(usage) || usage <= 0) e.usageLimit = "Usage limit required";

    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form]);

  // ✅ Input Change Handler
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    let processedValue = value;

    if (type === "number") {
      if (value === "") {
        processedValue = "";
      } else if (value.includes('.')) {
        processedValue = parseFloat(value) || value;
      } else if (/^\d+$/.test(value)) {
        processedValue = parseInt(value, 10);
      } else {
        processedValue = value;
      }
    }

    handleChange({ target: { name, value: processedValue } });

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // ✅ Smooth Close
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowForm(false);
      setErrors({});
      onClose?.();
      setIsClosing(false);
    }, 300);
  };

  // ✅ Fixed Form Submission - No date conversion needed
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      const firstError = Object.keys(errors)[0];
      console.log("object", firstError)
      if (firstError) {
        const errorElement = formRef.current?.querySelector(`[name="${firstError}"]`);
        errorElement?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    try {
      const success = await handleSubmit(e);
      if (success) {
        toast.success(isEditing ? "Offer updated successfully!" : "Offer created successfully!");
        handleClose();
      }
    } catch (err) {
      console.error('Submit error:', err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  // ✅ Condition Handlers
  const handleConditionChange = (i, val) => {
    const c = [...(form.conditions || [])];
    c[i] = val;
    handleChange({ target: { name: "conditions", value: c } });
  };

  const addCondition = () =>
    handleChange({ target: { name: "conditions", value: [...(form.conditions || []), ""] } });

  const removeCondition = (i) =>
    handleChange({
      target: { name: "conditions", value: form.conditions.filter((_, idx) => idx !== i) },
    });

  return (
    <>
      {showForm && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={handleClose} />}

      <div
        className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 pt-14
          ${showForm && !isClosing ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
      >
        <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 w-full sm:max-w-xl md:max-w-2xl max-h-[85vh] flex flex-col mx-4 overflow-hidden">

          {/* Header */}
          <header className="sticky top-0 z-10 bg-white p-5 border-b flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className={`p-2 rounded-lg bg-blue-50 ${typeColor}`}>{typeIcon}</span>
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">{computedTitle}</h2>
                <p className="text-sm text-gray-500">
                  {isEditing ? "Update your offer details" : "Fill in the details to create your offer"}
                </p>
              </div>
            </div>
            <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-100 transition">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </header>

          {/* Body */}
          <form ref={formRef} onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-5 space-y-6">

            <ResponsiveGrid cols={type ? 1 : 2}>
              {!type && (
                <SelectField
                  label="Offer Type"
                  name="type"
                  value={form.type || "own"}
                  onChange={handleInputChange}
                  options={[
                    { value: "own", label: "Own Promotion" },
                    { value: "cross", label: "Cross Promotion" },
                    { value: "offer", label: "Special Offer" },
                  ]}
                />
              )}
              <SelectField
                label="Discount Type"
                name="discountType"
                value={form.discountType}
                onChange={handleInputChange}
                options={[
                  { value: "percentage", label: "Percentage" },
                  { value: "fixed", label: "Fixed Amount" },
                  { value: "custom", label: "Custom" },
                ]}
              />
            </ResponsiveGrid>

            <ResponsiveGrid cols={2}>
              <InputField
                label="Offer Name"
                name="presetName"
                value={form.presetName || ""}
                onChange={handleInputChange}
                error={errors.presetName}
                required
              />
              <InputField
                label="Offer Link"
                name="link"
                value={form.link || ""}
                onChange={handleInputChange}
                placeholder="https://example.com/offer"
              />
            </ResponsiveGrid>

            {form.discountType === "custom" ? (
              <InputField
                label="Custom Offer"
                name="discountAmount"
                value={form.discountAmount || ""}
                onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                      onChange={handleInputChange}
                      error={errors.discountAmount}
                      required
                    />
                    <InputField
                      label="Max Discount"
                      name="maxDiscount"
                      type="number"
                      value={form.maxDiscount || ""}
                      onChange={handleInputChange}
                      error={errors.maxDiscount}
                      required
                    />
                  </ResponsiveGrid>
                )}
              </div>
            )}

            <ResponsiveGrid cols={2}>
              <InputField
                label="Minimum Purchase"
                name="minPurchase"
                type="number"
                value={form.minPurchase || ""}
                onChange={handleInputChange}
                error={errors.minPurchase}
              />
              <InputField
                label="Usage Limit"
                name="usageLimit"
                type="number"
                value={form.usageLimit || ""}
                onChange={handleInputChange}
                error={errors.usageLimit}
                required
              />
            </ResponsiveGrid>

            {/* Expiry Duration - Replaced Validity Period */}
            <div className="border border-gray-200 bg-gray-50 rounded-lg p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-700" />
                <h3 className="font-semibold text-gray-800">Expiry Duration (Optional)</h3>
              </div>
              <ResponsiveGrid cols={2}>
                <div>
                  <label className="text-sm font-medium text-gray-800 mb-2 block">Days</label>
                  <input
                    type="number"
                    name="day"
                    value={form.day || ""}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  />
                  {errors.day && <p className="text-xs text-red-500 mt-1">{errors.day}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-800 mb-2 block">Hours</label>
                  <input
                    type="number"
                    name="hour"
                    value={form.hour || ""}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    max="23"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  />
                  {errors.hour && <p className="text-xs text-red-500 mt-1">{errors.hour}</p>}
                </div>
              </ResponsiveGrid>
              <p className="text-xs text-gray-500 mt-2">
                The coupon will expire after this duration from creation time. Leave empty for no expiry.
              </p>
            </div>

            {/* Conditions */}
            <ConditionList
              conditions={form.conditions || []}
              onAdd={addCondition}
              onRemove={removeCondition}
              onChange={handleConditionChange}
              errors={errors}
            />
          </form>

          {/* Footer */}
          <footer className="sticky bottom-0 bg-white border-t p-4 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={resetForm}
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

const ConditionList = ({ conditions, onAdd, onRemove, onChange, errors }) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-800">Conditions (Optional)</label>
        <button
          type="button"
          onClick={onAdd}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Condition
        </button>
      </div>

      {conditions.map((condition, index) => (
        <div key={index} className="flex gap-2 items-start">
          <input
            value={condition || ""}
            onChange={(e) => onChange(index, e.target.value)}
            placeholder={`Condition ${index + 1}`}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
          />
          {conditions.length > 1 && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};