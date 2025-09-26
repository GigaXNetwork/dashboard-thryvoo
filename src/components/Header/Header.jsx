import { CiMenuBurger } from "react-icons/ci";
import demo from "../../assets/images/default-user.png";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Ensure you're importing from the correct package
import { useUser } from "../../Context/ContextApt";

function Header({ onToggleSidebar }) {
  const {
    userData,  // User data fetched from API
    loading,   // Loading state
    error      // Error state
  } = useUser();
  
  return (
    <header className="w-full h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-[9999]">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="text-2xl p-2 rounded hover:bg-gray-100 transition"
          aria-label="Toggle Sidebar"
        >
          <CiMenuBurger />
        </button>
        <h1 className="text-xl font-semibold tracking-wide hidden sm:block">
          Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <Link to="/me" className="flex items-center gap-4">
            <img
              src={userData.user.photo || demo}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover border"
            />
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
