import { NavLink } from "react-router-dom";
import { useState } from "react";
import { BiSolidFoodMenu } from "react-icons/bi";
import { RiCoupon2Fill } from "react-icons/ri";
import { FaAddressCard, FaStar } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import { FiChevronDown } from "react-icons/fi";
import Cookies from 'js-cookie';

import "./Sidebar.css";

const menuItems = [
  { to: "/", icon: <IoHomeOutline />, label: "Home" },
  { to: "/card", icon: <FaAddressCard />, label: "Card" },
  {
    to: "/coupon",
    icon: <RiCoupon2Fill />,
    label: "Coupons",
    subItems: [
      { to: "/coupon", label: "All Coupons" },
      { to: "/coupon/presets", label: "All Presets" },
    ],
  },
  { to: "/reviews", icon: <FaStar />, label: "Reviews" },
];

function Sidebar({ onToggleSidebar }) {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleHandler = () => {
    console.log("Toggle Sidebar");

    if (window.innerWidth < 750) {
      onToggleSidebar();
    }
  };

  const handleMenuClick = (item, e) => {
    if (item.subItems) {
      e.preventDefault(); // prevent navigation if submenu exists
      setOpenMenu(openMenu === item.to ? null : item.to);
    }
    toggleHandler(); // always close sidebar on menu item click (mobile)
  };

  const handleLogout = async () => {
    Cookies.remove('authToken');
    window.location.href = "/login";
  };

  return (
    <aside className="h-full sticky shadow-sm w-[250px] bg-white">
      <nav className="navbar mt-4 px-2 flex flex-col gap-1 min-h-[calc(100%-5rem)] max-h-[calc(90vh-6rem)] h-auto overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.to} className="flex flex-col">
            <NavLink
              to={item.to}
              onClick={(e) => handleMenuClick(item, e)}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-2 rounded-lg text-[0.9rem] font-medium transition-all ${isActive ? "bg-violet-100 text-violet-700" : "text-gray-800 hover:bg-gray-100"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <span className="text-[1rem]">{item.icon}</span>
                <span>{item.label}</span>
              </div>

              {item.subItems && (
                <FiChevronDown
                  className={`transform transition-transform duration-300 ${openMenu === item.to ? "rotate-180" : ""
                    }`}
                />
              )}
            </NavLink>

            {item.subItems && openMenu === item.to && (
              <div className="ml-8 mt-1 flex flex-col gap-1">
                {item.subItems.map((sub) => (
                  <NavLink
                    key={sub.to}
                    to={sub.to}
                    onClick={toggleHandler}
                    className={({ isActive }) =>
                      `text-sm px-3 py-1 rounded-md transition ${isActive ? "bg-violet-50 text-violet-700" : "text-gray-600 hover:bg-gray-100"
                      }`
                    }
                  >
                    {sub.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t h-20 flex flex-col justify-center" onClick={toggleHandler}>
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-md hover:bg-red-200 transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1"
            />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
