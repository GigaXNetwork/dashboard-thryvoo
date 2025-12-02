import React, { useState, useEffect } from "react";

export default function PlanModal({ open, onClose, onSubmit, initialValues }) {
  const [form, setForm] = useState(
    initialValues || { 
      name: "", 
      price: "", 
      features: "", 
      durationInDays: "", 
      discount: "" 
    }
  );

  useEffect(() => {
    if (open) {
      setForm(initialValues || { 
        name: "", 
        price: "", 
        features: "", 
        durationInDays: "", 
        discount: "" 
      });
    }
  }, [initialValues, open]);

  if (!open) return null;

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm z-[9999] transition-opacity duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-transform duration-200 scale-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {initialValues ? "Edit Plan" : "Create New Plan"}
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors duration-150"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(form);
          }}
          className="p-6 space-y-4"
        >
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plan Name *
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
              placeholder="e.g., Premium Plan"
              value={form.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          {/* Price Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                type="number"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                placeholder="0.00"
                value={form.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Features Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Features *
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 resize-none"
              placeholder="Enter features separated by commas"
              rows="3"
              value={form.features}
              onChange={(e) => handleInputChange('features', e.target.value)}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple features with commas
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Duration Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration *
              </label>
              <div className="relative">
                <input
                  type="number"
                  className="w-full pr-8 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                  placeholder="30"
                  value={form.durationInDays}
                  onChange={(e) => handleInputChange('durationInDays', e.target.value)}
                  min="1"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">days</span>
                </div>
              </div>
            </div>

            {/* Discount Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount
              </label>
              <div className="relative">
                <input
                  type="number"
                  className="w-full pr-8 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                  placeholder="0"
                  value={form.discount}
                  onChange={(e) => handleInputChange('discount', e.target.value)}
                  min="0"
                  max="100"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150 shadow-sm"
            >
              {initialValues ? "Update Plan" : "Create Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}