import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { X, MapPin, Navigation } from "lucide-react";

export default function AddressModal({ cardData, cardId, role, onClose, onSubmit }) {
  const [form, setForm] = useState({
    addressLine: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
    longitude: "",
    latitude: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const charLimits = {
    addressLine: 150,
    city: 50,
    state: 50,
    country: 50,
    pinCode: 6,
  };

  const fieldConfig = {
    addressLine: { label: "Address Line", required: true, type: "text" },
    city: { label: "City", required: true, type: "text" },
    state: { label: "State", required: true, type: "text" },
    country: { label: "Country", required: true, type: "text" },
    pinCode: { label: "PIN Code", required: true, type: "number" },
    longitude: { label: "Longitude", required: false, type: "text" },
    latitude: { label: "Latitude", required: false, type: "text" },
  };

  useEffect(() => {
    if (cardData) {
      setForm({
        addressLine: cardData.addressLine || "",
        city: cardData.city || "",
        state: cardData.state || "",
        country: cardData.country || "",
        pinCode: cardData.pinCode || "",
        longitude: cardData.longitude || "",
        latitude: cardData.latitude || "",
      });
    }
  }, [cardData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const max = charLimits[name] || 100;
    const processedValue = value.slice(0, max);
    
    setForm(prev => ({ ...prev, [name]: processedValue }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, form[name]);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "addressLine":
        if (!value.trim()) newErrors.addressLine = "Address line is required";
        else if (value.trim().length < 5) newErrors.addressLine = "Address must be at least 5 characters";
        break;
      
      case "city":
        if (!value.trim()) newErrors.city = "City is required";
        else if (value.trim().length < 2) newErrors.city = "City must be at least 2 characters";
        break;
      
      case "state":
        if (!value.trim()) newErrors.state = "State is required";
        else if (value.trim().length < 2) newErrors.state = "State must be at least 2 characters";
        break;
      
      case "country":
        if (!value.trim()) newErrors.country = "Country is required";
        else if (value.trim().length < 2) newErrors.country = "Country must be at least 2 characters";
        break;
      
      case "pinCode":
        if (!value) newErrors.pinCode = "PIN code is required";
        else if (!/^[1-9][0-9]{5}$/.test(value)) newErrors.pinCode = "Must be a valid 6-digit PIN code";
        break;
      
      default:
        break;
    }

    setErrors(newErrors);
    return !newErrors[name];
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(fieldConfig).forEach(field => {
      if (fieldConfig[field].required && !validateField(field, form[field])) {
        isValid = false;
      }
    });

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(fieldConfig).forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const authToken = Cookies.get("authToken");
    let url;
    if (role === "admin") {
      url = `${import.meta.env.VITE_API_URL}/api/admin/card/${cardId}/updateaddress`;
    } else {
      url = `${import.meta.env.VITE_API_URL}/api/user/card/${cardId}/updateaddress`;
    }

    try {
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${authToken}`,
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update address.");

      if (onSubmit) onSubmit(data.data || form);
      onClose();
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInput = (name) => {
    const config = fieldConfig[name];
    const isError = touched[name] && errors[name];
    const charCount = form[name]?.length || 0;
    const maxChars = charLimits[name];

    return (
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
          {config.label}
          {config.required && <span className="text-red-500">*</span>}
        </label>
        
        <input
          type={config.type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
            isError
              ? "border-red-500 focus:border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
          }`}
          placeholder={`Enter ${config.label.toLowerCase()}`}
        />
        
        <div className="flex justify-between items-center">
          {isError ? (
            <p className="text-red-600 text-xs font-medium">{errors[name]}</p>
          ) : (
            <div className="text-xs text-gray-400">
              {maxChars && `${charCount}/${maxChars} characters`}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-[9999] backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Update Address</h2>
              <p className="text-sm text-gray-500">Fill in the address details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Address Line */}
          {renderInput("addressLine")}

          {/* City & State */}
          <div className="grid grid-cols-2 gap-4">
            {renderInput("city")}
            {renderInput("state")}
          </div>

          {/* Country & PIN Code */}
          <div className="grid grid-cols-2 gap-4">
            {renderInput("country")}
            {renderInput("pinCode")}
          </div>

          {/* Coordinates Section */}
          <div className="border-t pt-4 mt-2">
            <div className="flex items-center gap-2 mb-4">
              <Navigation className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-medium text-gray-700">Coordinates</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {renderInput("longitude")}
              {renderInput("latitude")}
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{errors.submit}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-blue-500 font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 rounded-lg font-semibold text-white transition-colors flex items-center gap-2 ${
                isSubmitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}