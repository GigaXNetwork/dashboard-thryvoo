import { X, Calendar, Clock, Tag, DollarSign, MinusCircle, ShoppingBag, Users } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

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
  type // Add type prop to determine which type of offer
}) {
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('17:00');
  const [errors, setErrors] = useState({});
  const [hasValidityPeriod, setHasValidityPeriod] = useState(false);
  const [hasExpiryDuration, setHasExpiryDuration] = useState(false);

  // Initialize date fields and toggle states from form data if editing
  useEffect(() => {
    if (form.startAt) {
      try {
        const dateTime = new Date(form.startAt);
        if (!isNaN(dateTime.getTime())) {
          setStartDate(dateTime.toISOString().split('T')[0]);
          setStartTime(dateTime.toTimeString().substring(0, 5));
          setHasValidityPeriod(true);
        }
      } catch (error) {
        console.error("Error parsing startAt date:", error);
      }
    }
    
    if (form.expireAt) {
      try {
        const dateTime = new Date(form.expireAt);
        if (!isNaN(dateTime.getTime())) {
          setEndDate(dateTime.toISOString().split('T')[0]);
          setEndTime(dateTime.toTimeString().substring(0, 5));
        }
      } catch (error) {
        console.error("Error parsing expireAt date:", error);
      }
    }

    // Check if expiry duration exists
    if (form.day || form.hour) {
      setHasExpiryDuration(true);
    }
  }, [form, showForm]);

  // Update form with combined date-time values
  const updateDateTimeFields = useCallback(() => {
    if (hasValidityPeriod && startDate && startTime) {
      const startAt = new Date(`${startDate}T${startTime}`);
      if (!isNaN(startAt.getTime())) {
        handleChange({ target: { name: 'startAt', value: startAt.toISOString() } });
      }
    }
    
    if (hasValidityPeriod && endDate && endTime) {
      const expireAt = new Date(`${endDate}T${endTime}`);
      if (!isNaN(expireAt.getTime())) {
        handleChange({ target: { name: 'expireAt', value: expireAt.toISOString() } });
      }
    }
    
    // Set type based on prop
    handleChange({ target: { name: 'type', value: type || 'offer' } });
  }, [startDate, startTime, endDate, endTime, hasValidityPeriod, handleChange, type]);

  // Validate form
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!form.presetName || form.presetName.trim() === '') {
      newErrors.presetName = 'Offer name is required';
    }
    
    if (form.discountType !== 'custom') {
      if (!form.discountAmount || form.discountAmount <= 0) {
        newErrors.discountAmount = 'Valid discount amount is required';
      }
      if (!form.maxDiscount || form.maxDiscount <= 0) {
        newErrors.maxDiscount = 'Valid max discount is required';
      }
    } else {
      if (!form.discountAmount || form.discountAmount.trim() === '') {
        newErrors.discountAmount = 'Custom offer description is required';
      }
    }
    
    if (!form.minPurchase || form.minPurchase < 0) {
      newErrors.minPurchase = 'Valid minimum purchase is required';
    }
    
    if (!form.usageLimit || form.usageLimit <= 0) {
      newErrors.usageLimit = 'Valid usage limit is required';
    }

    // Validate expiry duration if enabled
    if (hasExpiryDuration) {
      const day = parseFloat(form.day);
      const hour = parseFloat(form.hour);
      
      if (day < 0) newErrors.day = "Day must be non-negative";
      if (hour < 0) newErrors.hour = "Hour must be non-negative";
      if ((!day || day === 0) && (!hour || hour === 0)) {
        newErrors.day = "Please provide either days or hours";
        newErrors.hour = "Please provide either days or hours";
      }
    }
    
    // Validate validity period if enabled
    if (hasValidityPeriod) {
      if (!startDate) {
        newErrors.startDate = 'Start date is required';
      }
      
      if (!endDate) {
        newErrors.endDate = 'End date is required';
      }
      
      if (startDate && endDate) {
        const start = new Date(`${startDate}T${startTime}`);
        const end = new Date(`${endDate}T${endTime}`);
        
        if (end <= start) {
          newErrors.endDate = 'End date must be after start date';
        }
        
        if (start < new Date()) {
          newErrors.startDate = 'Start date cannot be in the past';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form, startDate, startTime, endDate, endTime, hasExpiryDuration, hasValidityPeriod]);

  // Handle form submission
  const handleFormSubmit = useCallback((e) => {
    e.preventDefault();
    
    // First update the date/time fields
    updateDateTimeFields();
    
    // Validate and submit
    if (validateForm()) {
      handleSubmit(e);
    }
  }, [updateDateTimeFields, validateForm, handleSubmit]);

  // Handle individual field changes
  const handleFieldChange = useCallback((e) => {
    const { name, value } = e.target;
    handleChange(e);
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors, handleChange]);

  // Toggle handlers
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
      setStartDate('');
      setEndDate('');
    }
    // Clear day/hour errors when toggling
    if (errors.day || errors.hour) {
      const newErrors = { ...errors };
      delete newErrors.day;
      delete newErrors.hour;
      setErrors(newErrors);
    }
  };

  // Handle date/time changes
  const handleDateTimeChange = useCallback((type, value) => {
    if (type === 'startDate') setStartDate(value);
    if (type === 'startTime') setStartTime(value);
    if (type === 'endDate') setEndDate(value);
    if (type === 'endTime') setEndTime(value);
    
    // Clear error when field is updated
    if (errors[type]) {
      setErrors(prev => ({ ...prev, [type]: '' }));
    }
    
    // Update form fields when date/time changes
    if ((type === 'startDate' || type === 'startTime') && startDate && startTime) {
      const startAt = new Date(`${type === 'startDate' ? value : startDate}T${type === 'startTime' ? value : startTime}`);
      if (!isNaN(startAt.getTime())) {
        handleChange({ target: { name: 'startAt', value: startAt.toISOString() } });
      }
    }
    
    if ((type === 'endDate' || type === 'endTime') && endDate && endTime) {
      const expireAt = new Date(`${type === 'endDate' ? value : endDate}T${type === 'endTime' ? value : endTime}`);
      if (!isNaN(expireAt.getTime())) {
        handleChange({ target: { name: 'expireAt', value: expireAt.toISOString() } });
      }
    }
  }, [errors, startDate, startTime, endDate, endTime, handleChange]);

  // Get today's date in YYYY-MM-DD format for date input min attribute
  const getTodayDate = useCallback(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  // Close form handler
  const handleClose = useCallback(() => {
    setShowForm(false);
    setErrors({});
    setHasValidityPeriod(false);
    setHasExpiryDuration(false);
    
    // Reset date fields when closing
    if (!isEditing) {
      setStartDate('');
      setEndDate('');
      setStartTime('09:00');
      setEndTime('17:00');
    }
    
    if (onClose) {
      onClose();
    }
  }, [setShowForm, isEditing, onClose]);

  // Reset the form
  const handleReset = useCallback(() => {
    resetForm();
    setStartDate('');
    setEndDate('');
    setStartTime('09:00');
    setEndTime('17:00');
    setErrors({});
    setHasValidityPeriod(false);
    setHasExpiryDuration(false);
  }, [resetForm]);

  return (
    <>
      {/* Backdrop */}
      {showForm && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] transition-opacity duration-300"
          onClick={handleClose}
        />
      )}
      
      {/* Centered Modal */}
      <div className={`fixed inset-0 flex items-center justify-center z-[9999] transition-opacity duration-300 ${showForm ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`relative w-full max-w-md bg-white rounded-xl shadow-2xl transform transition-transform duration-300 ${showForm ? 'scale-100' : 'scale-95'}`}>
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Tag className="w-5 h-5 text-[#2563EB]" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            
            {/* Discount Type Selector */}
            <div className="space-y-2">
              <label htmlFor="discountType" className="text-sm font-medium text-gray-700 flex items-center">
                Discount Type
              </label>
              <select
                id="discountType"
                name="discountType"
                value={form.discountType}
                onChange={handleFieldChange}
                disabled={loading}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
              >
                <option value="percentage">Percentage Off</option>
                <option value="fixed">Fixed Amount Off</option>
                <option value="custom">Custom Offer</option>
              </select>
            </div>

            {/* Offer Name */}
            <div className="space-y-2">
              <label htmlFor="presetName" className="text-sm font-medium text-gray-700 flex items-center">
                Offer Name *
              </label>
              <input
                id="presetName"
                name="presetName"
                type="text"
                value={form.presetName}
                onChange={handleFieldChange}
                placeholder="Enter offer name"
                disabled={loading}
                className={`w-full rounded-lg border ${errors.presetName ? 'border-red-500' : 'border-gray-200'} px-4 py-3 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-colors shadow-sm`}
              />
              {errors.presetName && <p className="text-red-500 text-xs mt-1">{errors.presetName}</p>}
            </div>

            {/* Discount Amount/Offer */}
            <div className="space-y-2">
              <label htmlFor="discountAmount" className="text-sm font-medium text-gray-700 flex items-center">
                {form.discountType === 'custom' ? (
                  <>Custom Offer *</>
                ) : (
                  <>{form.discountType === 'percentage' ? 'Discount Percentage *' : 'Discount Amount *'}</>
                )}
              </label>
              <input
                id="discountAmount"
                name="discountAmount"
                type={form.discountType === 'custom' ? 'text' : 'number'}
                value={form.discountAmount}
                onChange={handleFieldChange}
                placeholder={form.discountType === 'custom' ? 'E.g., Buy 1 Get 1 Free' : form.discountType === 'percentage' ? 'E.g., 10 for 10%' : 'E.g., 5 for $5 off'}
                disabled={loading}
                min={form.discountType === 'percentage' ? 0 : undefined}
                max={form.discountType === 'percentage' ? 100 : undefined}
                step={form.discountType === 'percentage' ? 0.01 : 1}
                className={`w-full rounded-lg border ${errors.discountAmount ? 'border-red-500' : 'border-gray-200'} px-4 py-3 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-colors shadow-sm`}
              />
              {errors.discountAmount && <p className="text-red-500 text-xs mt-1">{errors.discountAmount}</p>}
              {form.discountType === 'percentage' && form.discountAmount > 0 && (
                <p className="text-xs text-gray-500">{form.discountAmount}% discount</p>
              )}
            </div>

            {/* Max Discount (not shown for custom offers) */}
            {form.discountType !== 'custom' && (
              <div className="space-y-2">
                <label htmlFor="maxDiscount" className="text-sm font-medium text-gray-700 flex items-center">
                  Maximum Discount *
                </label>
                <input
                  id="maxDiscount"
                  name="maxDiscount"
                  type="number"
                  value={form.maxDiscount}
                  onChange={handleFieldChange}
                  placeholder="Enter maximum discount"
                  disabled={loading}
                  min="0"
                  step="0.01"
                  className={`w-full rounded-lg border ${errors.maxDiscount ? 'border-red-500' : 'border-gray-200'} px-4 py-3 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-colors shadow-sm`}
                />
                {errors.maxDiscount && <p className="text-red-500 text-xs mt-1">{errors.maxDiscount}</p>}
              </div>
            )}

            {/* Minimum Purchase */}
            <div className="space-y-2">
              <label htmlFor="minPurchase" className="text-sm font-medium text-gray-700 flex items-center">
                Minimum Purchase Amount *
              </label>
              <input
                id="minPurchase"
                name="minPurchase"
                type="number"
                value={form.minPurchase}
                onChange={handleFieldChange}
                placeholder="Enter minimum purchase amount"
                disabled={loading}
                min="0"
                step="0.01"
                className={`w-full rounded-lg border ${errors.minPurchase ? 'border-red-500' : 'border-gray-200'} px-4 py-3 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-colors shadow-sm`}
              />
              {errors.minPurchase && <p className="text-red-500 text-xs mt-1">{errors.minPurchase}</p>}
            </div>

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
                <>
                  {/* Start Date & Time */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label htmlFor="startDate" className="block text-xs font-medium text-gray-600">
                        Start Date
                      </label>
                      <div className="relative">
                        <input
                          id="startDate"
                          type="date"
                          value={startDate}
                          onChange={(e) => handleDateTimeChange('startDate', e.target.value)}
                          min={getTodayDate()}
                          className={`w-full rounded-lg border ${errors.startDate ? 'border-red-500' : 'border-gray-200'} px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        />
                      </div>
                      {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="startTime" className="block text-xs font-medium text-gray-600">
                        Start Time
                      </label>
                      <div className="relative">
                        <input
                          id="startTime"
                          type="time"
                          value={startTime}
                          onChange={(e) => handleDateTimeChange('startTime', e.target.value)}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* End Date & Time */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label htmlFor="endDate" className="block text-xs font-medium text-gray-600">
                        End Date
                      </label>
                      <div className="relative">
                        <input
                          id="endDate"
                          type="date"
                          value={endDate}
                          onChange={(e) => handleDateTimeChange('endDate', e.target.value)}
                          min={startDate || getTodayDate()}
                          className={`w-full rounded-lg border ${errors.endDate ? 'border-red-500' : 'border-gray-200'} px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        />
                      </div>
                      {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="endTime" className="block text-xs font-medium text-gray-600">
                        End Time
                      </label>
                      <div className="relative">
                        <input
                          id="endTime"
                          type="time"
                          value={endTime}
                          onChange={(e) => handleDateTimeChange('endTime', e.target.value)}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Usage Limit */}
            <div className="space-y-2">
              <label htmlFor="usageLimit" className="text-sm font-medium text-gray-700 flex items-center">
                Usage Limit (per customer) *
              </label>
              <input
                id="usageLimit"
                name="usageLimit"
                type="number"
                value={form.usageLimit}
                onChange={handleFieldChange}
                placeholder="Enter usage limit"
                disabled={loading}
                min="1"
                className={`w-full rounded-lg border ${errors.usageLimit ? 'border-red-500' : 'border-gray-200'} px-4 py-3 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-colors shadow-sm`}
              />
              {errors.usageLimit && <p className="text-red-500 text-xs mt-1">{errors.usageLimit}</p>}
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-100">
              <button
                type="button"
                disabled={loading}
                onClick={handleReset}
                className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg py-3 transition-colors border border-gray-200 shadow-sm"
              >
                Clear All
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg py-3 transition-all flex items-center justify-center shadow-md disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditing ? 'Update Offer' : 'Create Offer'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// Toggle Switch Component
const ToggleSwitch = ({ checked, onChange, disabled }) => (
  <label className="inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className="sr-only peer"
    />
    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
  </label>
);
