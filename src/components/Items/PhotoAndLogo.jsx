import { useRef, useState } from "react";

function PhotoAndLogo({ handleBack, handleNext, handleChange, formData }) {
  const photoInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);

  const handleDragOver = (e, type) => {
    e.preventDefault();
    if (type === 'photo') setIsDraggingPhoto(true);
    if (type === 'logo') setIsDraggingLogo(true);
  };

  const handleDragLeave = (e, type) => {
    e.preventDefault();
    if (type === 'photo') setIsDraggingPhoto(false);
    if (type === 'logo') setIsDraggingLogo(false);
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    if (type === 'photo') setIsDraggingPhoto(false);
    if (type === 'logo') setIsDraggingLogo(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const event = {
        target: {
          name: type === 'photo' ? 'photo' : 'companyLogo',
          type: 'file',
          files: [files[0]]
        }
      };
      handleChange(event);
    }
  };

  const triggerFileInput = (type) => {
    if (type === 'photo') {
      photoInputRef.current?.click();
    } else {
      logoInputRef.current?.click();
    }
  };

  const handleRemove = (type) => {
    // Create a synthetic event to clear the file input
    const event = {
      target: {
        name: type,
        value: ''
      }
    };
    
    // Update form data to remove the image
    handleChange(event);
    
    // Also reset the file input
    if (type === 'photo') {
      photoInputRef.current.value = '';
    } else {
      logoInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">Add Visual Elements</h3>
        
        {/* Profile Photo Section */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Profile Photo
          </label>
          
          <div 
            className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
              isDraggingPhoto 
                ? "border-blue-500 bg-blue-50" 
                : formData.photo 
                  ? "border-green-500" 
                  : "border-gray-300 hover:border-gray-400"
            }`}
            onClick={() => triggerFileInput('photo')}
            onDragOver={(e) => handleDragOver(e, 'photo')}
            onDragLeave={(e) => handleDragLeave(e, 'photo')}
            onDrop={(e) => handleDrop(e, 'photo')}
          >
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
              ref={photoInputRef}
            />
            
            {formData.photo ? (
              <div className="flex flex-col items-center">
                <div className="relative mb-4 group">
                  <img 
                    src={formData.photo} 
                    alt="Profile preview" 
                    className="h-32 w-32 rounded-full object-cover shadow-md border-4 border-white"
                  />
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center">
                      <span className="text-white text-sm font-medium mb-1">Change Photo</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove('photo');
                        }}
                        className="text-xs text-red-300 hover:text-white mt-1 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-green-600 font-medium">Photo uploaded successfully</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div className="flex text-sm text-gray-600">
                  <p className="pl-1">Upload a profile photo or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Company Logo Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Company Logo
          </label>
          
          <div 
            className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
              isDraggingLogo 
                ? "border-blue-500 bg-blue-50" 
                : formData.companyLogo 
                  ? "border-green-500" 
                  : "border-gray-300 hover:border-gray-400"
            }`}
            onClick={() => triggerFileInput('logo')}
            onDragOver={(e) => handleDragOver(e, 'logo')}
            onDragLeave={(e) => handleDragLeave(e, 'logo')}
            onDrop={(e) => handleDrop(e, 'logo')}
          >
            <input
              type="file"
              name="companyLogo"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
              ref={logoInputRef}
            />
            
            {formData.companyLogo ? (
              <div className="flex flex-col items-center">
                <div className="relative mb-4 p-2 bg-gray-50 rounded-lg group">
                  <img 
                    src={formData.companyLogo} 
                    alt="Logo preview" 
                    className="h-24 object-contain"
                  />
                  <div className="absolute inset-0 flex items-center justify-center rounded bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center">
                      <span className="text-white text-sm font-medium mb-1">Change Logo</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove('companyLogo');
                        }}
                        className="text-xs text-red-300 hover:text-white mt-1 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-green-600 font-medium">Logo uploaded successfully</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                  </svg>
                </div>
                <div className="flex text-sm text-gray-600">
                  <p className="pl-1">Upload a company logo or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, SVG up to 5MB</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t border-gray-200">
        <button
          onClick={handleBack}
          className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!formData.photo}
          className="px-5 py-2.5 text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg shadow-md hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          Continue to Basic Info
        </button>
      </div>
    </div>
  );
}

export default PhotoAndLogo;