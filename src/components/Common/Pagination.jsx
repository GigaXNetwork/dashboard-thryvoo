import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Generate pagination range with ellipsis
  const getPaginationRange = () => {
    const delta = 1;
    let left = currentPage - delta;
    let right = currentPage + delta;

    if (left < 2) {
      right += 2 - left;
      left = 2;
    }
    if (right > totalPages - 1) {
      left -= right - (totalPages - 1);
      right = totalPages - 1;
    }
    left = Math.max(left, 2);

    const range = [];
    range.push(1);

    if (left > 2) {
      range.push("left-ellipsis");
    }

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (right < totalPages - 1) {
      range.push("right-ellipsis");
    }

    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  const paginationRange = getPaginationRange();

  return (
    <div className="flex justify-center mt- space-x-2 items-center">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="p-2 rounded-md border bg-white shadow disabled:opacity-50"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {paginationRange.map((page, idx) => {
        if (page === "left-ellipsis" || page === "right-ellipsis") {
          return (
            <span
              key={page + idx}
              className="px-3 py-1 text-gray-500 select-none"
            >
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-md border text-sm shadow ${
              page === currentPage
                ? "bg-blue-600 text-white"
                : "bg-white hover:bg-blue-50 text-gray-700"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md border bg-white shadow disabled:opacity-50"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
