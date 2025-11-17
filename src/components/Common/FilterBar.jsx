// // src/components/Common/FilterBar.jsx
// import React from "react";
// import { Search, Filter, Calendar, X, Tag } from "lucide-react";
// import { formatLocalDate, addDays } from "../../utils/date";

// const FilterBar = ({
//   search,
//   setSearch,
//   searchLoading,
//   statusFilter,
//   setStatusFilter,
//   startDate,
//   setStartDate,
//   endDate,
//   setEndDate,
//   quickDateFilter,
//   setQuickDateFilter,
//   showStatus = true,
//   showDates = true,
//   showQuickFilter = true,
//   showTypeFilter = false,
//   placeholder = "Search...",
//   statusOptions = [
//     { value: "", label: "All Statuses" },
//     { value: "active", label: "Active" },
//     { value: "redeemed", label: "Redeemed" }
//   ],
//   quickFilterOptions = [
//     { value: "", label: "Custom / All Time" },
//     { value: "today", label: "Today" },
//     { value: "7days", label: "Last 7 Days" },
//     { value: "15days", label: "Last 15 Days" },
//     { value: "1month", label: "Last 1 Month" }
//   ],
//   typeFilter, // New prop for type filter - optional
//   setTypeFilter, // New prop for type filter - optional
//   typeOptions = [ // New prop for type options - optional
//     { value: "", label: "All Types" },
//     { value: "own", label: "Own Promotion" },
//     { value: "cross", label: "Cross Promotion" },
//     { value: "offer", label: "Special Offer" }
//   ],
//   onQuickDateChange,
//   onClearFilters,
// }) => {

//   // Check if any filters are active - include typeFilter only if showTypeFilter is true
//   const hasActiveFilters = search || statusFilter || startDate || endDate || quickDateFilter || (showTypeFilter && typeFilter);

//   // Quick date filter logic
//   const handleQuickDateFilterChange = (value) => {
//     setQuickDateFilter(value);

//     const todayLocal = new Date();
//     let start = '';
//     let end = formatLocalDate(addDays(todayLocal, 1));

//     switch (value) {
//       case 'today':
//         start = formatLocalDate(addDays(todayLocal, -1));
//         break;
//       case '7days':
//         start = formatLocalDate(addDays(todayLocal, -7));
//         break;
//       case '15days':
//         start = formatLocalDate(addDays(todayLocal, -15));
//         break;
//       case '1month':
//         start = formatLocalDate(addDays(todayLocal, -30));
//         break;
//       default:
//         start = '';
//         end = '';
//     }

//     setStartDate(start);
//     setEndDate(end);

//     if (onQuickDateChange) onQuickDateChange(value);
//   };

//   // Handle manual date changes (reset quick filter)
//   const handleStartDateChange = (value) => {
//     setStartDate(value);
//     setQuickDateFilter('');
//   };

//   const handleEndDateChange = (value) => {
//     setEndDate(value);
//     setQuickDateFilter('');
//   };

//   // Clear all filters - conditionally clear typeFilter
//   const handleClearFilters = () => {
//     setSearch('');
//     setStatusFilter('');
//     setStartDate('');
//     setEndDate('');
//     setQuickDateFilter('');
//     if (showTypeFilter && setTypeFilter) {
//       setTypeFilter('');
//     }

//     // Call parent callback if provided
//     if (onClearFilters) {
//       onClearFilters();
//     }
//   };

//   // Calculate grid columns based on visible filters
//   const getGridColumns = () => {
//     let visibleFilters = 0;
//     if (showStatus) visibleFilters++;
//     if (showTypeFilter) visibleFilters++;
//     if (showDates) visibleFilters += 2; // Start date + End date
//     if (showQuickFilter) visibleFilters++;

//     // Default responsive grid
//     if (visibleFilters <= 2) return 'grid-cols-1 sm:grid-cols-2';
//     if (visibleFilters <= 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
//     if (visibleFilters <= 4) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
//     return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5';
//   };

//   return (
//     <div className="bg-white rounded-2xl p-6 shadow-md space-y-6 mb-5">
//       {/* 🔍 Search Bar */}
//       <div className="relative mx-auto">
//         <input
//           type="text"
//           placeholder={placeholder}
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 shadow-inner text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
//         />
//         <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />

//         {searchLoading && (
//           <div className="absolute right-4 top-3.5 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//         )}
//       </div>

//       {/* 🔧 Filters */}
//       <div className={`grid ${getGridColumns()} gap-4 items-stretch`}>
//         {showStatus && (
//           <div className="relative flex items-center">
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="w-full pl-12 h-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200 appearance-none outline-none"
//             >
//               {statusOptions.map(option => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//             <Filter className="absolute left-4 text-gray-400 pointer-events-none" size={16} />
//           </div>
//         )}

//         {/* Type Filter - Conditionally render */}
//         {showTypeFilter && (
//           <div className="relative flex items-center">
//             <select
//               value={typeFilter || ''}
//               onChange={(e) => setTypeFilter && setTypeFilter(e.target.value)}
//               className="w-full pl-12 h-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200 appearance-none outline-none"
//             >
//               {typeOptions.map(option => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//             <Tag className="absolute left-4 text-gray-400 pointer-events-none" size={16} />
//           </div>
//         )}

//         {/* Date Filters */}
//         {showDates && (
//           <>
//             <div className="relative flex items-center">
//               <input
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => handleStartDateChange(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 text-sm shadow-inner focus:ring-2 focus:ring-blue-500 transition duration-200 outline-none"
//               />
//               <Calendar className="absolute left-4 text-gray-400 pointer-events-none" size={16} />
//             </div>
//             <div className="relative flex items-center">
//               <input
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => handleEndDateChange(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 text-sm shadow-inner focus:ring-2 focus:ring-blue-500 transition duration-200 outline-none"
//               />
//               <Calendar className="absolute left-4 text-gray-400 pointer-events-none" size={16} />
//             </div>
//           </>
//         )}

//         {/* Quick Filter */}
//         {showQuickFilter && (
//           <div className="relative">
//             <select
//               value={quickDateFilter}
//               onChange={(e) => handleQuickDateFilterChange(e.target.value)}
//               className="w-full h-12 px-4 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200 appearance-none outline-none"
//             >
//               {quickFilterOptions.map(option => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}
//       </div>

//       {hasActiveFilters && (
//         <div className="flex justify-end">
//           <button
//             onClick={handleClearFilters}
//             className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition duration-200"
//           >
//             <X className="w-4 h-4" />
//             Clear All Filters
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FilterBar;



import React, { useState } from "react";
import { Search, Filter, Calendar, X, Tag, ChevronDown } from "lucide-react";
import { formatLocalDate, addDays } from "../../utils/date";
import { Calendar as DateRangeCalendar } from "../ui/calender";

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
  showTypeFilter = false,
  placeholder = "Search...",
  statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "redeemed", label: "Redeemed" }
  ],
  quickFilterOptions = [
    { value: "", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "7days", label: "Last 7 Days" },
    { value: "15days", label: "Last 15 Days" },
    { value: "1month", label: "Last 1 Month" },
    { value: "custom", label: "Custom" }
  ],
  typeFilter,
  setTypeFilter,
  typeOptions = [
    { value: "", label: "All Types" },
    { value: "own", label: "Own Promotion" },
    { value: "cross", label: "Cross Promotion" },
    { value: "offer", label: "Special Offer" }
  ],
  onQuickDateChange,
  onClearFilters,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedRange, setSelectedRange] = useState({
    from: startDate ? new Date(startDate) : undefined,
    to: endDate ? new Date(endDate) : undefined
  });

  // Check if any filters are active
  const hasActiveFilters = search || statusFilter || startDate || endDate || quickDateFilter || (showTypeFilter && typeFilter);

  // Quick date filter logic
  const handleQuickDateFilterChange = (value) => {
    setQuickDateFilter(value);

    if (value === 'custom') {
      setShowCalendar(true);
      // Initialize selected range with current dates if any
      setSelectedRange({
        from: startDate ? new Date(startDate) : undefined,
        to: endDate ? new Date(endDate) : undefined
      });
      return;
    }

    setShowCalendar(false);

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
  };

  // Handle date selection from calendar - update local state only
  const handleDateSelect = (range) => {
    setSelectedRange(range);
  };

  // Apply the selected range and close calendar
  const handleApplyDates = () => {
    if (selectedRange?.from && selectedRange?.to) {
      setStartDate(selectedRange.from.toISOString().split('T')[0]);
      setEndDate(selectedRange.to.toISOString().split('T')[0]);
      setQuickDateFilter('custom');
    } else if (selectedRange?.from) {
      setStartDate(selectedRange.from.toISOString().split('T')[0]);
      setEndDate(selectedRange.from.toISOString().split('T')[0]);
      setQuickDateFilter('custom');
    }
    setShowCalendar(false);
  };

  // Clear dates in calendar
  const handleClearDates = () => {
    setSelectedRange({ from: undefined, to: undefined });
    setStartDate('');
    setEndDate('');
    setQuickDateFilter('');
    setShowCalendar(false);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setStartDate('');
    setEndDate('');
    setQuickDateFilter('');
    setSelectedRange({ from: undefined, to: undefined });
    setShowCalendar(false);
    if (showTypeFilter && setTypeFilter) {
      setTypeFilter('');
    }
    if (onClearFilters) onClearFilters();
  };

  // Format date range for display in custom option
  const formatCustomDateRange = () => {
    if (!startDate && !endDate) return "Custom";

    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (startDate && endDate) {
      return `Custom: ${formatDate(startDate)} - ${formatDate(endDate)}`;
    } else if (startDate) {
      return `Custom: From ${formatDate(startDate)}`;
    } else if (endDate) {
      return `Custom: Until ${formatDate(endDate)}`;
    }
    return "Custom";
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md space-y-4 mb-5">
      {/* 🔍 Search and Filters in One Row */}
      <div className="flex flex-col md:flex-row flex-wrap gap-4 items-stretch">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[200px]">
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

        {/* Status Filter */}
        {showStatus && (
          <div className="relative flex items-center min-w-[160px]">
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

        {/* Type Filter */}
        {showTypeFilter && (
          <div className="relative flex items-center min-w-[160px]">
            <select
              value={typeFilter || ''}
              onChange={(e) => setTypeFilter && setTypeFilter(e.target.value)}
              className="w-full pl-12 h-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200 appearance-none outline-none"
            >
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Tag className="absolute left-4 text-gray-400 pointer-events-none" size={16} />
          </div>
        )}

        {/* Quick Date Filter with Custom Option */}
        {showDates && showQuickFilter && (
          <div className="relative flex items-center min-w-[160px]">
            <select
              value={quickDateFilter}
              onChange={(e) => handleQuickDateFilterChange(e.target.value)}
              className="w-full h-12 px-4 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200 appearance-none outline-none"
            >
              {quickFilterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.value === 'custom' && (startDate || endDate)
                    ? formatCustomDateRange()
                    : option.label
                  }
                </option>
              ))}
            </select>

            {/* Calendar for Custom Date Range */}
            {showCalendar && (
              <>
                {/* Overlay backdrop for closing */}
                <div
                  className="fixed inset-0 bg-black/10 z-[9998]"
                  onClick={() => setShowCalendar(false)}
                />
                {/* Fixed, centered, visually elevated calendar popover */}
                <div
                  className="fixed top-32 left-1/2 -translate-x-1/2 z-[9999] bg-white border border-gray-200 rounded-lg shadow-2xl p-6 w-[95vw] max-w-2xl min-w-[320px] max-h-[90vh] overflow-auto"
                  style={{
                    maxWidth: '600px',
                    width: '95vw',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    padding: '1.25rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    top: '2.5rem',
                  }}
                >
                  <div className="flex justify-center">
                    <DateRangeCalendar
                      mode="range"
                      selected={selectedRange}
                      onSelect={handleDateSelect}
                      numberOfMonths={2}
                      className="border-0"
                      showOutsideDays={true}

                      // UPDATED: Allow navigation to earlier months but restrict future months
                      fromMonth={new Date(2020, 0, 1)} // Allow navigation to much earlier dates
                      toMonth={new Date()} // Current month (today) - right arrow disabled beyond this
                      disabled={{ after: new Date() }} // Disable future dates selection
                      defaultMonth={new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)} // Start with previous month

                      components={{
                        IconLeft: ({ ...props }) => <ChevronDown className="h-4 w-4 rotate-90" {...props} />,
                        IconRight: ({ ...props }) => <ChevronDown className="h-4 w-4 -rotate-90" {...props} />,
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                    <button
                      onClick={handleClearDates}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      Clear Dates
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowCalendar(false)}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleApplyDates}
                        disabled={!selectedRange?.from}
                        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="md:ml-auto w-full md:w-auto mt-2 md:mt-0 flex justify-end">
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-2 px-4 py-3 h-12 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition duration-200 whitespace-nowrap"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
