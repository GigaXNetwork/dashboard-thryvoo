// components/Support/FAQForm.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const FAQForm = ({
    isOpen,
    onClose,
    onSubmit,
    loading,
    editingFAQ,
    categoryId
}) => {
    const [formData, setFormData] = useState({
        question: '',
        answer: ''
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    useEffect(() => {
        if (isOpen) {
            if (editingFAQ) {
                setFormData({
                    question: editingFAQ.question || '',
                    answer: editingFAQ.answer || ''
                });
            } else {
                setFormData({
                    question: '',
                    answer: ''
                });
            }
            setErrors({});
            setTouched({});
        }
    }, [isOpen, editingFAQ]);

    if (!isOpen) return null;

    const validateField = (name, value) => {
        const newErrors = { ...errors };

        switch (name) {
            case 'question':
                if (!value.trim()) {
                    newErrors.question = 'Question is required';
                } else if (value.trim().length < 5) {
                    newErrors.question = 'Question must be at least 5 characters';
                } else if (value.trim().length > 200) {
                    newErrors.question = 'Question must be less than 200 characters';
                } else {
                    delete newErrors.question;
                }
                break;

            case 'answer':
                if (!value.trim()) {
                    newErrors.answer = 'Answer is required';
                } else if (value.trim().length < 10) {
                    newErrors.answer = 'Answer must be at least 10 characters';
                } else if (value.trim().length > 1000) {
                    newErrors.answer = 'Answer must be less than 1000 characters';
                } else {
                    delete newErrors.answer;
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

        if (touched[name]) {
            validateField(name, value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const allTouched = {
            question: true,
            answer: true
        };
        setTouched(allTouched);

        const isQuestionValid = validateField('question', formData.question);
        const isAnswerValid = validateField('answer', formData.answer);

        if (isQuestionValid && isAnswerValid) {
            const cleanFormData = {
                question: formData.question.trim(),
                answer: formData.answer.trim()
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
            <div className="bg-white rounded-lg w-full max-w-2xl mx-auto p-6 relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold mb-6">
                    {editingFAQ ? 'Edit FAQ' : 'Add FAQ'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Question *
                        </label>
                        <input
                            type="text"
                            name="question"
                            required
                            value={formData.question}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={getInputClassName('question')}
                            placeholder="Enter the question"
                        />
                        {touched.question && errors.question && (
                            <p className="text-red-500 text-xs mt-1">{errors.question}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.question.length}/200 characters
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Answer *
                        </label>
                        <textarea
                            name="answer"
                            required
                            rows={6}
                            value={formData.answer}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={getInputClassName('answer')}
                            placeholder="Enter the answer"
                        />
                        {touched.answer && errors.answer && (
                            <p className="text-red-500 text-xs mt-1">{errors.answer}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.answer.length}/1000 characters
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading || Object.keys(errors).length > 0}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : (editingFAQ ? 'Update FAQ' : 'Add FAQ')}
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

export default FAQForm;