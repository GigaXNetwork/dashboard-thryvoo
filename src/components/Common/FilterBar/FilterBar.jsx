import React, { useState, useRef, useEffect } from "react";
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
}) => {
  // Internal states for drop downs and search within dropdowns
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [filteredLocations, setFilteredLocations] = useState(locations);

  const categoryDropdownRef = useRef(null);
  const locationDropdownRef = useRef(null);

  // Sync filtered categories & locations when source arrays or show flags change
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

  // Filter locations by search
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
  }, [locationSearch, locations, showLocationFilter]);

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

  // Clear all filters
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
    }
    if (showSourceFilter && setSourceFilter) setSourceFilter("");
    if (onClearFilters) onClearFilters();
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md space-y-4 mb-5">
      {/* Main filter row */}
      <div className="flex flex-col md:flex-row flex-wrap gap-4 items-stretch">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
          loading={searchLoading}
          placeholder={placeholder}
        />
        
        {showStatus && (
          <StatusFilter
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            onClear={() => setStatusFilter("")}
            options={statusOptions}
          />
        )}
        
        {showSourceFilter && (
          <SourceFilter
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            onClear={() => setSourceFilter("")}
            options={sourceOptions}
          />
        )}
        
        {showTypeFilter && (
          <TypeFilter
            value={typeFilter}
            onChange={(e) => setTypeFilter && setTypeFilter(e.target.value)}
            onClear={() => setTypeFilter && setTypeFilter("")}
            options={typeOptions}
          />
        )}
        
        {showDates && showQuickFilter && (
          <QuickDateFilter
            quickDateFilter={quickDateFilter}
            setQuickDateFilter={setQuickDateFilter}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            quickFilterOptions={quickFilterOptions}
          />
        )}

        {/* Clear All Button */}
        {hasActiveFilters && (
          <div className="md:ml-auto w-full md:w-auto mt-2 md:mt-0 flex justify-end">
            <button
              onClick={handleClearAllFilters}
              className="flex items-center gap-2 px-4 py-3 h-12 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition duration-200 whitespace-nowrap"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Category + Location dropdown row */}
      {(showCategoryFilter || showLocationFilter) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {showCategoryFilter && (
            <CategoryFilterDropdown
              show={showCategoryDropdown}
              toggle={() => setShowCategoryDropdown((v) => !v)}
              categories={categories}
              filteredCategories={filteredCategories}
              filterText={categorySearch}
              setFilterText={setCategorySearch}
              selectedCategory={categoryFilter}
              onSelectCategory={(cat) => {
                setCategoryFilter(cat.name);
                setShowCategoryDropdown(false);
                setCategorySearch("");
              }}
              onClearCategory={() => {
                setCategoryFilter("");
                setCategorySearch("");
              }}
              dropdownRef={categoryDropdownRef}
            />
          )}
          {showLocationFilter && (
            <LocationFilterDropdown
              show={showLocationDropdown}
              toggle={() => setShowLocationDropdown((v) => !v)}
              locations={locations}
              filteredLocations={filteredLocations}
              filterText={locationSearch}
              setFilterText={setLocationSearch}
              selectedLocation={locationFilter}
              onSelectLocation={(loc) => {
                setLocationFilter(loc.addressLine);
                setShowLocationDropdown(false);
                setLocationSearch("");
              }}
              onClearLocation={() => {
                setLocationFilter("");
                setLocationSearch("");
              }}
              dropdownRef={locationDropdownRef}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;