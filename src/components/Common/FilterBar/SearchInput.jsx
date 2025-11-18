import React from "react";
import { Search, X } from "lucide-react";

const SearchInput = ({ value, onChange, onClear, loading, placeholder }) => (
  <div className="relative flex-1 min-w-[200px]">
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full pl-12 pr-10 py-3 rounded-lg h-12 border border-gray-300 shadow-inner text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
    />
    <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
    {value && (
      <button
        type="button"
        onClick={onClear}
        className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-700"
        aria-label="Clear search"
      >
        <X className="w-4 h-4" />
      </button>
    )}
    {loading && (
      <div className="absolute right-10 top-3.5 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
    )}
  </div>
);

export default SearchInput;
