import {
  X, Tag, Users, Link as LinkIcon,
  Plus, Trash2, Crosshair, Gift, Loader2,
  Clock, Calendar
} from "lucide-react";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { toast } from "react-toastify";

// Utility to parse date/time
const parseDateTime = (isoString) => {
  if (!isoString) return { date: "", time: "09:00" };
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return { date: "", time: "09:00" };
  return { date: d.toISOString().split("T")[0], time: d.toTimeString().slice(0, 5) };
};

// Offer type icons
const typeConfig = {
  cross: { label: "Cross Promotion", icon: <Crosshair className="w-4 h-4 mr-2 text-blue-600" /> },
  own: { label: "Own Promotion", icon: <Gift className="w-4 h-4 mr-2 text-blue-600" /> },
  offer: { label: "Special Offer", icon: <Tag className="w-4 h-4 mr-2 text-blue-600" /> },
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
  const [hasValidityPeriod, setHasValidityPeriod] = useState(false);
  const [hasExpiryDuration, setHasExpiryDuration] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const startDT = useMemo(() => parseDateTime(form.startAt), [form.startAt]);
  const endDT = useMemo(() => parseDateTime(form.expireAt), [form.expireAt]);

  const currentType = type || form.type || "offer";
  const { label: typeLabel, icon: typeIcon } = typeConfig[currentType];
  const computedTitle = useMemo(
    () => title || (isEditing ? `Edit ${typeLabel}` : `Create ${typeLabel}`),
    [title, isEditing, typeLabel]
  );

  useEffect(() => {
    if (form.startAt) setHasValidityPeriod(true);
    if (form.day || form.hour) setHasExpiryDuration(true);
    if (!Array.isArray(form.conditions))
      handleChange({ target: { name: "conditions", value: [""] } });
    if (type && form.type !== type)
      handleChange({ target: { name: "type", value: type } });
  }, [form, type, handleChange]);

  /* --------------------------------------------
   ✅ Validation
  --------------------------------------------- */
  const validateForm = useCallback(() => {
    const e = {};
    const num = (v) => (v === null || v === undefined ? NaN : parseFloat(v));

    if (!form.presetName?.trim()) e.presetName = "Offer name is required";
    else if (form.presetName.length < 3) e.presetName = "At least 3 characters";
    else if (form.presetName.length > 50) e.presetName = "At most 50 characters";

    if (form.discountType !== "custom") {
      if (!num(form.discountAmount) || num(form.discountAmount) <= 0)
        e.discountAmount = "Valid discount amount required";
      if (!num(form.maxDiscount) || num(form.maxDiscount) <= 0)
        e.maxDiscount = "Valid max discount required";
    } else if (!form.discountAmount?.trim()) {
      e.discountAmount = "Custom offer description required";
    }

    if (num(form.minPurchase) < 0) e.minPurchase = "Cannot be negative";
    if (!num(form.usageLimit) || num(form.usageLimit) <= 0)
      e.usageLimit = "Usage limit required";

    // Validate expiry duration if enabled
    if (hasExpiryDuration) {
      const day = num(form.day);
      const hour = num(form.hour);
      
      if (day < 0) e.day = "Day must be non-negative";
      if (hour < 0) e.hour = "Hour must be non-negative";
      if ((!day || day === 0) && (!hour || hour === 0)) {
        e.day = "Please provide either days or hours";
        e.hour = "Please provide either days or hours";
      }
    }

    // Validate validity period if enabled
    if (hasValidityPeriod) {
      if (!startDT.date) e.startDate = "Start date is required";
      if (!endDT.date) e.endDate = "End date is required";

      if (startDT.date && endDT.date) {
        const start = new Date(`${startDT.date}T${startDT.time}`);
        const end = new Date(`${endDT.date}T${endDT.time}`);
        if (end <= start) e.endDate = "End date must be after start date";
        if (start < new Date()) e.startDate = "Start date cannot be in the past";
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form, hasExpiryDuration, hasValidityPeriod, startDT, endDT]);

  /* --------------------------------------------
   ✅ Scroll to first error
  --------------------------------------------- */
  const scrollToError = useCallback(() => {
    if (!Object.keys(errors).length) return;
    const el = formRef.current?.querySelector(".text-red-500");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [errors]);

  /* --------------------------------------------
   ✅ Toggle Handlers
  --------------------------------------------- */
  const toggleValidityPeriod = () => {
    const newVal = !hasValidityPeriod;
    setHasValidityPeriod(newVal);
    if (newVal) {
      setHasExpiryDuration(false);
      handleChange({ target: { name: "day", value: null } });
      handleChange({ target: { name: "hour", value: null } });
    }
    // Clear date errors when toggling
    if (errors.startDate || errors.endDate) {
      const newErrors = { ...errors };
      delete newErrors.startDate;
      delete newErrors.endDate;
      setErrors(newErrors);
    }
  };

  const toggleExpiryDuration = () => {
    const newVal = !hasExpiryDuration;
    setHasExpiryDuration(newVal);
    if (newVal) {
      setHasValidityPeriod(false);
      handleChange({ target: { name: "startAt", value: null } });
      handleChange({ target: { name: "expireAt", value: null } });
    }
    // Clear day/hour errors when toggling
    if (errors.day || errors.hour) {
      const newErrors = { ...errors };
      delete newErrors.day;
      delete newErrors.hour;
      setErrors(newErrors);
    }
  };

  /* --------------------------------------------
   ✅ Date/Time Handlers
  --------------------------------------------- */
  const handleDateTimeChange = useCallback((field, value) => {
    if (field === "startDate") {
      handleChange({ target: { name: "startAt", value: `${value}T${startDT.time}` } });
    } else if (field === "startTime") {
      handleChange({ target: { name: "startAt", value: `${startDT.date}T${value}` } });
    } else if (field === "endDate") {
      handleChange({ target: { name: "expireAt", value: `${value}T${endDT.time}` } });
    } else if (field === "endTime") {
      handleChange({ target: { name: "expireAt", value: `${endDT.date}T${value}` } });
    }

    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  }, [errors, handleChange, startDT, endDT]);

  /* --------------------------------------------
   ✅ Smooth Close with animation
  --------------------------------------------- */
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowForm(false);
      setErrors({});
      onClose?.();
      setIsClosing(false);
    }, 400);
  };

  /* --------------------------------------------
   ✅ Submit Handler with Toast + Smooth Close
  --------------------------------------------- */
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Update date/time fields before validation
    if (hasValidityPeriod) {
      if (startDT.date && startDT.time) {
        const startAt = new Date(`${startDT.date}T${startDT.time}`);
        if (!isNaN(startAt)) {
          handleChange({ target: { name: "startAt", value: startAt.toISOString() } });
        }
      }
      if (endDT.date && endDT.time) {
        const expireAt = new Date(`${endDT.date}T${endDT.time}`);
        if (!isNaN(expireAt)) {
          handleChange({ target: { name: "expireAt", value: expireAt.toISOString() } });
        }
      }
    }

    if (!validateForm()) {
      scrollToError();
      return;
    }

    try {
      const success = await handleSubmit(e);

      if (success) {
        toast.success(isEditing ? "Offer updated successfully!" : "Offer created successfully!");
        setIsClosing(true);
        setTimeout(() => {
          setShowForm(false);
          setErrors({});
          onClose?.();
          setIsClosing(false);
        }, 400);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  /* --------------------------------------------
   🧱 Input Change
  --------------------------------------------- */
  const handleFieldChange = (e) => {
    const { name, value, type } = e.target;
    const v = type === "number" && value !== "" ? parseFloat(value) : value;
    handleChange({ target: { name, value: v } });
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  /* --------------------------------------------
   🧱 Condition Handlers
  --------------------------------------------- */
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
      {showForm && <div className="fixed inset-0 bg-black/15 z-40" onClick={handleClose} />}

      <div
        className={`fixed mt-7 inset-0 flex items-center justify-center z-50 transition-all duration-300 
        ${showForm && !isClosing ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
      >
        <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gray-50 rounded-t-xl">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg mr-2">{typeIcon}</div>
              <h2 className="text-xl font-semibold text-gray-800">{computedTitle}</h2>
            </div>
            <button onClick={handleClose} className="p-2 text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <form
            ref={formRef}
            onSubmit={handleFormSubmit}
            className="p-6 space-y-5 max-h-[70vh] overflow-y-auto"
          >
            {!type && (
              <SelectField
                label="Offer Type"
                name="type"
                value={form.type || "own"}
                options={[
                  { value: "own", label: "Own Promotion" },
                  { value: "cross", label: "Cross Promotion" },
                  { value: "offer", label: "Special Offer" },
                ]}
                onChange={handleFieldChange}
              />
            )}

            <SelectField
              label="Discount Type"
              name="discountType"
              value={form.discountType}
              options={[
                { value: "percentage", label: "Percentage Off" },
                { value: "fixed", label: "Fixed Amount Off" },
                { value: "custom", label: "Custom Offer" },
              ]}
              onChange={handleFieldChange}
            />

            <InputField
              label={`${typeLabel} Name *`}
              name="presetName"
              value={form.presetName}
              onChange={handleFieldChange}
              error={errors.presetName}
            />

            {form.discountType === "custom" ? (
              <InputField
                label="Custom Offer *"
                name="discountAmount"
                value={form.discountAmount}
                onChange={handleFieldChange}
                error={errors.discountAmount}
                placeholder="E.g., Buy 1 Get 1 Free"
              />
            ) : (
              <>
                <InputField
                  label={
                    form.discountType === "percentage"
                      ? "Discount Percentage *"
                      : "Discount Amount *"
                  }
                  name="discountAmount"
                  type="number"
                  value={form.discountAmount}
                  onChange={handleFieldChange}
                  error={errors.discountAmount}
                />
                <InputField
                  label="Max Discount *"
                  name="maxDiscount"
                  type="number"
                  value={form.maxDiscount}
                  onChange={handleFieldChange}
                  error={errors.maxDiscount}
                />
              </>
            )}

            <InputField
              label="Min Purchase (Optional)"
              name="minPurchase"
              type="number"
              value={form.minPurchase}
              onChange={handleFieldChange}
              error={errors.minPurchase}
            />

            <ConditionList
              conditions={form.conditions || []}
              onAdd={addCondition}
              onRemove={removeCondition}
              onChange={handleConditionChange}
              errors={errors}
            />

            <InputField
              label="Offer Link (optional)"
              name="link"
              value={form.link}
              onChange={handleFieldChange}
              icon={<LinkIcon className="w-4 h-4 mr-2 text-blue-600" />}
            />

            <InputField
              label="Usage Limit *"
              name="usageLimit"
              type="number"
              value={form.usageLimit}
              onChange={handleFieldChange}
              error={errors.usageLimit}
              icon={<Users className="w-4 h-4 mr-2 text-blue-600" />}
            />

            {/* Expiry Duration Field */}
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200 form-field">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Expiry Duration (Optional)
                </h3>
                <ToggleSwitch
                  checked={hasExpiryDuration}
                  onChange={toggleExpiryDuration}
                  disabled={hasValidityPeriod}
                />
              </div>
              {hasExpiryDuration && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">Days</label>
                    <input
                      name="day"
                      type="number"
                      value={form.day || ""}
                      onChange={handleFieldChange}
                      placeholder="0"
                      min="0"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    />
                    {errors.day && <p className="text-xs text-red-500 mt-1">{errors.day}</p>}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Hours</label>
                    <input
                      name="hour"
                      type="number"
                      value={form.hour || ""}
                      onChange={handleFieldChange}
                      placeholder="0"
                      min="0"
                      max="23"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    />
                    {errors.hour && <p className="text-xs text-red-500 mt-1">{errors.hour}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Validity Period Field */}
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200 form-field">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Validity Period (Optional)
                </h3>
                <ToggleSwitch
                  checked={hasValidityPeriod}
                  onChange={toggleValidityPeriod}
                  disabled={hasExpiryDuration}
                />
              </div>
              {hasValidityPeriod && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">Start Date</label>
                    <input
                      type="date"
                      value={startDT.date}
                      onChange={e => handleDateTimeChange('startDate', e.target.value)}
                      min={getTodayDate()}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm w-full"
                    />
                    {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Start Time</label>
                    <input
                      type="time"
                      value={startDT.time}
                      onChange={e => handleDateTimeChange('startTime', e.target.value)}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm w-full"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">End Date</label>
                    <input
                      type="date"
                      value={endDT.date}
                      onChange={e => handleDateTimeChange('endDate', e.target.value)}
                      min={startDT.date || getTodayDate()}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm w-full"
                    />
                    {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">End Time</label>
                    <input
                      type="time"
                      value={endDT.time}
                      onChange={e => handleDateTimeChange('endTime', e.target.value)}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm w-full"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Section */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t">
              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="w-1/2 bg-gray-100 hover:bg-gray-200 rounded-lg py-3 font-medium disabled:opacity-70"
              >
                Clear All
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-1/2 flex justify-center items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg py-3 font-medium disabled:opacity-70"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin text-white" />}
                {loading
                  ? isEditing
                    ? "Updating..."
                    : "Creating..."
                  : isEditing
                    ? "Update Offer"
                    : "Create Offer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

/* --------------------------------------------
 🧱 Subcomponents
--------------------------------------------- */
const InputField = ({ label, name, type = "text", value, onChange, error, icon, ...rest }) => (
  <div className="space-y-2 form-field">
    <label className="text-sm font-medium text-gray-700 flex items-center">
      {icon}
      {label}
    </label>
    <input
      name={name}
      type={type}
      value={value || ""}
      onChange={onChange}
      {...rest}
      className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all duration-150
        ${error
          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-400"
          : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"}
      `}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div className="space-y-2 form-field">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

const ToggleSwitch = ({ checked, onChange, disabled }) => (
  <label className="inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className="sr-only peer"
    />
    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 disabled:opacity-50"></div>
  </label>
);

const ConditionList = ({ conditions, onAdd, onRemove, onChange, errors }) => {
  const [focusedIndex, setFocusedIndex] = useState(null);

  return (
    <div className="space-y-3 form-field">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700">Conditions (optional)</label>
        <button
          type="button"
          onClick={onAdd}
          className="text-sm text-blue-600 flex items-center hover:underline"
        >
          <Plus className="w-4 h-4 mr-1" /> Add
        </button>
      </div>

      {conditions.map((c, i) => {
        const hasError = errors[`condition-${i}`];
        const showError = hasError && focusedIndex !== i;

        return (
          <div key={i} className="flex gap-2 items-start">
            <input
              value={c || ""}
              onFocus={() => setFocusedIndex(i)}
              onBlur={() => setFocusedIndex(null)}
              onChange={(e) => onChange(i, e.target.value)}
              placeholder={`Condition ${i + 1}`}
              className={`flex-1 rounded-lg border outline-none transition-all duration-150 px-4 py-3 text-sm
                ${showError
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-400"
                  : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"}
              `}
            />
            {conditions.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="p-3 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      })}
      {Object.keys(errors)
        .filter((k) => k.startsWith("condition-"))
        .map((k) => (
          <p key={k} className="text-xs text-red-500">
            {errors[k]}
          </p>
        ))}
    </div>
  );
};
