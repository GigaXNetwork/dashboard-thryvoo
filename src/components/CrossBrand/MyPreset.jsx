import React, { useEffect, useState, useRef } from 'react';
import MessagePopup from '../Common/MessagePopup';
import PresetToggle from './PresetToggle';
import PresetCard from './presetCard';
import Cookies from "js-cookie";

const MyPreset = () => {
  const [presets, setPresets] = useState([]);
  const [filteredPresets, setFilteredPresets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [presetToDelete, setPresetToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Filter states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [quickDateFilter, setQuickDateFilter] = useState('');

  const menuRefs = useRef([]);
  const API_URL = import.meta.env.VITE_API_URL;
  const token = Cookies.get("authToken");

  // Build query function
  const buildQuery = (params) => {
    return Object.entries(params)
      .filter(([_, v]) => v !== '' && v !== undefined && v !== null)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&');
  };

  // Fetch cross brand presets with filters
  useEffect(() => {
    const fetchPresets = async () => {
      setFetchLoading(true);
      try {
        const queryParams = {
          ...(search ? { presetName: search.trim() } : {}),
          ...(statusFilter !== '' ? { isActive: statusFilter === 'true' } : {}),
          ...(typeFilter ? { type: typeFilter } : {}),
          ...(startDate ? { 'createdAt[gt]': startDate } : {}),
          ...(endDate ? { 'createdAt[lt]': endDate } : {}),
        };

        const url = `${API_URL}/api/cross-brand?${buildQuery(queryParams)}`;

        const res = await fetch(url, {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setPresets(data?.data.crossbrands || []);
          setFilteredPresets(data?.data.crossbrands || []);
        } else {
          setMessage('❌ Failed to fetch coupons.');
        }
      } catch (err) {
        console.error('Failed to fetch presets:', err);
        setMessage('❌ Error loading coupons.');
      } finally {
        setFetchLoading(false);
      }
    };

    const timeout = setTimeout(fetchPresets, 300);
    return () => clearTimeout(timeout);
  }, [search, statusFilter, typeFilter, startDate, endDate, API_URL, token]);

  // Handle quick date filter changes
  const handleQuickDateFilterChange = (value) => {
    setQuickDateFilter(value);
    const today = new Date();

    switch (value) {
      case 'today':
        const todayStr = today.toISOString().split('T')[0];
        setStartDate(todayStr);
        setEndDate(todayStr);
        break;
      case '7days':
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        setStartDate(sevenDaysAgo.toISOString().split('T')[0]);
        setEndDate(today.toISOString().split('T')[0]);
        break;
      case '15days':
        const fifteenDaysAgo = new Date(today);
        fifteenDaysAgo.setDate(today.getDate() - 15);
        setStartDate(fifteenDaysAgo.toISOString().split('T')[0]);
        setEndDate(today.toISOString().split('T')[0]);
        break;
      case '1month':
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(today.getMonth() - 1);
        setStartDate(oneMonthAgo.toISOString().split('T')[0]);
        setEndDate(today.toISOString().split('T')[0]);
        break;
      default:
        setStartDate('');
        setEndDate('');
        break;
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearch('');
    setStatusFilter('');
    setTypeFilter('');
    setStartDate('');
    setEndDate('');
    setQuickDateFilter('');
  };

  // Handle outside click for menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuIndex !== null &&
        menuRefs.current[openMenuIndex] &&
        !menuRefs.current[openMenuIndex].contains(event.target)) {
        setOpenMenuIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuIndex]);

  // Delete preset
  const handleDeletePreset = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/cross-brand/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        setMessage('✅ Coupon deleted successfully!');
        // Trigger a refetch
        setSearch(prev => prev + ' ');
        setTimeout(() => setSearch(prev => prev.trim()), 100);
      } else {
        setMessage('❌ Failed to delete coupon.');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      setMessage('❌ Error deleting coupon.');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-md min-h-screen">
      {message && (
        <MessagePopup
          message={message}
          type={message.includes('✅') ? 'success' : 'error'}
          onClose={() => setMessage('')}
        />
      )}

      <div className="flex justify-between mb-6 items-center flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-gray-700">Cross-Brand Coupons</h1>
      </div>

      {/* 🔍 Filter Section */}
      <div className="bg-white rounded-2xl p-6 shadow-md space-y-6 mb-5">
        {/* 🔍 Search Bar */}
        <div className="relative mx-auto">
          <input
            type="text"
            placeholder="Search by coupon name..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 shadow-inner text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
          />
          <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
          </svg>
          {/* Loading indicator */}
          {fetchLoading && (
            <div className="absolute right-4 top-3.5">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
            </div>
          )}
        </div>

        {/* 🔧 Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
              <option value="">Custom / All Time</option>
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="15days">Last 15 Days</option>
              <option value="1month">Last 1 Month</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        {(search || statusFilter || typeFilter || startDate || endDate) && (
          <div className="flex justify-end">
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-600 hover:text-gray-800 underline transition duration-200"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {fetchLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-2 text-gray-600">Loading coupons...</span>
        </div>
      )}

      {/* Results count */}
      {!fetchLoading && (
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredPresets.length} coupons
          {(search || statusFilter || typeFilter || startDate || endDate) && " (filtered)"}
          {search && (
            <span className="ml-1">for "{search}"</span>
          )}
        </div>
      )}

      {/* Coupons Grid */}
      {!fetchLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 my-6">
          {filteredPresets.length > 0 ? (
            filteredPresets.map((preset, index) => (
              <PresetCard
                key={preset._id || `preset-${index}`}
                preset={preset}
                index={index}
                openMenuIndex={openMenuIndex}
                setOpenMenuIndex={setOpenMenuIndex}
                setPresetToDelete={setPresetToDelete}
                setShowDeleteModal={setShowDeleteModal}
                menuRefs={menuRefs}
              />
            ))
          ) : (
            <div className="text-gray-500 col-span-full text-center py-10">
              {presets.length === 0
                ? "No coupons available"
                : "No coupons match your current filters."}
            </div>
          )}
        </div>
      )}

      {showDeleteModal && (
        <PresetToggle
          presetToDelete={presetToDelete}
          setShowDeleteModal={setShowDeleteModal}
          handleDeletePreset={handleDeletePreset}
          title="Delete Coupon"
          message="Are you sure you want to delete this coupon?"
        />
      )}
    </div>
  );
};

export default MyPreset;