// import React, { useState } from "react";
// import { ChevronDown, X } from "lucide-react";
// import { Calendar as DateRangeCalendar } from "../../ui/calender";
// import { formatLocalDate, addDays } from "../../../utils/date";

// const QuickDateFilter = ({
//   quickDateFilter,
//   setQuickDateFilter,
//   startDate,
//   setStartDate,
//   endDate,
//   setEndDate,
//   quickFilterOptions,
// }) => {
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [selectedRange, setSelectedRange] = useState({
//     from: startDate ? new Date(startDate) : undefined,
//     to: endDate ? new Date(endDate) : undefined,
//   });

//   const formatCustomDateRange = () => {
//     if (!startDate && !endDate) return "Custom";

//     const formatDate = (dateString) => {
//       if (!dateString) return "";
//       const date = new Date(dateString);
//       return date.toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//       });
//     };

//     if (startDate && endDate) {
//       return `Custom: ${formatDate(startDate)} - ${formatDate(endDate)}`;
//     } else if (startDate) {
//       return `Custom: From ${formatDate(startDate)}`;
//     } else if (endDate) {
//       return `Custom: Until ${formatDate(endDate)}`;
//     }
//     return "Custom";
//   };

//   const handleChange = (value) => {
//     setQuickDateFilter(value);

//     if (value === "custom") {
//       setShowCalendar(true);
//       setSelectedRange({
//         from: startDate ? new Date(startDate) : undefined,
//         to: endDate ? new Date(endDate) : undefined,
//       });
//       return;
//     }

//     setShowCalendar(false);

//     const todayLocal = new Date();
//     let start = "";
//     let end = formatLocalDate(addDays(todayLocal, 1));

//     switch (value) {
//       case "today":
//         start = formatLocalDate(addDays(todayLocal, -1));
//         break;
//       case "7days":
//         start = formatLocalDate(addDays(todayLocal, -7));
//         break;
//       case "15days":
//         start = formatLocalDate(addDays(todayLocal, -15));
//         break;
//       case "1month":
//         start = formatLocalDate(addDays(todayLocal, -30));
//         break;
//       default:
//         start = "";
//         end = "";
//     }

//     setStartDate(start);
//     setEndDate(end);
//   };

//   const handleDateSelect = (range) => setSelectedRange(range);

//   const handleApplyDates = () => {
//     if (selectedRange?.from && selectedRange?.to) {
//       const from = selectedRange.from.toISOString().split("T")[0];
//       const to = selectedRange.to.toISOString().split("T")[0];
//       setStartDate(from);
//       setEndDate(to);
//       setQuickDateFilter("custom");
//     } else if (selectedRange?.from) {
//       const from = selectedRange.from.toISOString().split("T")[0];
//       setStartDate(from);
//       setEndDate(from);
//       setQuickDateFilter("custom");
//     }
//     setShowCalendar(false);
//   };

//   const handleClear = () => {
//     setSelectedRange({ from: undefined, to: undefined });
//     setStartDate("");
//     setEndDate("");
//     setQuickDateFilter("");
//     setShowCalendar(false);
//   };

//   return (
//     <div className="relative flex items-center min-w-[160px]">
//       <select
//         value={quickDateFilter}
//         onChange={(e) => handleChange(e.target.value)}
//         className="w-full h-12 px-4 pr-10 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200 appearance-none outline-none"
//       >
//         {quickFilterOptions.map((option) => (
//           <option key={option.value} value={option.value}>
//             {option.value === "custom" && (startDate || endDate)
//               ? formatCustomDateRange()
//               : option.label}
//           </option>
//         ))}
//       </select>

//       {quickDateFilter && (
//         <button
//           type="button"
//           onClick={handleClear}
//           className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
//           aria-label="Clear date filter"
//         >
//           <X className="w-4 h-4" />
//         </button>
//       )}

//       {showCalendar && (
//         <>
//           <div
//             className="fixed inset-0 bg-black/10 z-[9998]"
//             onClick={() => setShowCalendar(false)}
//           />
//           <div className="fixed top-32 left-1/2 -translate-x-1/2 z-[9999] bg-white border border-gray-200 rounded-lg shadow-2xl p-6 w-[95vw] max-w-2xl min-w-[320px] max-h-[90vh] overflow-auto">
//             <div className="flex justify-center">
//               <DateRangeCalendar
//                 mode="range"
//                 selected={selectedRange}
//                 onSelect={handleDateSelect}
//                 numberOfMonths={2}
//                 showOutsideDays={true}
//                 fromMonth={new Date(2020, 0, 1)}
//                 toMonth={new Date()}
//                 disabled={{ after: new Date() }}
//               />
//             </div>
//             <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
//               <button
//                 onClick={handleClear}
//                 className="text-sm text-gray-600 hover:text-gray-800"
//               >
//                 Clear Dates
//               </button>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setShowCalendar(false)}
//                   className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleApplyDates}
//                   disabled={!selectedRange?.from}
//                   className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Apply
//                 </button>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default QuickDateFilter;



import React, { useState } from "react";
import { ChevronDown, X, Calendar } from "lucide-react";
import { Calendar as DateRangeCalendar } from "../../ui/calender";
import { formatLocalDate, addDays } from "../../../utils/date";

const QuickDateFilter = ({
  quickDateFilter,
  setQuickDateFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  quickFilterOptions,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedRange, setSelectedRange] = useState({
    from: startDate ? new Date(startDate) : undefined,
    to: endDate ? new Date(endDate) : undefined,
  });

  const formatCustomDateRange = () => {
    if (!startDate && !endDate) return "Date Range";

    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    };

    if (startDate && endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    } else if (startDate) {
      return `From ${formatDate(startDate)}`;
    } else if (endDate) {
      return `Until ${formatDate(endDate)}`;
    }
    return "Date Range";
  };

  const handleChange = (value) => {
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

  const handleDateSelect = (range) => setSelectedRange(range);

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

  const handleClear = () => {
    setSelectedRange({ from: undefined, to: undefined });
    setStartDate("");
    setEndDate("");
    setQuickDateFilter("");
    setShowCalendar(false);
  };

  const hasActiveDateFilter = quickDateFilter || startDate || endDate;

  return (
    <div className="relative min-w-[160px]">
      {/* Main select with Calendar icon */}
      <div className="relative flex items-center">
        <select
          value={quickDateFilter}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full pl-9 pr-12 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200 appearance-none cursor-pointer hover:border-gray-400"
        >
          {quickFilterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.value === "custom" && (startDate || endDate)
                ? formatCustomDateRange()
                : option.label}
            </option>
          ))}
        </select>

        {/* Calendar icon on left */}
        <Calendar className="absolute left-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
        
        {/* ChevronDown icon on right */}
        <ChevronDown className="absolute right-3 w-4 h-4 text-gray-400 pointer-events-none" />

        {/* Clear button - only show when there's an active date filter */}
        {hasActiveDateFilter && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-8 text-gray-400 hover:text-red-500 transition-colors duration-200"
            aria-label="Clear date filter"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Calendar Popover */}
      {showCalendar && (
        <>
          <div
            className="fixed inset-0 bg-black/10 z-[9998]"
            onClick={() => setShowCalendar(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] bg-white border border-gray-200 rounded-lg shadow-2xl p-6 w-[95vw] max-w-2xl min-w-[320px] max-h-[85vh] overflow-auto">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Select Date Range</h3>
              <button
                onClick={() => setShowCalendar(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex justify-center">
              <DateRangeCalendar
                mode="range"
                selected={selectedRange}
                onSelect={handleDateSelect}
                numberOfMonths={2}
                showOutsideDays={true}
                fromMonth={new Date(2020, 0, 1)}
                toMonth={new Date()}
                disabled={{ after: new Date() }}
                className="border-0"
              />
            </div>
            
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={handleClear}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Clear Dates
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCalendar(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyDates}
                  disabled={!selectedRange?.from}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Apply Dates
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QuickDateFilter;