import { NavLink } from "react-router-dom";
import { useState } from "react";
import { RiCoupon2Fill } from "react-icons/ri";
import { FaAddressCard, FaHandshake, FaStar, FaWhatsapp } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import { FiChevronDown } from "react-icons/fi";
import Cookies from 'js-cookie';
import { useUser } from "../../Context/ContextApt";
import { MdOutlinePermMedia } from "react-icons/md";
import { IoIosFlash } from "react-icons/io";
import { FerrisWheel, Handshake, Star, Users } from "lucide-react";

function Sidebar({ onToggleSidebar }) {

  const { userData } = useUser();
  const role = userData.user.role;

  const isAdmin = role == "admin"
  const isUser = role == "user"

  const menuItems = [
    { to: "/", icon: <IoHomeOutline />, label: "Home" },
    { to: "/card", icon: <FaAddressCard />, label: "Card" },
    isAdmin && { to: "/blog", icon: <FaAddressCard />, label: "Blog" },
    isAdmin && { to: "/setting", icon: <FaAddressCard />, label: "Setting" },
    isAdmin ? { to: "/coupons", icon: <RiCoupon2Fill />, label: "Coupons" }
      :
      {
        to: "/coupon",
        icon: <RiCoupon2Fill />,
        label: "Coupons",
        subItems: [
          { to: "/coupon", label: "All Coupons" },
          { to: "/presets", label: "All Presets" },
        ]

      },

    userData.user.role === "user" && { to: "/flashOffer", icon: <IoIosFlash />, label: "Flash Hour Offer" },
    userData.user.role === "user" && {
      to: "/whatsapp",
      icon: <FaWhatsapp />,
      label: "WhatsApp",
      subItems: [
        { to: "/whatsapp/registration", label: "Registration Info" },
        { to: "/whatsapp/templates", label: "Templates" },
      ]
    },
    userData.user.role === "user" && {
      to: "/media",
      icon: <MdOutlinePermMedia />,
      label: "Media",
      subItems: [
        { to: "/media/setMedia", label: "Set Media" },
        { to: "/media/allMedia", label: "All Media" },
      ]
    },
    userData.user.role === "user" && {
      to: "/spin",
      icon: <FerrisWheel size={18}/>,
      label: "Spinning"
    },
    userData.user.role === "user" && {
      to: "/cross-brand",
      icon: <Handshake size={18}/>,
      label: "Cross Brand",
      subItems: [
        { to: "/cross-brand/presets", label: "Presets" },
        { to: "/cross-brand/store", label: "Store" },
      ]
    },
    { to: "/reviews", icon: <Star size={18} />, label: "Reviews" },
    userData.user.role === "user" && { to: "/customers", icon: <Users size={18} />, label: "Customers" },
  ].filter(Boolean);

  const [openMenu, setOpenMenu] = useState(null);

  const toggleHandler = () => {
    if (window.innerWidth < 750) {
      onToggleSidebar();
    }
  };

  const handleMenuClick = (item, e) => {
    if (item.subItems) {
      e.preventDefault();
      setOpenMenu(openMenu === item.to ? null : item.to);
      return;
    }
    toggleHandler();
  };

  const handleLogout = async () => {
    Cookies.remove('authToken');
    window.location.href = "/login";
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col shadow-sm h-full">
      {/* Scrollable Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto overflow-x-hidden">
        <div className="flex flex-col gap-1.5">
          {menuItems.map((item) => (
            <div key={item.to} className="flex flex-col group">
              <NavLink
                to={item.to}
                onClick={(e) => handleMenuClick(item, e)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ease-out ${isActive
                    ? "bg-gradient-to-r from-violet-50 to-violet-100 text-violet-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <span className={`text-lg p-1 rounded-md transition-all ${isActive
                          ? "text-violet-600 bg-violet-100/50"
                          : "text-gray-500 group-hover:bg-gray-200/30"
                        }`}>
                        {item.icon}
                      </span>
                      <span className="relative">
                        {item.label}
                      </span>
                    </div>

                    {item.subItems && (
                      <FiChevronDown
                        className={`transform transition-transform duration-200 ${openMenu === item.to
                            ? "rotate-180 text-violet-500"
                            : "text-gray-400 group-hover:text-gray-600"
                          }`}
                        size={18}
                      />
                    )}
                  </>
                )}
              </NavLink>

              {item.subItems && openMenu === item.to && (
                <div className="ml-10 mt-1 mb-2 flex flex-col gap-1 animate-fadeIn">
                  {item.subItems.map((sub) => (
                    <NavLink
                      key={sub.to}
                      to={sub.to}
                      onClick={toggleHandler}
                      className={({ isActive }) =>
                        `text-sm px-3 py-1.5 rounded-lg transition-all duration-150 ${isActive
                          ? "bg-violet-100/80 text-violet-700 font-medium pl-4 border-l-2 border-violet-500"
                          : "text-gray-500 hover:bg-gray-100 hover:pl-4 hover:border-l-2 hover:border-gray-300"
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
        </div>
      </nav>

      {/* Fixed Logout Button at Bottom */}
      <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-white">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
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