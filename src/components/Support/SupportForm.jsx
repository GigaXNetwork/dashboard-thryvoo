// components/Support/SupportForm.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const SupportForm = ({
    isOpen,
    onClose,
    onSubmit,
    loading,
    editingItem
}) => {
    const [formData, setFormData] = useState({
        help_cat_name: '',
        help_cat_icon: '',
        help_cat_description: ''
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Reset form when modal opens/closes or when editingItem changes
    useEffect(() => {
        if (isOpen) {
            if (editingItem) {
                // Pre-fill form with editing item data
                setFormData({
                    help_cat_name: editingItem.help_cat_name || '',
                    help_cat_icon: editingItem.help_cat_icon || '',
                    help_cat_description: editingItem.help_cat_description || ''
                });
            } else {
                // Reset form for new item
                setFormData({
                    help_cat_name: '',
                    help_cat_icon: '',
                    help_cat_description: ''
                });
            }
            setErrors({});
            setTouched({});
        }
    }, [isOpen, editingItem]);

    if (!isOpen) return null;

    const validateField = (name, value) => {
        const newErrors = { ...errors };

        switch (name) {
            case 'help_cat_name':
                if (!value.trim()) {
                    newErrors.help_cat_name = 'Category name is required';
                } else if (value.trim().length < 2) {
                    newErrors.help_cat_name = 'Category name must be at least 2 characters';
                } else if (value.trim().length > 50) {
                    newErrors.help_cat_name = 'Category name must be less than 50 characters';
                } else {
                    delete newErrors.help_cat_name;
                }
                break;

            case 'help_cat_icon':
                if (!value.trim()) {
                    newErrors.help_cat_icon = 'Icon is required';
                } else if (value.trim().length > 30) {
                    newErrors.help_cat_icon = 'Icon must be less than 30 characters';
                } else {
                    delete newErrors.help_cat_icon;
                }
                break;

            case 'help_cat_description':
                if (!value.trim()) {
                    newErrors.help_cat_description = 'Description is required';
                } else if (value.trim().length < 10) {
                    newErrors.help_cat_description = 'Description must be at least 10 characters';
                } else if (value.trim().length > 500) {
                    newErrors.help_cat_description = 'Description must be less than 500 characters';
                } else {
                    delete newErrors.help_cat_description;
                }
                break;

            default:
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name, value);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Validate field if it's been touched before
        if (touched[name]) {
            validateField(name, value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Mark all fields as touched
        const allTouched = {
            help_cat_name: true,
            help_cat_icon: true,
            help_cat_description: true
        };
        setTouched(allTouched);

        // Validate all fields
        const isNameValid = validateField('help_cat_name', formData.help_cat_name);
        const isIconValid = validateField('help_cat_icon', formData.help_cat_icon);
        const isDescValid = validateField('help_cat_description', formData.help_cat_description);

        if (isNameValid && isIconValid && isDescValid) {
            // Create a clean copy of formData to avoid circular references
            const cleanFormData = {
                help_cat_name: formData.help_cat_name.trim(),
                help_cat_icon: formData.help_cat_icon.trim(),
                help_cat_description: formData.help_cat_description.trim()
            };
            onSubmit(cleanFormData);
        }
    };

    const handleClose = () => {
        onClose();
    };

    const getInputClassName = (fieldName) => {
        const baseClass = "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none";

        if (touched[fieldName] && errors[fieldName]) {
            return `${baseClass} border-red-500 bg-red-50`;
        }

        return `${baseClass} border-gray-300`;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-md mx-auto p-6 relative max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold mb-6">
                    {editingItem ? 'Edit Help Item' : 'Create Help Item'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category Name *
                        </label>
                        <input
                            type="text"
                            name="help_cat_name"
                            required
                            value={formData.help_cat_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={getInputClassName('help_cat_name')}
                            placeholder="Enter category name"
                        />
                        {touched.help_cat_name && errors.help_cat_name && (
                            <p className="text-red-500 text-xs mt-1">{errors.help_cat_name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Icon *
                        </label>
                        <input
                            type="text"
                            name="help_cat_icon"
                            required
                            value={formData.help_cat_icon}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={getInputClassName('help_cat_icon')}
                            placeholder="Enter icon name or URL"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            You can use icon names from Lucide React or React Icons
                        </p>
                        {touched.help_cat_icon && errors.help_cat_icon && (
                            <p className="text-red-500 text-xs mt-1">{errors.help_cat_icon}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            name="help_cat_description"
                            required
                            rows={4}
                            value={formData.help_cat_description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={getInputClassName('help_cat_description')}
                            placeholder="Enter category description"
                            maxLength={200}
                        />
                        {touched.help_cat_description && errors.help_cat_description && (
                            <p className="text-red-500 text-xs mt-1">{errors.help_cat_description}</p>
                        )}
                        <div className={`text-xs mt-1 flex justify-between ${formData.help_cat_description.length > 200 ? 'text-red-500' : 'text-gray-500'}`}>
                            <span>
                                {formData.help_cat_description.length > 200 ? 'Character limit exceeded!' : `${formData.help_cat_description.length}/200 characters`}
                            </span>
                            {formData.help_cat_description.length > 200 && (
                                <span className="font-medium">
                                    {formData.help_cat_description.length - 200} over limit
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading || Object.keys(errors).length > 0}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : (editingItem ? 'Update' : 'Create')}
                        </button>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SupportForm;