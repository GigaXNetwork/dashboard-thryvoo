import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { FaPlus, FaTimes, FaSpinner, FaSave, FaWhatsapp } from 'react-icons/fa';
import {
    FaFacebook,
    FaInstagram,
    FaLinkedin,
    FaYoutube,
    FaGlobe
} from 'react-icons/fa';
import { FaThreads, FaXTwitter } from "react-icons/fa6";

const CreateSocialMedia = ({
    onClose,
    onCreateSuccess,
    onUpdateSuccess,
    editingMedia,
    isEditing
}) => {
    const [formData, setFormData] = useState({
        mediaType: '',
        link: '',
        conditions: [''],
        rewards: ''
    });
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [couponPresets, setCouponPresets] = useState([]);
    const [loadingPresets, setLoadingPresets] = useState(false);

    // Fetch coupon presets on component mount
    useEffect(() => {
        const fetchCouponPresets = async () => {
            setLoadingPresets(true);
            const token = Cookies.get('authToken');

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/coupon/presetsName`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${token}`,
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch coupon presets');
                }

                const data = await response.json();
                const presets = data.data?.presetsName || [];
                setCouponPresets(Array.isArray(presets) ? presets : []);
            } catch (error) {
                console.error('Error fetching coupon presets:', error);
            } finally {
                setLoadingPresets(false);
            }
        };

        fetchCouponPresets();
    }, []);

    // Initialize form with editing data if in edit mode
    useEffect(() => {
        if (isEditing && editingMedia) {
            setFormData({
                mediaType: editingMedia.mediaType || '',
                link: editingMedia.link || '',
                conditions: editingMedia.conditions && editingMedia.conditions.length > 0
                    ? [...editingMedia.conditions]
                    : [''],
                rewards: editingMedia.rewards || ''
            });
        }
    }, [isEditing, editingMedia]);

    const mediaTypes = [
        { value: 'facebook', label: 'Facebook', icon: <FaFacebook className="text-blue-600" /> },
        { value: 'instagram', label: 'Instagram', icon: <FaInstagram className="text-pink-600" /> },
        { value: 'x', label: 'X', icon: <FaXTwitter className="text-black" /> },
        { value: 'threads', label: 'Threads', icon: <FaThreads className="text-black" /> },
        { value: 'whatsapp', label: 'WhatsApp', icon: <FaWhatsapp className="text-green-500" /> },
        { value: 'youtube', label: 'YouTube', icon: <FaYoutube className="text-red-600" /> },
        { value: 'linkedin', label: 'LinkedIn', icon: <FaLinkedin className="text-blue-700" /> },
        { value: 'other', label: 'Other', icon: <FaGlobe className="text-gray-600" /> }
    ];

    const validateField = (name, value) => {
        const errors = { ...fieldErrors };

        switch (name) {
            case 'mediaType':
                if (!value) {
                    errors.mediaType = 'Please select a social media platform';
                } else {
                    delete errors.mediaType;
                }
                break;
            case 'link':
                if (!value) {
                    errors.link = 'Please provide a valid URL';
                } else if (!isValidUrl(value)) {
                    errors.link = 'Please enter a valid URL';
                } else {
                    delete errors.link;
                }
                break;
            default:
                break;
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        validateField(name, value);
    };

    const handleMediaTypeSelect = (mediaType) => {
        setFormData(prev => ({ ...prev, mediaType }));
        validateField('mediaType', mediaType);
    };

    const handleConditionChange = (index, value) => {
        const newConditions = [...formData.conditions];
        newConditions[index] = value;
        setFormData(prev => ({
            ...prev,
            conditions: newConditions
        }));

        // Validate conditions in real-time
        const validConditions = newConditions.filter(condition => condition.trim() !== '');
        const errors = { ...fieldErrors };

        if (validConditions.length > 0) {
            delete errors.conditions;
        } else {
            errors.conditions = 'Please add at least one condition';
        }

        setFieldErrors(errors);
    };

    const addCondition = () => {
        setFormData(prev => ({
            ...prev,
            conditions: [...prev.conditions, '']
        }));

        const errors = { ...fieldErrors };
        delete errors.conditions;
        setFieldErrors(errors);
    };

    const removeCondition = (index) => {
        const newConditions = formData.conditions.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            conditions: newConditions.length > 0 ? newConditions : ['']
        }));

        const validConditions = newConditions.filter(condition => condition.trim() !== '');
        const errors = { ...fieldErrors };

        if (validConditions.length > 0) {
            delete errors.conditions;
        } else {
            errors.conditions = 'Please add at least one condition';
        }

        setFieldErrors(errors);
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.mediaType) {
            errors.mediaType = 'Please select a social media platform';
        }

        if (!formData.link) {
            errors.link = 'Please provide a valid URL';
        } else if (!isValidUrl(formData.link)) {
            errors.link = 'Please enter a valid URL';
        }

        const validConditions = formData.conditions.filter(condition => condition.trim() !== '');
        if (validConditions.length === 0) {
            errors.conditions = 'Please add at least one condition';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        const filteredConditions = formData.conditions
            .map(condition => condition.trim())
            .filter(condition => condition !== '');

        const token = Cookies.get('authToken');
        try {
            const url = isEditing && editingMedia
                ? `${import.meta.env.VITE_API_URL}/api/social-media/${editingMedia._id}`
                : `${import.meta.env.VITE_API_URL}/api/social-media`;

            const method = isEditing ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
                body: JSON.stringify({
                    mediaType: formData.mediaType,
                    link: formData.link,
                    conditions: filteredConditions,
                    rewards: formData.rewards || null
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to ${isEditing ? 'update' : 'create'} social media offer`);
            }

            const data = await response.json();

            if (isEditing) {
                onUpdateSuccess?.(data.data.socialMedia);
            } else {
                onCreateSuccess?.(data.data.socialMedia);
            }

            onClose();
        } catch (error) {
            setFieldErrors({ submit: error.message });
        } finally {
            setLoading(false);
        }
    };

    const getRewardOptions = () => {
        if (Array.isArray(couponPresets) && couponPresets.length > 0) {
            return couponPresets;
        }
        return [];
    };

    const getCurrentRewardValue = () => {
        if (typeof formData.rewards === 'object') {
            return formData.rewards._id;
        }
        return formData.rewards;
    };

    const currentRewardExistsInPresets = () => {
        const currentValue = getCurrentRewardValue();
        if (!currentValue) return false;
        return getRewardOptions().some(preset => preset._id === currentValue);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden border border-gray-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                {isEditing ? 'Edit Social Media Offer' : 'Create Social Media Offer'}
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                {isEditing ? 'Update your social media offer details' : 'Add a new social media offer to engage customers'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white rounded-lg"
                            disabled={loading}
                        >
                            <FaTimes className="text-lg" />
                        </button>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Social Media Platform Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Social Media Platform *
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {mediaTypes.map((type) => (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => handleMediaTypeSelect(type.value)}
                                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${formData.mediaType === type.value
                                            ? 'border-blue-500 bg-blue-50 shadow-sm'
                                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                                            } ${fieldErrors.mediaType ? 'border-red-500' : ''}`}
                                        disabled={loading}
                                    >
                                        <span className="text-2xl mb-2">{type.icon}</span>
                                        <span className="text-xs font-medium text-gray-700">{type.label}</span>
                                    </button>
                                ))}
                            </div>
                            {fieldErrors.mediaType && (
                                <p className="text-red-600 text-sm mt-2 flex items-center">
                                    <FaTimes className="mr-1 text-xs" />
                                    {fieldErrors.mediaType}
                                </p>
                            )}
                        </div>

                        {/* Profile URL */}
                        <div>
                            <label htmlFor="link" className="block text-sm font-semibold text-gray-700 mb-2">
                                Profile/Page URL *
                            </label>
                            <input
                                type="url"
                                id="link"
                                name="link"
                                value={formData.link}
                                onChange={handleChange}
                                placeholder="https://example.com/your-profile"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${fieldErrors.link ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'}`}
                                disabled={loading}
                            />
                            {fieldErrors.link && (
                                <p className="text-red-600 text-sm mt-2 flex items-center">
                                    {fieldErrors.link}
                                </p>
                            )}
                        </div>

                        {/* Rewards Selection */}
                        <div>
                            <label htmlFor="rewards" className="block text-sm font-semibold text-gray-700 mb-2">
                                Rewards
                            </label>
                            <select
                                id="rewards"
                                name="rewards"
                                value={getCurrentRewardValue()}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
                                disabled={loading || loadingPresets}
                            >
                                <option value="">No reward (Default coins)</option>
                                {formData.rewards && !currentRewardExistsInPresets() && (
                                    <option value={getCurrentRewardValue()}>
                                        {typeof formData.rewards === 'object' ? formData.rewards.presetName : formData.rewards}
                                    </option>
                                )}
                                {getRewardOptions().map((preset) => (
                                    <option key={preset._id} value={preset._id}>
                                        {preset.presetName}
                                    </option>
                                ))}
                            </select>
                            <p className="text-gray-500 text-sm mt-2">
                                If no reward is selected, customers will receive default coins
                            </p>
                            {loadingPresets && (
                                <div className="flex items-center text-gray-500 text-sm mt-2">
                                    <FaSpinner className="animate-spin mr-2" />
                                    Loading rewards...
                                </div>
                            )}
                        </div>

                        {/* Terms & Conditions */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Terms & Conditions *
                            </label>
                            <div className="space-y-3">
                                {formData.conditions.map((condition, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={condition}
                                                onChange={(e) => handleConditionChange(index, e.target.value)}
                                                placeholder={`Condition ${index + 1}`}
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${fieldErrors.conditions ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
                                                    }`}
                                                disabled={loading}
                                            />
                                        </div>
                                        {formData.conditions.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeCondition(index)}
                                                className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                                                disabled={loading}
                                            >
                                                <FaTimes />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {fieldErrors.conditions && (
                                    <p className="text-red-600 text-sm mt-2 flex items-center">
                                        {fieldErrors.conditions}
                                    </p>
                                )}
                                <button
                                    type="button"
                                    onClick={addCondition}
                                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                                    disabled={loading}
                                >
                                    <FaPlus className="mr-2 text-xs" />
                                    Add Another Condition
                                </button>
                            </div>

                        </div>

                        {/* Submit Error */}
                        {fieldErrors.submit && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-700 text-sm font-medium">{fieldErrors.submit}</p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                                disabled={loading || loadingPresets}
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" />
                                        {isEditing ? 'Saving...' : 'Creating...'}
                                    </>
                                ) : (
                                    <>
                                        {isEditing ? (
                                            <>
                                                <FaSave className="mr-2" />
                                                Save Changes
                                            </>
                                        ) : (
                                            'Create Offer'
                                        )}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateSocialMedia;