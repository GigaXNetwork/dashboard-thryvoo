import React from "react";
import { Search, X } from "lucide-react";

const SearchInput = ({ value, onChange, onClear, loading, placeholder }) => (
  <div className="relative flex items-center w-full">
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200"
    />
    <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
    {value && (
      <button
        type="button"
        onClick={onClear}
        className="absolute right-3 text-gray-400 hover:text-gray-600"
      >
        <X className="w-4 h-4" />
      </button>
    )}
    {loading && (
      <div className="absolute right-10 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
    )}
  </div>
);

export default SearchInput;
