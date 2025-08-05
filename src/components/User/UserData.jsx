import { useEffect, useState } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import "../Main/Main.css"

// Icons
import { IoHomeOutline } from "react-icons/io5";
import { FaAddressCard, FaStar } from "react-icons/fa";
import { RiCoupon2Fill } from "react-icons/ri";
import { BiSolidFoodMenu } from "react-icons/bi";

// Components
import "./User.css";


const menuItems = [
  { to: "/", icon: <IoHomeOutline />, label: "Home" },
  { to: "card", icon: <FaAddressCard />, label: "Card" },
  { to: "coupon", icon: <RiCoupon2Fill />, label: "Coupons" },
  { to: "presets", icon: <RiCoupon2Fill />, label: "Presets" },
  { to: "reviews", icon: <FaStar />, label: "Reviews" },
];

function UserData() {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const { userId, id } = useParams();
  console.log(userId, id);


  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/user/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const result = await response.json();

        if (response.ok && result.status === "success") {
          setUser(result.data.user);
        } else {
          console.error("API error:", result.message || result);
          setUser(undefined);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setUser(undefined);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <p>Loading user...</p>;

  return (
    <div className="flex">
      {/* Sidebar with Sticky UserCard */}
      <div className="sidebar relative border-r border-gray-200 bg-white transition-all duration-300 ">
        <div className="sticky top-[90px] h-full shadow-sm w-[250px] bg-white p-6 ">
          <div className="text-center">
            <img
              src={user.photo || "https://picsum.photos/200"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mx-auto mb-4 bg-black"
              loading="lazy"
              draggable={false}
            />
            <h2 className="text-xl font-semibold mb-1 capitalize">{user.name}</h2>
            <p className="text-gray-500 mb-4 break-words">{user.email}</p>

            <div className="space-y-2">
              {menuItems.map(({ to, icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-lg text-[0.9rem] font-medium transition-all ${isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-800 hover:bg-gray-100"
                    }`
                  }
                >
                  <span className="text-[1rem]">{icon}</span>
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className="flex-1 overflow-y-auto transition-all duration-300
           ml-[250px]"
      >
        <Outlet />
      </div>
    </div>

  );
}

export default UserData;
