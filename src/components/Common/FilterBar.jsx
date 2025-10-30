// src/components/Common/FilterBar.jsx
import React from "react";
import { Search, Filter, Calendar, X } from "lucide-react";
import { formatLocalDate, addDays } from "../../utils/date";

const FilterBar = ({
  search,
  setSearch,
  searchLoading,
  statusFilter,
  setStatusFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  quickDateFilter,
  setQuickDateFilter,
  showStatus = true,
  showDates = true,
  showQuickFilter = true,
  placeholder = "Search...",
  statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "redeemed", label: "Redeemed" }
  ],
  quickFilterOptions = [
    { value: "", label: "Custom / All Time" },
    { value: "today", label: "Today" },
    { value: "7days", label: "Last 7 Days" },
    { value: "15days", label: "Last 15 Days" },
    { value: "1month", label: "Last 1 Month" }
  ],
  onQuickDateChange,
  onClearFilters, // Optional callback for parent component
}) => {

  // Check if any filters are active
  const hasActiveFilters = search || statusFilter || startDate || endDate || quickDateFilter;

  // Quick date filter logic
 

  const handleQuickDateFilterChange = (value) => {
    setQuickDateFilter(value);

    const todayLocal = new Date();
    let start = '';
    let end = formatLocalDate(addDays(todayLocal, 1));

    switch (value) {
      case 'today':
        start = formatLocalDate(addDays(todayLocal, -1));
        break;
      case '7days':
        start = formatLocalDate(addDays(todayLocal, -7));
        break;
      case '15days':
        start = formatLocalDate(addDays(todayLocal, -15));
        break;
      case '1month':
        start = formatLocalDate(addDays(todayLocal, -30));
        break;
      default:
        start = '';
        end = '';
    }

    setStartDate(start);
    setEndDate(end);

    if (onQuickDateChange) onQuickDateChange(value);

    // debug
    console.log('quick filter:', value, 'start', start, 'end', end);
  };


  // Handle manual date changes (reset quick filter)
  const handleStartDateChange = (value) => {
    setStartDate(value);
    setQuickDateFilter('');
  };

  const handleEndDateChange = (value) => {
    setEndDate(value);
    setQuickDateFilter('');
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setStartDate('');
    setEndDate('');
    setQuickDateFilter('');

    // Call parent callback if provided
    if (onClearFilters) {
      onClearFilters();
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md space-y-6 mb-5">
      {/* 🔍 Search Bar */}
      <div className="relative mx-auto">
        <input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 shadow-inner text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
        />
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />

        {searchLoading && (
          <div className="absolute right-4 top-3.5 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        )}
      </div>

      {/* 🔧 Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        {showStatus && (
          <div className="relative flex items-center">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-12 h-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200 appearance-none outline-none"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Filter className="absolute left-4 text-gray-400 pointer-events-none" size={16} />
          </div>
        )}

        {/* Date Filters */}
        {showDates && (
          <>
            <div className="relative flex items-center">
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 text-sm shadow-inner focus:ring-2 focus:ring-blue-500 transition duration-200 outline-none"
              />
              <Calendar className="absolute left-4 text-gray-400 pointer-events-none" size={16} />
            </div>
            <div className="relative flex items-center">
              <input
                type="date"
                value={endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 text-sm shadow-inner focus:ring-2 focus:ring-blue-500 transition duration-200 outline-none"
              />
              <Calendar className="absolute left-4 text-gray-400 pointer-events-none" size={16} />
            </div>
          </>
        )}

        {/* Quick Filter */}
        {showQuickFilter && (
          <div className="relative">
            <select
              value={quickDateFilter}
              onChange={(e) => handleQuickDateFilterChange(e.target.value)}
              className="w-full h-12 px-4 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200 appearance-none outline-none"
            >
              {quickFilterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex justify-end">
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition duration-200"
          >
            <X className="w-4 h-4" />
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;