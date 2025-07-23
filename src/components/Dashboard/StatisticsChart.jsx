import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

// Monthly mock data
const data = [
  { month: "Jan", visits: 180, paid: 40 },
  { month: "Feb", visits: 190, paid: 30 },
  { month: "Mar", visits: 170, paid: 50 },
  { month: "Apr", visits: 160, paid: 40 },
  { month: "May", visits: 175, paid: 55 },
  { month: "Jun", visits: 165, paid: 42 },
  { month: "Jul", visits: 170, paid: 70 },
  { month: "Aug", visits: 200, paid: 100 },
  { month: "Sep", visits: 220, paid: 110 },
  { month: "Oct", visits: 205, paid: 120 },
  { month: "Nov", visits: 230, paid: 150 },
  { month: "Dec", visits: 225, paid: 140 },
];

function StatisticsChart() {
  return (
    <div className="bg-white text-gray-800 p-4 rounded-2xl shadow-sm w-full overflow-x-auto">
      <div className="min-w-[600px]">
        <h2 className="text-base font-semibold mb-1">Customer Activity Overview</h2>
        <p className="text-sm text-gray-500 mb-3">Visits vs Paid Customers per Month</p>

        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#F9FAFB",
                border: "1px solid #E5E7EB",
                color: "#111827",
              }}
              labelStyle={{ color: "#6B7280" }}
              itemStyle={{ color: "#111827" }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />

            <Line
              type="monotone"
              dataKey="visits"
              name="Visits"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="paid"
              name="Paid Customers"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default StatisticsChart;
