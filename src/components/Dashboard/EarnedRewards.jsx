import React, { useState } from "react";




function EarnedRewards({data}) {
  const rewardData = {
    COUPONS: data,
    OVERALL: [],
    CASHBACK: [],
  };
  const [activeTab, setActiveTab] = useState("COUPONS");
  const currentData = rewardData[activeTab];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm w-full">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Earned rewards</h2>
        <p className="text-sm text-gray-500">
          Number of rewards that your customers received in the selected period
        </p>
      </div>

      {/* Tabs */}
      {/* <div className="flex gap-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "text-indigo-600 border-b-2 border-indigo-500"
                : "text-gray-500 hover:text-indigo-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div> */}

      {/* Content */}
      <div className="mt-6 max-h-64 overflow-y-auto pr-2">
        {currentData.length === 0 ? (
          <div className="bg-blue-50 text-blue-600 text-sm p-3 rounded-lg">
            No one has received a reward for the selected period.
          </div>
        ) : (
          <ul className="space-y-2">
            {currentData.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-lg text-sm text-gray-700"
              >
                <span>{item.name}</span>
                <span className="font-semibold text-gray-900">{item.quantity}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default EarnedRewards;
