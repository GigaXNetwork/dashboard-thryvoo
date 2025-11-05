import { useState, useEffect, useRef } from "react";
import { Search, Calendar, ExternalLink, ChevronDown, X } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const CrossBrand = () => {
  const [data, setData] = useState(null);
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingSet, setLoadingSet] = useState(null);

  // Filter states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [quickDateFilter, setQuickDateFilter] = useState('');
  const [fetchLoading, setFetchLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // New filter states
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [categorySearch, setCategorySearch] = useState('');
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [locationSearch, setLocationSearch] = useState('');

  const token = Cookies.get("authToken");
  const API_URL = import.meta.env.VITE_API_URL;

  // Refs for dropdown closing
  const categoryDropdownRef = useRef(null);
  const locationDropdownRef = useRef(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/settings/category`, {
          headers: { 'Authorization': `${token}` },
          withCredentials: true,
        });

        if (response.data && response.data.data && response.data.data.category) {
          // Convert array of category strings to objects with id and name
          const categoryObjects = response.data.data.category.map((cat, index) => ({
            id: index, // Using index as id since API returns array of strings
            name: cat
          }));
          setCategories(categoryObjects);
          setFilteredCategories(categoryObjects);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, [API_URL, token]);

  // Filter categories based on search
  useEffect(() => {
    if (categorySearch.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category =>
        category.name?.toLowerCase().includes(categorySearch.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [categorySearch, categories]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Simple buildQuery function - send dates as YYYY-MM-DD
  const buildQuery = (params) => {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== '' && value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });

    return queryParams.toString();
  };

  // Fetch cross brand data with filters
  useEffect(() => {
    const fetchCrossBrandData = async () => {
      setFetchLoading(true);
      setError(null);

      try {
        // Build query params object
        const queryParams = {};

        // Add search filter
        if (search) {
          queryParams.search = search.trim();
        }

        if (statusFilter !== '') {
          queryParams.isActive = statusFilter === 'true';
        }

        if (typeFilter) {
          queryParams.type = typeFilter;
        }

        if (startDate) {
          queryParams['createdAt[gt]'] = startDate;
        }

        if (endDate) {
          queryParams['createdAt[lt]'] = endDate;
        }

        // Add new filters
        if (categoryFilter) {
          queryParams.category = categoryFilter;
        }

        if (locationFilter) {
          queryParams.location = locationFilter;
        }

        const queryString = buildQuery(queryParams);
        const url = `${API_URL}/api/cross-brand/store${queryString ? `?${queryString}` : ''}`;

        const response = await axios.get(url, {
          headers: { 'Authorization': `${token}` },
          withCredentials: true,
        });

        const allPresets = response.data.data.crossBrand.flatMap((brand) =>
          brand.presets.map((preset) => ({
            ...preset,
            brandInfo: brand.card,
          }))
        );

        setData(response.data);
        setFilteredPromotions(allPresets);
      } catch (err) {
        console.error("Failed to fetch cross brand data:", err);
        setError("Failed to load promotions. Please try again later.");
      } finally {
        setIsLoading(false);
        setFetchLoading(false);
        setSearchLoading(false);
      }
    };

    const timeout = setTimeout(() => {
      fetchCrossBrandData();
    }, 300);

    return () => clearTimeout(timeout);
  }, [API_URL, token, search, statusFilter, typeFilter, startDate, endDate, categoryFilter, locationFilter]);

  // Handle search with separate loading state
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    if (e.target.value.trim()) {
      setSearchLoading(true);
    }
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setCategoryFilter(category.name);
    setShowCategoryDropdown(false);
    setCategorySearch('');
  };

  // Handle location selection (for now, using mock data)
  const handleLocationSelect = (location) => {
    setLocationFilter(location);
    setShowLocationDropdown(false);
    setLocationSearch('');
  };

  // Clear category filter
  const clearCategoryFilter = () => {
    setCategoryFilter('');
    setCategorySearch('');
  };

  // Clear location filter
  const clearLocationFilter = () => {
    setLocationFilter('');
    setLocationSearch('');
  };

  // Handle quick date filter changes - send simple date strings
  const handleQuickDateFilterChange = (value) => {
    setQuickDateFilter(value);
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    switch (value) {
      case 'today':
        setStartDate(todayStr);
        setEndDate(todayStr);
        break;
      case '7days':
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        setStartDate(sevenDaysAgo.toISOString().split('T')[0]);
        setEndDate(todayStr);
        break;
      case '15days':
        const fifteenDaysAgo = new Date(today);
        fifteenDaysAgo.setDate(today.getDate() - 15);
        setStartDate(fifteenDaysAgo.toISOString().split('T')[0]);
        setEndDate(todayStr);
        break;
      case '1month':
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(today.getMonth() - 1);
        setStartDate(oneMonthAgo.toISOString().split('T')[0]);
        setEndDate(todayStr);
        break;
      default:
        setStartDate('');
        setEndDate('');
        break;
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearch('');
    setStatusFilter('');
    setTypeFilter('');
    setStartDate('');
    setEndDate('');
    setQuickDateFilter('');
    setCategoryFilter('');
    setLocationFilter('');
    setCategorySearch('');
    setLocationSearch('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No expiration";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getDiscountText = (promotion) => {
    if (promotion.discountType === "percentage") {
      return `${promotion.discountAmount}% Off`;
    } else if (promotion.discountType === "fixed") {
      return `₹${promotion.discountAmount} Off`;
    } else {
      return promotion.discountAmount;
    }
  };

  const getStatusBadge = (promotion) => {
    const now = new Date();
    const expireDate = promotion.expireAt ? new Date(promotion.expireAt) : null;

    if (!promotion.isActive) {
      return { text: "Inactive", color: "bg-red-100 text-red-700" };
    }

    if (expireDate && expireDate < now) {
      return { text: "Expired", color: "bg-gray-100 text-gray-700" };
    }

    return { text: "Active", color: "bg-green-100 text-green-700" };
  };

  // Handle setting a coupon
  const handleSetCoupon = async (presetId) => {
    setLoadingSet(presetId);
    try {
      const response = await fetch(`${API_URL}/api/cross-brand/${presetId}/set`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Coupon set successfully!")
      } else {
        toast.error( result.message || "Failed to set coupon. Please try again.")
      }
    } catch (err) {
      console.error("Failed to set coupon:", err);
      alert("Failed to set coupon. Please try again.");
    } finally {
      setLoadingSet(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between mb-6 items-center flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-gray-700">
            Cross Brand Promotions
          </h1>
        </div>

        {/* 🔍 Filter Section */}
        <div className="bg-white rounded-2xl p-6 shadow-md space-y-6 mb-8">
          {/* 🔍 Search Bar */}
          <div className="relative mx-auto">
            <input
              type="text"
              placeholder="Search by promotion name..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 shadow-inner text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
            />
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
            {/* Search loading indicator - only shows during search */}
            {searchLoading && (
              <div className="absolute right-4 top-3.5">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>

          {/* 🔧 Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
                <option value="">All Statuses</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>

            {/* Type Filter */}
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
                <option value="">All Types</option>
                <option value="cross">Cross Brand</option>
                <option value="own">Own Brand</option>
                <option value="offer">Offer</option>
              </select>
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>

            {/* Start Date */}
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setQuickDateFilter('');
                  setStartDate(e.target.value);
                }}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm shadow-inner focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>

            {/* End Date */}
            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setQuickDateFilter('');
                  setEndDate(e.target.value);
                }}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm shadow-inner focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>

            {/* Quick Filter Dropdown */}
            <div className="relative">
              <select
                value={quickDateFilter}
                onChange={(e) => handleQuickDateFilterChange(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
                <option value="">Quick Date Filter</option>
                <option value="today">Today</option>
                <option value="7days">Last 7 Days</option>
                <option value="15days">Last 15 Days</option>
                <option value="1month">Last 1 Month</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {/* Category Filter */}
            <div className="relative w-full" ref={categoryDropdownRef}>
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200 flex items-center justify-between"
              >
                <span className="truncate">
                  {categoryFilter || "All Categories"}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
              </button>
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>

              {/* Category Dropdown */}
              {showCategoryDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-hidden">
                  {/* Search inside dropdown */}
                  <div className="p-2 border-b border-gray-200">
                    <div className="relative">
                      <Search className="absolute left-2 top-2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search categories..."
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        className="w-full pl-8 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                      {categorySearch && (
                        <button
                          onClick={() => setCategorySearch('')}
                          className="absolute right-2 top-3 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Category list */}
                  <div className="max-h-48 overflow-y-auto">
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => handleCategorySelect(category)}
                          className={`w-full text-left px-4 py-2 hover:bg-blue-50 text-sm ${categoryFilter === category.name ? 'bg-blue-100 text-blue-700' : ''
                            }`}
                        >
                          {category.name}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500 text-center">
                        No categories found
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Clear category button */}
              {categoryFilter && (
                <button
                  onClick={clearCategoryFilter}
                  className="absolute right-10 top-4 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Location Filter */}
            <div className="relative w-full" ref={locationDropdownRef}>
              <button
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200 flex items-center justify-between"
              >
                <span className="truncate">
                  {locationFilter || "All Locations"}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} />
              </button>
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>

              {/* Location Dropdown - For now using mock data */}
              {showLocationDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-hidden">
                  {/* Search inside dropdown */}
                  <div className="p-2 border-b border-gray-200">
                    <div className="relative">
                      <Search className="absolute left-2 top-2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search locations..."
                        value={locationSearch}
                        onChange={(e) => setLocationSearch(e.target.value)}
                        className="w-full pl-8 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                      {locationSearch && (
                        <button
                          onClick={() => setLocationSearch('')}
                          className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="max-h-48 overflow-y-auto">
                    <button
                      onClick={() => handleLocationSelect('Mumbai')}
                      className={`w-full text-left px-4 py-2 hover:bg-blue-50 text-sm ${locationFilter === 'Mumbai' ? 'bg-blue-100 text-blue-700' : ''
                        }`}
                    >
                      Mumbai
                    </button>
                    <button
                      onClick={() => handleLocationSelect('Delhi')}
                      className={`w-full text-left px-4 py-2 hover:bg-blue-50 text-sm ${locationFilter === 'Delhi' ? 'bg-blue-100 text-blue-700' : ''
                        }`}
                    >
                      Delhi
                    </button>
                    <button
                      onClick={() => handleLocationSelect('Bangalore')}
                      className={`w-full text-left px-4 py-2 hover:bg-blue-50 text-sm ${locationFilter === 'Bangalore' ? 'bg-blue-100 text-blue-700' : ''
                        }`}
                    >
                      Bangalore
                    </button>
                    <button
                      onClick={() => handleLocationSelect('Chennai')}
                      className={`w-full text-left px-4 py-2 hover:bg-blue-50 text-sm ${locationFilter === 'Chennai' ? 'bg-blue-100 text-blue-700' : ''
                        }`}
                    >
                      Chennai
                    </button>
                  </div>
                </div>
              )}

              {/* Clear location button */}
              {locationFilter && (
                <button
                  onClick={clearLocationFilter}
                  className="absolute right-8 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          {/* Clear Filters Button */}
          <div className="flex justify-end">
            {(search || statusFilter || typeFilter || startDate || endDate || categoryFilter || locationFilter) && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-600 hover:text-blue-500 underline transition duration-200"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        {/* Global loading indicator */}
        {fetchLoading && (
          <div className="flex justify-center items-center py-4 mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading promotions...</span>
          </div>
        )}

        {/* Results count */}
        {!isLoading && !fetchLoading && (
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredPromotions.length} promotions
            {(search || statusFilter || typeFilter || startDate || endDate || categoryFilter || locationFilter) && " (filtered)"}
            {search && (
              <span className="ml-1">for "{search}"</span>
            )}
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md h-52 animate-pulse"
              />
            ))}
          </div>
        ) : filteredPromotions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPromotions.map((promotion) => {
              const status = getStatusBadge(promotion);

              return (
                <div
                  key={promotion._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 border border-gray-100"
                >
                  {/* Brand Info */}
                  <div className="flex items-center gap-3 mb-4">
                    {promotion.brandInfo.logo ? (
                      <img
                        src={promotion.brandInfo.logo}
                        alt={promotion.brandInfo.name}
                        className="w-12 h-12 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium">
                        {promotion.brandInfo.name?.charAt(0) || "B"}
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {promotion.brandInfo.name || "Unknown Brand"}
                      </h3>
                      <p className="text-xs text-gray-500 truncate max-w-[180px]">
                        {promotion.brandInfo.address || "No address"}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}
                  >
                    {status.text}
                  </span>

                  {/* Promotion Title */}
                  <h2 className="text-lg font-medium text-gray-900 mt-3 mb-1">
                    {promotion.presetName}
                  </h2>

                  {/* Discount */}
                  <p className="text-blue-600 font-semibold mb-3">
                    {getDiscountText(promotion)}{" "}
                    {promotion.maxDiscount && (
                      <span className="text-gray-500 text-sm">
                        (Upto ₹{promotion.maxDiscount})
                      </span>
                    )}
                  </p>

                  {/* Expiry */}
                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <Calendar className="h-3 w-3 mr-1" />
                    Expires: {formatDate(promotion.expireAt)}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    {promotion.link && (
                      <a
                        href={promotion.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm inline-flex items-center hover:underline"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Visit Offer
                      </a>
                    )}
                    <button
                      onClick={() => handleSetCoupon(promotion._id)}
                      disabled={loadingSet === promotion._id}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm px-4 py-2 rounded-lg"
                    >
                      {loadingSet === promotion._id ? "Setting..." : "Set Coupon"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12">
            {data?.data?.crossBrand?.length === 0
              ? "No promotions found."
              : "No promotions match your current filters."}
          </div>
        )}
      </div>
    </div>
  );
};

export default CrossBrand;