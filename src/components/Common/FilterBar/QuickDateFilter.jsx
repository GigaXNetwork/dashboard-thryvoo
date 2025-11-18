import React, { useState } from "react";
import { ChevronDown, X } from "lucide-react";
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
    if (!startDate && !endDate) return "Custom";

    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    };

    if (startDate && endDate) {
      return `Custom: ${formatDate(startDate)} - ${formatDate(endDate)}`;
    } else if (startDate) {
      return `Custom: From ${formatDate(startDate)}`;
    } else if (endDate) {
      return `Custom: Until ${formatDate(endDate)}`;
    }
    return "Custom";
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

  return (
    <div className="relative flex items-center min-w-[160px]">
      <select
        value={quickDateFilter}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full h-12 px-4 pr-10 py-3 rounded-lg border border-gray-300 bg-white shadow-inner text-sm focus:ring-2 focus:ring-blue-500 transition duration-200 appearance-none outline-none"
      >
        {quickFilterOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.value === "custom" && (startDate || endDate)
              ? formatCustomDateRange()
              : option.label}
          </option>
        ))}
      </select>

      {quickDateFilter && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
          aria-label="Clear date filter"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {showCalendar && (
        <>
          <div
            className="fixed inset-0 bg-black/10 z-[9998]"
            onClick={() => setShowCalendar(false)}
          />
          <div className="fixed top-32 left-1/2 -translate-x-1/2 z-[9999] bg-white border border-gray-200 rounded-lg shadow-2xl p-6 w-[95vw] max-w-2xl min-w-[320px] max-h-[90vh] overflow-auto">
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
              />
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
              <button
                onClick={handleClear}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear Dates
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCalendar(false)}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyDates}
                  disabled={!selectedRange?.from}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply
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