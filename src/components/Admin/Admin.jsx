// import React, { useState, useEffect } from "react";
// import "./Admin.css"
// import Header from "../Header/Header";
// import Sidebar from "../Sidebar/Sidebar";
// import { Outlet } from "react-router";

// function Admin({user}) {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 750);

//   // Toggle function for sidebar
//   const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

//   // Set sidebar visibility based on screen size
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 750) {
//         setIsSidebarOpen(false);
//       } else {
//         setIsSidebarOpen(true);
//       }
//     };

//     handleResize(); // Initial check
//     window.addEventListener("resize", handleResize); // Attach listener

//     return () => window.removeEventListener("resize", handleResize); // Cleanup
//   }, []);

//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* Header */}
//       <Header onToggleSidebar={toggleSidebar} />

//       {/* Main layout */}
//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar */}
//         <aside
//           className={`sidebar  relative z-[99999] border-r border-gray-200 bg-white transition-all duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//             }`}
//         >
//           <Sidebar
//             isSidebarOpen={isSidebarOpen}
//             onToggleSidebar={toggleSidebar}
//             user={user}
//           />
//         </aside>

//         {/* Content area */}
//         <main className={`flex-1 overflow-y-auto transition-all duration-300 ${isSidebarOpen ? "ml-[250px]" : "ml-0"}`}>
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }

// export default Admin;


import React, { useState, useEffect } from "react";
import "./Admin.css";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import { Outlet } from "react-router";

function Admin({ user }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 750);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 750);

  // Track screen size to know if we're in mobile mode
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 750);
      if (window.innerWidth >= 750) {
        setIsSidebarOpen(true); // always open by default on desktop
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header onToggleSidebar={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`sidebar fixed md:static top-0 left-0 h-full w-[250px] 
          border-r border-gray-200 bg-white transition-transform duration-300 z-[9999]
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${isMobile ? "absolute" : ""}`}
        >
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={toggleSidebar}
            user={user}
          />
        </aside>

        {/* Overlay for mobile */}
        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
            onClick={toggleSidebar}
          />
        )}

        {/* Content */}
        <main
          className={`flex-1 overflow-y-auto transition-all duration-300 ${
            !isMobile && isSidebarOpen ? "ml-[250px]" : "ml-0"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Admin;
