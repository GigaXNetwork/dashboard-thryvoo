import { useState, useEffect } from "react";
import StatCard from "./StatCard";
import { Eye, Ticket, Zap, Footprints, UserRound, CheckCircle, Gift, Flame, Bolt } from 'lucide-react';
import EarnedRewards from "./EarnedRewards";
import CustomerTypeChart from "./CustomerTypeChart";
import VisitsByDay from "./VisitsByDay";
import VisitsByTime from "./VisitsByTime";
import CouponChart from "./StatisticsChart";
import Cookies from "js-cookie";

const DATE_PRESETS = [
  { label: "Today", value: "1day" },
  { label: "Last 5 days", value: "5day" },
  { label: "Last 7 days", value: "7day" },
  { label: "Last 30 days", value: "30day" },
  { label: "Last 3 months", value: "3month" },
  { label: "All time", value: "all" },
];

export const getAuthToken = () => {
  const tokenNames = ['authToken'];
  for (const name of tokenNames) {
    const token = Cookies.get(name);
    if (token) {
      return token;
    }
  }
  return null;
};

function Dashboard({ onFilter }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [datePreset, setDatePreset] = useState("all");
  const [couponsData, setCouponsData] = useState(null);
  const [insightsData, setInsightsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const authToken = getAuthToken();
  if (!authToken) {
    alert('Authentication token not found. Please log in again.');
    return;
  }

  const calculateDateRange = (preset) => {
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999); // End of day

    let start = new Date(now);

    switch (preset) {
      case "1day":
        start.setDate(start.getDate() - 1);
        break;
      case "5day":
        start.setDate(start.getDate() - 5);
        break;
      case "7day":
        start.setDate(start.getDate() - 7);
        break;
      case "30day":
        start.setDate(start.getDate() - 30);
        break;
      case "3month":
        start.setMonth(start.getMonth() - 3);
        break;
      case "all":
        // For "all time", we'll set startDate to empty
        return { startDate: "", endDate: end.toISOString().split('T')[0] };
      default:
        start.setDate(start.getDate() - 7);
    }

    start.setHours(0, 0, 0, 0); // Start of day

    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    };
  };

  const buildCouponsQuery = () => {
    if (!startDate && !endDate) return "";

    let query = [];
    if (startDate) query.push(`createdAt[gt]=${startDate}`);
    if (endDate) query.push(`createdAt[lt]=${endDate}`);

    return `?${query.join('&')}`;
  };

  const buildVisitorsQuery = () => {
    if (!startDate && !endDate) return "";

    let query = [];
    if (startDate) query.push(`visitedAt[gt]=${startDate}`);
    if (endDate) query.push(`visitedAt[lt]=${endDate}`);

    return `?${query.join('&')}`;
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const couponsQuery = buildCouponsQuery();
    const visitorsQuery = buildVisitorsQuery();

    try {
      const [couponsRes, insightsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/insights/coupons${couponsQuery}`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `${authToken}`,
          }
        }),
        fetch(`${import.meta.env.VITE_API_URL}/api/insights/visitorsInsights${visitorsQuery}`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `${authToken}`,
          }
        }),
      ]);

      if (!couponsRes.ok || !insightsRes.ok) {
        throw new Error("Failed to fetch one or more endpoints.");
      }

      const coupons = await couponsRes.json();
      const insights = await insightsRes.json();

      setCouponsData(coupons);
      setInsightsData(insights);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { startDate: presetStart, endDate: presetEnd } = calculateDateRange(datePreset);
    setStartDate(presetStart);
    setEndDate(presetEnd);
  }, [datePreset]);

  useEffect(() => {
    if (startDate !== "" || endDate !== "") {
      fetchData();
    }
  }, [startDate, endDate]);

  const handleFilter = () => {
    if (onFilter) onFilter({ startDate, endDate });
    fetchData();
  };

  const handlePresetChange = (preset) => {
    setDatePreset(preset);
    const { startDate: newStart, endDate: newEnd } = calculateDateRange(preset);
    setStartDate(newStart);
    setEndDate(newEnd);
  };

  return (
    <div className="p-4 md:p-6">
      {/* Filter Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          {/* Date Presets */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-600 mb-2">Quick Select</span>
            <div className="flex flex-wrap gap-2">
              {DATE_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handlePresetChange(preset.value)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${datePreset === preset.value
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 shadow-xs"
                    }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Date Range */}
          <div className="flex flex-col flex-1 max-w-2xl">
            <span className="text-sm font-medium text-gray-600 mb-2">Custom Range</span>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-500 mb-1">From</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setDatePreset("custom");
                        setStartDate(e.target.value);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-500 mb-1">To</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setDatePreset("custom");
                        setEndDate(e.target.value);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleFilter}
                  className="h-[42px] bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-md transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error & Loading States */}
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* KPI Cards */}
      {insightsData && couponsData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            icon={<Eye className="text-indigo-500" />}  // Eye icon for "visits"
            value={insightsData?.totalVisitors || 0}
            label="Number of visits"
            bgColor="bg-indigo-100"
            borderColor="border-indigo-100"
          />
          <StatCard
            icon={<Ticket className="text-yellow-500" />}  // Ticket icon for "coupons"
            value={couponsData?.redeemed || 0}
            label="Redeemed coupons"
            bgColor="bg-yellow-100"
            borderColor="border-yellow-100"
          />
          <StatCard
            icon={<Zap className="text-green-500" />}  // Zap (lightning) icon for "active"
            value={couponsData?.active || 0}
            label="Active Coupons"
            bgColor="bg-green-100"
            borderColor="border-green-100"
          />
        </div>
      )}

      {/* Rewards + Main Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-4 mt-6">
        <EarnedRewards data={couponsData?.data || []} />
        <CouponChart totalVisitors={insightsData?.totalVisitors || 0}
          activeCoupons={couponsData?.active || 0}
          redeemedCoupons={couponsData?.redeemed || 0}
          expiredCoupons={couponsData?.expired || 0}
        />
      </div>

      {/* Detail Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <CustomerTypeChart
          newvisitors={insightsData?.newVisitors || 0}
          old={insightsData?.oldVisitors || 0}
        />
        <VisitsByDay data={insightsData?.weekdayCounts || {}} />
        <VisitsByTime data={insightsData?.timeOfDayCounts || {}} />
      </div>
    </div>
  );
}

export default Dashboard;