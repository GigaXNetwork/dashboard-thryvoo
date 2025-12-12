import React, { useState, useEffect } from "react";
import { X, Globe, LinkIcon, Users, Building, Tag, User } from "lucide-react";
import { apiRequest } from "../../Context/apiService";

const EditAffiliateModal = ({ affiliate, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    organization_name: "",
    category: "",
    country: "",
    city: "",
    website_url: "",
    social_links: "",
    commissionPercentage: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: "", type: "", show: false });

  // Predefined categories
  const categories = [
    "Influencer",
    "Blogger",
    "YouTuber",
    "Podcaster",
    "Affiliate Marketer",
    "Content Creator",
    "Social Media Influencer",
    "E-commerce Store",
    "Other"
  ];

  const countries = [
    "India",
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "UAE",
    "Other"
  ];

  useEffect(() => {
    if (affiliate && isOpen) {
      setFormData({
        fullName: affiliate.fullName || "",
        mobile: affiliate.mobile || "",
        organization_name: affiliate.organization_name || "",
        category: affiliate.category || "",
        country: affiliate.country || "",
        city: affiliate.city || "",
        website_url: affiliate.website_url || "",
        social_links: affiliate.social_links ? affiliate.social_links.join("\n") : "",
        commissionPercentage: affiliate.commissionPercentage || ""
      });
      setErrors({});
      setMessage({ text: "", type: "", show: false });
    }
  }, [affiliate, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName?.trim()) {
      newErrors.fullName = "Full name is required";
    }
    
    if (formData.mobile && !/^[\d\s+\-()]{10,15}$/.test(formData.mobile)) {
      newErrors.mobile = "Please enter a valid mobile number";
    }
    
    if (formData.commissionPercentage) {
      const commission = parseFloat(formData.commissionPercentage);
      if (isNaN(commission) || commission < 0 || commission > 100) {
        newErrors.commissionPercentage = "Commission must be between 0 and 100";
      }
    }
    
    if (formData.website_url && !isValidUrl(formData.website_url)) {
      newErrors.website_url = "Please enter a valid URL";
    }
    
    return newErrors;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      const payload = {
        ...formData,
        social_links: formData.social_links
          .split("\n")
          .map(link => link.trim())
          .filter(link => link.length > 0),
        commissionPercentage: formData.commissionPercentage ? 
          parseFloat(formData.commissionPercentage) : 0
      };
      
      const response = await apiRequest(`/api/affiliate/update/${affiliate.id || affiliate._id}`, "PUT", payload);
      
      if (response.ok) {
        setMessage({
          text: "Affiliate details updated successfully!",
          type: "success",
          show: true
        });
        
        // Call onSuccess callback after a delay
        setTimeout(() => {
          onSuccess && onSuccess(response.affiliate || response.data);
          onClose();
        }, 1500);
      } else {
        throw new Error(response.message || "Failed to update affiliate");
      }
    } catch (error) {
      setMessage({
        text: error.message || "An error occurred while updating",
        type: "error",
        show: true
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Edit Affiliate Details</h3>
            <p className="text-sm text-gray-500">Update information for {affiliate?.fullName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message */}
        {message.show && (
          <div className={`mx-6 mt-4 px-4 py-3 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-sm">{message.text}</span>
              <button
                onClick={() => setMessage({ text: '', type: '', show: false })}
                className="text-sm hover:opacity-70"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-400" />
                Personal Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.fullName ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Enter full name"
                    disabled={loading}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.mobile ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="+1 (555) 123-4567"
                    disabled={loading}
                  />
                  {errors.mobile && (
                    <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Organization & Category Section */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-gray-400" />
                Professional Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    name="organization_name"
                    value={formData.organization_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Company or brand name"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-gray-400" />
                Location
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter city"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Website & Social Links */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-gray-400" />
                Online Presence
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    name="website_url"
                    value={formData.website_url}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.website_url ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="https://example.com"
                    disabled={loading}
                  />
                  {errors.website_url && (
                    <p className="mt-1 text-sm text-red-600">{errors.website_url}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Social Media Links (one per line)
                  </label>
                  <textarea
                    name="social_links"
                    value={formData.social_links}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://facebook.com/username&#10;https://instagram.com/username&#10;https://twitter.com/username"
                    rows="4"
                    disabled={loading}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter each social media link on a new line
                  </p>
                </div>
              </div>
            </div>

            {/* Commission Section */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-gray-400" />
                Commission Settings
              </h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commission Percentage (%)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="commissionPercentage"
                    value={formData.commissionPercentage}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.1"
                    className={`w-full md:w-48 px-3 py-2 border ${
                      errors.commissionPercentage ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="0-100"
                    disabled={loading}
                  />
                  <span className="text-gray-500">%</span>
                </div>
                {errors.commissionPercentage && (
                  <p className="mt-1 text-sm text-red-600">{errors.commissionPercentage}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Set commission rate for this affiliate (0-100%)
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Footer with Actions */}
        <div className="px-6 py-4 border-t bg-gray-50">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAffiliateModal;