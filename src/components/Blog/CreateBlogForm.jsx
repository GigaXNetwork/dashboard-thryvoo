import React, { useEffect, useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

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
    author_image: blog?.author_image || '',
    type: 'blog'
  });

  const [formData, setFormData] = useState(getInitialState());
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // File states
  const [authorImageFile, setAuthorImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [featuredImageFile, setFeaturedImageFile] = useState(null);
  const [metaPhotoFile, setMetaPhotoFile] = useState(null);

  // Error states
  const [galleryUploadError, setGalleryUploadError] = useState('');
  const [authorImageError, setAuthorImageError] = useState('');
  const [featuredUploadError, setFeaturedUploadError] = useState('');
  const [metaPhotoError, setMetaPhotoError] = useState('');

  // Refs
  const titleRef = useRef(null);
  const authorRef = useRef(null);
  const categoryRef = useRef(null);
  const descriptionRef = useRef(null);
  const contentRef = useRef(null);
  const tagRef = useRef(null);
  const featuredInputRef = useRef(null);
  const authorImageInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const metaPhotoInputRef = useRef(null);
  const metaTitleRef = useRef(null);
  const metaDescriptionRef = useRef(null);
  const metaTagsRef = useRef(null);

  useEffect(() => {
    if (isEditMode) {
      setFormData(getInitialState());
    }
  }, [blog]);

  // Character limits
  const DESCRIPTION_MAX_LENGTH = 160;
  const META_DESCRIPTION_MAX_LENGTH = 160;

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

  const categories = [
    'technology', 'business', 'health', 'entertainment', 'sports', 'science'
  ];

  const authToken = getAuthToken();
  if (!authToken) {
    alert('Authentication token not found. Please log in again.');
    return null;
  }

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

  // Character count validation for descriptions
  const validateDescription = (field, value, maxLength) => {
    if (value.length > maxLength) {
      setErrors(prev => ({
        ...prev,
        [field]: `${field === 'b_description' ? 'Description' : 'Meta Description'} cannot exceed ${maxLength} characters`
      }));
      return false;
    }
    return true;
  };

  const handleDescriptionChange = (field, value) => {
    const maxLength = field === 'b_description' ? DESCRIPTION_MAX_LENGTH : META_DESCRIPTION_MAX_LENGTH;

    handleInputChange(field, value);
    validateDescription(field, value, maxLength);
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


  const handleFileUpload = (file, setFileFunction, setErrorFunction, previewField) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorFunction("Please upload a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorFunction("Image must be less than 5MB.");
      return;
    }

    setFileFunction(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      handleInputChange(previewField, reader.result);
      setErrorFunction('');
    };
    reader.readAsDataURL(file);
  };


  const handleFeaturedFileChange = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file, setFeaturedImageFile, setFeaturedUploadError, 'b_image');
  };

  const handleAuthorImageChange = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file, setAuthorImageFile, setAuthorImageError, 'author_image');
  };

  const handleMetaPhotoChange = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file, setMetaPhotoFile, setMetaPhotoError, 'meta_photo');
  };

  const handleGalleryFileChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (galleryFiles.length + files.length > 10) {
      setGalleryUploadError("Maximum 10 gallery images allowed.");
      return;
    }

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setGalleryUploadError("Only image files are allowed in gallery.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setGalleryUploadError("Each gallery image must be ≤ 5MB.");
        return;
      }
    }

    setGalleryFiles(prev => [...prev, ...files].slice(0, 10));

    Promise.all(files.map(file => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    }))).then(base64Images => {
      setFormData(prev => ({
        ...prev,
        b_gallery: [...prev.b_gallery, ...base64Images].slice(0, 10)
      }));
      setGalleryUploadError('');
    });
  };

  // Remove functions
  const removeFeaturedImage = () => {
    handleInputChange('b_image', '');
    setFeaturedImageFile(null);
    setFeaturedUploadError('');
    if (featuredInputRef.current) featuredInputRef.current.value = '';
  };

  const removeAuthorImage = () => {
    handleInputChange('author_image', '');
    setAuthorImageFile(null);
    setAuthorImageError('');
    if (authorImageInputRef.current) authorImageInputRef.current.value = '';
  };

  const removeMetaPhoto = () => {
    handleInputChange('meta_photo', '');
    setMetaPhotoFile(null);
    setMetaPhotoError('');
    if (metaPhotoInputRef.current) metaPhotoInputRef.current.value = '';
  };

  const removeGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      b_gallery: prev.b_gallery.filter((_, i) => i !== index)
    }));
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      b_tags: prev.b_tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // const validateForm = () => {
  //   const newErrors = {};

  //   if (!formData.b_title.trim()) newErrors.b_title = 'Title is required';
  //   if (!formData.b_content.trim()) newErrors.b_content = 'Content is required';
  //   if (!formData.b_author.trim()) newErrors.b_author = 'Author is required';

  //   if (!formData.b_description.trim()) {
  //     newErrors.b_description = 'Description is required';
  //   } else if (formData.b_description.length > DESCRIPTION_MAX_LENGTH) {
  //     newErrors.b_description = `Description cannot exceed ${DESCRIPTION_MAX_LENGTH} characters`;
  //   }

  //   if (!formData.b_category.trim() || !categories.includes(formData.b_category)) {
  //     newErrors.b_category = 'Category is required and must be valid';
  //   }
  //   if (!formData.meta_title.trim()) newErrors.meta_title = 'Meta Title is required';

  //   if (!formData.meta_description.trim()) {
  //     newErrors.meta_description = 'Meta Description is required';
  //   } else if (formData.meta_description.length > META_DESCRIPTION_MAX_LENGTH) {
  //     newErrors.meta_description = `Meta Description cannot exceed ${META_DESCRIPTION_MAX_LENGTH} characters`;
  //   }

  //   if (!formData.meta_tag.trim()) newErrors.meta_tag = 'Meta Tags are required';
  //   if (formData.b_tags.length === 0) newErrors.b_tags = 'At least one tag is required';

  //   // Enhanced file validation - check both formData and file states
  //   const hasFeaturedImage = formData.b_image || featuredImageFile;
  //   const hasMetaPhoto = formData.meta_photo || metaPhotoFile;
  //   const hasAuthorImage = formData.author_image || authorImageFile;
  //   const hasGallery = formData.b_gallery.length > 0 || galleryFiles.length > 0;

  //   if (!hasFeaturedImage) newErrors.b_image = 'Featured Image is required';
  //   if (!hasMetaPhoto) newErrors.meta_photo = 'Meta Photo is required';
  //   if (!hasAuthorImage) newErrors.author_image = 'Author Image is required';
  //   if (!hasGallery) newErrors.b_gallery = 'At least one gallery image is required';

  //   setErrors(newErrors);

  //   const firstErrorKey = Object.keys(newErrors)[0];
  //   if (firstErrorKey) {
  //     const fieldMap = {
  //       b_title: titleRef,
  //       b_author: authorRef,
  //       b_category: categoryRef,
  //       b_description: descriptionRef,
  //       b_content: contentRef,
  //       b_tags: tagRef,
  //       meta_title: metaTitleRef,
  //       meta_description: metaDescriptionRef,
  //       meta_tag: metaTagsRef,
  //       b_image: featuredInputRef,
  //       meta_photo: metaPhotoInputRef,
  //       author_image: authorImageInputRef,
  //       b_gallery: galleryInputRef,
  //     };

  //     const ref = fieldMap[firstErrorKey];
  //     if (ref?.current) {
  //       setTimeout(() => {
  //         if (firstErrorKey === "b_content") {
  //           ref.current.getEditor().root.scrollIntoView({ behavior: "smooth", block: "center" });
  //           ref.current.getEditor().focus();
  //         } else {
  //           ref.current.scrollIntoView({
  //             behavior: "smooth",
  //             block: "center",
  //             inline: "nearest"
  //           });
  //           ref.current.focus?.();
  //         }
  //       }, 100);
  //     }
  //   }

  //   return Object.keys(newErrors).length === 0;
  // };


    const validateForm = () => {
    const newErrors = {};

    if (!formData.b_title.trim()) newErrors.b_title = 'Title is required';
    if (!formData.b_content.trim()) newErrors.b_content = 'Content is required';
    if (!formData.b_author.trim()) newErrors.b_author = 'Author is required';

    if (!formData.b_description.trim()) {
      newErrors.b_description = 'Description is required';
    } else if (formData.b_description.length > DESCRIPTION_MAX_LENGTH) {
      newErrors.b_description = `Description cannot exceed ${DESCRIPTION_MAX_LENGTH} characters`;
    }

    if (!formData.b_category.trim() || !categories.includes(formData.b_category)) {
      newErrors.b_category = 'Category is required and must be valid';
    }
    if (!formData.meta_title.trim()) newErrors.meta_title = 'Meta Title is required';

    if (!formData.meta_description.trim()) {
      newErrors.meta_description = 'Meta Description is required';
    } else if (formData.meta_description.length > META_DESCRIPTION_MAX_LENGTH) {
      newErrors.meta_description = `Meta Description cannot exceed ${META_DESCRIPTION_MAX_LENGTH} characters`;
    }

    if (!formData.meta_tag.trim()) newErrors.meta_tag = 'Meta Tags are required';
    if (formData.b_tags.length === 0) newErrors.b_tags = 'At least one tag is required';
    
    // Enhanced file validation - check both formData and file states
    const hasFeaturedImage = formData.b_image || featuredImageFile;
    const hasMetaPhoto = formData.meta_photo || metaPhotoFile;
    const hasAuthorImage = formData.author_image || authorImageFile;
    const hasGallery = formData.b_gallery.length > 0 || galleryFiles.length > 0;

    if (!hasFeaturedImage) newErrors.b_image = 'Featured Image is required';
    if (!hasMetaPhoto) newErrors.meta_photo = 'Meta Photo is required';
    
    // Make author image required only for new blogs, not for edits
    if (!isEditMode && !hasAuthorImage) {
      newErrors.author_image = 'Author Image is required';
    }
    
    if (!hasGallery) newErrors.b_gallery = 'At least one gallery image is required';

    setErrors(newErrors);
    console.log("newErrors", newErrors)

    const firstErrorKey = Object.keys(newErrors)[0];
    if (firstErrorKey) {
      const fieldMap = {
        b_title: titleRef,
        b_author: authorRef,
        b_category: categoryRef,
        b_description: descriptionRef,
        b_content: contentRef,
        b_tags: tagRef,
        meta_title: metaTitleRef,
        meta_description: metaDescriptionRef,
        meta_tag: metaTagsRef,
        b_image: featuredInputRef,
        meta_photo: metaPhotoInputRef,
        author_image: authorImageInputRef,
        b_gallery: galleryInputRef,
      };

      const ref = fieldMap[firstErrorKey];
      if (ref?.current) {
        // Use setTimeout to ensure the scroll happens after state update
        setTimeout(() => {
          if (firstErrorKey === "b_content") {
            ref.current.getEditor().root.scrollIntoView({ behavior: "smooth", block: "center" });
            ref.current.getEditor().focus();
          } else {
            ref.current.scrollIntoView({ 
              behavior: "smooth", 
              block: "center",
              inline: "nearest"
            });
            ref.current.focus?.(); // Safe focus call
          }
        }, 100);
      }
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();

      const textFields = {
        b_title: 'b_title',
        b_content: 'b_content',
        b_author: 'b_author',
        b_description: 'b_description',
        b_category: 'b_category',
        meta_title: 'meta_title',
        meta_description: 'meta_description',
        meta_tag: 'meta_tag',
        type: 'type'
      };

      Object.entries(textFields).forEach(([formField, backendField]) => {
        formDataToSend.append(backendField, formData[formField]);
      });

      // Append tags
      formData.b_tags.forEach(tag => formDataToSend.append('b_tags[]', tag));

      // Append files
      const fileMappings = [
        {
          file: featuredImageFile,
          backendField: 'b_image',
          existing: formData.b_image
        },
        {
          file: authorImageFile,
          backendField: 'author_image',
          existing: formData.author_image
        },
        {
          file: metaPhotoFile,
          backendField: 'meta_photo',
          existing: formData.meta_photo
        }
      ];

      fileMappings.forEach(({ file, backendField, existing }) => {
        if (file instanceof File) {
          formDataToSend.append(backendField, file);
        } else if (existing && !existing.startsWith('data:image')) {
          formDataToSend.append(backendField, existing);
        }
      });

      // Handle gallery files
      if (galleryFiles.length > 0) {
        galleryFiles.forEach(file => {
          if (file instanceof File) {
            formDataToSend.append('b_gallery', file);
          }
        });
      } else if (formData.b_gallery.length > 0) {
        formData.b_gallery.forEach(url => {
          if (!url.startsWith('data:image')) {
            formDataToSend.append('b_gallery[]', url);
          }
        });
      }

      const endpoint = isEditMode
        ? `${import.meta.env.VITE_API_URL}/api/blog/${blog.id}`
        : `${import.meta.env.VITE_API_URL}/api/blog/upload`;

      const method = isEditMode ? 'PATCH' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': getAuthToken()
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (onSuccess) onSuccess(result);
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} blog`);
    } finally {
      setLoading(false);
    }
  };

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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  ref={titleRef}
                  type="text"
                  value={formData.b_title}
                  onChange={(e) => handleInputChange('b_title', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none focus:border-transparent transition-all ${errors.b_title ? 'border-red-300' : 'border-gray-200'}`}
                  placeholder="Enter blog title"
                />
                {errors.b_title && (
                  <p className="mt-1 text-sm text-red-600">{errors.b_title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  ref={categoryRef}
                  value={formData.b_category}
                  onChange={(e) => handleInputChange('b_category', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none focus:border-transparent transition-all ${errors.b_category ? 'border-red-300' : 'border-gray-200'}`}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option
                      className='text-sm'
                      key={category}
                      value={category}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.b_category && (
                  <p className="mt-1 text-sm text-red-600">{errors.b_category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
                <input
                  ref={authorRef}
                  type="text"
                  value={formData.b_author}
                  onChange={(e) => handleInputChange('b_author', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none focus:border-transparent transition-all ${errors.b_author ? 'border-red-300' : 'border-gray-200'}`}
                  placeholder="Author name"
                />
                {errors.b_author && (
                  <p className="mt-1 text-sm text-red-600">{errors.b_author}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Author Image *</label>
                <input
                  ref={authorImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAuthorImageChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none focus:border-transparent transition-all ${errors.author_image ? 'border-red-300' : 'border-gray-200'
                    }`}
                />
                {errors.author_image && (
                  <p className="mt-1 text-sm text-red-600">{errors.author_image}</p>
                )}
                {authorImageError && (
                  <p className="mt-1 text-sm text-red-600">{authorImageError}</p>
                )}
                {(formData.author_image && formData.author_image.startsWith('data:image')) && (
                  <div className="mt-4 relative inline-block">
                    <img
                      src={formData.author_image}
                      alt="author"
                      className="h-24 w-24 object-cover rounded-lg border border-gray-200 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={removeAuthorImage}
                      className="absolute top-0 right-0 -mr-2 -mt-2 bg-white rounded-full p-1 shadow-md hover:text-red-600 transition-colors"
                      aria-label="Remove author image"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                  <span className="text-gray-500 ml-2">
                    ({formData.b_description.length}/{DESCRIPTION_MAX_LENGTH} characters)
                  </span>
                </label>
                <textarea
                  ref={descriptionRef}
                  value={formData.b_description}
                  onChange={(e) => handleDescriptionChange('b_description', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none focus:border-transparent transition-all resize-none ${errors.b_description ? 'border-red-300' : 'border-gray-200'
                    } ${formData.b_description.length > DESCRIPTION_MAX_LENGTH ? 'border-red-300' : ''
                    }`}
                  placeholder="Brief description of the blog post"
                />
                {errors.b_description && (
                  <p className="mt-1 text-sm text-red-600">{errors.b_description}</p>
                )}
                {formData.b_description.length > DESCRIPTION_MAX_LENGTH && !errors.b_description && (
                  <p className="mt-1 text-sm text-red-600">
                    Description cannot exceed {DESCRIPTION_MAX_LENGTH} characters
                  </p>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image *
                </label>
                <input
                  ref={featuredInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFeaturedFileChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none focus:border-transparent transition-all ${errors.b_image ? 'border-red-300' : 'border-gray-200'
                    }`}
                />
                {(errors.b_image || featuredUploadError) && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.b_image || featuredUploadError}
                  </p>
                )}
                {(formData.b_image && formData.b_image.startsWith('data:image')) && (
                  <div className="mt-4 relative inline-block">
                    <img
                      src={formData.b_image}
                      alt="featured"
                      className="h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={removeFeaturedImage}
                      className="absolute top-0 right-0 -mr-2 -mt-2 bg-white rounded-full p-1 shadow-md hover:text-red-600 transition-colors"
                      aria-label="Remove featured image"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Gallery Images * <span className="text-gray-500 font-normal">(Max 10 images, each ≤ 5MB)</span>
                </label>
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  multiple
                  onChange={handleGalleryFileChange}
                  disabled={uploadingGallery || galleryFiles.length >= 10}
                  className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none ${errors.b_gallery ? 'border-red-300' : 'border-gray-200'
                    }`}
                />
                {errors.b_gallery && (
                  <p className="mt-2 text-sm text-red-600">{errors.b_gallery}</p>
                )}
                {galleryUploadError && (
                  <p className="mt-2 text-sm text-red-600">{galleryUploadError}</p>
                )}
                {uploadingGallery && (
                  <p className="mt-2 text-sm text-blue-600">Uploading...</p>
                )}
                <div className="my-2">
                  {galleryFiles.length > 0 && (
                    <span>{galleryFiles.length} image{galleryFiles.length > 1 ? 's' : ''} selected</span>
                  )}
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
                          onClick={() => removeGalleryImage(index)}
                          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          aria-label="Remove gallery image"
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none focus:border-transparent transition-all ${errors.b_tags ? 'border-red-300' : 'border-gray-200'}`}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
                  className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${errors.meta_title ? 'border-red-300' : 'border-gray-200'}`}
                  placeholder="SEO title for search engines"
                />
                {errors.meta_title && (
                  <p className="mt-1 text-sm text-red-600">{errors.meta_title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Photo *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  ref={metaPhotoInputRef}
                  onChange={handleMetaPhotoChange}
                  className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${errors.meta_photo ? 'border-red-300' : 'border-gray-200'
                    }`}
                />
                {errors.meta_photo && (
                  <p className="mt-1 text-sm text-red-600">{errors.meta_photo}</p>
                )}
                {metaPhotoError && <p className="mt-1 text-sm text-red-600">{metaPhotoError}</p>}
                {formData.meta_photo && formData.meta_photo.startsWith('data:image') && (
                  <div className="mt-4 relative inline-block">
                    <img
                      src={formData.meta_photo}
                      alt="meta_photo"
                      className="h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={removeMetaPhoto}
                      className="absolute top-0 right-0 -mr-2 -mt-2 bg-white rounded-full p-1 shadow-md hover:text-red-600 transition-colors"
                      aria-label="Remove meta photo"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description *
                  <span className="text-gray-500 ml-2">
                    ({formData.meta_description.length}/{META_DESCRIPTION_MAX_LENGTH} characters)
                  </span>
                </label>
                <textarea
                  ref={metaDescriptionRef}
                  value={formData.meta_description}
                  onChange={(e) => handleDescriptionChange('meta_description', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${errors.meta_description ? 'border-red-300' : 'border-gray-200'
                    } ${formData.meta_description.length > META_DESCRIPTION_MAX_LENGTH ? 'border-red-300' : ''
                    }`}
                  placeholder="SEO description for search engines (150-160 characters recommended)"
                />
                {errors.meta_description && (
                  <p className="mt-1 text-sm text-red-600">{errors.meta_description}</p>
                )}
                {formData.meta_description.length > META_DESCRIPTION_MAX_LENGTH && !errors.meta_description && (
                  <p className="mt-1 text-sm text-red-600">
                    Meta Description cannot exceed {META_DESCRIPTION_MAX_LENGTH} characters
                  </p>
                )}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Tags *</label>
                <input
                  ref={metaTagsRef}
                  type="text"
                  value={formData.meta_tag}
                  onChange={(e) => handleInputChange('meta_tag', e.target.value)}
                  className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${errors.meta_tag ? 'border-red-300' : 'border-gray-200'}`}
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