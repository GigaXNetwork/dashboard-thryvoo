import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import MessagePopup from '../Common/MessagePopup';
import MediaDetails from './MediaDetails';
import Cookies from "js-cookie";
import FilterBar from '../Common/FilterBar';

function MediaRewards() {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    startDate: '',
    endDate: '',
    quickDateFilter: '',
    page: 1
  });
  const [mediaRewards, setMediaRewards] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [showDetailsCard, setShowDetailsCard] = useState({});
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const itemsPerPage = 10;
  const token = Cookies.get('authToken');
  const apiUrl = `${import.meta.env.VITE_API_URL}/api/social-media/media/allMedia`;

  // Custom status options for Media Rewards
  const mediaStatusOptions = [
    { value: "", label: "All Statuses" },
    { value: "Pending", label: "Pending" },
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" }
  ];

  // Memoized fetch function
  const fetchMediaRewards = useCallback(async () => {
    try {
      setSearchLoading(true);
      const params = {
        page: filters.page,
        limit: itemsPerPage,
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
        ...(filters.startDate && { 'createdAt[gte]': filters.startDate }),
        ...(filters.endDate && { 'createdAt[lte]': filters.endDate }),
      };

      const response = await axios.get(apiUrl, {
        params,
        headers: { 
          'Content-Type': 'application/json',
          "Authorization": `${token}`
        }
      });

      setMediaRewards(response.data.data.mediaRewards || []);
      setTotalPages(Math.ceil(response.data.results / itemsPerPage));
    } catch (error) {
      console.error('Error fetching media rewards:', error);
      setMessage('❌ Failed to fetch media rewards');
      setMessageType('error');
    } finally {
      setSearchLoading(false);
    }
  }, [filters, itemsPerPage, apiUrl, token]);

  useEffect(() => {
    const debounceTimer = setTimeout(fetchMediaRewards, 300);
    return () => clearTimeout(debounceTimer);
  }, [fetchMediaRewards]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
      ...(name !== 'page' && { page: 1 })
    }));
  };

  // Handler for FilterBar's quick date filter
  const handleQuickDateFilterChange = (value) => {
    const today = new Date();
    let start = '';
    let end = today.toISOString().split('T')[0];

    switch (value) {
      case 'today':
        start = end;
        break;
      case '7days':
        start = new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0];
        break;
      case '15days':
        start = new Date(today.setDate(today.getDate() - 15)).toISOString().split('T')[0];
        break;
      case '1month':
        start = new Date(today.setMonth(today.getMonth() - 1)).toISOString().split('T')[0];
        break;
      default:
        start = '';
        end = '';
    }

    setFilters(prev => ({
      ...prev,
      quickDateFilter: value,
      startDate: start,
      endDate: end,
      page: 1
    }));
  };

  // Handler for clearing all filters
  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: '',
      startDate: '',
      endDate: '',
      quickDateFilter: '',
      page: 1
    });
  };

  const handleStatusUpdate = async (id, action) => {
    try {
      const endpoint = action === 'approve'
        ? `${import.meta.env.VITE_API_URL}/api/social-media/media/${id}/approve`
        : `${import.meta.env.VITE_API_URL}/api/social-media/media/${id}/reject`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Optimistic UI update
      setMediaRewards(prev => prev.map(reward =>
        reward._id === id
          ? { ...reward, status: action === 'approve' ? 'Approved' : 'Rejected' }
          : reward
      ));

      setMessage(`✅ Media reward ${action}d successfully!`);
      setMessageType('success');
    } catch (error) {
      console.error(`Error ${action}ing media reward:`, error);
      setMessage(`❌ Failed to ${action} media reward`);
      setMessageType('error');
      fetchMediaRewards();
    }
  };

  const getPaginationRange = () => {
    const delta = 1;
    let left = filters.page - delta;
    let right = filters.page + delta;

    if (left < 2) {
      right += 2 - left;
      left = 2;
    }

    if (right > totalPages - 1) {
      left -= right - (totalPages - 1);
      right = totalPages - 1;
    }

    left = Math.max(left, 2);

    const range = [1];
    if (left > 2) range.push('...');
    for (let i = left; i <= right; i++) range.push(i);
    if (right < totalPages - 1) range.push('...');
    if (totalPages > 1) range.push(totalPages);
    return range;
  };

  const tableHeaders = ["Sl. No", "User", "Media Type", "Conditions", "Screenshot", "Status", "Actions"];

  return (
    <div className="px-8 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-700 tracking-tight">
          Media Rewards
        </h1>

        <NavLink
          to="/social-media"
          className="inline-flex items-center px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-200"
        >
          + Add New
        </NavLink>
      </div>

      {/* FilterBar Component */}
      <FilterBar
        search={filters.search}
        setSearch={(value) => handleFilterChange('search', value)}
        searchLoading={searchLoading}
        statusFilter={filters.status}
        setStatusFilter={(value) => handleFilterChange('status', value)}
        startDate={filters.startDate}
        setStartDate={(value) => handleFilterChange('startDate', value)}
        endDate={filters.endDate}
        setEndDate={(value) => handleFilterChange('endDate', value)}
        quickDateFilter={filters.quickDateFilter}
        setQuickDateFilter={(value) => handleFilterChange('quickDateFilter', value)}
        onQuickDateChange={handleQuickDateFilterChange}
        onClearFilters={handleClearFilters}
        placeholder="Search..."
        statusOptions={mediaStatusOptions}
        showStatus={true}
        showDates={true}
        showQuickFilter={true}
        quickFilterOptions={[
          { value: "", label: "Custom / All Time" },
          { value: "today", label: "Today" },
          { value: "7days", label: "Last 7 Days" },
          { value: "15days", label: "Last 15 Days" },
          { value: "1month", label: "Last 1 Month" }
        ]}
        className="mb-6"
      />

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="max-w-full overflow-x-auto">
          <table className="min-w-full w-max text-sm bg-white">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                {tableHeaders.map((heading, i) => (
                  <th key={i} className="px-6 py-3 text-center">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mediaRewards.length > 0 ? (
                mediaRewards.map((reward, index) => {
                  const statusColor = reward.status === 'Approved'
                    ? 'text-green-600'
                    : reward.status === 'Rejected'
                      ? 'text-red-600'
                      : 'text-yellow-600';

                  return (
                    <tr key={reward._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-center">{(filters.page - 1) * itemsPerPage + index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <img
                              src={reward.account.photo || 'https://via.placeholder.com/50'}
                              alt={reward.account.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                          </div>
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900 capitalize">{reward.account.name}</span>
                              {reward.account.verified && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  Verified
                                </span>
                              )}
                            </div>
                            <a
                              href={`mailto:${reward.account.email}`}
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                            >
                              {reward.account.email}
                            </a>
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{new Date(reward.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium capitalize text-center">{reward.mediaType}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          className="text-blue-600 hover:underline font-medium"
                          onClick={() => {
                            setShowDetailsCard(prev => ({ ...prev, [reward._id]: true }));
                            setSelectedMedia(reward);
                          }}
                        >
                          View Conditions
                        </button>
                        {showDetailsCard[reward._id] && (
                          <MediaDetails
                            conditions={reward.social?.conditions}
                            onClose={() => setShowDetailsCard(prev => ({ ...prev, [reward._id]: false }))}
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <img
                          src={reward.screen_shot}
                          alt="Media screenshot"
                          className="w-16 h-16 object-cover mx-auto cursor-pointer hover:opacity-80"
                          onClick={() => window.open(reward.screen_shot, '_blank')}
                        />
                      </td>
                      <td className={`px-6 py-4 font-medium text-center ${statusColor}`}>
                        {reward.status}
                      </td>
                      <td className="px-6 py-4 text-center space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(reward._id, 'approve')}
                          className={`px-3 py-1 rounded ${reward.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-gray-100 hover:bg-green-50'}`}
                          disabled={reward.status === 'Approved'}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(reward._id, 'reject')}
                          className={`px-3 py-1 rounded ${reward.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 hover:bg-red-50'}`}
                          disabled={reward.status === 'Rejected'}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={tableHeaders.length} className="px-6 py-4 text-center text-gray-500">
                    No media rewards found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            onClick={() => handleFilterChange('page', Math.max(filters.page - 1, 1))}
            disabled={filters.page === 1}
            className="p-2 rounded border bg-white shadow disabled:opacity-40 hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {getPaginationRange().map((page, idx) => (
            typeof page === 'string' ? (
              <span key={idx} className="px-2 py-1 text-gray-500">…</span>
            ) : (
              <button
                key={page}
                onClick={() => handleFilterChange('page', page)}
                className={`px-3 py-1 rounded-md border text-sm shadow ${filters.page === page ? 'bg-blue-600 text-white' : 'bg-white hover:bg-blue-50 text-gray-700'}`}
              >
                {page}
              </button>
            )
          ))}
          <button
            onClick={() => handleFilterChange('page', Math.min(filters.page + 1, totalPages))}
            disabled={filters.page === totalPages}
            className="p-2 rounded border bg-white shadow disabled:opacity-40 hover:bg-gray-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Message Popup */}
      {message && (
        <MessagePopup
          message={message}
          type={messageType}
          onClose={() => setMessage('')}
        />
      )}
    </div>
  );
}

export default MediaRewards;