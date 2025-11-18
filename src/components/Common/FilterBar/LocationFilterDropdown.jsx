import React from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";

const LocationFilterDropdown = ({
  show,
  toggle,
  locations,
  filteredLocations,
  filterText,
  setFilterText,
  selectedLocation,
  onSelectLocation,
  onClearLocation,
  dropdownRef,
}) => (
  <div className="relative w-full" ref={dropdownRef}>
    <button
      onClick={toggle}
      className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm flex items-center justify-between focus:ring-2 focus:ring-blue-500 transition duration-200"
    >
      <span className="truncate">{selectedLocation || "All Locations"}</span>
      <ChevronDown
        className={`w-4 h-4 transition-transform ${show ? "rotate-180" : ""}`}
      />
    </button>
    <Filter className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />

    {show && (
      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-hidden">
        <div className="p-2 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-2 top-2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search locations..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full pl-8 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
            {filterText && (
              <button
                onClick={() => setFilterText("")}
                className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="max-h-48 overflow-y-auto">
          {filteredLocations.length > 0 ? (
            filteredLocations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => onSelectLocation(loc)}
                className={`w-full text-left px-4 py-2 hover:bg-blue-50 text-sm ${
                  selectedLocation === loc.addressLine ? "bg-blue-100 text-blue-700" : ""
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

    {selectedLocation && (
      <button
        onClick={onClearLocation}
        className="absolute right-8 top-3.5 text-gray-400 hover:text-gray-600"
      >
        <X className="w-4 h-4" />
      </button>
    )}
  </div>
);

export default LocationFilterDropdown;
