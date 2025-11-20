// TypeFilter.jsx
import React from "react";
import { X, ChevronDown } from "lucide-react";

const TypeFilter = ({ value, onChange, onClear, options }) => {
    return (
        <div className="relative min-w-[140px] flex items-center">
            <select
                value={value || ""}
                onChange={onChange}
                className="w-full pl-3 pr-10 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200 appearance-none cursor-pointer hover:border-gray-400"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {/* ChevronDown icon - always visible */}
            <ChevronDown className="absolute right-3 w-4 h-4 text-gray-400 pointer-events-none" />

            {/* Clear button - only show when there's a value */}
            {value && (
                <button
                    type="button"
                    onClick={onClear}
                    className="absolute right-9 text-gray-400 hover:text-red-500 transition-colors duration-200"
                    aria-label="Clear type filter"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            )}
        </div>
    );
};

export default TypeFilter;