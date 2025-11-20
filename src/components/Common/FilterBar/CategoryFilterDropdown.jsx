import React from "react";
import { Search, X, ChevronDown, Tag } from "lucide-react";

const CategoryFilterDropdown = ({
  show,
  toggle,
  categories,
  filteredCategories,
  filterText,
  setFilterText,
  selectedCategory,
  onSelectCategory,
  onClearCategory,
  dropdownRef,
}) => (
  <div className="relative w-full flex items-center" ref={dropdownRef}>
    {/* Main dropdown button */}
    <button
      onClick={toggle}
      className="w-full pl-9 pr-3 py-2.5 gap-2 rounded-lg border border-gray-300 bg-white text-sm flex items-center justify-between focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 hover:border-gray-400"
    >
      <span className="truncate">{selectedCategory || "All Categories"}</span>
      <ChevronDown
        className={`w-4 h-4 text-gray-400 transition-transform ${show ? "rotate-180" : ""}`}
      />
    </button>

    {/* Tag icon on left - more relevant for categories */}
    <Tag className="absolute left-2.5 w-4 h-4 text-gray-400 pointer-events-none" />

    {/* Clear button - only show when there's a selected category */}
    {selectedCategory && (
      <button
        onClick={onClearCategory}
        className="absolute right-8 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        aria-label="Clear category filter"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    )}

    {/* Dropdown content - Increased width */}
    {show && (
      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-hidden min-w-[240px] w-full sm:min-w-[280px]">
        {/* Search input inside dropdown */}
        <div className="p-2 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
            {filterText && (
              <button
                onClick={() => setFilterText("")}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Categories list */}
        <div className="max-h-48 overflow-y-auto">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat)}
                className={`w-full text-left px-4 py-2.5 hover:bg-blue-50 text-sm transition-colors duration-150 ${
                  selectedCategory === cat.name 
                    ? "bg-blue-100 text-blue-700 font-medium" 
                    : "text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{cat.name}</span>
                </div>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              {filterText ? "No categories found" : "No categories available"}
            </div>
          )}
        </div>
      </div>
    )}
  </div>
);

export default CategoryFilterDropdown;