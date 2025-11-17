import React, { useState, useCallback } from "react";
import { Image as LucideImage, User as LucideUser, Edit3 as LucideEdit } from 'lucide-react';

const ProfileBanner = ({
  logo,
  photo,
  onOpenLogoModal,
  onOpenPhotoModal,
}) => {
  // track load errors so we can fallback to icons (watermark)
  const [hasError, setHasError] = useState({ banner: false, logo: false });

  const handleImageError = useCallback((type) => {
    setHasError(prev => ({ ...prev, [type]: true }));
  }, []);

  const handleEditClick = useCallback((e, openModal) => {
    e.stopPropagation();
    if (typeof openModal === 'function') openModal();
  }, []);

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-lg mb-5 bg-gray-200">
      {/* Banner Image area (click to edit) */}
      <div
        className="relative group cursor-pointer"
        tabIndex={0}
        onClick={onOpenPhotoModal}
        onKeyDown={(e) => { if (e.key === 'Enter') onOpenPhotoModal && onOpenPhotoModal(); }}
        aria-label="Edit banner image"
      >
        {/* If photo present and didn't error -> show image */}
        {photo && !hasError.banner ? (
          <img
            src={photo}
            alt="Banner"
            className="w-full h-80 object-cover"
            onError={() => handleImageError('banner')}
            loading="lazy"
          />
        ) : (
          // Fallback watermark icon when no photo or error
          <div className="w-full h-80 bg-gray-100 flex items-center justify-center relative">
            <LucideImage className="w-28 h-28 opacity-20" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-gray-400 text-sm">No banner image</span>
            </div>
          </div>
        )}

        {/* Hover overlay with edit icon */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-5">
          <button
            className="bg-white rounded-full p-3 shadow-md hover:bg-blue-50 transition-colors duration-200"
            onClick={(e) => handleEditClick(e, onOpenPhotoModal)}
            aria-label="Edit banner"
          >
            <LucideEdit className="w-5 h-5 text-blue-600" />
          </button>
        </div>
      </div>

      {/* Logo in center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="relative rounded-full bg-white shadow-xl flex items-center justify-center p-1 cursor-pointer group pointer-events-auto"
          onClick={onOpenLogoModal}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') onOpenLogoModal && onOpenLogoModal(); }}
          aria-label="Edit logo"
        >
          {/* If logo present and didn't error -> show image */}
          {logo && !hasError.logo ? (
            <img
              src={logo}
              alt="Logo"
              className="w-20 h-20 object-contain rounded-full"
              onError={() => handleImageError('logo')}
              loading="lazy"
            />
          ) : (
            // Fallback watermark icon when no logo or error
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
              <LucideUser className="w-10 h-10 opacity-30" />
            </div>
          )}

          {/* Edit overlay on hover */}
          <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
            <LucideEdit className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBanner;
