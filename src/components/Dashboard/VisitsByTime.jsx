// import React from "react";

// const visitTimeData = {
//   morning: 0,
//   lunch: 2,
//   evening: 1,
//   night: 0,
// };

// const formatLabel = (label) =>
//   label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();

// function VisitsByTime({data}) {
//   return (
//     <div className="bg-white p-5 rounded-2xl shadow-sm w-full">
//   <h2 className="text-sm font-semibold text-gray-700">
//     Visits by time of day
//   </h2>
//   <p className="text-xs text-gray-400 mb-4">in the selected period</p>

//   <div className="text-sm text-gray-700 divide-y divide-gray-100">
//     {Object.entries(data).map(([key, value]) => (
//       <div key={key} className="flex justify-between py-2">
//         <span>{formatLabel(key)}</span>
//         <span className="font-medium">{value}</span>
//       </div>
//     ))}
//   </div>

//   {/* Time period information section */}
//   <div className="mt-6 pt-4 border-t border-gray-100">
//     <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
//       Time Periods
//     </h3>
//     <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
//       <div className="flex items-center">
//         <span className="w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
//         <span>6:00 AM - 11:59 AM: Morning</span>
//       </div>
//       <div className="flex items-center">
//         <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
//         <span>12:00 PM - 5:59 PM: Afternoon</span>
//       </div>
//       <div className="flex items-center">
//         <span className="w-2 h-2 rounded-full bg-orange-400 mr-2"></span>
//         <span>6:00 PM - 11:59 PM: Evening</span>
//       </div>
//       <div className="flex items-center">
//         <span className="w-2 h-2 rounded-full bg-purple-400 mr-2"></span>
//         <span>12:00 AM - 6:00 AM: Night</span>
//       </div>
//     </div>
//   </div>
// </div>
//   );
// }

// export default VisitsByTime;



const timePeriods = [
  {
    label: "Morning",
    time: "6:00 AM - 11:59 AM",
    color: "bg-blue-400",
    key: "morning"
  },
  {
    label: "Afternoon",
    time: "12:00 PM - 5:00 PM",
    color: "bg-green-400",
    key: "afternoon"
  },
  {
    label: "Evening",
    time: "5:00 PM - 8:00 PM",
    color: "bg-orange-400",
    key: "evening"
  },
  {
    label: "Night",
    time: "8:00 PM - 6:00 AM",
    color: "bg-purple-400",
    key: "night"
  }
];

const timeOfDayCounts = {
  morning: 0,
  afternoon: 9,
  evening: 0,
  night: 7
};

function VisitsByTime({ data }) {
  const totalVisits = Object.values(data).reduce((sum, val) => sum + val, 0);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm w-full">
      {/* Header with Total Visits */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Visits by Time of Day
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            In the selected period
          </p>
        </div>

        {/* Total Visits Badge */}
        <div className="bg-blue-50 px-3 py-2 rounded-xl border border-blue-100 min-w-[140px]">
          <div className="block items-center gap-2 justify-center sm:justify-start">
            <span className="text-sm font-semibold text-blue-800 whitespace-nowrap">
              Total Visits :
            </span>
            <p className="text-lg font-semibold text-blue-900">
            {totalVisits}
          </p>
          </div>
          
        </div>
      </div>

      {/* Time Period Analysis */}
      <div className="space-y-3 sm:space-y-4">
        {timePeriods.map((period) => (
          <div
            key={period.key}
            className="flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            {/* Color Indicator */}
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${period.color}`}></div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                {/* Period Info */}
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-gray-800 text-sm sm:text-base whitespace-nowrap">
                    {period.label}
                  </span>
                  <p className="text-xs text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">
                    {period.time}
                  </p>
                </div>

                {/* Visit Count */}
                <span className="font-semibold text-gray-900 text-base whitespace-nowrap">
                  {data[period.key] || 0} visits
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile time indicator */}
      <div className="mt-4 pt-4 border-t border-gray-100 sm:hidden">
        <p className="text-xs text-gray-500 text-center">
          Tap on any period for details
        </p>
      </div>
    </div>
  );
}

export default VisitsByTime;