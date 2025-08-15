import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import MessagePopup from '../Common/MessagePopup';
import MediaDetails from './MediaDetails';

function MediaRewards() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [mediaRewards, setMediaRewards] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [showDetailsCard, setShowDetailsCard] = useState({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [quickDateFilter, setQuickDateFilter] = useState('');

  const itemsPerPage = 10;
  const apiUrl = `${import.meta.env.VITE_API_URL}/api/social-media/media/allMedia`;

  useEffect(() => {
    const fetchMediaRewards = async () => {
      try {
        const params = new URLSearchParams({
          page: currentPage,
          limit: itemsPerPage,
          ...(search && { search: search.trim() }),
          ...(statusFilter && { status: statusFilter }),
          ...(startDate && { 'createdAt[gt]': startDate }),
          ...(endDate && { 'createdAt[lt]': endDate }),
        });

        const response = await fetch(`${apiUrl}?${params}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setMediaRewards(data.data.mediaRewards || []);
        setTotalPages(Math.ceil(data.results / itemsPerPage));
      } catch (error) {
        console.error('Error fetching media rewards:', error);
        setMessage('❌ Failed to fetch media rewards');
        setMessageType('error');
      }
    };

    const timeout = setTimeout(fetchMediaRewards, 300);
    return () => clearTimeout(timeout);
  }, [search, statusFilter, currentPage, startDate, endDate]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await fetch(`${apiUrl}/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setMessage('✅ Status updated successfully!');
      setMessageType('success');
      // Trigger refetch
      setSearch(prev => prev + ' ');
    } catch (error) {
      console.error("Error updating status:", error);
      setMessage('❌ Failed to update status');
      setMessageType('error');
    }
  };

  const getPaginationRange = () => {
    const delta = 1;
    let left = currentPage - delta;
    let right = currentPage + delta;

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

  const handleQuickDateFilterChange = (value) => {
    setQuickDateFilter(value);

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

    setStartDate(start);
    setEndDate(end);
  };

  const tableHeaders = ["Sl. No", "User", "Media Type", "Conditions", "Screenshot", "Status", "Actions"];

  return (
    <div className="p-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          📱 Media Rewards
        </h1>

        <NavLink
          to="/social-media"
          className="inline-flex items-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add New
        </NavLink>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-md space-y-6 mb-5">
        {/* Search Bar */}
        <div className="relative mx-auto">
          <input
            type="text"
            placeholder="🔍 Search by user name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 shadow-inner text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
          />
          <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
          </svg>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
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
      </div>

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
              {mediaRewards.map((reward, index) => {
                const statusColor = reward.status === 'Approved' 
                  ? 'text-green-600' 
                  : reward.status === 'Rejected' 
                    ? 'text-red-600' 
                    : 'text-yellow-600';

                return (
                  <tr key={reward._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <img 
                          src={reward.account.photo || 'https://via.placeholder.com/50'} 
                          alt={reward.account.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <span>{reward.account.name}</span>
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
                          conditions={reward.social.conditions}
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
                        onClick={() => handleStatusUpdate(reward._id, 'Approved')}
                        className={`px-3 py-1 rounded ${reward.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-gray-100 hover:bg-green-50'}`}
                        disabled={reward.status === 'Approved'}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(reward._id, 'Rejected')}
                        className={`px-3 py-1 rounded ${reward.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 hover:bg-red-50'}`}
                        disabled={reward.status === 'Rejected'}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
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
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-md border text-sm shadow ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-white hover:bg-blue-50 text-gray-700'}`}
            >
              {page}
            </button>
          )
        ))}
        <button
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-2 rounded border bg-white shadow disabled:opacity-40 hover:bg-gray-50"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

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