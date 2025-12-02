import React, { useEffect, useState, useRef } from 'react';
import MessagePopup from '../Common/MessagePopup';
import PresetToggle from './PresetToggle';
import Cookies from "js-cookie";
import { Api, getAuthToken } from '../../Context/apiService';
import CrossPresetCard from './CrossPresetCard';
import FilterBar from '../Common/FilterBar/FilterBar';

const MyPreset = () => {
  const [presets, setPresets] = useState([]);
  const [filteredPresets, setFilteredPresets] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [presetToDelete, setPresetToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [presetToAssign, setPresetToAssign] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignType, setAssignType] = useState(''); // 'special-offer' or 'spin-to-win'

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
      if (search.trim() !== '') {
        setSearchLoading(true);
      }
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
        setSearchLoading(false);
        setFetchLoading(false);
      }
    };

    const timeout = setTimeout(fetchPresets, 300);
    return () => clearTimeout(timeout);
  }, [search, statusFilter, typeFilter, startDate, endDate, API_URL, token]);

  // Clear all filters
  const clearAllFilters = () => {
    setSearch('');
    setStatusFilter('');
    setTypeFilter('');
    setStartDate('');
    setEndDate('');
    setQuickDateFilter('');
    setSearchLoading(false);
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
  const handleDeletePreset = async (presetToDelete) => {
    const id = presetToDelete.crossBrand
    try {
      const res = await fetch(`${API_URL}/api/cross-brand/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': getAuthToken()
        }
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

  // Open assign modal
  const handleOpenAssignModal = (preset) => {
    setPresetToAssign(preset);
    setShowAssignModal(true);
    setAssignType('');
  };

  // Handle assign to special offer or spin to win
  const handleAssign = async () => {
    if (!presetToAssign || !assignType) return;

    setAssignLoading(true);
    try {
      const crossBrandId = presetToAssign.crossBrand;
      let res;

      if (assignType === 'special-offer') {
        res = await Api.assignToSpecialOffer(crossBrandId);
      } else if (assignType === 'spin-to-win') {
        res = await Api.assignToSpinToWin(crossBrandId);
      }

      if (res.status === "success") {
        const actionText = assignType === 'special-offer' ? 'special offers' : 'spin to win';
        setMessage(`✅ Coupon assigned to ${actionText} successfully!`);
        setSearch(prev => prev + ' ');
        setTimeout(() => setSearch(prev => prev.trim()), 100);
      } else {
        setMessage(`❌ ${res.message || `Failed to assign coupon to ${assignType}.`}`);
      }
    } catch (err) {
      console.error('Assign failed:', err);
      setMessage(`❌ Error assigning coupon to ${assignType}.`);
    } finally {
      setAssignLoading(false);
      setShowAssignModal(false);
      setPresetToAssign(null);
      setAssignType('');
    }
  };

  // Close assign modal
  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    setPresetToAssign(null);
    setAssignType('');
    setAssignLoading(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 rounded-lg shadow-md min-h-screen">
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

      {/* 🔍 Updated FilterBar with Latest Props */}
      <FilterBar
        // Core search
        search={search}
        setSearch={setSearch}
        searchLoading={searchLoading}
        placeholder="Search by coupon name..."
        
        // Status filter
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        showStatus={true}
        statusOptions={[
          { value: '', label: 'All Statuses' },
          { value: 'true', label: 'Active' },
          { value: 'false', label: 'Inactive' }
        ]}
        
        // Type filter
        showTypeFilter={true}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        typeOptions={[
          { value: '', label: 'All Types' },
          { value: 'cross', label: 'Cross Brand' },
          { value: 'own', label: 'Own Brand' },
          { value: 'offer', label: 'Offer' }
        ]}
        
        // Date filters
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        quickDateFilter={quickDateFilter}
        setQuickDateFilter={setQuickDateFilter}
        showDates={true}
        showQuickFilter={true}
        
        // Clear all handler
        onClearFilters={clearAllFilters}
        
        // Hide unused filters
        showCategoryFilter={false}
        showLocationFilter={false}
        showSourceFilter={false}
      />

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
              <CrossPresetCard
                key={preset._id || `preset-${index}`}
                preset={preset}
                index={index}
                openMenuIndex={openMenuIndex}
                setOpenMenuIndex={setOpenMenuIndex}
                setPresetToDelete={setPresetToDelete}
                setShowDeleteModal={setShowDeleteModal}
                setPresetToAssign={handleOpenAssignModal}
                setShowAssignModal={setShowAssignModal}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <PresetToggle
          presetToDelete={presetToDelete}
          setShowDeleteModal={setShowDeleteModal}
          handleDeletePreset={handleDeletePreset}
          title="Delete Coupon"
          message="Are you sure you want to delete this coupon?"
        />
      )}

      {/* Assign Modal with Two Options */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Assign Coupon</h2>
            <p className="text-gray-600 mb-6">Choose where to assign this coupon:</p>
            
            {/* Assignment Options */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => setAssignType('special-offer')}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                  assignType === 'special-offer'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                }`}
              >
                <div className="font-medium text-gray-800">Special Offer</div>
                <div className="text-sm text-gray-600 mt-1">Assign this coupon to special offers section</div>
              </button>

              <button
                onClick={() => setAssignType('spin-to-win')}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                  assignType === 'spin-to-win'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                }`}
              >
                <div className="font-medium text-gray-800">Spin to Win</div>
                <div className="text-sm text-gray-600 mt-1">Assign this coupon to spin to win game</div>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseAssignModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                disabled={assignLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={!assignType || assignLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-2"
              >
                {assignLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Assigning...
                  </>
                ) : (
                  `Assign to ${assignType === 'special-offer' ? 'Special Offer' : assignType === 'spin-to-win' ? 'Spin to Win' : ''}`
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPreset;