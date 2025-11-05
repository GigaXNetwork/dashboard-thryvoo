import React, { useState, useCallback } from "react";
import { FaEdit } from "react-icons/fa";

const ProfileBanner = ({ 
  logo, 
  photo, 
  onOpenLogoModal, 
  onOpenPhotoModal,
  logoAlt = "Company logo",
  bannerAlt = "Banner image"
}) => {
  const [imageLoaded, setImageLoaded] = useState({
    banner: false,
    logo: false
  });

  const handleImageLoad = useCallback((type) => {
    setImageLoaded(prev => ({ ...prev, [type]: true }));
  }, []);

  const handleEditClick = useCallback((e, callback) => {
    e.stopPropagation();
    callback?.();
  }, []);

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-lg mb-5 bg-gray-200">
      {/* Banner Image */}
      <div className="relative group cursor-pointer" role="button" tabIndex={0} 
           onClick={onOpenPhotoModal}
           onKeyPress={(e) => e.key === 'Enter' && onOpenPhotoModal?.()}
           aria-label="Edit banner image">
        {!imageLoaded.banner && (
          <div className="w-full h-80 bg-gray-300 animate-pulse flex items-center justify-center">
            <span className="text-gray-500">Loading banner...</span>
          </div>
        )}
        <img
          src={photo ? `${photo}?t=${new Date().getTime()}` : photo}
          alt={bannerAlt}
          className={`w-full h-80 object-cover transition-opacity duration-300 ${imageLoaded.banner ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => handleImageLoad('banner')}
          loading="lazy"
        />

        {/* Hover overlay with edit icon */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-5">
          <div 
            className="bg-white rounded-full p-3 shadow-md hover:bg-blue-50 transition-colors duration-200"
            onClick={(e) => handleEditClick(e, onOpenPhotoModal)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleEditClick(e, onOpenPhotoModal)}
            aria-label="Edit banner"
          >
            <FaEdit className="text-blue-600 text-lg" />
          </div>
        </div>
      </div>

      {/* Logo in center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="relative rounded-full bg-white shadow-xl flex items-center justify-center p-1 cursor-pointer group pointer-events-auto"
          onClick={onOpenLogoModal}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && onOpenLogoModal?.()}
          aria-label="Edit logo"
        >
          {!imageLoaded.logo && (
            <div className="w-20 h-20 rounded-full bg-gray-300 animate-pulse flex items-center justify-center">
              <span className="text-gray-500 text-xs">Loading logo...</span>
            </div>
          )}
          <img
            src={logo ? `${logo}?t=${new Date().getTime()}` : logo}
            alt={logoAlt}
            className={`w-20 h-20 object-contain rounded-full transition-opacity duration-300 ${imageLoaded.logo ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => handleImageLoad('logo')}
            loading="lazy"
          />

          {/* Edit overlay on hover */}
          <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
            <FaEdit className="text-white text-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProfileBanner);