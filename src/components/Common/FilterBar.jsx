

//This is not using in any page right now but kept for future use


import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  Calendar,
  X,
  Tag,
  ChevronDown,
} from "lucide-react";
import { formatLocalDate, addDays } from "../../utils/date";
import { Calendar as DateRangeCalendar } from "../ui/calender";

const FilterBar = ({
  // core filters
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
  // type filter
  showTypeFilter = false,
  typeFilter,
  setTypeFilter,
  // extra filters
  showCategoryFilter = false,
  categoryFilter,
  setCategoryFilter,
  categories = [],
  showLocationFilter = false,
  locationFilter,
  setLocationFilter,
  locations = [],

  sourceFilter,
  setSourceFilter,
  sourceOptions = [],
  showSourceFilter = false,

  // UI toggles
  showStatus = true,
  showDates = true,
  showQuickFilter = true,
  placeholder = "Search...",
  statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "redeemed", label: "Redeemed" },
  ],
  quickFilterOptions = [
    { value: "", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "7days", label: "Last 7 Days" },
    { value: "15days", label: "Last 15 Days" },
    { value: "1month", label: "Last 1 Month" },
    { value: "custom", label: "Custom" },
  ],
  typeOptions = [
    { value: "", label: "All Types" },
    { value: "own", label: "Own Promotion" },
    { value: "cross", label: "Cross Promotion" },
    { value: "offer", label: "Special Offer" },
  ],
  // callbacks
  onClearFilters,
}) => {
  // calendar state
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedRange, setSelectedRange] = useState({
    from: startDate ? new Date(startDate) : undefined,
    to: endDate ? new Date(endDate) : undefined,
  });

  // category/location internal state
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [filteredLocations, setFilteredLocations] = useState(locations);

  const categoryDropdownRef = useRef(null);
  const locationDropdownRef = useRef(null);

  // filter active check
  const hasActiveFilters =
    search ||
    statusFilter ||
    startDate ||
    endDate ||
    quickDateFilter ||
    (showTypeFilter && typeFilter) ||
    (showCategoryFilter && categoryFilter) ||
    (showLocationFilter && locationFilter) ||
    (showSourceFilter && sourceFilter);

  // sync filtered lists when options change
  useEffect(() => {
    if (showCategoryFilter) {
      setFilteredCategories(categories);
    }
  }, [categories, showCategoryFilter]);

  useEffect(() => {
    if (showLocationFilter) {
      setFilteredLocations(locations);
    }
  }, [locations, showLocationFilter]);

  // category search filter
  useEffect(() => {
    if (!showCategoryFilter) return;

    if (!categorySearch.trim()) {
      setFilteredCategories(categories);
      return;
    }
    const q = categorySearch.toLowerCase();
    setFilteredCategories(
      categories.filter((c) => c.name?.toLowerCase().includes(q))
    );
  }, [categorySearch, categories]);

  // location search filter
  useEffect(() => {
    if (!showLocationFilter) return;

    if (!locationSearch.trim()) {
      setFilteredLocations(locations);
      return;
    }
    const q = locationSearch.toLowerCase();
    setFilteredLocations(
      locations.filter((l) => l.display?.toLowerCase().includes(q))
    );
  }, [locationSearch, locations]);

  // click outside close for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setShowCategoryDropdown(false);
      }
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target)
      ) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // quick date filter logic
  const handleQuickDateFilterChange = (value) => {
    setQuickDateFilter(value);

    if (value === "custom") {
      setShowCalendar(true);
      setSelectedRange({
        from: startDate ? new Date(startDate) : undefined,
        to: endDate ? new Date(endDate) : undefined,
      });
      return;
    }

    setShowCalendar(false);

    const todayLocal = new Date();
    let start = "";
    let end = formatLocalDate(addDays(todayLocal, 1));

    switch (value) {
      case "today":
        start = formatLocalDate(addDays(todayLocal, -1));
        break;
      case "7days":
        start = formatLocalDate(addDays(todayLocal, -7));
        break;
      case "15days":
        start = formatLocalDate(addDays(todayLocal, -15));
        break;
      case "1month":
        start = formatLocalDate(addDays(todayLocal, -30));
        break;
      default:
        start = "";
        end = "";
    }

    setStartDate(start);
    setEndDate(end);
  };

  // date range from calendar
  const handleDateSelect = (range) => {
    setSelectedRange(range);
  };

  const handleApplyDates = () => {
    if (selectedRange?.from && selectedRange?.to) {
      const from = selectedRange.from.toISOString().split("T")[0];
      const to = selectedRange.to.toISOString().split("T")[0];
      setStartDate(from);
      setEndDate(to);
      setQuickDateFilter("custom");
    } else if (selectedRange?.from) {
      const from = selectedRange.from.toISOString().split("T")[0];
      setStartDate(from);
      setEndDate(from);
      setQuickDateFilter("custom");
    }
    setShowCalendar(false);
  };

  const handleClearDates = () => {
    setSelectedRange({ from: undefined, to: undefined });
    setStartDate("");
    setEndDate("");
    setQuickDateFilter("");
    setShowCalendar(false);
  };

  // clear all filters
  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setStartDate("");
    setEndDate("");
    setQuickDateFilter("");
    setSelectedRange({ from: undefined, to: undefined });
    setShowCalendar(false);
    if (showTypeFilter && setTypeFilter) {
      setTypeFilter("");
    }
    if (showCategoryFilter && setCategoryFilter) {
      setCategoryFilter("");
      setCategorySearch("");
    }
    if (showLocationFilter && setLocationFilter) {
      setLocationFilter("");
      setLocationSearch("");
    }
    if (showSourceFilter && setSourceFilter) {
      setSourceFilter("");
    }
    if (onClearFilters) onClearFilters();
  };

  // custom date range label
  const formatCustomDateRange = () => {
    if (!startDate && !endDate) return "Custom";

    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
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

  // handlers for category/location selection and clear
  const handleCategorySelect = (category) => {
    if (setCategoryFilter) {
      setCategoryFilter(category.name);
    }
    setShowCategoryDropdown(false);
    setCategorySearch("");
  };

  const clearCategoryFilter = () => {
    if (setCategoryFilter) setCategoryFilter("");
    setCategorySearch("");
  };

  const handleLocationSelect = (location) => {
    if (setLocationFilter) {
      // store addressLine (for ?addressLine=... query) but show display in UI if needed
      setLocationFilter(location.addressLine);
    }
    setShowLocationDropdown(false);
    setLocationSearch("");
  };

  const clearLocationFilter = () => {
    if (setLocationFilter) setLocationFilter("");
    setLocationSearch("");
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md space-y-4 mb-5">
      {/* main row */}
      <div className="flex flex-col md:flex-row flex-wrap gap-4 items-stretch">
        {/* search */}
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder={placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg h-12 border border-gray-300 shadow-inner text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
          />
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
          {searchLoading && (
            <div className="absolute right-4 top-3.5 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          )}
        </div>

        {/* status */}
        {showStatus && (
          <div className="relative flex items-center min-w-[160px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-12 h-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200 appearance-none outline-none"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Filter className="absolute left-4 text-gray-400 pointer-events-none" size={16} />
          </div>
        )}

        {/* source */}
        {showSourceFilter && (
          <div className="relative flex items-center min-w-[160px]">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full pl-12 h-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200 appearance-none outline-none"
            >
              {sourceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Tag className="absolute left-4 text-gray-400 pointer-events-none" size={16} />
          </div>
        )}

        {/* type */}
        {showTypeFilter && (
          <div className="relative flex items-center min-w-[160px]">
            <select
              value={typeFilter || ""}
              onChange={(e) => setTypeFilter && setTypeFilter(e.target.value)}
              className="w-full pl-12 h-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200 appearance-none outline-none"
            >
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Tag className="absolute left-4 text-gray-400 pointer-events-none" size={16} />
          </div>
        )}

        {/* quick date filter */}
        {showDates && showQuickFilter && (
          <div className="relative flex items-center min-w-[160px]">
            <select
              value={quickDateFilter}
              onChange={(e) => handleQuickDateFilterChange(e.target.value)}
              className="w-full h-12 px-4 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200 appearance-none outline-none"
            >
              {quickFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.value === "custom" && (startDate || endDate)
                    ? formatCustomDateRange()
                    : option.label}
                </option>
              ))}
            </select>

            {/* calendar popover */}
            {showCalendar && (
              <>
                <div
                  className="fixed inset-0 bg-black/10 z-[9998]"
                  onClick={() => setShowCalendar(false)}
                />
                <div
                  className="fixed top-32 left-1/2 -translate-x-1/2 z-[9999] bg-white border border-gray-200 rounded-lg shadow-2xl p-6 w-[95vw] max-w-2xl min-w-[320px] max-h-[90vh] overflow-auto"
                  style={{
                    maxWidth: "600px",
                    width: "95vw",
                    marginLeft: "auto",
                    marginRight: "auto",
                    padding: "1.25rem",
                    left: "50%",
                    transform: "translateX(-50%)",
                    top: "2.5rem",
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
                      fromMonth={new Date(2020, 0, 1)}
                      toMonth={new Date()}
                      disabled={{ after: new Date() }}
                      defaultMonth={
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth() - 1,
                          1
                        )
                      }
                      components={{
                        IconLeft: ({ ...props }) => (
                          <ChevronDown className="h-4 w-4 rotate-90" {...props} />
                        ),
                        IconRight: ({ ...props }) => (
                          <ChevronDown className="h-4 w-4 -rotate-90" {...props} />
                        ),
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

        {/* Clear button in main row (optional) */}
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

      {/* Category + Location row */}
      {(showCategoryFilter || showLocationFilter) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Category */}
          {showCategoryFilter && (
            <div className="relative w-full" ref={categoryDropdownRef}>
              <button
                type="button"
                onClick={() => setShowCategoryDropdown((v) => !v)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200 flex items-center justify-between"
              >
                <span className="truncate">
                  {categoryFilter || "All Categories"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${showCategoryDropdown ? "rotate-180" : ""
                    }`}
                />
              </button>
              <Filter
                className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none"
              />

              {showCategoryDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-hidden">
                  {/* search inside */}
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
                          type="button"
                          onClick={() => setCategorySearch("")}
                          className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* list */}
                  <div className="max-h-48 overflow-y-auto">
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((cat) => (
                        <button
                          type="button"
                          key={cat.id}
                          onClick={() => handleCategorySelect(cat)}
                          className={`w-full text-left px-4 py-2 hover:bg-blue-50 text-sm ${categoryFilter === cat.name
                            ? "bg-blue-100 text-blue-700"
                            : ""
                            }`}
                        >
                          {cat.name}
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

              {categoryFilter && (
                <button
                  type="button"
                  onClick={clearCategoryFilter}
                  className="absolute right-8 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Location */}
          {showLocationFilter && (
            <div className="relative w-full" ref={locationDropdownRef}>
              <button
                type="button"
                onClick={() => setShowLocationDropdown((v) => !v)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200 flex items-center justify-between"
              >
                <span className="truncate">
                  {locationFilter || "All Locations"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${showLocationDropdown ? "rotate-180" : ""
                    }`}
                />
              </button>
              <Filter
                className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none"
              />

              {showLocationDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-hidden">
                  {/* search inside */}
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
                          type="button"
                          onClick={() => setLocationSearch("")}
                          className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* list */}
                  <div className="max-h-48 overflow-y-auto">
                    {filteredLocations.length > 0 ? (
                      filteredLocations.map((loc) => (
                        <button
                          type="button"
                          key={loc.id}
                          onClick={() => handleLocationSelect(loc)}
                          className={`w-full text-left px-4 py-2 hover:bg-blue-50 text-sm ${locationFilter === loc.addressLine
                            ? "bg-blue-100 text-blue-700"
                            : ""
                            }`}
                        >
                          {loc.display}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500 text-center">
                        No locations found
                      </div>
                    )}
                  </div>
                </div>
              )}

              {locationFilter && (
                <button
                  type="button"
                  onClick={clearLocationFilter}
                  className="absolute right-8 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
