import { CiMenuBurger } from "react-icons/ci";
import demo from "../../assets/images/default-user.png";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../Context/ContextApt";
import logoThryvoo from "../../assets/logo/logoThryvoo.png";
import { FaUserCircle } from "react-icons/fa";

function Header({ onToggleSidebar }) {
  const {
    userData,  // User data fetched from API
    loading,   // Loading state
    error      // Error state
  } = useUser();

  const userPhoto = userData?.user?.photo
    ? `${userData.user.photo}?t=${new Date().getTime()}`
    : null;

  return (
    <header className="w-full h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-[9999]">
      <div className="flex items-center gap-4">
        <img
          src={logoThryvoo}
          alt="Thryvoo"
          className="w-26 h-14 px-2 py-2"
        />
      </div>

      <div className="flex items-center gap-2">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <>
            <Link to="/me" className="flex items-center gap-4">
              {userPhoto ? (
                <img
                  src={userPhoto}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full object-cover border"
                  key={userPhoto}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border">
                  <FaUserCircle className="text-gray-500 text-2xl" />
                </div>
              )}
            </Link>
            <button
              onClick={onToggleSidebar}
              className="text-2xl rounded p-2 hover:bg-blue-600/10 transition md:hidden lg:hidden"
              aria-label="Toggle Sidebar"
            >
              <CiMenuBurger className="text-blue-600" />
            </button>
          </>
        )}
      </div>

    </header>
  );
}

export default Header;
