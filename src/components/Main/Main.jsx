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
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <Header onToggleSidebar={toggleSidebar} />

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <aside
          className={`
            fixed top-0 left-0 z-30 w-64 bg-white border-r border-gray-200
            transform transition-transform duration-300
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            md:relative md:translate-x-0 md:flex-shrink-0
            h-screen md:h-full
            overflow-y-auto overflow-x-hidden 
        `}
          style={{ paddingTop: isSidebarOpen && window.innerWidth < 768 ? '64px' : '0' }}
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
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>

    </div>
  );
}

export default Main;