import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import UserCard from "./UserCard";
import "./User.css";
import { Link } from "react-router";
import axios from "axios";
import { AlertCircle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Grid, LayoutGrid, List, Loader2, Plus, RefreshCw, RotateCcw, Search } from "lucide-react";
import { getAuthToken } from "../../Context/apiService";
import UserListCard from "./UserListCard";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";


const UserHeader = ({
  filters,
  onFilterChange,
  onResetFilters,
  layout,
  onLayoutChange,
  onCreateUser
}) => {
  const handleSearchChange = useCallback((e) => {
    onFilterChange('search', e.target.value);
  }, [onFilterChange]);

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
      <h1 className="text-2xl font-bold text-gray-800">User Management</h1>

      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px] sm:min-w-[260px] lg:min-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or email"
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full h-11 pl-10 pr-4 border border-gray-300 rounded-lg bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base outline-none"
          />
        </div>

        {/* Layout Toggle */}
        <div className="flex items-center bg-gray-100 rounded-lg py-1 px-1 min-h-[44px]">
          <button
            onClick={() => onLayoutChange("card")}
            className={`p-2 rounded-md transition-all flex items-center justify-center w-10 h-9 ${layout === "card"
              ? "bg-white text-blue-600 shadow"
              : "text-gray-600 hover:text-gray-800"
              }`}
            title="Card View"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => onLayoutChange("list")}
            className={`p-2 rounded-md transition-all flex items-center justify-center w-10 h-9 ${layout === "list"
              ? "bg-white text-blue-600 shadow"
              : "text-gray-600 hover:text-gray-800"
              }`}
            title="List View"
          >
            <List className="w-5 h-5" />
          </button>
        </div>

        {/* Reset Button */}
        <button
          onClick={onResetFilters}
          className="flex items-center gap-2 px-4 h-11 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 transition-colors"
          title="Reset Filters"
        >
          <RotateCcw className="h-5 w-5" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        {/* Create User Button */}
        <button
          onClick={onCreateUser}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 h-11 rounded-lg transition-colors font-medium"
        >
          <Plus className="h-5 w-5" />
          <span>Create User</span>
        </button>
      </div>
    </div>
  );
};

function User() {
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    limit: 8
  });
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [layout, setLayout] = useState("card");
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    hasNextPage: false,
    hasPreviousPage: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const maxVisiblePages = 5;

  // Build query parameters from filters
  const buildQueryParams = useCallback(() => {
    const params = {
      page: filters.page,
      limit: filters.limit,
    };

    if (filters.search.trim()) params.search = filters.search.trim();

    return params;
  }, [filters]);

  // Fetch users with query parameters
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = buildQueryParams();

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/users`,
        {
          params: queryParams,
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "Authorization": `${getAuthToken()}`
          },
        }
      );

      const result = response.data;
      if (result.status === "success") {
        setUsers(result.data.users || []);

        setPagination({
          totalItems: result.data.results || 0,
          itemsPerPage: result.data.itemsPerPage || filters.limit,
          currentPage: result.data.currentPage || filters.page,
          totalPages: result.data.totalPages || 1,
          hasNextPage: result.data.hasNextPage || false,
          hasPreviousPage: result.data.hasPreviousPage || false
        });
      }

    } catch (err) {
      console.error("Fetch failed:", err);
      setUsers([]);
      setPagination({
        totalItems: 0,
        totalPages: 1,
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false
      });
    } finally {
      setLoading(false);
    }
  }, [buildQueryParams, filters.limit, filters.page]);

  // Use a ref to track if this is the initial load
  const initialLoad = useRef(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchUsers();
      initialLoad.current = false;
    }, filters.search ? 500 : initialLoad.current ? 0 : 500); // No delay for initial load

    return () => clearTimeout(timeout);
  }, [filters.search, filters.page, filters.limit, fetchUsers]);

  const handleFilterChange = useCallback((name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
      ...(name !== 'page' && { page: 1 }) // Reset to first page when filters change
    }));
  }, []);

  const resetFilters = () => {
    setFilters({
      search: '',
      page: 1,
      limit: 8
    });
  };

  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters(prev => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pagination.totalPages]);

  const getPaginationRange = useMemo(() => {
    const { currentPage, totalPages } = pagination;

    // If total pages is less than max visible, show all
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const halfVisible = Math.floor(maxVisiblePages / 2);
    let startPage = currentPage - halfVisible;
    let endPage = currentPage + halfVisible;

    // Adjust if we're near the start
    if (currentPage <= halfVisible + 1) {
      startPage = 1;
      endPage = maxVisiblePages;
    }
    // Adjust if we're near the end
    else if (currentPage >= totalPages - halfVisible) {
      startPage = totalPages - maxVisiblePages + 1;
      endPage = totalPages;
    }

    const pages = [];

    // Always show first page
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      if (i > 0 && i <= totalPages) pages.push(i);
    }

    // Always show last page if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  }, [pagination.currentPage, pagination.totalPages]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    // Reset errors
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    };

    let hasError = false;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      hasError = true;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      hasError = true;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      hasError = true;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      hasError = true;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      hasError = true;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      hasError = true;
    }

    if (hasError) {
      setFormErrors(newErrors);
      return;
    }

    setCreating(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/users`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "Authorization": `${getAuthToken()}`
          },
        }
      );

      const result = response.data;

      if (result.status === "success") {
        toast.success("User created successfully!");
        setShowModal(false);
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
        setFormErrors({ name: "", email: "", password: "", confirmPassword: "" });
        fetchUsers();
      } else {
        toast.error(result.message || "Failed to create user.");
      }
    } catch (error) {
      console.error("Create user failed:", error);
      toast.error(error.response?.data?.message || "An unexpected error occurred.");
    } finally {
      setCreating(false)
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setFormStatus({ type: "", message: "" });
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    setFormErrors({ name: "", email: "", password: "", confirmPassword: "" });
  };

  if (loading && users.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
        <UserHeader
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={resetFilters}
          layout={layout}
          onLayoutChange={setLayout}
          onCreateUser={() => setShowModal(true)}
        />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
      {/* Header */}
      <UserHeader
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={resetFilters}
        layout={layout}
        onLayoutChange={setLayout}
        onCreateUser={() => setShowModal(true)}
      />

      {/* User list */}
      {users.length ? (
        <>
          {/* Loading overlay for existing content */}
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          <div className={layout === "card" ? "user-grid" : "space-y-4"}>
            {users.map((user) => (
              layout === "card" ? (
                <UserCard
                  key={user._id}
                  name={user.name}
                  profile={user?.photo}
                  email={user.email}
                  id={user._id}
                />
              ) : (
                <UserListCard
                  key={user._id}
                  name={user.name}
                  profile={user?.photo}
                  email={user.email}
                  id={user._id}
                />
              )
            ))}
          </div>

          {/* Enhanced Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
              {/* Items count */}
              <div className="text-sm text-gray-600 whitespace-nowrap">
                Showing {(filters.page - 1) * filters.limit + 1} to{' '}
                {Math.min(filters.page * filters.limit, pagination.totalItems)} of {pagination.totalItems} users
              </div>

              {/* Pagination controls */}
              <div className="flex items-center gap-1 w-full sm:w-auto justify-center sm:justify-normal">
                {/* Mobile: Compact navigation */}
                <div className="sm:hidden flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="p-2 rounded-md border bg-white shadow disabled:opacity-30 hover:bg-gray-50 transition-colors"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="px-3 py-1 text-sm font-medium text-gray-700">
                    {filters.page} / {pagination.totalPages}
                  </div>

                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={!pagination.hasNextPage}
                    className="p-2 rounded-md border bg-white shadow disabled:opacity-30 hover:bg-gray-50 transition-colors"
                    aria-label="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Desktop: Full navigation */}
                <div className="hidden sm:flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={filters.page === 1}
                    className="p-2 rounded-md border bg-white shadow disabled:opacity-30 hover:bg-gray-50 transition-colors"
                    aria-label="First Page"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="p-2 rounded-md border bg-white shadow disabled:opacity-30 hover:bg-gray-50 transition-colors"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1">
                    {getPaginationRange.map((page, idx) =>
                      page === '...' ? (
                        <span key={`ellipsis-${idx}`} className="px-2 py-1 text-gray-500">
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 flex items-center justify-center rounded-md border text-sm ${page === filters.page
                            ? 'bg-blue-600 text-white border-blue-600 font-medium'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                          aria-current={page === filters.page ? 'page' : undefined}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={!pagination.hasNextPage}
                    className="p-2 rounded-md border bg-white shadow disabled:opacity-30 hover:bg-gray-50 transition-colors"
                    aria-label="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handlePageChange(pagination.totalPages)}
                    disabled={filters.page === pagination.totalPages}
                    className="p-2 rounded-md border bg-white shadow disabled:opacity-30 hover:bg-gray-50 transition-colors"
                    aria-label="Last Page"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No users found</h3>
          <p className="mt-2 text-gray-500">Try adjusting your search or create a new user.</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Create New User
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999] p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Create New User</h2>
              <button
                onClick={handleModalClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4" noValidate>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 outline-none transition-colors ${formErrors.name
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 outline-none transition-colors ${formErrors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 outline-none transition-colors ${formErrors.password
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                />
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {formErrors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 outline-none transition-colors ${formErrors.confirmPassword
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                />
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {formErrors.confirmPassword}
                  </p>
                )}
              </div>

              {formStatus.message && (
                <div className={`p-3 rounded-lg ${formStatus.type === "error"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-green-50 text-green-700 border border-green-200"
                  }`}>
                  {formStatus.message}
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin" size={16} />
                      Creating...
                    </span>
                  ) : (
                    "Create User"
                  )}
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