// StatusFilter.jsx
import React from "react";
import { Filter, X } from "lucide-react";

const StatusFilter = ({ value, onChange, onClear, options }) => (
  <div className="relative flex items-center min-w-[160px]">
    <select
      value={value}
      onChange={onChange}
      className="w-full pl-12 h-12 pr-10 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200 appearance-none outline-none"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <Filter className="absolute left-4 text-gray-400 pointer-events-none" size={16} />
    {value && (
      <button
        type="button"
        onClick={onClear}
        className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
        aria-label="Clear status filter"
      >
        <X className="w-4 h-4" />
      </button>
    )}
  </div>
);

export default StatusFilter;