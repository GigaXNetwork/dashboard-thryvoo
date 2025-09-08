import React from "react";

const ProfileBanner = ({logo,photo}) => {
  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-lg mb-5">
      {/* Banner Image */}
      <img
        src={photo} // replace with your banner image path
        alt="Banner"
        className="w-full h-80 object-cover"
      />

      {/* Logo in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-full bg-white shadow-xl flex items-center justify-center p-1">
          <img
            src={logo} // replace with your logo path
            alt="Logo"
            className="w-20 h-20 object-contain rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileBanner;