// import React, { useState, useEffect } from 'react';
// import { X, Image as ImageIcon, Link as LinkIcon, Upload, Trash2, AlertCircle } from "lucide-react";

// const ItemModal = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   loading,
//   category,
//   error
// }) => {
//   const [mediaType, setMediaType] = useState('none');
//   const [image, setImage] = useState('');
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState('');
//   const [url, setUrl] = useState('');
//   const [errors, setErrors] = useState({});
//   const [submitError, setSubmitError] = useState('');

//   useEffect(() => {
//     // Reset form when modal opens
//     setMediaType('none');
//     setImage('');
//     setImagePreview('');
//     setUrl('');
//     setImageFile(null);
//     setErrors({});
//     setSubmitError('');
//   }, [isOpen]);

//   // Clear submit error when user changes form
//   useEffect(() => {
//     if (mediaType !== 'none' || image || url) {
//       setSubmitError('');
//     }
//   }, [mediaType, image, url]);

//   const validateForm = () => {
//     const newErrors = {};

//     if (mediaType === 'none') {
//       newErrors.mediaType = 'Please select either image or URL';
//     } else if (mediaType === 'image' && !image) {
//       newErrors.image = 'Please upload an image';
//     } else if (mediaType === 'url' && !url.trim()) {
//       newErrors.url = 'URL is required';
//     } else if (mediaType === 'url' && url.trim() && !isValidUrl(url)) {
//       newErrors.url = 'Please enter a valid URL (e.g., https://example.com)';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const isValidUrl = (string) => {
//     try {
//       const url = new URL(string);
//       return url.protocol === 'http:' || url.protocol === 'https:';
//     } catch (_) {
//       return false;
//     }
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (!file.type.startsWith('image/')) {
//         setErrors({ ...errors, image: 'Please select an image file (PNG, JPG, JPEG, GIF)' });
//         return;
//       }

//       if (file.size > 5 * 1024 * 1024) {
//         setErrors({ ...errors, image: 'Image size should be less than 5MB' });
//         return;
//       }

//       setImageFile(file);
//       setImage(file.name);
      
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setImagePreview(e.target.result);
//       };
//       reader.readAsDataURL(file);

//       setErrors({ ...errors, image: '', mediaType: '' });
//     }
//   };

//   const handleUrlChange = (value) => {
//     setUrl(value);
//     if (value.trim()) {
//       setErrors({ ...errors, url: '' });
//     }
//   };

//   const removeImage = () => {
//     setImage('');
//     setImagePreview('');
//     setImageFile(null);
//     setMediaType('none');
//   };

//   const handleMediaTypeChange = (type) => {
//     setMediaType(type);
//     setErrors({ ...errors, mediaType: '', image: '', url: '' });
    
//     if (type === 'image') {
//       setUrl('');
//     } else if (type === 'url') {
//       setImage('');
//       setImagePreview('');
//       setImageFile(null);
//     }
//   };

//   const handleUrlBlur = () => {
//     if (mediaType === 'url' && url.trim() && !isValidUrl(url)) {
//       setErrors({ ...errors, url: 'Please enter a valid URL (e.g., https://example.com)' });
//     }
//   };

//   const handleSubmitForm = async (e) => {
//     e.preventDefault();
//     setSubmitError('');
    
//     if (!validateForm()) {
//       return;
//     }

//     try {
//       let payload;

//       if (mediaType === 'image' && imageFile) {
//         const formData = new FormData();
//         formData.append('image', imageFile);
//         formData.append('type', 'image');
//         formData.append('name', category?.name || '');
//         formData.append('url', 'url');
//         payload = formData;
//       } else if (mediaType === 'url') {
//         payload = {
//           url: url.trim(),
//           type: 'video',
//           name: category?.name || ''
//         };
//       }      
//       await onSubmit(payload);
      
//     } catch (err) {
//       console.error('Error in form submission:', err);
//       setSubmitError(err.message || 'Failed to add item. Please try again.');
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-bold">
//             Add Item to {category?.name}
//           </h2>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-800">
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Error Display */}
//         {submitError && (
//           <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700">
//             <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
//             <div className="flex-1">
//               <p className="font-medium">Failed to add item</p>
//               <p className="text-sm mt-1">{submitError}</p>
//             </div>
//             <button 
//               onClick={() => setSubmitError('')} 
//               className="text-red-500 hover:text-red-700"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           </div>
//         )}

//         <form onSubmit={handleSubmitForm} className="space-y-3">
//           {/* Category Name Display (Read-only) */}
//           <div>
//             <label className="text-gray-600 text-sm font-medium mb-2 block">
//               Category Name
//             </label>
//             <div className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-900 font-medium">
//               {category?.name || 'No category selected'}
//             </div>
//             <p className="text-xs text-gray-500 mt-1">
//               This will be included in the item payload
//             </p>
//           </div>

//           {/* Media Type Selection */}
//           <div>
//             <label className="text-gray-600 text-sm font-medium mb-3 block">
//               Select Media Type *
//             </label>
            
//             <div className="grid grid-cols-2 gap-3 mb-4">
//               <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
//                 mediaType === 'image' 
//                   ? 'border-blue-500 bg-blue-50' 
//                   : 'border-gray-200 hover:border-gray-300'
//               }`}>
//                 <input
//                   type="radio"
//                   name="mediaType"
//                   value="image"
//                   checked={mediaType === 'image'}
//                   onChange={() => handleMediaTypeChange('image')}
//                   className="text-blue-600 focus:ring-blue-500"
//                 />
//                 <div className="ml-3 flex items-center gap-2">
//                   <ImageIcon className="w-5 h-5 text-gray-700" />
//                   <span className="font-medium">Image</span>
//                 </div>
//               </label>

//               <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
//                 mediaType === 'url' 
//                   ? 'border-blue-500 bg-blue-50' 
//                   : 'border-gray-200 hover:border-gray-300'
//               }`}>
//                 <input
//                   type="radio"
//                   name="mediaType"
//                   value="url"
//                   checked={mediaType === 'url'}
//                   onChange={() => handleMediaTypeChange('url')}
//                   className="text-blue-600 focus:ring-blue-500"
//                 />
//                 <div className="ml-3 flex items-center gap-2">
//                   <LinkIcon className="w-5 h-5 text-gray-700" />
//                   <span className="font-medium">Video URL</span>
//                 </div>
//               </label>
//             </div>

//             {errors.mediaType && (
//               <div className="mt-2 flex items-center gap-2 text-red-500 text-sm">
//                 <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                 </svg>
//                 <span>{errors.mediaType}</span>
//               </div>
//             )}
//           </div>

//           {/* Image Upload Section */}
//           {mediaType === 'image' && (
//             <div className="animate-fade-in">
//               <label className="text-gray-600 text-sm font-medium mb-2 block">
//                 Upload Image *
//               </label>
              
//               {imagePreview ? (
//                 <div className="border rounded-lg p-4 bg-gray-50">
//                   <div className="relative">
//                     <img
//                       src={imagePreview}
//                       alt="Preview"
//                       className="w-full h-48 object-cover rounded-lg"
//                     />
//                     <button
//                       type="button"
//                       onClick={removeImage}
//                       className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                   <p className="text-sm text-gray-600 mt-2 text-center truncate">
//                     {image}
//                   </p>
//                 </div>
//               ) : (
//                 <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
//                   <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                     <Upload className="w-8 h-8 text-gray-400 mb-2" />
//                     <p className="text-sm text-gray-500">Click to upload image</p>
//                     <p className="text-xs text-gray-400">PNG, JPG, GIF (Max 5MB)</p>
//                   </div>
//                   <input
//                     type="file"
//                     className="hidden"
//                     accept="image/*"
//                     onChange={handleImageChange}
//                     disabled={loading}
//                   />
//                 </label>
//               )}
              
//               {errors.image && (
//                 <div className="mt-2 flex items-center gap-2 text-red-500 text-sm">
//                   <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                   </svg>
//                   <span>{errors.image}</span>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* URL Input Section */}
//           {mediaType === 'url' && (
//             <div className="animate-fade-in">
//               <label className="text-gray-600 text-sm font-medium mb-2 block">
//                 Enter YouTube Video URL *
//               </label>
//               <div className="flex items-center gap-2">
//                 <LinkIcon className={`w-5 h-5 ${
//                   errors.url ? 'text-red-500' : 'text-gray-400'
//                 }`} />
//                 <input
//                   type="url"
//                   className={`w-full border-2 rounded-lg px-4 py-2.5 ${
//                     errors.url 
//                       ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-300' 
//                       : 'border-gray-300 focus:border-blue-500'
//                   } focus:outline-none focus:ring-0 focus:ring-blue-500 transition-colors`}
//                   placeholder="https://www.youtube.com/watch?v=..."
//                   value={url}
//                   onChange={(e) => handleUrlChange(e.target.value)}
//                   onBlur={handleUrlBlur}
//                   disabled={loading}
//                 />
//               </div>
              
//               {errors.url && (
//                 <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
//                   <div className="flex items-start gap-2">
//                     <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                     </svg>
//                     <div>
//                       <p className="text-red-700 text-sm font-medium">{errors.url}</p>
//                       <p className="text-red-600 text-xs mt-1">
//                         Example: https://www.youtube.com/watch?v=VIDEO_ID
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}
              
//               {url && !errors.url && isValidUrl(url) && (
//                 <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
//                   <div className="flex items-center gap-2 text-green-700 text-sm">
//                     <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                     </svg>
//                     <span className="font-medium">✓ Valid URL format</span>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Submit Buttons */}
//           <div className="flex justify-end gap-3 pt-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-4 py-2 font-semibold transition"
//               disabled={loading}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
//               disabled={loading || mediaType === 'none' || 
//                 (mediaType === 'image' && !image) || 
//                 (mediaType === 'url' && !url.trim())}
//             >
//               {loading ? 'Adding...' : 'Add Item'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ItemModal;





import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Link as LinkIcon, Upload, Trash2, AlertCircle } from "lucide-react";

const ItemModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  category,
  error
}) => {
  const [mediaType, setMediaType] = useState('none');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [url, setUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    setMediaType('none');
    setImage('');
    setImagePreview('');
    setUrl('');
    setImageFile(null);
    setErrors({});
    setSubmitError('');
  }, [isOpen]);

  useEffect(() => {
    if (mediaType !== 'none' || image || url) {
      setSubmitError('');
    }
  }, [mediaType, image, url]);

  const validateForm = () => {
    const newErrors = {};

    if (mediaType === 'none') {
      newErrors.mediaType = 'Please select either image or URL';
    } else if (mediaType === 'image' && !image) {
      newErrors.image = 'Please upload an image';
    } else if (mediaType === 'url' && !url.trim()) {
      newErrors.url = 'URL is required';
    } else if (mediaType === 'url' && url.trim() && !isValidUrl(url)) {
      newErrors.url = 'Please enter a valid URL (e.g., https://example.com)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, image: 'Please select an image file (PNG, JPG, JPEG, GIF)' });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: 'Image size should be less than 5MB' });
        return;
      }

      setImageFile(file);
      setImage(file.name);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      setErrors({ ...errors, image: '', mediaType: '' });
    }
  };

  const handleUrlChange = (value) => {
    setUrl(value);
    if (value.trim()) {
      setErrors({ ...errors, url: '' });
    }
  };

  const removeImage = () => {
    setImage('');
    setImagePreview('');
    setImageFile(null);
    setMediaType('none');
  };

  const handleMediaTypeChange = (type) => {
    setMediaType(type);
    setErrors({ ...errors, mediaType: '', image: '', url: '' });
    
    if (type === 'image') {
      setUrl('');
    } else if (type === 'url') {
      setImage('');
      setImagePreview('');
      setImageFile(null);
    }
  };

  const handleUrlBlur = () => {
    if (mediaType === 'url' && url.trim() && !isValidUrl(url)) {
      setErrors({ ...errors, url: 'Please enter a valid URL (e.g., https://example.com)' });
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validateForm()) {
      return;
    }

    try {
      let payload;

      if (mediaType === 'image' && imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('type', 'image');
        formData.append('name', category?.name || '');
        formData.append('url', 'url');
        payload = formData;
      } else if (mediaType === 'url') {
        payload = {
          url: url.trim(),
          type: 'video',
          name: category?.name || ''
        };
      }      
      await onSubmit(payload);
      
    } catch (err) {
      console.error('Error in form submission:', err);
      setSubmitError(err.message || 'Failed to add item. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    // <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 p-4">
    <div className={`fixed inset-0 flex items-center justify-center z-50 bg-black/20 p-4 ${imagePreview ? 'mt-10' : ''}`}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-bold">
            Add Item to {category?.name}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmitForm} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {/* Error Display */}
            {submitError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Failed to add item</p>
                  <p className="text-xs mt-1">{submitError}</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setSubmitError('')} 
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Category Name Display */}
            <div>
              <label className="text-gray-600 text-sm font-medium mb-2 block">
                Category Name
              </label>
              <div className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-900 font-medium">
                {category?.name || 'No category selected'}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                This will be included in the item payload
              </p>
            </div>

            {/* Media Type Selection */}
            <div>
              <label className="text-gray-600 text-sm font-medium mb-2 block">
                Select Media Type *
              </label>
              
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  mediaType === 'image' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="mediaType"
                    value="image"
                    checked={mediaType === 'image'}
                    onChange={() => handleMediaTypeChange('image')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-2 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-gray-700" />
                    <span className="font-medium text-sm">Image</span>
                  </div>
                </label>

                <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  mediaType === 'url' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="mediaType"
                    value="url"
                    checked={mediaType === 'url'}
                    onChange={() => handleMediaTypeChange('url')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-2 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-gray-700" />
                    <span className="font-medium text-sm">Video URL</span>
                  </div>
                </label>
              </div>

              {errors.mediaType && (
                <div className="mt-2 flex items-center gap-2 text-red-500 text-sm">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>{errors.mediaType}</span>
                </div>
              )}
            </div>

            {/* Image Upload Section */}
            {mediaType === 'image' && (
              <div>
                <label className="text-gray-600 text-sm font-medium mb-2 block">
                  Upload Image *
                </label>
                
                {imagePreview ? (
                  <div className="border rounded-lg p-3 bg-gray-50">
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition shadow-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 text-center truncate">
                      {image}
                    </p>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="w-6 h-6 text-gray-400 mb-1" />
                      <p className="text-sm text-gray-500">Click to upload image</p>
                      <p className="text-xs text-gray-400">PNG, JPG, GIF (Max 5MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={loading}
                    />
                  </label>
                )}
                
                {errors.image && (
                  <div className="mt-2 flex items-center gap-2 text-red-500 text-sm">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>{errors.image}</span>
                  </div>
                )}
              </div>
            )}

            {/* URL Input Section */}
            {mediaType === 'url' && (
              <div>
                <label className="text-gray-600 text-sm font-medium mb-2 block">
                  Enter YouTube Video URL *
                </label>
                <div className="flex items-center gap-2">
                  <LinkIcon className={`w-5 h-5 flex-shrink-0 ${
                    errors.url ? 'text-red-500' : 'text-gray-400'
                  }`} />
                  <input
                    type="url"
                    className={`w-full border-2 rounded-lg px-3 py-2 text-sm ${
                      errors.url 
                        ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-300' 
                        : 'border-gray-300 focus:border-blue-500'
                    } focus:outline-none transition-colors`}
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    onBlur={handleUrlBlur}
                    disabled={loading}
                  />
                </div>
                
                {errors.url && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <p className="text-red-700 text-xs font-medium">{errors.url}</p>
                    </div>
                  </div>
                )}
                
                {url && !errors.url && isValidUrl(url) && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700 text-xs">
                      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">✓ Valid URL format</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Fixed Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-4 py-2 font-semibold transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
              disabled={loading || mediaType === 'none' || 
                (mediaType === 'image' && !image) || 
                (mediaType === 'url' && !url.trim())}
            >
              {loading ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemModal;
