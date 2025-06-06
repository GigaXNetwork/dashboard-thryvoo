import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import "./User.css";

function User() {
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const usersPerPage = 6;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const result = await response.json();
      if (response.ok && result.status === "success") {
        setUsers(result.data.users || []);
      } else {
        console.error("API error:", result.message);
        setUsers([]);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmpassword) {
      setFormStatus({ type: "error", message: "Passwords do not match." });
      return;
    }

    try {
      const response = await fetch("${import.meta.env.VITE_API_URL}/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmpassword: formData.confirmpassword,
        }),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        setFormStatus({ type: "success", message: "User created successfully!" });

        // Auto-close modal after short delay
        setTimeout(() => {
          setShowModal(false);
          setFormData({ name: "", email: "", password: "", confirmpassword: "" });
          setFormStatus({ type: "", message: "" });
          fetchUsers(); // Refresh user list
        }, 1500);
      } else {
        setFormStatus({
          type: "error",
          message: result.message || "Failed to create user.",
        });
      }
    } catch (error) {
      console.error("Create user failed:", error);
      setFormStatus({ type: "error", message: "An unexpected error occurred." });
    }
  };


  if (loading) return <p>Loading users...</p>;

  return (
    <div className="py-10 px-4">
      {/* Header with search + button */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={handleSearchChange}
          className="mb-4 md:mb-0 p-2 border rounded w-full md:max-w-md"
        />
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Create User
        </button>
      </div>

      {/* User list */}
      {paginatedUsers.length ? (
        <>
          <div className="user-grid">
            {paginatedUsers.map((user) => (
              <UserCard
                key={user._id}
                name={user.name}
                profile={user.photo || "https://picsum.photos/200"}
                email={user.email}
                id={user._id}
              />
            ))}
          </div>

          <div className="mt-6 flex gap-2 justify-center items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p>No users found.</p>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New User</h2>
            <form onSubmit={handleCreateUser} className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="password"
                name="confirmpassword"
                placeholder="Confirm Password"
                value={formData.confirmpassword}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />

              {formStatus.message && (
                <p
                  className={`text-sm ${formStatus.type === "error" ? "text-red-600" : "text-green-600"
                    }`}
                >
                  {formStatus.message}
                </p>
              )}


              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormStatus({ type: "", message: "" });
                    setFormData({ name: "", email: "", password: "", confirmpassword: "" });
                  }}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default User;
