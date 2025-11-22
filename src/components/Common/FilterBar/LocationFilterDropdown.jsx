// import React from "react";
// import { Search, X, ChevronDown, MapPin } from "lucide-react";

// const LocationFilterDropdown = ({
//   show,
//   toggle,
//   locations,
//   filteredLocations,
//   filterText,
//   setFilterText,
//   selectedLocation,
//   onSelectLocation,
//   onClearLocation,
//   dropdownRef,
//   searchLoading = false,
// }) => (
//   <div className="relative w-full flex items-center" ref={dropdownRef}>
//     {/* Main dropdown button */}
//     <button
//       onClick={toggle}
//       className="w-full pl-3 pr-3 py-2.5 gap-2 rounded-lg border border-gray-300 bg-white text-sm flex items-center justify-between focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 hover:border-gray-400"
//     >
//       <span className="truncate">{selectedLocation || "Locations"}</span>
//       <ChevronDown
//         className={`w-4 h-4 text-gray-400 transition-transform ${show ? "rotate-180" : ""}`}
//       />
//     </button>

//     {/* Clear button - only show when there's a selected location */}
//     {selectedLocation && (
//       <button
//         onClick={onClearLocation}
//         className="absolute right-8 text-gray-400 hover:text-gray-600 transition-colors duration-200"
//         aria-label="Clear location filter"
//       >
//         <X className="w-3.5 h-3.5" />
//       </button>
//     )}

//     {/* Dropdown content - Increased width */}
//     {show && (
//       <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-hidden min-w-[280px] w-full sm:min-w-[320px]">
//         {/* Search input inside dropdown */}
//         <div className="p-2 border-b border-gray-200">
//           <div className="relative">
//             <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search locations..."
//               value={filterText}
//               onChange={(e) => setFilterText(e.target.value)}
//               className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//               onClick={(e) => e.stopPropagation()}
//             />
//             {filterText && (
//               <button
//                 onClick={() => setFilterText("")}
//                 className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 <X className="w-3.5 h-3.5" />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Locations list */}
//         <div className="max-h-48 overflow-y-auto">
//           {searchLoading ? (
//             <div className="px-4 py-3 text-sm text-gray-500 text-center">
//               <div className="flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
//                 Searching locations...
//               </div>
//             </div>
//           ) : filteredLocations.length > 0 ? (
//             filteredLocations.map((loc) => (
//               <button
//                 key={loc.id}
//                 onClick={() => onSelectLocation(loc)}
//                 className={`w-full text-left px-4 py-2.5 hover:bg-blue-50 text-sm transition-colors duration-150 ${
//                   selectedLocation === loc.addressLine
//                     ? "bg-blue-100 text-blue-700 font-medium"
//                     : "text-gray-700"
//                 }`}
//               >
//                 <div className="flex items-start gap-2">
//                   <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
//                   <div className="text-left flex-1 min-w-0">
//                     {loc.addressLine && loc.display !== loc.addressLine && (
//                       <div className="text-xs text-gray-700 font-semibold mt-0.5">
//                         {loc.addressLine}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </button>
//             ))
//           ) : (
//             <div className="px-4 py-3 text-sm text-gray-500 text-center">
//               {filterText ? "No locations found" : "No locations available"}
//             </div>
//           )}
//         </div>
//       </div>
//     )}
//   </div>
// );

// export default LocationFilterDropdown;


import React from "react";
import { Search, X, ChevronDown, MapPin } from "lucide-react";

const LocationFilterDropdown = ({
  show,
  toggle,
  filteredLocations,
  filterText,
  setFilterText,
  selectedLocation,
  onSelectLocation,
  onClearLocation,
  dropdownRef,
  searchLoading = false,
}) => (
  <div className="relative w-full flex items-center" ref={dropdownRef}>
    {/* Dropdown button */}
    <button
      onClick={toggle}
      className="w-full gap-2 pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 bg-white 
        text-sm flex items-center justify-between hover:border-gray-400 
        focus:ring-2 focus:ring-blue-500 overflow-hidden"
      >


      <span className="truncate min-w-0 overflow-hidden text-ellipsis whitespace-nowrap block flex-1">
        {selectedLocation || "Locations"}
      </span>

      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${show ? "rotate-180" : ""}`} />
    </button>

    {/* Pin icon */}
    <MapPin className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />

    {/* Clear Button */}
    {selectedLocation && (
      <button
        onClick={onClearLocation}
        className="absolute right-3 p-1 bg-white rounded-full text-gray-400 hover:text-red-600 transition"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    )}

    {/* Dropdown Panel */}
    {show && (
      <div className="absolute top-full left-0 mt-1 w-full min-w-[320px] bg-white border border-gray-200 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.08)] z-20 max-h-72 overflow-hidden animate-fadeIn">

        {/* Search */}
        <div className="p-2 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search locations..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              onClick={(e) => e.stopPropagation()}
            />
            {filterText && (
              <button
                onClick={() => setFilterText("")}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="max-h-56 overflow-y-auto">
          {searchLoading ? (
            <p className="px-4 py-4 text-sm text-gray-500 text-center">Searching...</p>
          ) : filteredLocations.length ? (
            filteredLocations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => onSelectLocation(loc)}
                className={`w-full px-4 py-2.5 flex gap-2 items-start text-sm group transition
                  ${selectedLocation === loc.addressLine ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50"}
                `}
              >
                <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                <span className="text-left min-w-0">{loc.addressLine}</span>
                {selectedLocation === loc.addressLine && (
                  <span className="ml-auto text-blue-600 font-semibold">✓</span>
                )}
              </button>
            ))
          ) : (
            <p className="px-4 py-4 text-sm text-gray-500 text-center">No locations found</p>
          )}
        </div>
      </div>
    )}
  </div>
);

export default LocationFilterDropdown;
