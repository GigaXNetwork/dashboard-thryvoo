import { useState, useEffect } from "react";
import StatCard from "./StatCard";
import { Users, UserPlus, DollarSign } from "lucide-react";
import StatisticsChart from "./StatisticsChart";
import EarnedRewards from "./EarnedRewards";
import CustomerTypeChart from "./CustomerTypeChart";
import VisitsByDay from "./VisitsByDay";
import VisitsByTime from "./VisitsByTime";

function Dashboard({ onFilter }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [couponsData, setCouponsData] = useState(null);
  const [insightsData, setInsightsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buildQuery = () => {
    return startDate && endDate
      ? `?startDate=${startDate}&endDate=${endDate}`
      : "";
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const query = buildQuery();

    try {
      const [couponsRes, insightsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/insights/coupons${query}`, {
          credentials: "include",
        }),
        fetch(`${import.meta.env.VITE_API_URL}/api/insights/visitorsInsights${query}`, {
          credentials: "include",
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
    fetchData();
  }, []);

  const handleFilter = () => {
    if (onFilter) onFilter({ startDate, endDate });
    fetchData();
  };

  return (
    <div className="p-4 md:p-6">
      {/* Filter Section */}
      <div className="flex flex-wrap items-end gap-2 text-sm mb-6">
        <label className="flex flex-col text-gray-600">
          <span className="mb-1">Filter from:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-indigo-500"
          />
        </label>
        <label className="flex flex-col text-gray-600">
          <span className="mb-1">To:</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-indigo-500"
          />
        </label>
        <button
          onClick={handleFilter}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-4 py-2 rounded-md transition mt-4 md:mt-0"
        >
          FILTER
        </button>
      </div>

      {/* Error & Loading States */}
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* KPI Cards */}
      {insightsData && couponsData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            icon={<Users className="text-indigo-500" />}
            value={insightsData?.totalVisitors || 0}
            label="Number of visits"
            bgColor="bg-indigo-100"
            borderColor="border-indigo-100"
          />
          <StatCard
            icon={<UserPlus className="text-yellow-500" />}
            value={couponsData?.redeemed || 0}
            label="Redeemed coupons"
            bgColor="bg-yellow-100"
            borderColor="border-yellow-100"
          />
          <StatCard
            icon={<DollarSign className="text-green-500" />}
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
        <StatisticsChart data={insightsData} />
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
