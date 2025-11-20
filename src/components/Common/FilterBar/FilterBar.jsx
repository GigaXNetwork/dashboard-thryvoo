// import React, { useState, useRef, useEffect, useCallback } from "react";
// import SearchInput from "./SearchInput";
// import StatusFilter from "./StatusFilter";
// import SourceFilter from "./SourceFilter";
// import TypeFilter from "./TypeFilter";
// import QuickDateFilter from "./QuickDateFilter";
// import CategoryFilterDropdown from "./CategoryFilterDropdown";
// import LocationFilterDropdown from "./LocationFilterDropdown";
// import { X } from "lucide-react";

// const FilterBar = ({
//   // Core filters
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
//   // Type filter
//   showTypeFilter = false,
//   typeFilter,
//   setTypeFilter,
//   // Extra filters
//   showCategoryFilter = false,
//   categoryFilter,
//   setCategoryFilter,
//   categories = [],
//   showLocationFilter = false,
//   locationFilter,
//   setLocationFilter,
//   locations = [],
//   // Location search props
//   onLocationSearch,
//   // Source filter
//   sourceFilter,
//   setSourceFilter,
//   sourceOptions = [],
//   showSourceFilter = false,
//   // UI toggles
//   showStatus = true,
//   showDates = true,
//   showQuickFilter = true,
//   placeholder = "Search...",
//   // Options
//   statusOptions = [
//     { value: "", label: "All Statuses" },
//     { value: "active", label: "Active" },
//     { value: "redeemed", label: "Redeemed" },
//   ],
//   quickFilterOptions = [
//     { value: "", label: "All Time" },
//     { value: "today", label: "Today" },
//     { value: "7days", label: "Last 7 Days" },
//     { value: "15days", label: "Last 15 Days" },
//     { value: "1month", label: "Last 1 Month" },
//     { value: "custom", label: "Custom" },
//   ],
//   typeOptions = [
//     { value: "", label: "All Types" },
//     { value: "own", label: "Own Promotion" },
//     { value: "cross", label: "Cross Promotion" },
//     { value: "offer", label: "Special Offer" },
//   ],
//   // Handlers
//   onClearFilters,
// }) => {
//   // Internal states for drop downs and search within dropdowns
//   const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
//   const [showLocationDropdown, setShowLocationDropdown] = useState(false);
//   const [categorySearch, setCategorySearch] = useState("");
//   const [locationSearch, setLocationSearch] = useState("");
//   const [filteredCategories, setFilteredCategories] = useState(categories);
//   const [filteredLocations, setFilteredLocations] = useState(locations);
//   const [locationSearchResults, setLocationSearchResults] = useState(locations);
//   const [locationSearchLoading, setLocationSearchLoading] = useState(false);

//   const categoryDropdownRef = useRef(null);
//   const locationDropdownRef = useRef(null);
//   const locationSearchTimeoutRef = useRef(null);

//   // Sync filtered categories & locations when source arrays or show flags change
//   useEffect(() => {
//     if (showCategoryFilter) {
//       setFilteredCategories(categories);
//     }
//   }, [categories, showCategoryFilter]);

//   useEffect(() => {
//     if (showLocationFilter) {
//       setFilteredLocations(locations);
//       setLocationSearchResults(locations);
//     }
//   }, [locations, showLocationFilter]);

//   // Filter categories by search
//   useEffect(() => {
//     if (!showCategoryFilter) return;

//     if (!categorySearch.trim()) {
//       setFilteredCategories(categories);
//       return;
//     }
//     const q = categorySearch.toLowerCase();
//     setFilteredCategories(
//       categories.filter((c) => c.name?.toLowerCase().includes(q))
//     );
//   }, [categorySearch, categories, showCategoryFilter]);

//   // Proper debounced location search with API call
//   const performLocationSearch = useCallback(async (searchTerm) => {
//     if (!onLocationSearch) return;

//     setLocationSearchLoading(true);
//     try {
//       const results = await onLocationSearch(searchTerm);
//       setLocationSearchResults(results);
//     } catch (error) {
//       console.error("Location search failed:", error);
//       setLocationSearchResults([]);
//     } finally {
//       setLocationSearchLoading(false);
//     }
//   }, [onLocationSearch]);

//   // Handle location search input with proper debounce
//   useEffect(() => {
//     if (!showLocationFilter || !onLocationSearch) return;

//     // Clear previous timeout
//     if (locationSearchTimeoutRef.current) {
//       clearTimeout(locationSearchTimeoutRef.current);
//     }

//     if (!locationSearch.trim()) {
//       // If search is empty, show initial locations
//       setLocationSearchResults(locations);
//       setLocationSearchLoading(false);
//       return;
//     }

//     // Set new timeout for debounced search
//     locationSearchTimeoutRef.current = setTimeout(() => {
//       performLocationSearch(locationSearch.trim());
//     }, 800); // 800ms debounce

//     // Cleanup
//     return () => {
//       if (locationSearchTimeoutRef.current) {
//         clearTimeout(locationSearchTimeoutRef.current);
//       }
//     };
//   }, [locationSearch, locations, showLocationFilter, performLocationSearch, onLocationSearch]);

//   // Close dropdowns on outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         categoryDropdownRef.current &&
//         !categoryDropdownRef.current.contains(event.target)
//       ) {
//         setShowCategoryDropdown(false);
//       }
//       if (
//         locationDropdownRef.current &&
//         !locationDropdownRef.current.contains(event.target)
//       ) {
//         setShowLocationDropdown(false);
//         setLocationSearch(""); // Clear search when closing
//         setLocationSearchLoading(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Determine if any filter is active
//   const hasActiveFilters =
//     search ||
//     statusFilter ||
//     startDate ||
//     endDate ||
//     quickDateFilter ||
//     (showTypeFilter && typeFilter) ||
//     (showCategoryFilter && categoryFilter) ||
//     (showLocationFilter && locationFilter) ||
//     (showSourceFilter && sourceFilter);

//   // Clear all filters
//   const handleClearAllFilters = () => {
//     setSearch("");
//     setStatusFilter("");
//     setStartDate("");
//     setEndDate("");
//     setQuickDateFilter("");
//     if (showTypeFilter && setTypeFilter) setTypeFilter("");
//     if (showCategoryFilter && setCategoryFilter) {
//       setCategoryFilter("");
//       setCategorySearch("");
//     }
//     if (showLocationFilter && setLocationFilter) {
//       setLocationFilter("");
//       setLocationSearch("");
//       setLocationSearchResults(locations);
//       setLocationSearchLoading(false);
//     }
//     if (showSourceFilter && setSourceFilter) setSourceFilter("");
//     if (onClearFilters) onClearFilters();
//   };

//   // Handle location selection
//   const handleLocationSelect = (loc) => {
//     setLocationFilter(loc.addressLine);
//     setShowLocationDropdown(false);
//     setLocationSearch("");
//     setLocationSearchResults(locations); // Reset to initial locations
//     setLocationSearchLoading(false);
//   };

//   // Handle location clear
//   const handleLocationClear = () => {
//     setLocationFilter("");
//     setLocationSearch("");
//     setLocationSearchResults(locations);
//     setLocationSearchLoading(false);
//   };

//   // Handle location search input change
//   const handleLocationSearchChange = (value) => {
//     setLocationSearch(value);
//   };

//   return (
//     <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-4">
//       {/* Main filter row - Improved layout similar to Bootstrap */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
//         {/* Search Input - Takes priority on left */}
//         <div className="flex-grow lg:flex-grow-0 lg:w-80">
//           <SearchInput
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             onClear={() => setSearch("")}
//             loading={searchLoading}
//             placeholder={placeholder}
//           />
//         </div>

//         {/* Filter Controls - Right side with flex wrap */}
//         <div className="flex gap-2 items-center flex-wrap">
//           {showCategoryFilter && (
//             <div className="flex-1">
//               <CategoryFilterDropdown
//                 show={showCategoryDropdown}
//                 toggle={() => setShowCategoryDropdown((v) => !v)}
//                 categories={categories}
//                 filteredCategories={filteredCategories}
//                 filterText={categorySearch}
//                 setFilterText={setCategorySearch}
//                 selectedCategory={categoryFilter}
//                 onSelectCategory={(cat) => {
//                   setCategoryFilter(cat.name);
//                   setShowCategoryDropdown(false);
//                   setCategorySearch("");
//                 }}
//                 onClearCategory={() => {
//                   setCategoryFilter("");
//                   setCategorySearch("");
//                 }}
//                 dropdownRef={categoryDropdownRef}
//               />
//             </div>
//           )}
//           {showLocationFilter && (
//             <div className="flex-1">
//               <LocationFilterDropdown
//                 show={showLocationDropdown}
//                 toggle={() => setShowLocationDropdown((v) => !v)}
//                 locations={onLocationSearch ? locationSearchResults : filteredLocations}
//                 filteredLocations={onLocationSearch ? locationSearchResults : filteredLocations}
//                 filterText={locationSearch}
//                 setFilterText={handleLocationSearchChange}
//                 selectedLocation={locationFilter}
//                 onSelectLocation={handleLocationSelect}
//                 onClearLocation={handleLocationClear}
//                 dropdownRef={locationDropdownRef}
//                 searchLoading={locationSearchLoading}
//               />
//             </div>
//           )}
//           {/* Status Filter */}
//           {showStatus && (
//             <div className="min-w-[140px]">
//               <StatusFilter
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 onClear={() => setStatusFilter("")}
//                 options={statusOptions}
//               />
//             </div>
//           )}

//           {/* Source Filter */}
//           {showSourceFilter && (
//             <div className="min-w-[140px]">
//               <SourceFilter
//                 value={sourceFilter}
//                 onChange={(e) => setSourceFilter(e.target.value)}
//                 onClear={() => setSourceFilter("")}
//                 options={sourceOptions}
//               />
//             </div>
//           )}

//           {/* Type Filter */}
//           {showTypeFilter && (
//             <div className="min-w-[140px]">
//               <TypeFilter
//                 value={typeFilter}
//                 onChange={(e) => setTypeFilter && setTypeFilter(e.target.value)}
//                 onClear={() => setTypeFilter && setTypeFilter("")}
//                 options={typeOptions}
//               />
//             </div>
//           )}

//           {/* Date Filter */}
//           {showDates && showQuickFilter && (
//             <div className="min-w-[160px]">
//               <QuickDateFilter
//                 quickDateFilter={quickDateFilter}
//                 setQuickDateFilter={setQuickDateFilter}
//                 startDate={startDate}
//                 setStartDate={setStartDate}
//                 endDate={endDate}
//                 setEndDate={setEndDate}
//                 quickFilterOptions={quickFilterOptions}
//               />
//             </div>
//           )}

//           {/* Clear All Button - Only show when filters are active */}
//           {/* {hasActiveFilters && (
//             <button
//               onClick={handleClearAllFilters}
//               className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition duration-200 whitespace-nowrap border border-gray-300"
//             >
//               <X className="w-4 h-4" />
//               Clear All
//             </button>
//           )} */}
//         </div>
//       </div>

//       {/* Category + Location dropdown row - Only show if needed
//       {(showCategoryFilter || showLocationFilter) && (
//         <div className="flex flex-col md:flex-row gap-3 mt-3 pt-3 border-t border-gray-200">
//           {showCategoryFilter && (
//             <div className="flex-1">
//               <CategoryFilterDropdown
//                 show={showCategoryDropdown}
//                 toggle={() => setShowCategoryDropdown((v) => !v)}
//                 categories={categories}
//                 filteredCategories={filteredCategories}
//                 filterText={categorySearch}
//                 setFilterText={setCategorySearch}
//                 selectedCategory={categoryFilter}
//                 onSelectCategory={(cat) => {
//                   setCategoryFilter(cat.name);
//                   setShowCategoryDropdown(false);
//                   setCategorySearch("");
//                 }}
//                 onClearCategory={() => {
//                   setCategoryFilter("");
//                   setCategorySearch("");
//                 }}
//                 dropdownRef={categoryDropdownRef}
//               />
//             </div>
//           )}
//           {showLocationFilter && (
//             <div className="flex-1">
//               <LocationFilterDropdown
//                 show={showLocationDropdown}
//                 toggle={() => setShowLocationDropdown((v) => !v)}
//                 locations={onLocationSearch ? locationSearchResults : filteredLocations}
//                 filteredLocations={onLocationSearch ? locationSearchResults : filteredLocations}
//                 filterText={locationSearch}
//                 setFilterText={handleLocationSearchChange}
//                 selectedLocation={locationFilter}
//                 onSelectLocation={handleLocationSelect}
//                 onClearLocation={handleLocationClear}
//                 dropdownRef={locationDropdownRef}
//                 searchLoading={locationSearchLoading}
//               />
//             </div>
//           )}
//         </div>
//       )} */}
//     </div>
//   );
// };

// export default FilterBar;





import React, { useState, useRef, useEffect, useCallback } from "react";
import SearchInput from "./SearchInput";
import StatusFilter from "./StatusFilter";
import SourceFilter from "./SourceFilter";
import TypeFilter from "./TypeFilter";
import QuickDateFilter from "./QuickDateFilter";
import CategoryFilterDropdown from "./CategoryFilterDropdown";
import LocationFilterDropdown from "./LocationFilterDropdown";
import { X } from "lucide-react";

const FilterBar = ({
  // Core filters
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
  // Type filter
  showTypeFilter = false,
  typeFilter,
  setTypeFilter,
  // Extra filters
  showCategoryFilter = false,
  categoryFilter,
  setCategoryFilter,
  categories = [],
  showLocationFilter = false,
  locationFilter,
  setLocationFilter,
  locations = [],
  // Location search props
  onLocationSearch,
  // Source filter
  sourceFilter,
  setSourceFilter,
  sourceOptions = [],
  showSourceFilter = false,
  // UI toggles
  showStatus = true,
  showDates = true,
  showQuickFilter = true,
  placeholder = "Search...",
  // Options
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
  // Handlers
  onClearFilters,
  // NEW: Callback when any filter changes
  onFilterChange,
}) => {
  // Internal states for drop downs and search within dropdowns
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [filteredLocations, setFilteredLocations] = useState(locations);
  const [locationSearchResults, setLocationSearchResults] = useState(locations);
  const [locationSearchLoading, setLocationSearchLoading] = useState(false);

  const categoryDropdownRef = useRef(null);
  const locationDropdownRef = useRef(null);
  const locationSearchTimeoutRef = useRef(null);

  // Enhanced handlers with onFilterChange callback
  const handleSearchChange = (value) => {
    setSearch(value);
    onFilterChange?.();
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    onFilterChange?.();
  };

  const handleTypeChange = (value) => {
    setTypeFilter?.(value);
    onFilterChange?.();
  };

  const handleSourceChange = (value) => {
    setSourceFilter?.(value);
    onFilterChange?.();
  };

  const handleStartDateChange = (value) => {
    setStartDate(value);
    onFilterChange?.();
  };

  const handleEndDateChange = (value) => {
    setEndDate(value);
    onFilterChange?.();
  };

  const handleQuickDateFilterChange = (value) => {
    setQuickDateFilter(value);
    onFilterChange?.();
  };

  const handleCategoryChange = (value) => {
    setCategoryFilter?.(value);
    onFilterChange?.();
  };

  const handleLocationChange = (value) => {
    setLocationFilter?.(value);
    onFilterChange?.();
  };

  // Enhanced clear all filters
  const handleClearAllFilters = () => {
    setSearch("");
    setStatusFilter("");
    setStartDate("");
    setEndDate("");
    setQuickDateFilter("");
    if (showTypeFilter && setTypeFilter) setTypeFilter("");
    if (showCategoryFilter && setCategoryFilter) {
      setCategoryFilter("");
      setCategorySearch("");
    }
    if (showLocationFilter && setLocationFilter) {
      setLocationFilter("");
      setLocationSearch("");
      setLocationSearchResults(locations);
      setLocationSearchLoading(false);
    }
    if (showSourceFilter && setSourceFilter) setSourceFilter("");
    
    // Call both callbacks
    onFilterChange?.();
    if (onClearFilters) onClearFilters();
  };

  // Enhanced location handlers
  const handleLocationSelect = (loc) => {
    handleLocationChange(loc.addressLine);
    setShowLocationDropdown(false);
    setLocationSearch("");
    setLocationSearchResults(locations);
    setLocationSearchLoading(false);
  };

  const handleLocationClear = () => {
    handleLocationChange("");
    setLocationSearch("");
    setLocationSearchResults(locations);
    setLocationSearchLoading(false);
  };

  const handleCategorySelect = (cat) => {
    handleCategoryChange(cat.name);
    setShowCategoryDropdown(false);
    setCategorySearch("");
  };

  const handleCategoryClear = () => {
    handleCategoryChange("");
    setCategorySearch("");
  };

  // Sync filtered categories & locations when source arrays or show flags change
  useEffect(() => {
    if (showCategoryFilter) {
      setFilteredCategories(categories);
    }
  }, [categories, showCategoryFilter]);

  useEffect(() => {
    if (showLocationFilter) {
      setFilteredLocations(locations);
      setLocationSearchResults(locations);
    }
  }, [locations, showLocationFilter]);

  // Filter categories by search
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
  }, [categorySearch, categories, showCategoryFilter]);

  // Proper debounced location search with API call
  const performLocationSearch = useCallback(async (searchTerm) => {
    if (!onLocationSearch) return;

    setLocationSearchLoading(true);
    try {
      const results = await onLocationSearch(searchTerm);
      setLocationSearchResults(results);
    } catch (error) {
      console.error("Location search failed:", error);
      setLocationSearchResults([]);
    } finally {
      setLocationSearchLoading(false);
    }
  }, [onLocationSearch]);

  // Handle location search input with proper debounce
  useEffect(() => {
    if (!showLocationFilter || !onLocationSearch) return;

    // Clear previous timeout
    if (locationSearchTimeoutRef.current) {
      clearTimeout(locationSearchTimeoutRef.current);
    }

    if (!locationSearch.trim()) {
      // If search is empty, show initial locations
      setLocationSearchResults(locations);
      setLocationSearchLoading(false);
      return;
    }

    // Set new timeout for debounced search
    locationSearchTimeoutRef.current = setTimeout(() => {
      performLocationSearch(locationSearch.trim());
    }, 800); // 800ms debounce

    // Cleanup
    return () => {
      if (locationSearchTimeoutRef.current) {
        clearTimeout(locationSearchTimeoutRef.current);
      }
    };
  }, [locationSearch, locations, showLocationFilter, performLocationSearch, onLocationSearch]);

  // Close dropdowns on outside click
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
        setLocationSearch(""); // Clear search when closing
        setLocationSearchLoading(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Determine if any filter is active
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

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-4">
      {/* Main filter row - Improved layout similar to Bootstrap */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
        {/* Search Input - Takes priority on left */}
        <div className="flex-grow lg:flex-grow-0 lg:w-80">
          <SearchInput
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            onClear={() => handleSearchChange("")}
            loading={searchLoading}
            placeholder={placeholder}
          />
        </div>

        {/* Filter Controls - Right side with flex wrap */}
        <div className="flex gap-2 items-center flex-wrap">
          {showCategoryFilter && (
            <div className="flex-1">
              <CategoryFilterDropdown
                show={showCategoryDropdown}
                toggle={() => setShowCategoryDropdown((v) => !v)}
                categories={categories}
                filteredCategories={filteredCategories}
                filterText={categorySearch}
                setFilterText={setCategorySearch}
                selectedCategory={categoryFilter}
                onSelectCategory={handleCategorySelect}
                onClearCategory={handleCategoryClear}
                dropdownRef={categoryDropdownRef}
              />
            </div>
          )}
          {showLocationFilter && (
            <div className="flex-1">
              <LocationFilterDropdown
                show={showLocationDropdown}
                toggle={() => setShowLocationDropdown((v) => !v)}
                locations={onLocationSearch ? locationSearchResults : filteredLocations}
                filteredLocations={onLocationSearch ? locationSearchResults : filteredLocations}
                filterText={locationSearch}
                setFilterText={setLocationSearch}
                selectedLocation={locationFilter}
                onSelectLocation={handleLocationSelect}
                onClearLocation={handleLocationClear}
                dropdownRef={locationDropdownRef}
                searchLoading={locationSearchLoading}
              />
            </div>
          )}
          {/* Status Filter */}
          {showStatus && (
            <div className="min-w-[140px]">
              <StatusFilter
                value={statusFilter}
                onChange={(e) => handleStatusChange(e.target.value)}
                onClear={() => handleStatusChange("")}
                options={statusOptions}
              />
            </div>
          )}

          {/* Source Filter */}
          {showSourceFilter && (
            <div className="min-w-[140px]">
              <SourceFilter
                value={sourceFilter}
                onChange={(e) => handleSourceChange(e.target.value)}
                onClear={() => handleSourceChange("")}
                options={sourceOptions}
              />
            </div>
          )}

          {/* Type Filter */}
          {showTypeFilter && (
            <div className="min-w-[140px]">
              <TypeFilter
                value={typeFilter}
                onChange={(e) => handleTypeChange(e.target.value)}
                onClear={() => handleTypeChange("")}
                options={typeOptions}
              />
            </div>
          )}

          {/* Date Filter */}
          {showDates && showQuickFilter && (
            <div className="min-w-[160px]">
              <QuickDateFilter
                quickDateFilter={quickDateFilter}
                setQuickDateFilter={handleQuickDateFilterChange}
                startDate={startDate}
                setStartDate={handleStartDateChange}
                endDate={endDate}
                setEndDate={handleEndDateChange}
                quickFilterOptions={quickFilterOptions}
              />
            </div>
          )}

          {/* Clear All Button - Only show when filters are active */}
          {/* {hasActiveFilters && (
            <button
              onClick={handleClearAllFilters}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition duration-200 whitespace-nowrap border border-gray-300"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;