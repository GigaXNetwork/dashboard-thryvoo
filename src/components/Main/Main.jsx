import React, { useState, useEffect } from "react";
import "./Main.css";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import { Outlet } from "react-router";

function Main({user}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 750);

  // Toggle function for sidebar
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // Set sidebar visibility based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 750) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize); // Attach listener

    return () => window.removeEventListener("resize", handleResize); // Cleanup
  }, []);

  console.log("main",user);
  

  return (
    <main className="main">
      <Header onToggleSidebar={toggleSidebar} />
      <div className="main-child flex">
        <div
          className={`sidebar relative border-r border-gray-200 bg-white transition-all duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} user={user} />
        </div>
        <div
          className={`content flex-1 transition-all duration-300 ${
            isSidebarOpen ? "ml-[250px]" : "ml-0"
          }`}
        >
          <Outlet />
        </div>
      </div>
    </main>
  );
}

export default Main;
