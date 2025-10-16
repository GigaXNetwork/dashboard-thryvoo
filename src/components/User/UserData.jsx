import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import {
  IoHomeOutline,
} from "react-icons/io5";
import {
  FaAddressCard,
  FaStar,
  FaGift,
} from "react-icons/fa";
import {
  RiCoupon2Fill,
  RiUser3Line
} from "react-icons/ri";
import {
  BiSolidFoodMenu,
  BiCategory
} from "react-icons/bi";
import { getAuthToken } from "../../Context/apiService";
import { Loader, User } from "lucide-react";

const menuItems = [
  { to: "/", icon: <IoHomeOutline />, label: "Home" },
  { to: "card", icon: <FaAddressCard />, label: "Digital Card" },
  { to: "coupon", icon: <RiCoupon2Fill />, label: "Coupons" },
  { to: "presets", icon: <BiSolidFoodMenu />, label: "Presets" },
  { to: "reviews", icon: <FaStar />, label: "Reviews" },
  { to: "redeem-store", icon: <FaGift />, label: "Reward Store" },
  { to: "categories", icon: <BiCategory />, label: "Categories" },
];

export default function UserData() {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();

  const sidebarRef = useRef();
  const [sidebarHeight, setSidebarHeight] = useState();

  // Responsive: Use window.matchMedia for desktop height sync
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  const userPhoto = user?.photo && user.photo !== "default-user.png" ? user.photo : null;
  const userPhotoURL = userPhoto?.startsWith("http") ? userPhoto : null;

  useEffect(() => {
    const updateIsDesktop = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', updateIsDesktop);
    return () => window.removeEventListener('resize', updateIsDesktop);
  }, []);

  useLayoutEffect(() => {
    if (sidebarRef.current && isDesktop) {
      setSidebarHeight(sidebarRef.current.offsetHeight);
    } else {
      setSidebarHeight(undefined);
    }
  }, [user, isDesktop]);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/user/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${getAuthToken()}`,
            },
            credentials: "include",
          }
        );
        const result = await response.json();
        if (response.ok && result.status === "success") {
          setUser(result.data.user);
        } else {
          setUser(undefined);
        }
      } catch (err) {
        setUser(undefined);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center min-h-64">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : !user ? (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
          <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md mx-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <RiUser3Line className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">User Not Found</h3>
            <p className="text-gray-600">The requested user profile could not be loaded.</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row gap-8 items-stretch">
              {/* Sidebar is full width on mobile, fixed on desktop */}
              <aside
                className="w-full md:w-80 flex-shrink-0 flex flex-col mb-6 md:mb-0"
                ref={sidebarRef}
              >
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex-1 flex flex-col">
                  <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-6 text-center rounded-lg">
                    <div className="relative inline-block">
                      {userPhotoURL ? (
                        <img
                          src={
                            `${user.photo}` ||
                            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80"
                          }
                          alt="Profile"
                          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg mx-auto mb-4"
                          loading="lazy"
                          draggable={false}
                        />
                      ) : (
                        <div className="relative w-24 h-24 rounded-full mx-auto mb-2 border-4 border-white shadow-md bg-gray-100 flex items-center justify-center">
                          <User className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute bottom-4 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-1 capitalize">{user.name}</h2>
                    <p className="text-blue-100 text-sm">{user.email}</p>
                  </div>
                  {/* Navigation Menu */}
                  <nav className="p-4">
                    <div className="space-y-1">
                      {menuItems.map(({ to, icon, label }) => (
                        <NavLink
                          key={to}
                          to={to}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                              ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600 shadow-sm"
                              : "text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:border-l-4 hover:border-gray-200"
                            }`
                          }
                        >
                          <span
                            className={`text-lg transition-colors ${menuItems.find((item) => item.to === to)?.isActive
                              ? "text-blue-600"
                              : "text-gray-500 group-hover:text-blue-600"
                              }`}
                          >
                            {icon}
                          </span>
                          <span className="font-medium">{label}</span>
                        </NavLink>
                      ))}
                    </div>
                  </nav>
                </div>
              </aside>
              {/* Main Content */}
              <main className="flex-1 flex flex-col min-h-0">
                <div
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 flex-1 flex flex-col h-full"
                  style={
                    isDesktop && sidebarHeight
                      ? { maxHeight: sidebarHeight, minHeight: sidebarHeight }
                      : {}
                  }
                >
                  <div className="p-6 flex-1 overflow-y-auto min-h-0">
                    <Outlet />
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
