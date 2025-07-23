import React from "react";

const visitTimeData = {
  morning: 0,
  lunch: 2,
  evening: 1,
  night: 0,
};

const formatLabel = (label) =>
  label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();

function VisitsByTime({data}) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm w-full">
      <h2 className="text-sm font-semibold text-gray-700">
        Visits by time of day
      </h2>
      <p className="text-xs text-gray-400 mb-4">in the selected period</p>

      <div className="text-sm text-gray-700 divide-y divide-gray-100">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex justify-between py-2">
            <span>{formatLabel(key)}</span>
            <span className="font-medium">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VisitsByTime;
