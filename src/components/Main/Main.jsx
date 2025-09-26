import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import { Outlet } from "react-router";

function Main({ user }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 750);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 750);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header onToggleSidebar={toggleSidebar} />

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <aside
          className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 overflow-y-auto
          transform transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:relative md:translate-x-0 md:flex-shrink-0 md:overflow-visible
        `}
        >

          <Sidebar
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={toggleSidebar}
            user={user}
          />
        </aside>

        {/* Overlay for mobile when sidebar is open */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black bg-opacity-25 md:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto pt-4 px-4 md:px-6 transition-all duration-300 max-h-screen">
          <Outlet />
        </main>
      </div>

    </div>
  );
}

export default Main;