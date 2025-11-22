import { useState, useEffect } from "react";
import { Calendar, ExternalLink } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import FilterBar from "../Common/FilterBar/FilterBar";
import MessagePopup from "../Common/MessagePopup";


const CrossBrand = () => {
  const [data, setData] = useState(null);
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingSet, setLoadingSet] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Filter states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [quickDateFilter, setQuickDateFilter] = useState('');
  const [fetchLoading, setFetchLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  const token = Cookies.get("authToken");
  const API_URL = import.meta.env.VITE_API_URL;

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
  };

  const closeMessage = () => {
    setMessage({ text: "", type: "" });
  };

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/settings/category`, {
          headers: { 'Authorization': `${token}` },
          withCredentials: true,
        });

        if (response.data && response.data.data && response.data.data.category) {
          const categoryObjects = response.data.data.category.map((cat, index) => ({
            id: index,
            name: cat
          }));
          setCategories(categoryObjects);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, [API_URL, token]);

  // Fetch initial locations
  useEffect(() => {
    const fetchInitialLocations = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/location`, {
          headers: { Authorization: `${token}` },
          withCredentials: true,
        });

        if (response.data.status === 'success') {
          const locs = response.data.data.locations.map(loc => ({
            id: loc.coordinates?._id || loc._id,
            display: `${loc.addressLine} (${loc.pin})`,
            addressLine: loc.addressLine,
            pin: loc.pin,
          }));
          setLocations(locs);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchInitialLocations();
  }, [API_URL, token]);

  // Simple buildQuery function
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
      if (search.trim() !== '') {
        setSearchLoading(true);
      }
      setFetchLoading(true);
      setError(null);

      try {
        const queryParams = {};

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
  };

  // Handle location search
  const handleLocationSearch = async (searchTerm) => {
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      const url = `${API_URL}/api/location${params.toString() ? `?${params.toString()}` : ''}`;

      const response = await axios.get(url, {
        headers: { Authorization: `${token}` },
        withCredentials: true,
      });

      if (response.data.status === 'success') {
        const locs = response.data.data.locations.map(loc => ({
          id: loc.coordinates?._id || loc._id,
          display: `${loc.addressLine} (${loc.pin})`,
          addressLine: loc.addressLine,
          pin: loc.pin,
        }));
        return locs;
      }
      return [];
    } catch (error) {
      console.error('Error fetching locations:', error);
      return [];
    }
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
        showMessage("Coupon set successfully!", "success");
      } else {
        showMessage(result.message || "Failed to set coupon. Please try again.", "error");
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
      {message.text && (
        <MessagePopup
          message={message.text}
          type={message.type}
          onClose={closeMessage}
        />
      )}
      
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between mb-6 items-center flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-gray-700">
            Cross Brand Promotions
          </h1>
        </div>

        {/* 🔍 Filter Section */}
        <FilterBar
          search={search}
          setSearch={setSearch}
          searchLoading={searchLoading}
          placeholder="Search by promotion name..."
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          showStatus={true}
          statusOptions={[
            { value: "", label: "Statuses" },
            { value: "true", label: "Active" },
            { value: "false", label: "Inactive" },
          ]}
          showTypeFilter={true}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          typeOptions={[
            { value: "", label: "All Types" },
            { value: "cross", label: "Cross Brand" },
            { value: "own", label: "Own Brand" },
            { value: "offer", label: "Offer" },
          ]}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          quickDateFilter={quickDateFilter}
          setQuickDateFilter={setQuickDateFilter}
          showDates={true}
          showQuickFilter={true}
          showCategoryFilter={true}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          categories={categories}
          showLocationFilter={true}
          locationFilter={locationFilter}
          setLocationFilter={setLocationFilter}
          locations={locations}
          onLocationSearch={handleLocationSearch}
          onClearFilters={clearAllFilters}
          showSourceFilter={false}
        />

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