// import {
//   X, Tag, Users, Link as LinkIcon,
//   Plus, Trash2, Crosshair, Gift, Loader2,
//   Clock, Calendar
// } from "lucide-react";
// import { useState, useEffect, useCallback, useMemo, useRef } from "react";
// import { toast } from "react-toastify";

// // Utility to parse date/time
// const parseDateTime = (isoString) => {
//   if (!isoString) return { date: "", time: "09:00" };
//   const d = new Date(isoString);
//   if (isNaN(d.getTime())) return { date: "", time: "09:00" };
//   return { date: d.toISOString().split("T")[0], time: d.toTimeString().slice(0, 5) };
// };

// // Offer type icons
// const typeConfig = {
//   cross: { label: "Cross Promotion", icon: <Crosshair className="w-4 h-4 mr-2 text-blue-600" /> },
//   own: { label: "Own Promotion", icon: <Gift className="w-4 h-4 mr-2 text-blue-600" /> },
//   offer: { label: "Special Offer", icon: <Tag className="w-4 h-4 mr-2 text-blue-600" /> },
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
//   const [hasValidityPeriod, setHasValidityPeriod] = useState(false);
//   const [hasExpiryDuration, setHasExpiryDuration] = useState(false);
//   const [isClosing, setIsClosing] = useState(false);

//   const startDT = useMemo(() => parseDateTime(form.startAt), [form.startAt]);
//   const endDT = useMemo(() => parseDateTime(form.expireAt), [form.expireAt]);

//   const currentType = type || form.type || "offer";
//   const { label: typeLabel, icon: typeIcon } = typeConfig[currentType];
//   const computedTitle = useMemo(
//     () => title || (isEditing ? `Edit ${typeLabel}` : `Create ${typeLabel}`),
//     [title, isEditing, typeLabel]
//   );

//   useEffect(() => {
//     if (form.startAt) setHasValidityPeriod(true);
//     if (form.day || form.hour) setHasExpiryDuration(true);
//     if (!Array.isArray(form.conditions))
//       handleChange({ target: { name: "conditions", value: [""] } });
//     if (type && form.type !== type)
//       handleChange({ target: { name: "type", value: type } });
//   }, [form, type, handleChange]);

//   /* --------------------------------------------
//    ✅ Validation
//   --------------------------------------------- */
//   const validateForm = useCallback(() => {
//     const e = {};
//     const num = (v) => {
//       if (v === "" || v === null || v === undefined) return NaN;
//       return parseFloat(v);
//     };

//     if (!form.presetName?.trim()) e.presetName = "Offer name is required";
//     else if (form.presetName.length < 3) e.presetName = "At least 3 characters";
//     else if (form.presetName.length > 50) e.presetName = "At most 50 characters";

//     if (form.discountType !== "custom") {
//       const discountAmount = num(form.discountAmount);
//       if (isNaN(discountAmount) || discountAmount <= 0)
//         e.discountAmount = "Valid discount amount required";

//       const maxDiscount = num(form.maxDiscount);
//       if (isNaN(maxDiscount) || maxDiscount <= 0)
//         e.maxDiscount = "Valid max discount required";
//     } else if (!form.discountAmount?.trim()) {
//       e.discountAmount = "Custom offer description required";
//     }

//     const minPurchase = num(form.minPurchase);
//     if (!isNaN(minPurchase) && minPurchase < 0)
//       e.minPurchase = "Cannot be negative";

//     const usageLimit = num(form.usageLimit);
//     if (isNaN(usageLimit) || usageLimit <= 0)
//       e.usageLimit = "Usage limit required";

//     // Validate expiry duration if enabled
//     if (hasExpiryDuration) {
//       const day = num(form.day);
//       const hour = num(form.hour);

//       if (day < 0) e.day = "Day must be non-negative";
//       if (hour < 0) e.hour = "Hour must be non-negative";
//       if ((!day || day === 0) && (!hour || hour === 0)) {
//         e.day = "Please provide either days or hours";
//         e.hour = "Please provide either days or hours";
//       }
//     }

//     // Validate validity period if enabled
//     if (hasValidityPeriod) {
//       if (!startDT.date) e.startDate = "Start date is required";
//       if (!endDT.date) e.endDate = "End date is required";

//       if (startDT.date && endDT.date) {
//         const start = new Date(`${startDT.date}T${startDT.time}`);
//         const end = new Date(`${endDT.date}T${endDT.time}`);
//         if (end <= start) e.endDate = "End date must be after start date";
//         if (start < new Date()) e.startDate = "Start date cannot be in the past";
//       }
//     }

//     setErrors(e);
//     return Object.keys(e).length === 0;
//   }, [form, hasExpiryDuration, hasValidityPeriod, startDT, endDT]);

//   /* --------------------------------------------
//    ✅ Scroll to first error
//   --------------------------------------------- */
//   const scrollToError = useCallback(() => {
//     if (!Object.keys(errors).length) return;
//     const el = formRef.current?.querySelector(".text-red-500");
//     if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
//   }, [errors]);

//   /* --------------------------------------------
//    ✅ Toggle Handlers
//   --------------------------------------------- */
//   const toggleValidityPeriod = () => {
//     const newVal = !hasValidityPeriod;
//     setHasValidityPeriod(newVal);
//     if (newVal) {
//       setHasExpiryDuration(false);
//       handleChange({ target: { name: "day", value: null } });
//       handleChange({ target: { name: "hour", value: null } });
//     }
//     // Clear date errors when toggling
//     if (errors.startDate || errors.endDate) {
//       const newErrors = { ...errors };
//       delete newErrors.startDate;
//       delete newErrors.endDate;
//       setErrors(newErrors);
//     }
//   };

//   const toggleExpiryDuration = () => {
//     const newVal = !hasExpiryDuration;
//     setHasExpiryDuration(newVal);
//     if (newVal) {
//       setHasValidityPeriod(false);
//       handleChange({ target: { name: "startAt", value: null } });
//       handleChange({ target: { name: "expireAt", value: null } });
//     }
//     // Clear day/hour errors when toggling
//     if (errors.day || errors.hour) {
//       const newErrors = { ...errors };
//       delete newErrors.day;
//       delete newErrors.hour;
//       setErrors(newErrors);
//     }
//   };

//   /* --------------------------------------------
//    ✅ Date/Time Handlers
//   --------------------------------------------- */
//   const handleDateTimeChange = useCallback((field, value) => {
//     if (field === "startDate") {
//       handleChange({ target: { name: "startAt", value: `${value}T${startDT.time}` } });
//     } else if (field === "startTime") {
//       handleChange({ target: { name: "startAt", value: `${startDT.date}T${value}` } });
//     } else if (field === "endDate") {
//       handleChange({ target: { name: "expireAt", value: `${value}T${endDT.time}` } });
//     } else if (field === "endTime") {
//       handleChange({ target: { name: "expireAt", value: `${endDT.date}T${value}` } });
//     }

//     if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
//   }, [errors, handleChange, startDT, endDT]);

//   /* --------------------------------------------
//    ✅ Smooth Close with animation
//   --------------------------------------------- */
//   const handleClose = () => {
//     setIsClosing(true);
//     setTimeout(() => {
//       setShowForm(false);
//       setErrors({});
//       onClose?.();
//       setIsClosing(false);
//     }, 400);
//   };

//   /* --------------------------------------------
//    ✅ Submit Handler with Toast + Smooth Close
//   --------------------------------------------- */
//   const handleFormSubmit = async (e) => {
//     e.preventDefault();

//     // Update date/time fields before validation
//     if (hasValidityPeriod) {
//       if (startDT.date && startDT.time) {
//         const startAt = new Date(`${startDT.date}T${startDT.time}`);
//         if (!isNaN(startAt)) {
//           handleChange({ target: { name: "startAt", value: startAt.toISOString() } });
//         }
//       }
//       if (endDT.date && endDT.time) {
//         const expireAt = new Date(`${endDT.date}T${endDT.time}`);
//         if (!isNaN(expireAt)) {
//           handleChange({ target: { name: "expireAt", value: expireAt.toISOString() } });
//         }
//       }
//     }

//     if (!validateForm()) {
//       scrollToError();
//       return;
//     }

//     try {
//       const success = await handleSubmit(e);

//       if (success) {
//         toast.success(isEditing ? "Offer updated successfully!" : "Offer created successfully!");
//         setIsClosing(true);
//         setTimeout(() => {
//           setShowForm(false);
//           setErrors({});
//           onClose?.();
//           setIsClosing(false);
//         }, 400);
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Something went wrong. Please try again.");
//     }
//   };

//   /* --------------------------------------------
//  🧱 Input Change
// --------------------------------------------- */
//   /* --------------------------------------------
//    🧱 Input Change - FIXED VERSION
//   --------------------------------------------- */
//   const handleFieldChange = (e) => {
//     const { name, value, type } = e.target;

//     let processedValue = value;

//     if (type === "number") {
//       // Handle empty input
//       if (value === "") {
//         processedValue = "";
//       }
//       // Handle decimal numbers
//       else if (value.includes('.')) {
//         // Allow decimal numbers as they are
//         processedValue = value;
//       }
//       // Handle whole numbers - only convert if valid
//       else if (/^\d+$/.test(value)) {
//         processedValue = parseInt(value, 10);
//       }
//       // If it starts with 0, keep as string to allow typing
//       else if (value === "0") {
//         processedValue = "0";
//       }
//       // For any other case, keep the string value
//       else {
//         processedValue = value;
//       }
//     }

//     handleChange({ target: { name, value: processedValue } });

//     // Clear error for this field if it exists
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: "" }));
//     }
//   };

//   /* --------------------------------------------
//    🧱 Condition Handlers
//   --------------------------------------------- */
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
//       {showForm && <div className="fixed inset-0 bg-black/15 z-40" onClick={handleClose} />}

//       <div
//         className={`fixed mt-7 inset-0 flex items-center justify-center z-50 transition-all duration-300 
//         ${showForm && !isClosing ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
//       >
//         <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl">
//           {/* Header */}
//           <div className="flex items-center justify-between p-6 border-b bg-gray-50 rounded-t-xl">
//             <div className="flex items-center">
//               <div className="p-2 bg-blue-50 rounded-lg mr-2">{typeIcon}</div>
//               <h2 className="text-xl font-semibold text-gray-800">{computedTitle}</h2>
//             </div>
//             <button onClick={handleClose} className="p-2 text-gray-500 hover:text-gray-700">
//               <X className="w-5 h-5" />
//             </button>
//           </div>

//           {/* Body */}
//           <form
//             ref={formRef}
//             onSubmit={handleFormSubmit}
//             className="p-6 space-y-5 max-h-[70vh] overflow-y-auto"
//           >
//             {!type && (
//               <SelectField
//                 label="Offer Type"
//                 name="type"
//                 value={form.type || "own"}
//                 options={[
//                   { value: "own", label: "Own Promotion" },
//                   { value: "cross", label: "Cross Promotion" },
//                   { value: "offer", label: "Special Offer" },
//                 ]}
//                 onChange={handleFieldChange}
//               />
//             )}

//             <SelectField
//               label="Discount Type"
//               name="discountType"
//               value={form.discountType}
//               options={[
//                 { value: "percentage", label: "Percentage Off" },
//                 { value: "fixed", label: "Fixed Amount Off" },
//                 { value: "custom", label: "Custom Offer" },
//               ]}
//               onChange={handleFieldChange}
//             />

//             <InputField
//               label={`${typeLabel} Name *`}
//               name="presetName"
//               value={form.presetName}
//               onChange={handleFieldChange}
//               error={errors.presetName}
//             />

//             {form.discountType === "custom" ? (
//               <InputField
//                 label="Custom Offer *"
//                 name="discountAmount"
//                 value={form.discountAmount}
//                 onChange={handleFieldChange}
//                 error={errors.discountAmount}
//                 placeholder="E.g., Buy 1 Get 1 Free"
//               />
//             ) : (
//               <>
//                 <InputField
//                   label={
//                     form.discountType === "percentage"
//                       ? "Discount Percentage *"
//                       : "Discount Amount *"
//                   }
//                   name="discountAmount"
//                   type="number"
//                   value={form.discountAmount}
//                   onChange={handleFieldChange}
//                   error={errors.discountAmount}
//                 />
//                 <InputField
//                   label="Max Discount *"
//                   name="maxDiscount"
//                   type="number"
//                   value={form.maxDiscount}
//                   onChange={handleFieldChange}
//                   error={errors.maxDiscount}
//                 />
//               </>
//             )}

//             <InputField
//               label="Min Purchase (Optional)"
//               name="minPurchase"
//               type="number"
//               value={form.minPurchase}
//               onChange={handleFieldChange}
//               error={errors.minPurchase}
//             />

//             <ConditionList
//               conditions={form.conditions || []}
//               onAdd={addCondition}
//               onRemove={removeCondition}
//               onChange={handleConditionChange}
//               errors={errors}
//             />

//             <InputField
//               label="Offer Link (optional)"
//               name="link"
//               value={form.link}
//               onChange={handleFieldChange}
//               icon={<LinkIcon className="w-4 h-4 mr-2 text-blue-600" />}
//             />

//             <InputField
//               label="Usage Limit *"
//               name="usageLimit"
//               type="number"
//               value={form.usageLimit}
//               onChange={handleFieldChange}
//               error={errors.usageLimit}
//               icon={<Users className="w-4 h-4 mr-2 text-blue-600" />}
//             />

//             {/* Expiry Duration Field */}
//             {/* <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200 form-field">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-sm font-medium text-gray-700 flex items-center">
//                   <Clock className="w-4 h-4 mr-2" />
//                   Expiry Duration (Optional)
//                 </h3>
//                 <ToggleSwitch
//                   checked={hasExpiryDuration}
//                   onChange={toggleExpiryDuration}
//                   disabled={hasValidityPeriod}
//                 />
//               </div>
//               {hasExpiryDuration && (
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <label className="text-xs text-gray-500">Days</label>
//                     <input
//                       name="day"
//                       type="number"
//                       value={form.day || ""}
//                       onChange={handleFieldChange}
//                       placeholder="0"
//                       min="0"
//                       className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
//                     />
//                     {errors.day && <p className="text-xs text-red-500 mt-1">{errors.day}</p>}
//                   </div>
//                   <div>
//                     <label className="text-xs text-gray-500">Hours</label>
//                     <input
//                       name="hour"
//                       type="number"
//                       value={form.hour || ""}
//                       onChange={handleFieldChange}
//                       placeholder="0"
//                       min="0"
//                       max="23"
//                       className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
//                     />
//                     {errors.hour && <p className="text-xs text-red-500 mt-1">{errors.hour}</p>}
//                   </div>
//                 </div>
//               )}
//             </div> */}

//             {/* Validity Period Field */}
//             <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200 form-field">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-sm font-medium text-gray-700 flex items-center">
//                   <Calendar className="w-4 h-4 mr-2" />
//                   Validity Period (Optional)
//                 </h3>
//                 <ToggleSwitch
//                   checked={hasValidityPeriod}
//                   onChange={toggleValidityPeriod}
//                   disabled={hasExpiryDuration}
//                 />
//               </div>
//               {hasValidityPeriod && (
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <label className="text-xs text-gray-500">Start Date</label>
//                     <input
//                       type="date"
//                       value={startDT.date}
//                       onChange={e => handleDateTimeChange('startDate', e.target.value)}
//                       min={getTodayDate()}
//                       className="rounded-lg border border-gray-200 px-3 py-2 text-sm w-full"
//                     />
//                     {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>}
//                   </div>
//                   <div>
//                     <label className="text-xs text-gray-500">Start Time</label>
//                     <input
//                       type="time"
//                       value={startDT.time}
//                       onChange={e => handleDateTimeChange('startTime', e.target.value)}
//                       className="rounded-lg border border-gray-200 px-3 py-2 text-sm w-full"
//                     />
//                   </div>
//                   <div>
//                     <label className="text-xs text-gray-500">End Date</label>
//                     <input
//                       type="date"
//                       value={endDT.date}
//                       onChange={e => handleDateTimeChange('endDate', e.target.value)}
//                       min={startDT.date || getTodayDate()}
//                       className="rounded-lg border border-gray-200 px-3 py-2 text-sm w-full"
//                     />
//                     {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>}
//                   </div>
//                   <div>
//                     <label className="text-xs text-gray-500">End Time</label>
//                     <input
//                       type="time"
//                       value={endDT.time}
//                       onChange={e => handleDateTimeChange('endTime', e.target.value)}
//                       className="rounded-lg border border-gray-200 px-3 py-2 text-sm w-full"
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Submit Section */}
//             <div className="flex items-center justify-between gap-4 pt-4 border-t">
//               <button
//                 type="button"
//                 onClick={resetForm}
//                 disabled={loading}
//                 className="w-1/2 bg-gray-100 hover:bg-gray-200 rounded-lg py-3 font-medium disabled:opacity-70"
//               >
//                 Clear All
//               </button>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-1/2 flex justify-center items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg py-3 font-medium disabled:opacity-70"
//               >
//                 {loading && <Loader2 className="w-4 h-4 animate-spin text-white" />}
//                 {loading
//                   ? isEditing
//                     ? "Updating..."
//                     : "Creating..."
//                   : isEditing
//                     ? "Update Offer"
//                     : "Create Offer"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// }

// /* --------------------------------------------
//  🧱 Subcomponents
// --------------------------------------------- */
// const InputField = ({ label, name, type = "text", value, onChange, error, icon, ...rest }) => (
//   <div className="space-y-2 form-field">
//     <label className="text-sm font-medium text-gray-700 flex items-center">
//       {icon}
//       {label}
//     </label>
//     <input
//       name={name}
//       type={type}
//       value={value ?? ""}
//       onChange={onChange}
//       {...rest}
//       // Add inputMode for better keyboard on mobile
//       inputMode={type === "number" ? "decimal" : "text"}
//       // Prevent negative values for number inputs
//       min={type === "number" ? "0" : undefined}
//       className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all duration-150
//         ${error
//           ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-400"
//           : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"}
//       `}
//       {...(type === "number" && { step: "any" })}
//     />
//     {error && <p className="text-xs text-red-500">{error}</p>}
//   </div>
// );

// const SelectField = ({ label, name, value, onChange, options }) => (
//   <div className="space-y-2 form-field">
//     <label className="text-sm font-medium text-gray-700">{label}</label>
//     <select
//       name={name}
//       value={value}
//       onChange={onChange}
//       className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
//     >
//       {options.map((o) => (
//         <option key={o.value} value={o.value}>
//           {o.label}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// const ToggleSwitch = ({ checked, onChange, disabled }) => (
//   <label className="inline-flex items-center cursor-pointer">
//     <input
//       type="checkbox"
//       checked={checked}
//       onChange={onChange}
//       disabled={disabled}
//       className="sr-only peer"
//     />
//     <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 disabled:opacity-50"></div>
//   </label>
// );

// const ConditionList = ({ conditions, onAdd, onRemove, onChange, errors }) => {
//   const [focusedIndex, setFocusedIndex] = useState(null);

//   return (
//     <div className="space-y-3 form-field">
//       <div className="flex justify-between items-center">
//         <label className="text-sm font-medium text-gray-700">Conditions (optional)</label>
//         <button
//           type="button"
//           onClick={onAdd}
//           className="text-sm text-blue-600 flex items-center hover:underline"
//         >
//           <Plus className="w-4 h-4 mr-1" /> Add
//         </button>
//       </div>

//       {conditions.map((c, i) => {
//         const hasError = errors[`condition-${i}`];
//         const showError = hasError && focusedIndex !== i;

//         return (
//           <div key={i} className="flex gap-2 items-start">
//             <input
//               value={c || ""}
//               onFocus={() => setFocusedIndex(i)}
//               onBlur={() => setFocusedIndex(null)}
//               onChange={(e) => onChange(i, e.target.value)}
//               placeholder={`Condition ${i + 1}`}
//               className={`flex-1 rounded-lg border outline-none transition-all duration-150 px-4 py-3 text-sm
//                 ${showError
//                   ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-400"
//                   : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"}
//               `}
//             />
//             {conditions.length > 1 && (
//               <button
//                 type="button"
//                 onClick={() => onRemove(i)}
//                 className="p-3 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 transition"
//               >
//                 <Trash2 className="w-4 h-4" />
//               </button>
//             )}
//           </div>
//         );
//       })}
//       {Object.keys(errors)
//         .filter((k) => k.startsWith("condition-"))
//         .map((k) => (
//           <p key={k} className="text-xs text-red-500">
//             {errors[k]}
//           </p>
//         ))}
//     </div>
//   );
// };




// ✅ OfferForm.jsx (Fixed Timezone Issue)
import {
  X, Tag, Crosshair, Gift, Loader2, Plus, Trash2, Calendar
} from "lucide-react";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { toast } from "react-toastify";

const parseDateTime = (isoString) => {
  if (!isoString) return { date: "", time: "09:00" };
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return { date: "", time: "09:00" };
  return { date: d.toISOString().split("T")[0], time: d.toTimeString().slice(0, 5) };
};

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

  const startDT = useMemo(() => parseDateTime(form.startAt), [form.startAt]);
  const endDT = useMemo(() => parseDateTime(form.expireAt), [form.expireAt]);
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

  // ✅ Fixed Validation
  const validateForm = useCallback(() => {
    const e = {};
    const num = (v) => (v === "" || v === null || v === undefined ? NaN : parseFloat(v));

    if (!form.presetName?.trim()) e.presetName = "Offer name is required";
    else if (form.presetName.length < 3) e.presetName = "At least 3 characters";

    if (form.discountType !== "custom") {
      const discount = num(form.discountAmount);
      const max = num(form.maxDiscount);
      if (isNaN(discount) || discount <= 0) e.discountAmount = "Valid discount amount required";
      if (isNaN(max) || max <= 0) e.maxDiscount = "Valid max discount required";
    } else if (!form.discountAmount?.trim()) {
      e.discountAmount = "Custom offer description required";
    }

    const usage = num(form.usageLimit);
    if (isNaN(usage) || usage <= 0) e.usageLimit = "Usage limit required";

    if (!startDT.date) e.startDate = "Start date is required";
    if (!endDT.date) e.endDate = "End date is required";

    if (startDT.date && endDT.date) {
      try {
        // Use local datetime strings for comparison
        const startTime = startDT.time || "00:00";
        const endTime = endDT.time || "23:59";

        const start = new Date(`${startDT.date}T${startTime}`);
        const end = new Date(`${endDT.date}T${endTime}`);

        // Only validate date part for "past date" check
        const startDateOnly = new Date(startDT.date);
        const todayDateOnly = new Date();
        todayDateOnly.setHours(0, 0, 0, 0);

        if (startDateOnly < todayDateOnly) {
          e.startDate = "Start date cannot be in the past";
        }

        if (end <= start) e.endDate = "End date must be after start date";
      } catch (error) {
        console.error('Date validation error:', error);
        e.startDate = "Invalid date format";
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form, startDT, endDT]);

  // ✅ Fixed Date/Time Handlers
  const handleDateTimeChange = useCallback((field, value) => {
    if (field === "startDate") {
      const time = startDT.time || "09:00";
      handleChange({ target: { name: "startAt", value: `${value}T${time}` } });
    } else if (field === "startTime") {
      const date = startDT.date || new Date().toISOString().split("T")[0];
      handleChange({ target: { name: "startAt", value: `${date}T${value}` } });
    } else if (field === "endDate") {
      const time = endDT.time || "23:59";
      handleChange({ target: { name: "expireAt", value: `${value}T${time}` } });
    } else if (field === "endTime") {
      const date = endDT.date || new Date().toISOString().split("T")[0];
      handleChange({ target: { name: "expireAt", value: `${date}T${value}` } });
    }

    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  }, [errors, handleChange, startDT, endDT]);

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

  // ✅ Fixed Form Submission - Convert to UTC before sending
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Convert local datetime to UTC ISO strings before sending
    if (startDT.date && startDT.time) {
      const localDateTime = `${startDT.date}T${startDT.time}`;
      const utcDate = new Date(localDateTime);
      const utcISOString = utcDate.toISOString(); // Converts to UTC
      handleChange({ target: { name: "startAt", value: utcISOString } });
    }

    if (endDT.date && endDT.time) {
      const localDateTime = `${endDT.date}T${endDT.time}`;
      const utcDate = new Date(localDateTime);
      const utcISOString = utcDate.toISOString(); // Converts to UTC
      handleChange({ target: { name: "expireAt", value: utcISOString } });
    }

    if (!validateForm()) {
      const firstError = Object.keys(errors)[0];
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

  const getTodayDate = () => new Date().toISOString().split("T")[0];

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
              <ResponsiveGrid cols={2}>
                <InputField
                  label={form.discountType === "percentage" ? "Discount Percentage" : "Discount Amount"}
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
                    value={startDT.date}
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
                    value={startDT.time}
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
                    value={endDT.date}
                    onChange={(e) => handleDateTimeChange('endDate', e.target.value)}
                    min={startDT.date || getTodayDate()}
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition
                      ${errors.endDate ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"}`}
                  />
                  {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-800 mb-2 block">End Time</label>
                  <input
                    type="time"
                    value={endDT.time}
                    onChange={(e) => handleDateTimeChange('endTime', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  />
                </div>
              </ResponsiveGrid>
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