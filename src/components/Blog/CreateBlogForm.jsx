import React, { useEffect, useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import Cookies from 'js-cookie';

export const getAuthToken = () => {
  const tokenNames = ['authToken', 'token', 'jwt', 'access_token'];
  for (const name of tokenNames) {
    const token = Cookies.get(name);
    if (token) return token;
  }
  return null;
};

export const CreateBlogForm = ({ onBack, onSuccess, blog }) => {

  const isEditMode = Boolean(blog && blog.id);

  const getInitialState = () => ({
    b_title: blog?.b_title || '',
    b_content: blog?.b_content || '',
    b_author: blog?.b_author || '',
    b_description: blog?.b_description || '',
    b_image: blog?.b_image || '',
    b_category: blog?.b_category || '',
    b_tags: blog?.b_tags || [],
    b_gallery: blog?.b_gallery || [],
    meta_tag: blog?.meta_tag || '',
    meta_title: blog?.meta_title || '',
    meta_description: blog?.meta_description || '',
    meta_photo: blog?.meta_photo || '',
    type: 'blog'
  });

  const [formData, setFormData] = useState(getInitialState());
  const [tagInput, setTagInput] = useState('');
  const [galleryInput, setGalleryInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const titleRef = useRef(null);
  const authorRef = useRef(null);
  const categoryRef = useRef(null);
  const descriptionRef = useRef(null);
  const contentRef = useRef(null);
  const tagRef = useRef(null);
  const imageRef = useRef(null);
  const metaTitleRef = useRef(null);
  const metaPhotoUrlRef = useRef(null);
  const metaDescriptionRef = useRef(null);
  const metaTagsRef = useRef(null);

  useEffect(() => {
    if (isEditMode) {
      setFormData(getInitialState());
    }
  }, [blog]);

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'indent',
    'align', 'blockquote', 'code-block', 'link', 'image', 'video'
  ];

  // Lowercase categories for strict API validation
  const categories = [
    'technology', 'business', 'health', 'entertainment', 'sports', 'science'
  ];

  const authToken = getAuthToken();
  if (!authToken) {
    alert('Authentication token not found. Please log in again.');
    return null;
  }

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.b_tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        b_tags: [...prev.b_tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      b_tags: prev.b_tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addGalleryImage = () => {
    if (galleryInput.trim() && !formData.b_gallery.includes(galleryInput.trim())) {
      setFormData(prev => ({
        ...prev,
        b_gallery: [...prev.b_gallery, galleryInput.trim()]
      }));
      setGalleryInput('');
    }
  };

  const removeGalleryImage = (imageToRemove) => {
    setFormData(prev => ({
      ...prev,
      b_gallery: prev.b_gallery.filter(image => image !== imageToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.b_title.trim()) {
      newErrors.b_title = 'Title is required';
    }
    if (!formData.b_content.trim()) {
      newErrors.b_content = 'Content is required';
    } else if (formData.b_content.replace(/<[^>]+>/g, '').length < 5000) {
      newErrors.b_content = 'Blog content should be at least 5000 characters';
    }
    if (!formData.b_author.trim()) {
      newErrors.b_author = 'Author is required';
    }
    if (!formData.b_description.trim()) {
      newErrors.b_description = 'Description is required';
    }
    if (!formData.b_category.trim() || !categories.includes(formData.b_category)) {
      newErrors.b_category = 'Category is required and must be valid';
    }
    if (formData.b_gallery.some(img => typeof img !== 'string' || !img.trim())) {
      newErrors.b_gallery = 'Gallery images must be valid URLs';
    }
    if (!formData.meta_title.trim()) {
      newErrors.meta_title = 'Meta  is required';
    }
    if (!formData.meta_photo.trim()) {
      newErrors.meta_photo = 'Meta Photo URL is required';
    }
    else if (!isValidUrl(formData.meta_photo)) {
      newErrors.meta_photo = 'Meta Photo URL must be a valid URL';
    }
    if (!formData.meta_description.trim()) {
      newErrors.meta_description = 'Meta Description is required';
    }
    if (!formData.meta_tag.trim()) {
      newErrors.meta_tag = 'Meta Tags are required';
    }
    if (!formData.b_image.trim()) {
      newErrors.b_image = 'Featured Image URL is required';
    } else if (!isValidUrl(formData.b_image)) {
      newErrors.b_image = 'Featured Image URL must be a valid URL';
    }

    if (formData.b_tags.length === 0) {
      newErrors.b_tags = 'At least one tag is required';
    }


    setErrors(newErrors);

    const firstErrorKey = Object.keys(newErrors)[0];
    if (firstErrorKey) {
      const fieldMap = {
        b_title: titleRef,
        b_author: authorRef,
        b_category: categoryRef,
        b_description: descriptionRef,
        b_content: contentRef,
        b_image: imageRef,
        b_tags: tagRef,
        meta_title: metaTitleRef,
        meta_photo: metaPhotoUrlRef,
        meta_description: metaDescriptionRef,
        meta_tag: metaTagsRef,
      };

      const ref = fieldMap[firstErrorKey];
      if (ref?.current) {
        if (firstErrorKey === "b_content") {
          ref.current.getEditor().root.scrollIntoView({ behavior: "smooth", block: "center" });
          ref.current.getEditor().focus();
        } else {
          ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
          // ref.current.getEditor().focus();
        }
      }
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        ...formData,
        b_category: formData.b_category.toLowerCase(),
        b_gallery: formData.b_gallery.filter(url => typeof url === 'string' && url.trim()),
      };

      const endpoint = isEditMode
        ? `https://api.thryvoo.com/api/blog/${blog.id}`   // update endpoint
        : 'https://api.thryvoo.com/api/blog/upload';

      const method = isEditMode ? 'PATCH' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${getAuthToken()}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (onSuccess) onSuccess(result);
    } catch (err) {
      alert(`Failed to ${isEditMode ? 'update' : 'create'} blog: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (errors.b_gallery) {
      const timer = setTimeout(() => {
        setErrors(prev => ({ ...prev, b_gallery: '' }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors.b_gallery]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {blog ? 'Edit Blog' : 'Create New Blog'}
            </h1>
            <p className="text-gray-600 mt-1">
              {blog ? 'Update the details of your blog post' : 'Fill in the details to create a new blog post'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  ref={titleRef}
                  type="text"
                  value={formData.b_title}
                  onChange={(e) => handleInputChange('b_title', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-violet-500 outline-none focus:border-transparent transition-all ${errors.b_title ? 'border-red-300' : 'border-gray-200'}`}
                  placeholder="Enter blog title"
                />
                {errors.b_title && (
                  <p className="mt-1 text-sm text-red-600">{errors.b_title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
                <input
                  ref={authorRef}
                  type="text"
                  value={formData.b_author}
                  onChange={(e) => handleInputChange('b_author', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-violet-500 outline-none focus:border-transparent transition-all ${errors.b_author ? 'border-red-300' : 'border-gray-200'}`}
                  placeholder="Author name"
                />
                {errors.b_author && (
                  <p className="mt-1 text-sm text-red-600">{errors.b_author}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  ref={categoryRef}
                  value={formData.b_category}
                  onChange={(e) => handleInputChange('b_category', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-violet-500 outline-none focus:border-transparent transition-all ${errors.b_category ? 'border-red-300' : 'border-gray-200'}`}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option
                      className='text-sm'
                      key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
                  ))}
                </select>
                {errors.b_category && (
                  <p className="mt-1 text-sm text-red-600">{errors.b_category}</p>
                )}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  ref={descriptionRef}
                  value={formData.b_description}
                  onChange={(e) => handleInputChange('b_description', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-violet-500 outline-none focus:border-transparent transition-all resize-none ${errors.b_description ? 'border-red-300' : 'border-gray-200'}`}
                  placeholder="Brief description of the blog post"
                />
                {errors.b_description && (
                  <p className="mt-1 text-sm text-red-600">{errors.b_description}</p>
                )}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                <div className={`border rounded-lg ${errors.b_content ? 'border-red-300' : 'border-gray-200'} p-1 min-h-[400px]`}>
                  <ReactQuill
                    ref={contentRef}
                    theme="snow"
                    value={formData.b_content}
                    onChange={(value) => handleInputChange('b_content', value)}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Write your blog content here..."
                    className='h-[345px] bg-white'
                  />
                </div>
                {errors.b_content && (
                  <p className="mt-1 text-sm text-red-600">{errors.b_content}</p>
                )}
              </div>
            </div>
          </div>

          {/* Content Preview */}
          {formData.b_content && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Content Preview</h2>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: formData.b_content }}
              />
            </div>
          )}

          {/* Media */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Media</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image URL</label>
                <input
                  type="url"
                  value={formData.b_image}
                  onChange={(e) => handleInputChange('b_image', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-violet-500 outline-none focus:border-transparent transition-all ${errors.b_image ? 'border-red-300' : 'border-gray-200'}`}
                  placeholder="https://example.com/image.jpg"
                />
                {errors.b_image && (
                  <p className="mt-1 text-sm text-red-600">{errors.b_image}</p>
                )}
              </div>

              {/* Gallery Images as URLs ONLY */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Gallery Images <span className="text-gray-500 font-normal">(Max 5 URLs)</span>
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="url"
                    value={galleryInput}
                    onChange={(e) => setGalleryInput(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all outline-none"
                    placeholder="Paste image URL"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGalleryImage())}
                  />

                  <button
                    type="button"
                    onClick={addGalleryImage}
                    className="px-4 py-3 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {formData.b_gallery.length > 0 && (
                  <div className="flex flex-wrap gap-4 mt-4">
                    {formData.b_gallery.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`gallery-${index}`}
                          className="h-20 w-20 object-cover rounded-lg border border-gray-200 shadow-sm transition-transform group-hover:scale-105"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(url)}
                          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          aria-label="Remove image"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Tags</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Add Tags *</label>
              <div className="flex gap-2 mb-3">
                <input
                  ref={tagRef}
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-violet-500 outline-none focus:border-transparent transition-all ${errors.b_tags ? 'border-red-300' : 'border-gray-200'}`}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-3 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {errors.b_tags && (
                <p className="mt-2 text-sm text-red-600">{errors.b_tags}</p>
              )}
              {formData.b_tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.b_tags.map((tag, index) => (
                    <div key={index} className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SEO Meta Data */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">SEO Meta Data</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title *</label>
                <input
                  ref={metaTitleRef}
                  type="text"
                  value={formData.meta_title}
                  onChange={(e) => handleInputChange('meta_title', e.target.value)}
                  className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all outline-none ${errors.meta_title ? 'border-red-300' : 'border-gray-200'}`}
                  placeholder="SEO title for search engines"
                />
                {errors.meta_title && (
                  <p className="mt-1 text-sm text-red-600">{errors.meta_title}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Photo URL *</label>
                <input
                  ref={metaPhotoUrlRef}
                  type="url"
                  value={formData.meta_photo}
                  onChange={(e) => handleInputChange('meta_photo', e.target.value)}
                  className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all outline-none ${errors.meta_photo ? 'border-red-300' : 'border-gray-200'}`}
                  placeholder="https://example.com/meta-image.jpg"
                />
                {errors.meta_photo && (
                  <p className="mt-1 text-sm text-red-600">{errors.meta_photo}</p>
                )}
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description *</label>
                <textarea
                  ref={metaDescriptionRef}
                  value={formData.meta_description}
                  onChange={(e) => handleInputChange('meta_description', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all outline-none ${errors.meta_description ? 'border-red-300' : 'border-gray-200'}`}
                  placeholder="SEO description for search engines (150-160 characters recommended)"
                />
                {errors.meta_description && (
                  <p className="mt-1 text-sm text-red-600">{errors.meta_description}</p>
                )}
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Tags *</label>
                <input
                  ref={metaTagsRef}
                  type="text"
                  value={formData.meta_tag}
                  onChange={(e) => handleInputChange('meta_tag', e.target.value)}
                  className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all outline-none ${errors.meta_tag ? 'border-red-300' : 'border-gray-200'}`}
                  placeholder="Comma-separated meta tags"
                />
                {errors.meta_tag && (
                  <p className="mt-1 text-sm text-red-600">{errors.meta_tag}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {isEditMode ? 'Update Blog' : 'Create Blog'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
