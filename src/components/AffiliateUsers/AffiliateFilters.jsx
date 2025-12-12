// src/components/AffiliateUsers/AffiliateFilters.jsx
import React from "react";
import FilterBar from "../Common/FilterBar/FilterBar";

const AffiliateFilters = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  quickDateFilter,
  setQuickDateFilter,
  onClearFilters,
  onFilterChange,
}) => {
  // Affiliate-specific status options
  const affiliateStatusOptions = [
    { value: "", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  // Quick filter options
  const quickFilterOptions = [
    { value: "", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "7days", label: "Last 7 Days" },
    { value: "15days", label: "Last 15 Days" },
    { value: "1month", label: "Last 1 Month" },
    { value: "custom", label: "Custom" },
  ];

  return (
    <FilterBar
      // Core filters
      search={search}
      setSearch={setSearch}
      searchLoading={false}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      startDate={startDate}
      setStartDate={setStartDate}
      endDate={endDate}
      setEndDate={setEndDate}
      quickDateFilter={quickDateFilter}
      setQuickDateFilter={setQuickDateFilter}
      quickFilterOptions={quickFilterOptions}
      statusOptions={affiliateStatusOptions}
      // UI toggles
      showStatus={true}
      showDates={true}
      showQuickFilter={false}
      showTypeFilter={false}
      showCategoryFilter={false}
      showLocationFilter={false}
      showSourceFilter={false}
      // Handlers
      onClearFilters={onClearFilters}
      onFilterChange={onFilterChange}
      placeholder="Search by name, email, or referral code..."
    />
  );
};

export default AffiliateFilters;